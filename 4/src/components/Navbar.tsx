'use client';

import Link from 'next/link';

const navItems = [
  { href: '/', label: '介绍' },
  { href: '/features', label: '功能' },
  { href: '/monitor', label: '实时监测' },
  { href: '/heatmap', label: '积尘热力图' }
];

export function Navbar() {
  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-white font-bold text-xl">
              🌞 PDU 监控系统
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60 hidden sm:block">实时数据可视化监控平台</span>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 text-xs font-medium whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
