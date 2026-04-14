// @ts-nocheck
'use client';
// Chart.js 类型过于严格，此处使用运行时安全的配置

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface DustChartProps {
  timeData: { time: string; value: number }[];
  regionData: { region: string; value: number }[];
  stats: {
    max: number;
    min: number;
    avg: number;
    count: number;
  };
}

export function DustChart({ timeData, regionData, stats }: DustChartProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // 时间趋势图数据
  const lineChartData = {
    labels: timeData.map(d => {
      const date = new Date(d.time);
      return date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0');
    }),
    datasets: [
      {
        label: '积尘度趋势',
        data: timeData.map(d => d.value),
        borderColor: 'rgba(0, 255, 136, 1)',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgba(255, 255, 255, 0.9)'
        }
      },
      title: {
        display: true,
        text: '积尘度变化趋势',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          callback: (value: number) => value + '%'
        }
      }
    }
  };

  // 区域对比图数据
  const barChartData = {
    labels: regionData.map(d => d.region),
    datasets: [
      {
        label: '区域积尘度',
        data: regionData.map(d => d.value),
        backgroundColor: [
          'rgba(0, 255, 136, 0.7)',
          'rgba(255, 200, 0, 0.7)',
          'rgba(255, 100, 100, 0.7)',
          'rgba(100, 150, 255, 0.7)',
          'rgba(150, 100, 255, 0.7)'
        ],
        borderColor: [
          'rgba(0, 255, 136, 1)',
          'rgba(255, 200, 0, 1)',
          'rgba(255, 100, 100, 1)',
          'rgba(100, 150, 255, 1)',
          'rgba(150, 100, 255, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgba(255, 255, 255, 0.9)'
        }
      },
      title: {
        display: true,
        text: '区域积尘度对比',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          callback: (value: number) => value + '%'
        }
      }
    }
  };

  // 分布饼图数据
  const doughnutData = {
    labels: ['正常', '轻度积尘', '重度积尘'],
    datasets: [
      {
        data: [
          regionData.filter(d => d.value <= 30).length || 0,
          regionData.filter(d => d.value > 30 && d.value <= 70).length || 0,
          regionData.filter(d => d.value > 70).length || 0
        ],
        backgroundColor: [
          'rgba(0, 255, 136, 0.8)',
          'rgba(255, 200, 0, 0.8)',
          'rgba(255, 100, 100, 0.8)'
        ],
        borderColor: [
          'rgba(0, 255, 136, 1)',
          'rgba(255, 200, 0, 1)',
          'rgba(255, 100, 100, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          padding: 15,
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: '积尘分布比例',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: {
          label: (context: any) => {
            const value = context.raw as number;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `占比：${percentage}% (${value}个区域)`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setTimeRange('7d')}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            timeRange === '7d'
              ? 'bg-green-500 text-white'
              : 'bg-white/20 text-white/80 hover:bg-white/30'
          }`}
        >
          7 天趋势
        </button>
        <button
          onClick={() => setTimeRange('30d')}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            timeRange === '30d'
              ? 'bg-green-500 text-white'
              : 'bg-white/20 text-white/80 hover:bg-white/30'
          }`}
        >
          30 天趋势
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 变化趋势折线图 */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
          <div className="chart-container h-[400px]">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* 区域积尘度对比柱状图 */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
          <div className="chart-container h-[400px]">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* 积尘度统计表格 */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg overflow-hidden">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>📊</span>
          积尘度统计分析
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20">
                <th className="pb-3 text-left font-medium">统计项</th>
                <th className="pb-3 text-center font-medium">数值</th>
                <th className="pb-3 text-left font-medium">说明</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-4">最大积尘度</td>
                <td className="py-4 text-center text-red-300 font-semibold">{stats.max}%</td>
                <td className="py-4 text-white/60">记录中的最高积尘值</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-4">最小积尘度</td>
                <td className="py-4 text-center text-green-300 font-semibold">{stats.min}%</td>
                <td className="py-4 text-white/60">记录中的最低积尘值</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-4">平均积尘度</td>
                <td className="py-4 text-center text-blue-300 font-semibold">{stats.avg.toFixed(1)}%</td>
                <td className="py-4 text-white/60">统计周期内的平均值</td>
              </tr>
              <tr>
                <td className="py-4">数据点数量</td>
                <td className="py-4 text-center text-purple-300 font-semibold">{stats.count}</td>
                <td className="py-4 text-white/60">采集的数据记录数</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 区域分布饼图 */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
        <div className="chart-container h-[350px]">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
}
