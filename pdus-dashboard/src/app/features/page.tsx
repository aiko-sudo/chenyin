'use client';


const features = [
  {
    icon: '📡',
    title: '实时监测',
    description: '7×24 小时不间断监测光伏板积尘状态，数据每 30 秒自动更新一次，确保及时掌握积尘变化趋势。',
    details: [
      '实时数据刷新',
      '积尘度连续监测',
      '置信度实时评估',
      '设备在线状态监控'
    ],
    color: 'bg-blue-500'
  },
  {
    icon: '☁️',
    title: '数据上传',
    description: '通过 MQTT 协议将监测数据实时上传到 OneNET 云平台，支持云端存储、分析和共享。',
    details: [
      'MQTT 实时传输',
      'OneNET 云端存储',
      '数据加密传输',
      '断点续传机制'
    ],
    color: 'bg-green-500'
  },
  {
    icon: '🔔',
    title: '告警功能',
    description: '根据积尘度阈值自动触发多级告警，通过可视化界面、推送通知等方式提醒运维人员。',
    details: [
      '多级告警阈值',
      '实时告警提示',
      '告警历史记录',
      '告警状态追溯'
    ],
    color: 'bg-red-500'
  },
  {
    icon: '📱',
    title: '本地显示',
    description: '本地显示屏实时展示积尘状态和设备信息，无需连接网络即可查看当前监测数据。',
    details: [
      '本地 OLED 显示',
      '状态指示灯',
      '触摸交互界面',
      '离线也可显示'
    ],
    color: 'bg-purple-500'
  },
  {
    icon: '⚙️',
    title: '远程配置',
    description: '通过云平台远程配置监测参数，包括采集间隔、告警阈值、设备名称等，无需现场操作。',
    details: [
      '远程参数设置',
      '阈值动态配置',
      '设备命名管理',
      '配置版本备份'
    ],
    color: 'bg-yellow-500'
  },
  {
    icon: '📊',
    title: '历史查询',
    description: '支持按时间范围查询历史积尘数据，生成趋势图表和统计分析报表。',
    details: [
      '7 天/30 天历史',
      '可视化趋势图',
      '统计数据导出',
      '多区域对比'
    ],
    color: 'bg-pink-500'
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">系统核心功能</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            全面的功能设计，满足光伏板积尘监测的各个环节需求
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass p-8 rounded-xl card-hover transition-all duration-300 fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              
              <p className="text-white/80 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="space-y-3">
                {feature.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-white/70">
                    <div className={`w-2 h-2 ${feature.color} rounded-full`}></div>
                    <span className="text-sm">{detail}</span>
                  </div>
                ))}
              </div>
              
              <div className={`mt-6 h-1 rounded-full ${feature.color}`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlights Section */}
      <div className="bg-white/10 backdrop-blur-md py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">技术亮点</h2>
            <p className="text-white/80 text-lg">先进的技术支持，确保系统稳定可靠</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-xl card-hover">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🤖
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">AI 视觉识别技术</h3>
                  <p className="text-white/70 mb-4">
                    基于深度学习的图像识别算法，能够准确区分不同类型的积尘（灰尘、沙土、鸟粪等）， 
                    识别精度达到 95% 以上，置信度评估可靠。
                  </p>
                  <ul className="text-white/60 text-sm space-y-2">
                    <li>✓ ResNet50 骨干网络，高精度特征提取</li>
                    <li>✓ 针对光伏板场景训练，适应性强</li>
                    <li>✓ 支持边界模糊场景检测</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-xl card-hover">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  📡
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">MQTT 物联网协议</h3>
                  <p className="text-white/70 mb-4">
                    采用轻量级 MQTT 协议进行数据通信，支持 QoS 三级服务质量， 
                    确保数据可靠传输，即使在网络不稳定的情况下也能保证数据完整性。
                  </p>
                  <ul className="text-white/60 text-sm space-y-2">
                    <li>✓ 低功耗设计，适合远端设备</li>
                    <li>✓ 支持断线重连和消息持久化</li>
                    <li>✓ 兼容 OneNET 平台协议规范</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-xl card-hover">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  ⚡
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">低能耗设计</h3>
                  <p className="text-white/70 mb-4">
                    基于 ESP32 超低功耗主控，支持深度睡眠和定时唤醒，结合太阳能供电系统， 
                    实现长期免维护运行，适合野外光伏站点部署。
                  </p>
                  <ul className="text-white/60 text-sm space-y-2">
                    <li>✓ 待机功耗&lt;10mW</li>
                    <li>✓ 支持多种电源输入方式</li>
                    <li>✓ 内置电池保护机制</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-xl card-hover">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🔒
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">安全可靠</h3>
                  <p className="text-white/70 mb-4">
                    采用 TLS/SSL 加密传输，设备认证和云端鉴权双重保障，数据完整性和隐私保护无忧。
                  </p>
                  <ul className="text-white/60 text-sm space-y-2">
                    <li>✓ HTTPS 加密通信</li>
                    <li>✓ 设备身份认证</li>
                    <li>✓ 数据备份与恢复</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">适用场景</h2>
          <p className="text-white/80 text-lg">广泛的场景覆盖，满足不同光伏电站需求</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-6 rounded-xl text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🏭
            </div>
            <h3 className="text-xl font-bold text-white mb-2">大型光伏电站</h3>
            <p className="text-white/70 text-sm">
              针对大规模光伏电站的面阵式监测，支持多区域统一管理，
              提供全局积尘分布视图
            </p>
          </div>

          <div className="glass p-6 rounded-xl text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🏠
            </div>
            <h3 className="text-xl font-bold text-white mb-2">工商业屋顶光伏</h3>
            <p className="text-white/70 text-sm">
              为工商业屋顶光伏提供低成本监测方案，快速部署，
              实时掌握积尘状态，优化运维效率
            </p>
          </div>

          <div className="glass p-6 rounded-xl text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🏞️
            </div>
            <h3 className="text-xl font-bold text-white mb-2">偏远地区电站</h3>
            <p className="text-white/70 text-sm">
              针对野外偏远地区，支持离线运行和远程管理，
              降低巡检频率，减少人工成本
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
