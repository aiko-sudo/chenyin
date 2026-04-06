'use client';

interface DeviceCardProps {
  title: string;
  deviceName: string;
  productId: string;
  icon?: string;
}

export function DeviceCard({ title, deviceName, productId, icon = '🌞' }: DeviceCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="text-white text-sm font-medium uppercase tracking-wide">{title}</h3>
          <div className="flex gap-2 mt-1">
            <span className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded">设备名：{deviceName}</span>
            <span className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded">产品 ID: {productId.substring(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
