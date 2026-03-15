# 🧋 Rui Tea 员工培训手册

React + Vite + Tailwind CSS 员工培训 Web App。

## 更新履历

### v1.1.0 — 2026-03-15　UI 全面重设计（Tailwind UI Dashboard）

**布局**
- 将顶部导航栏替换为固定左侧侧边栏（桌面端 `lg+`）
- 移动端改为汉堡菜单 + 滑出 Drawer + 半透明遮罩
- 内容区域整体右移（`lg:pl-64`），最大宽度扩至 `max-w-4xl`

**导航（`Nav.jsx`）**
- 导航图标从 emoji 换为 Heroicons SVG（outline 风格）
- 当前页高亮改为 `bg-amber-50 text-amber-700` + 右侧圆点指示器
- 侧边栏底部新增店铺地址信息

**组件**
- `DrinkCard`：白底卡片 + `border-gray-200` + hover 时琥珀边框；右侧箭头 hover 动画；底部信息栏加分隔线
- `RecipeSteps`：统一白底卡片风格，步骤编号色块对齐容器颜色

**页面**
- `Home`：搜索框改为标准 input + focus ring；分类 filter 保留胶囊样式；空状态换为 SVG 图标
- `DrinkDetail`：Tab 导航改为下划线式（Tailwind UI 标准）；配方/冰量/配料三栏样式统一
- `Quiz`：选项改为字母标识（A/B/C/D）；得分区域增加进度条；答题反馈卡片更清晰
- `Simulate`：候选步骤区域加 `+` SVG 图标；提交按钮加 SVG 勾号；结果页评分卡片重新排版
- `Checklist`：进度区域独立为白色卡片；复选框改为 SVG 勾号；水果重量表格加表头底色
- `Contacts`：联系人头像改为圆角方块；电话按钮改为 SVG 电话图标；地址卡片加表头

**色彩系统**
- 中性色从 `stone-*` 统一迁移至 `gray-*`
- 成功色从 `green-*` 统一迁移至 `emerald-*`
- 主色 amber 保持不变

---

### v1.0.0 — 初始版本

- 基础培训 App 搭建（React + Vite + Tailwind CSS）
- 饮品菜单、详情、模拟制作、知识测验、开班清单、紧急联系六大模块

## 项目结构

```
ruitea-training/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Nav.jsx          # 侧边栏导航（桌面固定 + 移动抽屉）
│   │   ├── DrinkCard.jsx    # 饮品列表卡片
│   │   └── RecipeSteps.jsx  # 制作步骤渲染
│   ├── pages/
│   │   ├── Home.jsx         # 饮品菜单列表
│   │   ├── DrinkDetail.jsx  # 饮品详情（配方/冰量/配料）
│   │   ├── Simulate.jsx     # 模拟制作练习
│   │   ├── Quiz.jsx         # 知识测验（4种题型）
│   │   ├── Checklist.jsx    # 开班备货清单
│   │   └── Contacts.jsx     # 紧急联系
│   ├── data/
│   │   ├── drinks.json      # 所有饮品数据、清单、联系人
│   │   └── constants.js     # 分类样式、容器样式、工具函数
│   ├── App.jsx              # 根组件，页面路由
│   ├── main.jsx             # React 入口
│   └── index.css            # Tailwind 指令
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── .gitignore
```

## 本地运行

```bash
npm install
npm run dev
```

## 部署到 Vercel（推荐）

1. 将项目推送到 GitHub
2. 打开 [vercel.com](https://vercel.com) → **Add New Project**
3. 导入 GitHub 仓库，Framework 选 **Vite**
4. 点击 **Deploy** — 完成！

## 推送到 GitHub

```bash
git init
git add .
git commit -m "init: Rui Tea training app"
git branch -M main
git remote add origin https://github.com/<你的用户名>/ruitea-training.git
git push -u origin main
```

## 更新饮品数据

所有数据集中在 `src/data/drinks.json`，包含：
- `drinks` — 所有饮品配方
- `checklist` — 开班备货清单项目
- `fruitWeights` — 水果杯重量标准
- `contacts` — 紧急联系人
