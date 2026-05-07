# 🌊 双屿正念

<p align="center">
  <strong>基于双耳节拍技术的治愈系心理正念辅助小程序</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/微信小程序-双屿正念-07C160?style=flat-square&logo=wechat" alt="WeChat Mini Program"/>
  <img src="https://img.shields.io/badge/技术栈-WXML%20%7C%20WXSS%20%7C%20JS-2C3E50?style=flat-square" alt="Tech Stack"/>
</p>

---

## ✨ 项目简介

**双屿正念** 是一款以「治愈系」为核心设计理念的心理正念辅助工具。项目依托 **双耳节拍（Binaural Beats）** 声学理论，通过精心调配的音频频率与极简优雅的视觉交互，帮助用户：

- 🧘 缓解日常焦虑与压力
- 📚 进入深度专注的学习状态
- 🌿 沉浸于自然放松的冥想体验

> 「双耳节拍」指两耳分别接收频率略有差异的音波时，大脑会感知到一种「差频」节拍，该节拍可引导脑波进入特定的意识状态（如 Alpha、Beta、Theta、Gamma 波段）。

---

## 🎯 核心功能

### 🏠 启动页
- **艺术字标题** — 精心设计的品牌视觉呈现
- **温馨佩戴提示** — 引导用户正确使用耳机，确保双耳节拍效果最佳

### 🎧 播放页
- **Glassmorphism 磨砂质感按键** — 玻璃拟态风格的交互控件，兼具美观与触控反馈
- **云端音频流播放** — 双轨音频架构：
  - **Wave 轨**：双耳节拍波形音频（Alpha / Beta / Delta / Theta / Gamma）
  - **BGM 轨**：治愈系背景音乐（火焰 / 森林 / 海浪 / 蒸汽 / 行走 / 清风）
- **独立音量控制** — 分别调节波形与背景音乐音量
- **点赞互动** — 云端实时统计用户偏好，驱动智能推荐

### 📂 分类页

| 学习场景 | 双耳节拍波段 | 适用学科 |
|---------|------------|---------|
| 高度专注 | Alpha (α) | 数学、物理 |
| 中度激活 | Beta (β) | 化学、生物 |
| 深度理解 | Delta (δ) | 语文、英语 |
| 记忆强化 | Theta (θ) | 历史、地理、政治 |

| 放松场景 | 双耳节拍波段 | 效果 |
|---------|------------|------|
| 冥想放松 | Gamma1 (γ) | 缓解焦虑 |
| 自然疗愈 | Gamma3 (γ) | 缓解疼痛 |

### ⚙️ 配置页
- **场景背景选择** — 森林 / 湖畔 / 草地 / 沙滩 / 雪山
- **BGM 选择** — 多款治愈系环境音效
- **社区推荐位** — 基于点赞数据的 Top1 热门推荐

---

## 🛠 技术栈

```
┌─────────────────────────────────────┐
│           微信小程序原生框架          │
│         WXML + WXSS + JavaScript     │
├─────────────────────────────────────┤
│         微信云开发 (Cloud Base)       │
│  ┌───────────┐ ┌──────────┐        │
│  │  云数据库   │ │  云存储   │        │
│  └───────────┘ └──────────┘        │
├─────────────────────────────────────┤
│            设计与布局                 │
│  CSS Linear Gradient · Web Font    │
│  Flex Layout · Glassmorphism       │
└─────────────────────────────────────┘
```

| 层级 | 技术 | 说明 |
|:---|:---|:---|
| **前端框架** | 微信小程序原生 (WXML/WXSS/JS) | 无第三方框架依赖，轻量高效 |
| **后端/云端** | 微信云开发 | 云数据库（`interaction_stats` 集合）+ 云存储（音频/图片资源） |
| **UI 设计** | CSS 线性渐变 + 动态字体加载 | 全局 Serif 宋体排版 + Web Font 支持 |
| **布局方案** | Flex 弹性布局 | 自适应多机型屏幕尺寸 |

---

## 💡 项目亮点

### 🎨 UI 深度优化：全局宋体化人文排版

项目在全局层面实现了 **Serif（宋体）字体体系** 的统一应用，摒弃了常见的无衬线字体堆砌，通过衬线字体的笔画细节与人文气质，赋予界面独特的书卷美感与阅读舒适度。

```css
/* 全局字体声明 */
page { font-family: -apple-system, "Noto Serif SC", "Songti SC", Georgia, serif; }
```

### 📐 动态布局适配：精准对齐系统胶囊按钮

针对微信小程序的 **自定义导航栏** 场景，实现了返回键与系统胶囊按钮的 **动态垂直居中对齐** 算法，完美兼容各类异形屏设备（刘海屏 / 药丸屏 / 水滴屏）：

```javascript
const menuRect = wx.getMenuButtonBoundingClientRect()
const btnCenterY = menuRect.top + menuRect.height / 2
this.setData({ navBarTop: btnCenterY - 16 }) // 返回按钮半高偏移
```

> 内置降级机制：当 `getMenuButtonBoundingClientRect()` 不可用时，自动回退至 `statusBarHeight` 安全估算值。

### 🌫️ 极致视觉：自定义底部渐变雾化效果

页面底部采用 **多层线性渐变叠加** 实现柔和的「雾化过渡」视觉，消除了传统纯色背景的生硬边界感，显著增强页面的沉浸式氛围：

```css
background-image: linear-gradient(
  180deg,
  #D8F0E3 0%, #EAF6EE 14%,
  #FFFFFF 28%, #FFFFFF 65%,
  #EBFAF1 82%, #D8F0E3 100%
);
```

### 🔊 双轨音频架构 + 容错机制

播放页采用 `InnerAudioContext` 双实例并行架构，Wave 与 BGM 独立控制互不干扰。所有音频操作均包裹于 `try-catch` 中，确保异常不会阻断用户体验。

### ☁️ 云端资源一体化管理

音频与图片均托管于微信云存储，通过 `cloud://` 协议直接引用，无需额外 CDN 配置，实现前后端资源的统一生命周期管理。

---

## 📦 安装说明

### 前置条件
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) >= 稳定版
- 微信公众平台账号（已开通 [云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html) 服务）

### 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/<your-username>/miniprogram-11.git
   cd miniprogram-11
   ```

2. **配置云环境 ID**（⚠️ 必须操作）

   打开 `app.js`，将 `env` 字段替换为你自己的云开发环境 ID：

   ```javascript
   // app.js 第 12~14 行
   wx.cloud.init({
     env: 'your-env-id-here',  // ← 替换为你的云环境 ID
     traceUser: true,
   });
   ```

   > 如何获取环境 ID：[微信云开发控制台](https://console.cloud.weixin.qq.com/) → 设置 → 环境设置 → 环境 ID

3. **导入开发者工具**
   - 打开微信开发者工具 → 导入项目
   - 目录选择本项目的根文件夹
   - AppID 使用你自己的或测试号

4. **创建云开发资源**
   - 在开发者工具中点击「云开发」按钮开通环境
   - 创建数据库集合 `interaction_stats`
   - 上传音频文件至云存储目录：
     - `audio_waves/` — 双耳节拍波形文件（`.wav`）
     - `audio_bgm/` — 背景音乐文件（`.mp3`）
     - `images/` — 场景背景图（`.jpg`）
     - `audio_theme/` — 主页主题曲（`.wav`）

5. **编译运行**
   ```
   Ctrl + B（或点击编译按钮）
   ```

---

## 📁 项目结构

```
miniprogram-11/
├── app.js                  # 应用入口 & 云开发初始化 & 全局 BGM 管理
├── app.json                # 页面路由 & 全局配置
├── app.wxss                # 全局样式
├── pages/
│   ├── index/index         # 启动页（艺术字 + 佩戴提示）
│   ├── main/main           # 主导航页（学习 / 放松入口）
│   ├── study/study         # 学习分类页（6 大学科波段映射）
│   ├── relax/relax         # 放松分类页（冥想 / 自然疗愈）
│   ├── config/config       # 场景配置页（背景/BGM选择 + 排行榜推荐）
│   └── player/player       # 播放页（双轨音频 + Glassmorphism 控件）
├── components/             # 自定义组件
├── static/                 # 本地静态资源
├── assets/                 # 项目素材（SVG 等）
└── project.config.json     # 开发者工具配置
```

---

## 📄 许可证

本项目仅供学习交流使用。双耳节拍音频资源版权归原作者所有。

---

<p align="center">
  Made with ❤️ by <strong>双屿正念</strong>
</p>
