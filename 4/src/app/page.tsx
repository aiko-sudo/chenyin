'use client';


const features = [
  {
    icon: '🎯',
    title: '高精度识别',
    description: '采用 AI 视觉技术，积尘识别精度高达 95% 以上，准确判断积尘程度',
    color: 'bg-blue-500'
  },
  {
    icon: '💰',
    title: '低成本部署',
    description: '基于现有监控系统升级，无需额外硬件投入，快速部署',
    color: 'bg-green-500'
  },
  {
    icon: '🔋',
    title: '低功耗设计',
    description: '采用 ESP32 超低功耗主控，支持太阳能供电，长期稳定运行',
    color: 'bg-yellow-500'
  },
  {
    icon: '☁️',
    title: '物联网集成',
    description: '对接 OneNET 云平台，支持实时监控、历史数据查询和远程配置',
    color: 'bg-purple-500'
  },
  {
    icon: '🧠',
    title: '端侧智能',
    description: '本地运行 AI 模型，无需云端算力即可实现高精度识别',
    color: 'bg-indigo-500'
  },
  {
    icon: '📊',
    title: '实时监控',
    description: '7×24 小时实时监测积尘状态，自动生成可视化报表',
    color: 'bg-pink-500'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16 fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              光伏板积尘<br/>监测与告警系统
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              基于 AI 视觉技术与物联网平台，实时监测光伏板积尘状态，<br/>
              智能识别积尘程度，自动触发清洁告警，最大化发电效率
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/monitor" className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                立即监测
              </a>
              <a href="/features" className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-200 backdrop-blur-sm">
                了解更多
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass p-6 rounded-xl card-hover transition-all duration-300 fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-2xl shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                </div>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">工作流程</h2>
          <p className="text-white/80 text-lg">四步实现智能积尘监测</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">图像采集</h3>
            <p className="text-white/70 text-sm">摄像头定期采集光伏板表面图像</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI 分析</h3>
            <p className="text-white/70 text-sm">端侧模型识别积尘程度，生成诊断报告</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">云上传</h3>
            <p className="text-white/70 text-sm">通过 MQTT 将数据实时上传到 OneNET 云平台</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
              4
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">智能告警</h3>
            <p className="text-white/70 text-sm">积尘超阈值触发告警，通知运维人员</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white/10 backdrop-blur-md py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">系统优势</h2>
            <p className="text-white/80 text-lg">为什么选择我们的积尘监测系统？</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-2xl mb-4">
                📈
              </div>
              <h3 className="text-xl font-bold text-white mb-2">提升发电效率</h3>
              <p className="text-white/80 mb-4">
                及时发现积尘问题，减少发电损失，提升光伏板效率 5-15%
              </p>
              <ul className="text-white/70 text-sm space-y-2">
                <li>✓ 减少发电量损失</li>
                <li>✓ 降低运营成本</li>
                <li>✓ 延长设备寿命</li>
              </ul>
            </div>

            <div className="glass p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl mb-4">
                🔧
              </div>
              <h3 className="text-xl font-bold text-white mb-2">维护智能化</h3>
              <p className="text-white/80 mb-4">
                从被动维护转为主动预测，合理安排清洁计划
              </p>
              <ul className="text-white/70 text-sm space-y-2">
                <li>✓ 按需清洁，减少浪费</li>
                <li>✓ 智能调度维护资源</li>
                <li>✓ 降低人工成本</li>
              </ul>
            </div>

            <div className="glass p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-2xl mb-4">
                📊
              </div>
              <h3 className="text-xl font-bold text-white mb-2">数据可追溯</h3>
              <p className="text-white/80 mb-4">
                完整的历史数据记录，支持趋势分析和决策优化
              </p>
              <ul className="text-white/70 text-sm space-y-2">
                <li>✓ 积尘度历史追溯</li>
                <li>✓ 月度/季度分析报告</li>
                <li>✓ 数据导出支持</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white/60 text-sm">
              © 2024 光伏板积尘监测与告警系统。基于 OneNET 物联网平台构建。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
