# 📖 互联网记忆 — Internet Memory

> 追踪热点事情 · 社会事件时间线记录站

记录互联网上的重要社会事件，保留数字记忆。基于 JSON 数据的静态站点，支持 GitHub Pages 部署。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建**: Vite 6
- **样式**: TailwindCSS 3
- **路由**: React Router v7
- **部署**: GitHub Pages（静态导出）

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 部署到 GitHub Pages（需先配置仓库）
npm run deploy
```

## 数据源

数据位于 `public/data/events.json`，由「数据库开发 li」根据 PRD 提供完整 Schema。当前为示例数据。

## 项目结构

```
public/
├── data/events.json        # JSON 数据源
├── 404.html                # GitHub Pages SPA 路由修复
└── favicon.svg

src/
├── types/index.ts          # TypeScript 类型定义
├── data/loader.ts          # 数据加载层（fetch + 缓存）
├── hooks/useEvents.ts      # 状态管理 + 搜索筛选逻辑
├── components/
│   ├── Layout.tsx          # 全局布局（Header + Footer）
│   ├── EventCard.tsx       # 首页事件卡片
│   ├── StatusBadge.tsx     # 状态三级标签
│   ├── SearchBar.tsx       # 搜索输入框
│   ├── FilterPanel.tsx     # 筛选面板
│   ├── TimelineNode.tsx    # 时间线瀑布流节点
│   └── LoadingSpinner.tsx  # 加载动画
├── pages/
│   ├── HomePage.tsx        # 首页：卡片列表 + 搜索 + 筛选
│   └── DetailPage.tsx      # 详情页：时间线瀑布流
└── utils/
    ├── constants.ts        # 常量定义
    └── spaRedirect.ts      # SPA 路由恢复
```

## 功能清单

- [x] 首页事件卡片列表（自适应网格）
- [x] 详情页时间线瀑布流
- [x] 状态三级标签（进行中 🔴 / 已解决 ✅ / 悬而未决 ⚪）
- [x] 关键字搜索
- [x] 状态/分类/标签筛选
- [x] 排序（时间/更新时间/标题 + 升降序）
- [x] JSON 数据加载层（带缓存）
- [x] 移动端适配（响应式设计）
- [x] GitHub Pages 部署支持

## License

MIT
