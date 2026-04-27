# 路由目录统一与入口收敛设计

- 日期：2026-04-27
- 范围：仅统一前端路由文件组织方式，不修改页面行为、URL、loader/action 逻辑

## 背景

当前项目已经使用 `react-router-dom` 并以根目录 `main.tsx` 作为入口，但代码结构仍残留两类历史组织方式：

1. 页面文件直接平铺在 `src/routes/*.tsx`
2. 布局壳层放在 `src/app/root.tsx` 与 `src/app/admin-layout.tsx`

这导致目录职责不统一：一部分是 React Router 路由模块，一部分沿用类似 App Router 的命名。用户希望把结构收敛到单一约定：

- 不再使用 `src/app`
- 所有路由页面统一放到 `src/routes/<route_name>/route.tsx`
- 路由目录统一使用下划线命名
- 原先多级路由对应的页面目录拍平成单层下划线目录
- 现有简易 layout 不再保留为独立文件，直接合并到 `main.tsx`

## 目标

1. 将现有路由页面统一迁移为 `src/routes/<route_name>/route.tsx`
2. 目录名全部使用下划线风格
3. 多级路径对应的页面目录拍平成单层目录
4. 删除 `src/app/root.tsx` 与 `src/app/admin-layout.tsx`
5. 在 `main.tsx` 中直接承载根层与后台层的 layout JSX
6. 保持现有路由 path、loader、action、页面渲染行为不变

## 非目标

本次不做以下事项：

- 不调整 URL 设计
- 不调整嵌套路由层级
- 不拆分 loader / action 到单独文件
- 不重构菜单、面包屑、状态管理或样式逻辑
- 不顺手改业务页面实现
- 不引入新的布局抽象或共享包装组件

## 目标结构

### 路由模块迁移规则

现有页面统一迁移为如下结构：

- `src/routes/home.tsx` → `src/routes/home/route.tsx`
- `src/routes/login.tsx` → `src/routes/login/route.tsx`
- `src/routes/dashboard.tsx` → `src/routes/dashboard/route.tsx`
- `src/routes/theme.tsx` → `src/routes/theme/route.tsx`
- `src/routes/thread.tsx` → `src/routes/thread/route.tsx`
- `src/routes/check.tsx` → `src/routes/check/route.tsx`
- `src/routes/user-list.tsx` → `src/routes/user_list/route.tsx`
- `src/routes/user-role.tsx` → `src/routes/user_role/route.tsx`
- `src/routes/broadcast.tsx` → `src/routes/system_broadcast/route.tsx`

说明：

- 目录名一律使用下划线
- 多段 path 不保留目录层级，直接拍平成单层命名
- 文件名固定为 `route.tsx`

## 入口与布局调整

### 根层布局

当前 `src/app/root.tsx` 的职责只有：

- 引入全局样式 `@/app/globals.css`
- 设置 `dayjs.locale("zh-cn")`
- 提供 `ConfigProvider` 和 `App`
- 作为 `Outlet` 容器

调整后：

- 删除 `src/app/root.tsx`
- 将以上职责直接合并进 `main.tsx`
- 根路由的 `element` 改为 `main.tsx` 中定义的内联根层包装组件

### 后台布局

当前 `src/app/admin-layout.tsx` 的职责包括：

- 侧边菜单
- 顶部栏
- 面包屑
- 内容容器
- Footer
- `Outlet` 嵌套渲染

调整后：

- 删除 `src/app/admin-layout.tsx`
- 保留原有 JSX 结构与交互逻辑
- 直接在 `main.tsx` 中定义后台层包装组件
- `createBrowserRouter` 中原本依赖 `AdminLayout` 的嵌套路由继续存在，只是改为引用 `main.tsx` 内的后台包装组件

## 路由装配策略

`main.tsx` 中继续使用 `createBrowserRouter`，并保持现有路由拓扑不变：

- `/` → 首页
- `/login` → 登录页，保留 `action`
- 后台壳层下继续挂载：
  - `/dashboard`
  - `/user/list`
  - `/user/role`
  - `/theme`
  - `/thread`
  - `/check`
  - `/system/broadcast`

本次只改两类引用：

1. 组件 import 路径改为新的 `src/routes/<route_name>/route.tsx`
2. `Root` / `AdminLayout` import 删除，改为本文件内组件

## 兼容性与风险

### 保持不变的部分

- 所有 route path 字符串保持不变
- 现有 loader / action 保持原位置导出，只是跟随路由文件迁移
- 页面默认导出组件保持原实现
- 菜单 key、面包屑推导逻辑、导航行为保持不变

### 主要风险点

1. 路由模块迁移后 import 路径遗漏
2. `globals.css` 的引入位置从 `Root` 改到 `main.tsx` 后，需要确保仍然全局生效
3. layout 内联进 `main.tsx` 后，若遗漏 `Outlet`，会导致子路由不渲染
4. 登录页 action、部分页面 loader 的具名导出路径需要同步更新

### 风险控制策略

- 只做移动与引用修正，不改业务逻辑
- 删除 layout 文件前，先完整迁移其 JSX 结构到 `main.tsx`
- 修改完成后执行构建验证，确认类型与路由装配正常

## 验证方案

至少执行：

- `pnpm build`

若本地可启动，再补充人工验证以下路由的基本可访问性：

- `/`
- `/login`
- `/dashboard`
- `/user/list`
- `/system/broadcast`

验证重点：

- 页面能渲染
- 后台布局仍然显示菜单、头部、面包屑与内容区
- 登录 action 与 loader 路由未因路径调整失效

## 实施边界总结

这是一次纯结构收敛：

- 做文件迁移
- 做 import 修正
- 做 layout 内联合并
- 删除不再需要的 `src/app` 路由壳层文件

除此之外不做任何行为层重构。