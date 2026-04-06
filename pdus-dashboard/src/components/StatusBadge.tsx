'use client';

interface StatusBadgeProps {
  online: boolean;
  lastUpdate: string | null;
}

export function StatusBadge({ online, lastUpdate }: StatusBadgeProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-white font-medium">{online ? '设备在线' : '设备离线'}</span>
        </div>
        {lastUpdate && (
          <div className="text-white/60 text-xs">
            最后更新：{new Date(lastUpdate).toLocaleString('zh-CN')}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        {online ? (
          <span className="text-xs text-white/60">
            数据实时更新中...
          </span>
        ) : (
          <span className="text-xs text-white/60">
            上一次连接：{lastUpdate ? new Date(lastUpdate).toLocaleString('zh-CN') : '未知'}
          </span>
        )}
      </div>
    </div>
  );
}
