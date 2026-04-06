# 光伏板积尘监测与告警系统 - PDU 监控系统

> 基于 AI 视觉技术与物联网平台，实时监测光伏板积尘状态，智能识别积尘程度，自动触发清洁告警，最大化发电效率

## 🚀 快速开始

### 本地开发

1. **克隆项目**
   
   ```bash
   git clone <your-repo-url>
   cd pdus-dashboard
   ```

2. **安装依赖**
   
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   ```bash
   cp .env.local.example .env.local
   ```
   
   编辑 `.env.local`，配置 OneNET 平台参数：
   
   ```env
   ONENET_API_BASE=https://iot-api.heclouds.com
   ONENET_PRODUCT_ID=cC223qEDV4
   ONENET_DEVICE_NAME=D001
   ONENET_ACCESS_KEY=fZ/7z/GxfTv58d97sVG9ZYcvj7GhlYfNARX3DwmVO0s=
   ONENET_TOKEN_METHOD=sha256
   ```

4. **启动开发服务器**
   
   ```bash
   npm run dev
   ```
   
   访问 [http://localhost:3000](http://localhost:3000) 查看应用

## 📁 项目结构

```
pdus-dashboard/
├── src/
│   ├── app/                        # Next.js 14 App Router
│   │   ├── layout.tsx              # 根布局
│   │   ├── page.tsx                # 首页（介绍）
│   │   ├── features/page.tsx       # 功能页面
│   │   ├── monitor/page.tsx        # 实时监测（动态数据）
│   │   ├── heatmap/page.tsx        # 积尘热力图（统计图表）
│   │   ├── api/
│   │   │   ├── onenet/
│   │   │   │   ├── latest/route.ts # OneNET 最新数据 API
│   │   │   │   └── history/route.ts # OneNET 历史数据 API
│   │   │   └── health/route.ts     # 健康检查 API
│   │   └── globals.css             # 全局样式
│   ├── components/                 # React 组件
│   │   ├── Navbar.tsx              # 导航栏
│   │   ├── MetricCard.tsx          # 指标卡片
│   │   ├── DustChart.tsx           # 积尘图表
│   │   ├── ProgressBar.tsx         # 进度条
│   │   ├── DeviceCard.tsx          # 设备信息卡
│   │   └── StatusBadge.tsx         # 状态徽章
│   └── lib/
│       ├── onenet.ts               # OneNET API 封装
│       └── types.ts                # TypeScript 类型定义
├── public/                         # 静态资源
├── .env.local.example             # 环境变量模板
├── package.json                   # 项目配置
├── tailwind.config.ts             # Tailwind CSS 配置
├── tsconfig.json                  # TypeScript 配置
├── vercel.json                    # Vercel 部署配置
└── README.md                      # 项目文档
```

## 🎯 功能介绍

### 1. 介绍页面 (首页)

- 系统原理和技术优势介绍
- 6 个核心特性展示
- 工作流程说明
- 适用场景介绍

### 2. 功能页面

- 实时监测功能详解
- 数据上传机制
- 告警功能说明
- 本地显示特性
- 远程配置能力
- 历史查询功能

### 3. 实时监测页面 (动态)

- **实时数据展示**
  - 当前积尘度（0-100%）
  - 识别置信度（0-100%）
  - 积尘诊断状态（正常/轻度/重度）
  - 设备电池电量
- **设备状态监控**
  - 在线/离线状态
  - 最后更新时间
  - 自动刷新（30 秒间隔）
- **积尘度可视化**
  - 进度条显示
  - 颜色分级（绿色/黄色/红色）
  - 智能告警提示

### 4. 积尘热力图页面 (统计)

- **历史趋势分析**
  - 7 天/30 天趋势切换
  - 折线图展示积尘变化
- **区域对比分析**
  - 柱状图显示各区域积尘度
  - 区域分布饼图
- **统计数据**
  - 最大/最小积尘度
  - 平均值
  - 数据点数量
- **表格视图**
  - 统计表格展示
  - 响应式布局

## 🔧 OneNET 集成说明

### API 鉴权方式

OneNET 使用 Token 鉴权，生成公式：

```
StringForSignature = et + '\n' + method + '\n' + res + '\n' + version
key = Base64Decode(access_key)
sign = Base64Encode(HMAC_SHA256(key, StringForSignature))
```

### API 接口路径

当前配置基于 OneNET 新版文档：

- 最新数据查询：`/thingmodel/query-device-property`
- 历史数据查询：`/thingmodel/query-device-property-history`

**注意**: 如遇接口路径问题，可通过环境变量调整：

```env
ONENET_API_LATEST_PATH=/your/custom/path
ONENET_API_HISTORY_PATH=/your/custom/path
```

### 设备数据格式

```json
{
  "id": "123",
  "version": "1.0",
  "params": {
    "survey_": {"value": 50},        // 积尘度 0-100
    "level_": {"value": 85},         // 置信度百分比
    "dust_": {"value": "mild"},      // 诊断状态
    "BatteryVoltage": {"value": 82.5} // 电池电量
  }
}
```

## 📱 移动端适配

- ✅ 响应式布局设计
- ✅ Chart.js 图表自适应（`responsive: true, maintainAspectRatio: false`）
- ✅ CSS Grid `auto-fit` 布局
- ✅ 导航栏移动端滚动
- ✅ 表格水平滚动
- ✅ 卡片间距动态调整

## 🚀 部署到 Vercel

1. **准备环境**
   
   ```bash
   npm run build
   ```

2. **部署到 Vercel**
   
   - 在 [Vercel](https://vercel.com) 创建项目
   - 导入 GitHub 仓库
   - 配置环境变量
   - 部署

3. **环境变量（Vercel 部署时）**
   
   ```
   ONENET_API_BASE=https://iot-api.heclouds.com
   ONENET_PRODUCT_ID=cC223qEDV4
   ONENET_DEVICE_NAME=D001
   ONENET_ACCESS_KEY=fZ/7z/GxfTv58d97sVG9ZYcvj7GhlYfNARX3DwmVO0s=
   ONENET_TOKEN_METHOD=sha256
   ```
   
   > ⚠️ `ONENET_ACCESS_KEY` 是产品 accessKey，不是设备密钥。在 OneNET 控制台 → 产品概述 → 产品信息中获取。

## 🎨 视觉主题

- **背景渐变**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **强调色**: `#00ff88`（绿色）
- **卡片**: 毛玻璃效果 `backdrop-filter: blur(10px)`
- **配色**: 紫色渐变 + 白色文字

## 📋 积尘等级定义

| 等级   | 积尘度范围   | 状态标识      | 建议     |
| ---- | ------- | --------- | ------ |
| 正常   | 0-30%   | ✅ green   | 无需处理   |
| 轻度积尘 | 31-70%  | ⚠️ yellow | 建议安排清洁 |
| 重度积尘 | 71-100% | 🚨 red    | 立即清洁   |

## ⚠️ 注意事项

1. **设备离线处理**
   
   - 实时监测页面显示设备离线状态
   - 历史页面显示"暂无历史数据"
   - 自动重试连接（30 秒轮询）

2. **API 路径配置**
   
   - 实际 OneNET API 路径可能需要根据固件版本调整
   - 建议先测试 API 连通性，再部署生产环境

3. **数据缓存**
   
   - 最新数据缓存 30 秒
   - 历史数据缓存 5 分钟
   - 内存缓存基于 Node.js Map

4. **安全性**
   
   - 设备密钥不暴露到前端
   - 所有通过 API Route 代理请求
   - 生产环境使用 HTTPS

## 🔍 调试与测试

### 检查 OneNET API 连通性

```bash
# 在本地开发环境下测试
curl http://localhost:3000/api/onenet/latest
curl http://localhost:3000/api/onenet/history?days=7

# 健康检查
curl http://localhost:3000/api/health
```

### 查看日志

```bash
# 开发环境日志
npm run dev

# 生产环境日志
npm run start
```

## 📦 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图表**: Chart.js + react-chartjs-2
- **部署**: Vercel
- **硬件**: OneNET 物联网平台
- **固件**: ESP32 + AI 视觉模块

## 📄 License

Copyright © 2024 光伏板积尘监测与告警系统

## 👥 技术支持

如有问题，请查阅：

- [OneNET 官方文档](https://open.iot.10086.cn/)
- [Next.js 官方文档](https://nextjs.org/docs)
- [Chart.js 文档](https://www.chartjs.org/docs/latest/)

---

**快速部署**: 一键部署到 Vercel，实时连接 OneNET 设备数据
