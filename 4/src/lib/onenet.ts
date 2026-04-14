import crypto from 'crypto';
import { NextResponse } from 'next/server';

interface OneNETConfig {
  apiBase: string;
  productId: string;
  deviceName: string;
  accessKey: string;
  tokenMethod: string;
  keyType: 'device' | 'product';  // 标记密钥类型：device=DeviceKey, product=AccessKey
}

// OneNET API 接口路径模板（支持配置调整）
const API_PATHS = {
  latestProperty: process.env.ONENET_API_LATEST_PATH || '/thingmodel/query-device-property',
  propertyHistory: process.env.ONENET_API_HISTORY_PATH || '/thingmodel/query-device-property-history',
  deviceStatus: '/devices/status'
};

// 生成鉴权 Token（自动适配产品级 AccessKey 和设备级 DeviceKey）
export function generateToken(config: OneNETConfig, expireSeconds: number = 86400): string {
  const et = Math.floor(Date.now() / 1000) + expireSeconds;
  const version = '2018-10-31';

  // 根据密钥类型选择 res 路径：
  //   DeviceKey  → products/{pid}/devices/{dname}
  //   AccessKey  → products/{pid}
  const res = config.keyType === 'device'
    ? `products/${config.productId}/devices/${config.deviceName}`
    : `products/${config.productId}`;

  const method = config.tokenMethod.toLowerCase();
  
  // 签名格式：et\nmethod\nres\nversion
  const stringForSignature = `${et}\n${method}\n${res}\n${version}`;
  const key = Buffer.from(config.accessKey, 'base64');
  const sign = crypto.createHmac(method as 'sha256' | 'md5' | 'sha1', key)
    .update(stringForSignature)
    .digest('base64');
  
  // URL 编码
  const encodedRes = encodeURIComponent(res);
  const encodedSign = encodeURIComponent(sign);
  
  const token = `version=${version}&res=${encodedRes}&et=${et}&method=${method}&sign=${encodedSign}`;
  
  // 安全日志：仅记录关键结构信息
  console.log(`[OneNET] Token 详情: version=${version}, method=${method}, expire_at=${new Date(et * 1000).toLocaleString()}, res=${res}`);
  return token;
}

export function getAvailableDevices(): string[] {
  const envNames = process.env.ONENET_DEVICE_NAMES;
  if (envNames) {
    return envNames.split(',').map(d => d.trim()).filter(Boolean);
  }
  const envName = process.env.ONENET_DEVICE_NAME;
  if (envName) {
    return [envName.trim()];
  }
  return [];
}

// 获取配置对象
function getConfig(targetDevice?: string): OneNETConfig {
  const ONENET_API_BASE = process.env.ONENET_API_BASE || 'https://iot-api.heclouds.com';
  const ONENET_PRODUCT_ID = process.env.ONENET_PRODUCT_ID || '';
  const availableDevices = getAvailableDevices();
  const ONENET_DEVICE_NAME = targetDevice || availableDevices[0] || '';
  
  // 环境变量优先级逻辑：
  // 1. 如果有 ONENET_DEVICE_KEY，优先认定为设备级密钥
  // 2. 如果只有 ONENET_ACCESS_KEY，判定为产品级密钥
  // 提示：如果用户在 Vercel 将设备密钥填入了 ONENET_ACCESS_KEY 变量，可能导致鉴权 10403
  let accessKey = '';
  let keyType: 'device' | 'product' = 'product';

  if (process.env.ONENET_DEVICE_KEY) {
    accessKey = process.env.ONENET_DEVICE_KEY;
    keyType = 'device';
  } else if (process.env.ONENET_ACCESS_KEY) {
    accessKey = process.env.ONENET_ACCESS_KEY;
    keyType = 'product';
  }

  const ONENET_TOKEN_METHOD = process.env.ONENET_TOKEN_METHOD || 'sha256';

  if (!ONENET_PRODUCT_ID || !ONENET_DEVICE_NAME || !accessKey) {
    throw new Error('OneNET 环境配置不完整：缺少必填环境变量（ONENET_PRODUCT_ID, ONENET_DEVICE_NAME, 以及 ONENET_ACCESS_KEY 或 ONENET_DEVICE_KEY）');
  }

  return {
    apiBase: ONENET_API_BASE,
    productId: ONENET_PRODUCT_ID,
    deviceName: ONENET_DEVICE_NAME,
    accessKey: accessKey,
    tokenMethod: ONENET_TOKEN_METHOD,
    keyType: keyType
  };
}

// 获取最新属性数据
export async function getLatestProperties(targetDevice?: string): Promise<{ data: object | null; online: boolean; errorMsg?: string }> {
  try {
    const config = getConfig(targetDevice);
    const token = generateToken(config);

    const apiUrl = `${config.apiBase}${API_PATHS.latestProperty}?${new URLSearchParams({
      product_id: config.productId,
      device_name: config.deviceName
    }).toString()}`;

    const statusUrl = `${config.apiBase}${API_PATHS.deviceStatus}?${new URLSearchParams({
      product_id: config.productId,
      device_names: config.deviceName // 注意：/devices/status 接口通常使用 device_names (复数)
    }).toString()}`;

    console.log('[OneNET] 请求最新数据和状态:', apiUrl, statusUrl);

    // 并行请求数据和状态
    const [propResponse, statusResponse] = await Promise.all([
      fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      }),
      fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      })
    ]);

    if (!propResponse.ok || !statusResponse.ok) {
      console.error('[OneNET] 请求失败:', 
        !propResponse.ok ? `Prop: ${propResponse.status}` : '', 
        !statusResponse.ok ? `Status: ${statusResponse.status}` : ''
      );
      if (propResponse.status === 401 || propResponse.status === 403 || statusResponse.status === 401 || statusResponse.status === 403) {
        throw new Error('鉴权失败：请检查设备密钥和 Token 生成算法');
      }
      return { data: null, online: false };
    }

    const [jsonData, statusData] = await Promise.all([
      propResponse.json(),
      statusResponse.json()
    ]);

    // OneNET Studio /device/status 返回格式通常为 { code: 0, data: [{ status: 1, ... }] } 或 { code: 0, data: { status: 1 } }
    let isOnline = false;
    if (statusData.code === 0) {
      if (Array.isArray(statusData.data) && statusData.data.length > 0) {
        isOnline = statusData.data[0].status === 1;
      } else if (statusData.data && typeof statusData.data.status !== 'undefined') {
        isOnline = statusData.data.status === 1;
      }
    }

    console.log(`[OneNET] 设备状态: ${isOnline ? '在线' : '离线'} (code=${statusData.code}, data=${JSON.stringify(statusData.data)})`);
    console.log('[OneNET] 最新数据响应:', JSON.stringify(jsonData).slice(0, 500));

    // 提取设备数据
    // 新版 API 返回格式：{ code: 0, data: [{ identifier: "survey_", value: "50", time: ... }] }
    if (jsonData.code === 0 && Array.isArray(jsonData.data) && jsonData.data.length > 0) {
      const attrs: Record<string, any> = {};
      jsonData.data.forEach((item: any) => {
        attrs[item.identifier] = item;
      });

      const data = {
        survey_: parseFloat(attrs['survey_']?.value) || 0,
        level_: parseFloat(attrs['level_']?.value) || 0,
        dust_: attrs['dust_']?.value || 'normal',
        BatteryVoltage: parseFloat(attrs['BatteryVoltage']?.value) || 0,
        timestamp: attrs['survey_']?.time || new Date().toISOString(),
        online: isOnline
      };
      return { data, online: isOnline };
    }

    // 兼容旧格式 { data: { attributes: { ... } } }
    if (jsonData.data && jsonData.data.attributes) {
      const attrs = jsonData.data.attributes;
      const data = {
        survey_: attrs.survey_?.value ?? 0,
        level_: attrs.level_?.value ?? 0,
        dust_: attrs.dust_?.value ?? 'normal',
        BatteryVoltage: attrs.BatteryVoltage?.value ?? 0,
        timestamp: jsonData.data.time?.toString() || new Date().toISOString(),
        online: isOnline
      };
      return { data, online: isOnline };
    }

    console.log('[OneNET] 未知响应格式:', jsonData.code, jsonData.msg);
    return { data: null, online: false, errorMsg: `OneNET API 返回错误: code=${jsonData.code}, msg=${jsonData.msg}` };
  } catch (error: any) {
    console.error('[OneNET] 获取最新数据失败:', error.message);
    return { data: null, online: false, errorMsg: `请求失败: ${error.message}` };
  }
}

// 获取历史属性数据
export async function getPropertyHistory(
  identifier: string = 'survey_',
  startTime: number,
  endTime: number,
  targetDevice?: string
): Promise<HistoryRecord[]> {
  try {
    const config = getConfig(targetDevice);
    const token = generateToken(config);

    const apiUrl = `${config.apiBase}${API_PATHS.propertyHistory}?${new URLSearchParams({
      product_id: config.productId,
      device_name: config.deviceName,
      identifier,
      start_time: String(startTime),
      end_time: String(endTime),
      limit: '100'
    }).toString()}`;

    console.log('[OneNET] 请求历史数据:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('[OneNET] 请求历史数据失败:', response.status, response.statusText);
      return [];
    }

    const jsonData = await response.json();
    console.log('[OneNET] 历史数据响应:', jsonData);

    // 提取历史记录
    // OneNET 返回格式：{ code: 0, data: [{ time: 毫秒时间戳, value: 值 }, ...] }
    const records: HistoryRecord[] = [];
    const rawList = Array.isArray(jsonData.data) ? jsonData.data
      : jsonData.data?.list ? jsonData.data.list
      : jsonData.data?.records ? jsonData.data.records.map((r: any) => ({ time: r.record?.[0] || r.time, value: r.record?.[1]?.value ?? r.value }))
      : [];

    rawList.forEach((item: any) => {
      const ts = item.time;
      const val = item.value;
      if (ts !== undefined && val !== undefined) {
        records.push({
          time: new Date(ts).toISOString(),
          value: parseFloat(val) || 0
        });
      }
    });

    console.log('[OneNET] 解析后的记录数:', records.length);
    return records;
  } catch (error: any) {
    console.error('[OneNET] 获取历史数据失败:', error.message);
    return [];
  }
}

// 类型定义（与 types.ts 一致）
interface HistoryRecord {
  time: string;
  value: number;
}
