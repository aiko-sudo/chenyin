'use client';

interface ProgressBarProps {
  value: number;
  level: 'normal' | 'mild' | 'severe';
  label: string;
}

export function ProgressBar({ value, level, label }: ProgressBarProps) {
  const getProgressColor = () => {
    if (level === 'normal') return 'bg-green-500';
    if (level === 'mild') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressLabel = () => {
    if (level === 'normal') return '正常';
    if (level === 'mild') return '轻度积尘';
    return '重度积尘';
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
      <h3 className="text-white text-sm font-medium mb-3 uppercase tracking-wide">{label}</h3>
      
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-white/20">
              {getProgressLabel()}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-white">
              {value}%
            </span>
          </div>
        </div>
        
        <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-white/20">
          <div
            style={{ width: `${Math.min(value, 100)}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor()} transition-all duration-500 ease-out`}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-white/60">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {level === 'mild' && (
        <div className="mt-3 text-yellow-300 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <p>建议安排清洁维护</p>
        </div>
      )}
      
      {level === 'severe' && (
        <div className="mt-3 text-red-300 text-sm flex items-center gap-2">
          <span>🚨</span>
          <p>立即清洁以恢复效率</p>
        </div>
      )}
      
      {level === 'normal' && (
        <div className="mt-3 text-green-300 text-sm flex items-center gap-2">
          <span>✅</span>
          <p>积尘度在正常范围内</p>
        </div>
      )}
    </div>
  );
}
