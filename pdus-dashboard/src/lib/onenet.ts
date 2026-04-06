import crypto from 'crypto';
import { NextResponse } from 'next/server';

interface OneNETConfig {
  apiBase: string;
  productId: string;
  deviceName: string;
  deviceKey: string;
  tokenMethod: string;
}

// OneNET API 接口路径模板（支持配置调整）
const API_PATHS = {
  latestProperty: process.env.ONENET_API_LATEST_PATH || '/thingmodel/query-device-property',
  propertyHistory: process.env.ONENET_API_HISTORY_PATH || '/thingmodel/query-device-property-history'
};

// 生成鉴权 Token
export function generateToken(config: OneNETConfig, expireSeconds: number = 3600): string {
  const et = Math.floor(Date.now() / 1000) + expireSeconds;
  const version = '2018-10-31';
  const res = `products/${config.productId}/devices/${config.deviceName}`;
  const method = config.tokenMethod;
  
  // 签名格式：et\nmethod\nres\nversion（仅使用 res 的原始值）
  const stringForSignature = `${et}\n${method}\n${res}\n${version}`;
  const key = Buffer.from(config.deviceKey, 'base64');
  const sign = crypto.createHmac(method as 'sha256' | 'md5' | 'sha1', key)
    .update(stringForSignature)
    .digest('base64');
  
  // URL 编码 value 部分（/ → %2F, = → %3D）
  const encodedRes = encodeURIComponent(res);
  const encodedSign = encodeURIComponent(sign);
  
  // token 格式：version=xxx&res=xxx&et=xxx&method=xxx&sign=xxx
  return `version=${version}&res=${encodedRes}&et=${et}&method=${method}&sign=${encodedSign}`;
}

// 获取配置对象
function getConfig(): OneNETConfig {
  const ONENET_API_BASE = process.env.ONENET_API_BASE || 'https://iot-api.heclouds.com/thingmodel';
  const ONENET_PRODUCT_ID = process.env.ONENET_PRODUCT_ID || '';
  const ONENET_DEVICE_NAME = process.env.ONENET_DEVICE_NAME || '';
  const ONENET_DEVICE_KEY = process.env.ONENET_DEVICE_KEY || '';
  const ONENET_TOKEN_METHOD = process.env.ONENET_TOKEN_METHOD || 'sha256';

  if (!ONENET_PRODUCT_ID || !ONENET_DEVICE_NAME || !ONENET_DEVICE_KEY) {
    throw new Error('OneNET 环境配置不完整：缺少必填环境变量');
  }

  return {
    apiBase: ONENET_API_BASE,
    productId: ONENET_PRODUCT_ID,
    deviceName: ONENET_DEVICE_NAME,
    deviceKey: ONENET_DEVICE_KEY,
    tokenMethod: ONENET_TOKEN_METHOD
  };
}

// 获取最新属性数据
export async function getLatestProperties(): Promise<{ data: object | null; online: boolean }> {
  try {
    const config = getConfig();
    const token = generateToken(config);

    const apiUrl = `${config.apiBase}${API_PATHS.latestProperty}?product_id=${config.productId}&device_name=${config.deviceName}`;

    console.log('[OneNET] 请求最新数据:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('[OneNET] 请求失败:', response.status, response.statusText);
      if (response.status === 401 || response.status === 403) {
        throw new Error('鉴权失败：请检查设备密钥和 Token 生成算法');
      }
      return { data: null, online: false };
    }

    const jsonData = await response.json();
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
        online: true
      };
      return { data, online: true };
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
        online: true
      };
      return { data, online: true };
    }

    console.log('[OneNET] 未知响应格式:', jsonData.code, jsonData.msg);
    return { data: null, online: false };
  } catch (error: any) {
    console.error('[OneNET] 获取最新数据失败:', error.message);
    return { data: null, online: false };
  }
}

// 获取历史属性数据
export async function getPropertyHistory(
  identifier: string = 'survey_',
  startTime: number,
  endTime: number
): Promise<HistoryRecord[]> {
  try {
    const config = getConfig();
    const token = generateToken(config);

    const apiUrl = `${config.apiBase}${API_PATHS.propertyHistory}?product_id=${config.productId}&device_name=${config.deviceName}&identifier=${identifier}&start_time=${startTime}&end_time=${endTime}`;

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
    const records: HistoryRecord[] = [];
    if (jsonData.data && jsonData.data.records) {
      jsonData.data.records.forEach((record: any) => {
        if (record.record) {
          records.push({
            time: new Date(record.record[0]).toISOString(),
            value: record.record[1]?.value ?? 0
          });
        }
      });
    }

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
