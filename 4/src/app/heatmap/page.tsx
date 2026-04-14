'use client';

import { useState, useEffect } from 'react';
import { DustChart } from '@/components/DustChart';

interface HistoryData {
  identifier: string;
  startTime: number;
  endTime: number;
  days: number;
  recordCount: number;
  records: { time: string; value: number }[];
  error?: string;
}

export default function HeatmapPage() {
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regionData, setRegionData] = useState<{ region: string; value: number }[]>([
    { region: '区域 A', value: 0 },
    { region: '区域 B', value: 0 },
    { region: '区域 C', value: 0 },
    { region: '区域 D', value: 0 },
    { region: '区域 E', value: 0 }
  ]);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/onenet/history?identifier=survey_&days=7');
      const data: HistoryData = await response.json();

      if (data.error) {
        setError(data.error);
        setHistoryData(null);
        setRegionData([
          { region: '区域 A', value: 0 },
          { region: '区域 B', value: 0 },
          { region: '区域 C', value: 0 },
          { region: '区域 D', value: 0 },
          { region: '区域 E', value: 0 }
        ]);
      } else {
        setHistoryData(data);
        
        // 生成模拟区域数据（实际应从历史数据中分析）
        const mockRegions = [
          { region: '区域 A', value: Math.min(100, Math.max(0, (data.records[0]?.value || 0) * 0.7 + 10)) },
          { region: '区域 B', value: Math.min(100, Math.max(0, (data.records[0]?.value || 0) * 0.8 + 15)) },
          { region: '区域 C', value: Math.min(100, Math.max(0, (data.records[0]?.value || 0) * 0.9 + 20)) },
          { region: '区域 D', value: Math.min(100, Math.max(0, (data.records[0]?.value || 0) * 1.1 + 5)) },
          { region: '区域 E', value: Math.min(100, Math.max(0, (data.records[0]?.value || 0) * 1.2 + 25)) }
        ];
        
        setRegionData(mockRegions);
        setError(null);
      }
    } catch (err) {
      setError('网络请求失败');
      setHistoryData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
    
    // 每 5 分钟刷新一次
    const interval = setInterval(fetchHistoryData, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // 计算统计数据
  const stats = {
    max: historyData ? Math.max(...historyData.records.map(r => r.value)) : 0,
    min: historyData ? Math.min(...historyData.records.map(r => r.value)) : 0,
    avg: historyData ? historyData.records.reduce((sum, r) => sum + r.value, 0) / historyData.records.length : 0,
    count: historyData ? historyData.records.length : 0
  };

  // 空状态
  if (!loading && !historyData && regionData.every(r => r.value === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">📭</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">暂无历史数据</h1>
            <p className="text-white/80 text-lg mb-8">
              设备尚未上报历史数据，或者设备离线<br />
              请检查设备连接状态后再次尝试
            </p>
            <button
              onClick={fetchHistoryData}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              重新加载数据
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">积尘热力图</h1>
            <p className="text-white/80">历史积尘数据趋势分析</p>
          </div>
          
          <div className="text-right">
            <div className="text-white/60 text-sm">数据刷新频率</div>
            <div className="text-white font-semibold">5 分钟自动刷新</div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white text-lg">加载历史数据中...</div>
          </div>
        ) : error ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-red-300 font-medium mb-4">{error}</div>
            <button
              onClick={fetchHistoryData}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              重新加载
            </button>
          </div>
        ) : historyData ? (
          <>
            {/* Data Info */}
            <div className="glass p-6 rounded-xl mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-white/60 text-sm mb-1">数据范围</div>
                  <div className="text-white font-mono text-sm">
                    {new Date(historyData.startTime).toLocaleDateString('zh-CN')} 至{' '}
                    {new Date(historyData.endTime).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-white/60 text-sm mb-1">数据记录数</div>
                  <div className="text-white font-semibold text-xl">{historyData.recordCount} 条</div>
                </div>
                <div className="text-center">
                  <div className="text-white/60 text-sm mb-1">属性</div>
                  <div className="text-white font-semibold">{historyData.identifier}</div>
                </div>
              </div>
            </div>

            {/* Dust Chart */}
            <div className="glass p-8 rounded-xl">
              <DustChart
                timeData={historyData.records}
                regionData={regionData}
                stats={stats}
              />
            </div>

            {/* Data Source Info */}
            <div className="mt-8 glass p-4 rounded-xl text-center">
              <div className="text-white/60 text-sm">
                数据来源：OneNET 云平台 · 设备 ID: D001 · 产品 ID: cC223qEDV4
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
