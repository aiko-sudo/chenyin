'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  subtitle?: React.ReactNode;
  color?: string;
}

export function MetricCard({ title, value, icon, subtitle, color = 'bg-blue-500' }: MetricCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-white">{value}</div>
          {subtitle && (
            <div className="text-xs text-white/60 mt-1">{subtitle}</div>
          )}
        </div>
      </div>
      
      <div className={`h-1 rounded-full mt-4 ${color}`}></div>
    </div>
  );
}
