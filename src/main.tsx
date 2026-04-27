import { DesktopOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import {
  App,
  Breadcrumb,
  ConfigProvider,
  Layout,
  Menu,
  type MenuProps,
  theme,
} from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import CheckPage from "@/routes/check/route";
import DashboardPage from "@/routes/dashboard/route";
import HomePage from "@/routes/home/route";
import LoginPage, { action as loginAction } from "@/routes/login/route";
import BroadcastPage, {
  loader as broadcastLoader,
} from "@/routes/system_broadcast/route";
import ThemePage, { loader as themeLoader } from "@/routes/theme/route";
import ThreadPage, { loader as threadLoader } from "@/routes/thread/route";
import UserListPage, {
  loader as userListLoader,
} from "@/routes/user_list/route";
import UserRolePage from "@/routes/user_role/route";
import "@/globals.css";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

type NavItem = {
  label: string;
  key: string;
  icon?: React.ReactNode;
  children?: NavItem[];
};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const menuConfig: NavItem[] = [
  { label: "主页", key: "/dashboard", icon: <HomeOutlined /> },
  {
    label: "用户",
    key: "/user",
    icon: <UserOutlined />,
    children: [
      { label: "用户列表", key: "/user/list" },
      { label: "用户角色", key: "/user/role" },
    ],
  },
  { label: "主题", key: "/theme" },
  { label: "帖子", key: "/thread" },
  { label: "举报审查", key: "/check" },
  {
    label: "系统",
    key: "/system",
    icon: <DesktopOutlined />,
    children: [
      { label: "通知广播", key: "/system/broadcast" },
      { label: "系统设置", key: "/system/systemSetting" },
    ],
  },
];

const items: MenuItem[] = menuConfig.map((item) =>
  getItem(
    item.label,
    item.key,
    item.icon,
    item.children?.map((child) => getItem(child.label, child.key)),
  ),
);

function findTrail(list: NavItem[], target: string): string[] | null {
  for (const item of list) {
    if (item.key === target) {
      return [item.label];
    }
    if (item.children) {
      const childTrail = findTrail(item.children, target);
      if (childTrail) {
        return [item.label, ...childTrail];
      }
    }
  }
  return null;
}

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
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
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
        <Content
          style={{ margin: "0 16px" }}
          className="overflow-y-scroll scroller-hidden"
        >
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage />, action: loginAction },
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          {
            path: "user/list",
            element: <UserListPage />,
            loader: userListLoader,
          },
          { path: "user/role", element: <UserRolePage /> },
          { path: "theme", element: <ThemePage />, loader: themeLoader },
          { path: "thread", element: <ThreadPage />, loader: threadLoader },
          { path: "check", element: <CheckPage /> },
          {
            path: "system/broadcast",
            element: <BroadcastPage />,
            loader: broadcastLoader,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
