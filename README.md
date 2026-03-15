# 🧋 Rui Tea 员工培训手册

React + Vite + Tailwind CSS 员工培训 Web App。

## 项目结构

```
ruitea-training/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Nav.jsx          # 顶部导航栏
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
