# Route Structure Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将路由页面统一迁移到 `src/routes/<route_name>/route.tsx`，删除 `src/app` 下的简易 layout，并把包装逻辑合并进 `main.tsx`，且不改变现有行为。

**Architecture:** 保持现有 React Router 拓扑、URL、loader、action 与页面实现不变，只做文件迁移、import 修正与 layout 内联。根层包装与后台包装都收敛到 `main.tsx`，页面模块统一落到按下划线命名的目录下。

**Tech Stack:** React 19, React Router, Vite, TypeScript, Ant Design, dayjs

---

## File Structure

- Modify: `main.tsx`
- Create: `src/routes/home/route.tsx`
- Create: `src/routes/login/route.tsx`
- Create: `src/routes/dashboard/route.tsx`
- Create: `src/routes/theme/route.tsx`
- Create: `src/routes/thread/route.tsx`
- Create: `src/routes/check/route.tsx`
- Create: `src/routes/user_list/route.tsx`
- Create: `src/routes/user_role/route.tsx`
- Create: `src/routes/system_broadcast/route.tsx`
- Delete: `src/routes/home.tsx`
- Delete: `src/routes/login.tsx`
- Delete: `src/routes/dashboard.tsx`
- Delete: `src/routes/theme.tsx`
- Delete: `src/routes/thread.tsx`
- Delete: `src/routes/check.tsx`
- Delete: `src/routes/user-list.tsx`
- Delete: `src/routes/user-role.tsx`
- Delete: `src/routes/broadcast.tsx`
- Delete: `src/app/root.tsx`
- Delete: `src/app/admin-layout.tsx`
- Verify: `package.json`

### Task 1: 迁移路由模块目录

**Files:**
- Create: `src/routes/home/route.tsx`
- Create: `src/routes/login/route.tsx`
- Create: `src/routes/dashboard/route.tsx`
- Create: `src/routes/theme/route.tsx`
- Create: `src/routes/thread/route.tsx`
- Create: `src/routes/check/route.tsx`
- Create: `src/routes/user_list/route.tsx`
- Create: `src/routes/user_role/route.tsx`
- Create: `src/routes/system_broadcast/route.tsx`
- Delete: `src/routes/home.tsx`
- Delete: `src/routes/login.tsx`
- Delete: `src/routes/dashboard.tsx`
- Delete: `src/routes/theme.tsx`
- Delete: `src/routes/thread.tsx`
- Delete: `src/routes/check.tsx`
- Delete: `src/routes/user-list.tsx`
- Delete: `src/routes/user-role.tsx`
- Delete: `src/routes/broadcast.tsx`

- [ ] **Step 1: 创建目标目录**

```bash
mkdir -p src/routes/home src/routes/login src/routes/dashboard src/routes/theme src/routes/thread src/routes/check src/routes/user_list src/routes/user_role src/routes/system_broadcast
```

- [ ] **Step 2: 迁移平铺路由文件到 `route.tsx`**

```bash
mv src/routes/home.tsx src/routes/home/route.tsx
mv src/routes/login.tsx src/routes/login/route.tsx
mv src/routes/dashboard.tsx src/routes/dashboard/route.tsx
mv src/routes/theme.tsx src/routes/theme/route.tsx
mv src/routes/thread.tsx src/routes/thread/route.tsx
mv src/routes/check.tsx src/routes/check/route.tsx
mv src/routes/user-list.tsx src/routes/user_list/route.tsx
mv src/routes/user-role.tsx src/routes/user_role/route.tsx
mv src/routes/broadcast.tsx src/routes/system_broadcast/route.tsx
```

- [ ] **Step 3: 确认旧文件已清空、新路径存在**

Run: `find src/routes -maxdepth 2 -type f | sort`
Expected: 只出现 `src/routes/<route_name>/route.tsx` 形式的新文件

- [ ] **Step 4: 提交一次纯迁移提交**

```bash
git add src/routes
git commit -m "refactor(routes): unify route module directories"
```

### Task 2: 将 layout 合并到 `main.tsx`

**Files:**
- Modify: `main.tsx`
- Delete: `src/app/root.tsx`
- Delete: `src/app/admin-layout.tsx`

- [ ] **Step 1: 在 `main.tsx` 中引入原 root 布局依赖**

```ts
import { App, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import { Outlet } from "react-router-dom";
import "@/app/globals.css";
```

- [ ] **Step 2: 在 `main.tsx` 中定义根层包装组件**

```tsx
function RootLayout() {
  dayjs.locale("zh-cn");
  return (
    <ConfigProvider locale={zhCN}>
      <App>
        <Outlet />
      </App>
    </ConfigProvider>
  );
}
```

- [ ] **Step 3: 把 `src/app/admin-layout.tsx` 的 JSX 与逻辑内联到 `main.tsx`**

```tsx
function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const breadcrumbItems = useMemo(() => {
    const trail = findTrail(menuConfig, pathname);
    const fallback = pathname.split("/").filter(Boolean).pop();
    const labels = ["控制台", ...(trail ?? (fallback ? [fallback] : []))];
    return labels.map((label) => ({ title: label }));
  }, [pathname]);

  return (
    <Layout className="overflow-y-hidden! h-screen">
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={[pathname]}
          mode="inline"
          items={items}
          selectedKeys={[pathname]}
          onClick={(e) => {
            navigate(e.key);
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex items-center h-full px-10">
            <div className="font-bold text-lg">Nine Forum 后台管理</div>
          </div>
        </Header>
        <Content style={{ margin: "0 16px" }} className="overflow-y-scroll scroller-hidden">
          <Breadcrumb className="ml-3! py-4!" items={breadcrumbItems} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Nine Console ©{new Date().getFullYear()} Created by Ayor
        </Footer>
      </Layout>
    </Layout>
  );
}
```

- [ ] **Step 4: 删除对 `src/app/root.tsx` 与 `src/app/admin-layout.tsx` 的 import，并删除这两个文件**

```bash
rm src/app/root.tsx src/app/admin-layout.tsx
```

- [ ] **Step 5: 提交一次 layout 收敛提交**

```bash
git add main.tsx src/app src/routes
git commit -m "refactor(router): inline root and admin layouts in main"
```

### Task 3: 修正 `main.tsx` 中的路由引用

**Files:**
- Modify: `main.tsx`

- [ ] **Step 1: 将旧路由 import 改到新目录**

```ts
import BroadcastPage, { loader as broadcastLoader } from "@/routes/system_broadcast/route";
import CheckPage from "@/routes/check/route";
import DashboardPage from "@/routes/dashboard/route";
import HomePage from "@/routes/home/route";
import LoginPage, { action as loginAction } from "@/routes/login/route";
import ThemePage, { loader as themeLoader } from "@/routes/theme/route";
import ThreadPage, { loader as threadLoader } from "@/routes/thread/route";
import UserListPage, { loader as userListLoader } from "@/routes/user_list/route";
import UserRolePage from "@/routes/user_role/route";
```

- [ ] **Step 2: 将根路由 element 指向 `RootLayout`**

```ts
{
  path: "/",
  element: <RootLayout />,
  children: [
```

- [ ] **Step 3: 将后台壳层 element 指向内联 `AdminLayout`**

```ts
{
  element: <AdminLayout />,
  children: [
```

- [ ] **Step 4: 检查 path、loader、action 与旧版一致**

Run: `git diff -- main.tsx`
Expected: 只出现 import 路径调整、layout 组件替换与必要的内联代码新增，不出现路由 path 改动

- [ ] **Step 5: 提交一次路由装配修正提交**

```bash
git add main.tsx
git commit -m "refactor(router): update route imports to new structure"
```

### Task 4: 验证构建结果

**Files:**
- Verify: `main.tsx`
- Verify: `src/routes/**/route.tsx`
- Verify: `package.json`

- [ ] **Step 1: 运行类型检查与生产构建**

Run: `pnpm build`
Expected: 构建成功，输出 Vite build 完成信息，无 TypeScript 错误

- [ ] **Step 2: 如构建失败，逐项修正 import 或类型问题后重新运行构建**

Run: `pnpm build`
Expected: 成功

- [ ] **Step 3: 检查工作区只包含本次结构调整相关变更**

Run: `git status --short`
Expected: 仅包含 `main.tsx`、`src/routes/**`、`src/app/*` 删除以及计划/spec 文档相关变更

- [ ] **Step 4: 提交验证通过后的收尾提交**

```bash
git add main.tsx src/routes src/app
git commit -m "refactor(routes): finalize route structure unification"
```

## Self-Review

- Spec coverage：已覆盖目录迁移、下划线命名、拍平多级路由目录、删除 `src/app` layout、合并到 `main.tsx`、保持行为不变、构建验证。
- Placeholder scan：无 `TODO`、`TBD`、泛化措辞或未展开步骤。
- Type consistency：统一使用 `RootLayout`、`AdminLayout`、`route.tsx`、`system_broadcast`、`user_list`、`user_role` 命名。
