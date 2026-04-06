'use client';

import { useState, useEffect } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { ProgressBar } from '@/components/ProgressBar';
import { DeviceCard } from '@/components/DeviceCard';
import { StatusBadge } from '@/components/StatusBadge';
import { DUST_LEVELS, getDustLevel, getDustStatusIcon } from '@/lib/types';

interface DeviceData {
  survey: number;
  confidence: number;
  status: string;
  battery: number;
  online: boolean;
  data_time: string;
}

export default function MonitorPage() {
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const fetchDeviceData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/onenet/latest');
      const data = await response.json();

      if (data.error && !data.online) {
        setError(data.error || '设备离线');
        setDeviceData({
          survey: 0,
          confidence: 0,
          status: 'normal',
          battery: 0,
          online: false,
          data_time: new Date().toISOString()
        });
        setLastUpdate(new Date().toISOString());
      } else {
        setDeviceData({
          survey: data.survey ?? 0,
          confidence: data.confidence ?? 0,
          status: data.status ?? 'normal',
          battery: data.battery ?? 0,
          online: data.online ?? false,
          data_time: data.timestamp || new Date().toISOString()
        });
        setLastUpdate(data.timestamp || new Date().toISOString());
        setError(null);
      }
    } catch (err) {
      setError('网络请求失败');
      setDeviceData({
        survey: 0,
        confidence: 0,
        status: 'normal',
        battery: 0,
        online: false,
        data_time: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceData();
    
    // 每 30 秒自动刷新
    const interval = setInterval(fetchDeviceData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const currentLevel = deviceData ? getDustLevel(deviceData.survey) : DUST_LEVELS[0];
  const statusIcon = getDustStatusIcon(deviceData?.status || 'normal');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">实时监测</h1>
            <p className="text-white/80">光伏板积尘状态监控</p>
          </div>
          
          <div className="text-right">
            <div className="text-white/60 text-sm">数据更新频率</div>
            <div className="text-white font-semibold">30 秒自动刷新</div>
          </div>
        </div>

        {/* Device Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DeviceCard 
            title="设备信息"
            deviceName="D001"
            productId="cC223qEDV4"
            icon="🌞"
          />
          <StatusBadge 
            online={deviceData?.online ?? false}
            lastUpdate={lastUpdate}
          />
          {error && (
            <div className="glass p-6 rounded-xl text-center">
              <div className="text-red-300 font-medium">{error}</div>
              <div className="text-white/60 text-sm mt-2">正在重试连接...</div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white text-lg">加载数据中...</div>
          </div>
        ) : (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* 积尘度 */}
              <MetricCard
                title="当前积尘度"
                value={deviceData?.survey ?? 0}
                subtitle={`${currentLevel.label}${deviceData?.survey !== null ? ' (0-100%)' : ''}`}
                icon="📊"
                color="bg-green-500"
              />

              {/* 置信度 */}
              <MetricCard
                title="识别置信度"
                value={deviceData?.confidence ?? 0}
                subtitle={deviceData?.confidence !== null ? 'AI 准确率评估' : ''}
                icon="🎯"
                color="bg-blue-500"
              />

              {/* 诊断状态 */}
              <MetricCard
                title="积尘诊断"
                value={statusIcon}
                subtitle={deviceData ? (
                  <span className="flex items-center gap-1">
                    {deviceData.status === 'normal' && '正常'}
                    {deviceData.status === 'mild' && '轻度积尘'}
                    {deviceData.status === 'severe' && '重度积尘'}
                  </span>
                ) : ''}
                icon="🔍"
                color={
                  deviceData?.status === 'normal' ? 'bg-green-500' :
                  deviceData?.status === 'mild' ? 'bg-yellow-500' :
                  'bg-red-500'
                }
              />

              {/* 电池电量 */}
              <MetricCard
                title="供电状态"
                value={deviceData?.battery ?? 0}
                subtitle={deviceData?.battery !== null ? '电池电量百分比' : ''}
                icon="🔋"
                color={
                  (deviceData?.battery ?? 0) < 20 ? 'bg-red-500' :
                  (deviceData?.battery ?? 0) < 50 ? 'bg-yellow-500' :
                  'bg-green-500'
                }
              />
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <ProgressBar
                value={deviceData?.survey ?? 0}
                level={deviceData?.status as 'normal' | 'mild' | 'severe'}
                label="积尘度评估"
              />
            </div>

            {/* Status Levels Reference */}
            <div className="glass p-6 rounded-xl">
              <h3 className="text-white font-semibold mb-4">积尘等级说明</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DUST_LEVELS.map((level) => (
                  <div 
                    key={level.label}
                    className={`bg-white/10 rounded-lg p-4 flex items-center gap-3`}
                  >
                    <div className={`w-4 h-4 ${level.color} rounded-full`}></div>
                    <div>
                      <div className="text-white font-medium">{level.label}</div>
                      <div className="text-white/60 text-sm">
                        {level.min} - {level.max}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
