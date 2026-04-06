// OneNET API 响应类型

export interface OneNETConfig {
  apiBase: string;
  productId: string;
  deviceName: string;
  deviceKey: string;
  tokenMethod: string;
}

export interface DeviceData {
  survey_: number;          // 积尘度 0-100
  level_: number;          // 置信度百分比 0-100
  dust_: string;           // 诊断状态：normal / mild / severe
  BatteryVoltage: number;  // 电池电量 0.0-100.0
  timestamp: string;       // 数据时间戳
  online: boolean;         // 设备在线状态
}

export interface HistoryRecord {
  time: string;            // 时间戳
  value: number;           // 数值
}

export interface DeviceStatus {
  online: boolean;         // 设备是否在线
  lastUpdate: string | null; // 最后更新时间
}

export interface DustLevel {
  label: string;
  color: string;
  min: number;
  max: number;
}

export const DUST_LEVELS: DustLevel[] = [
  { label: '正常 (正常)', color: 'bg-green-500', min: 0, max: 30 },
  { label: '轻度积尘', color: 'bg-yellow-500', min: 31, max: 70 },
  { label: '重度积尘', color: 'bg-red-500', min: 71, max: 100 }
];

export function getDustLevel(survey: number): DustLevel {
  return DUST_LEVELS.find(level => survey >= level.min && survey <= level.max) || DUST_LEVELS[0];
}

export function getDustStatusIcon(dust_: string): string {
  switch (dust_) {
    case 'normal':
      return '✅';
    case 'mild':
      return '⚠️';
    case 'severe':
      return '🚨';
    default:
      return '❓';
  }
}
