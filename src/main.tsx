import {
  DesktopOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Breadcrumb,
  Button,
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

const antTheme = {
  token: {
    colorPrimary: "#d97706",
    colorSuccess: "#059669",
    colorError: "#e11d48",
    colorInfo: "#4f46e5",
    colorWarning: "#d97706",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgLayout: "#f8f7f4",
    colorText: "#1c1917",
    colorTextSecondary: "#57534e",
    colorTextTertiary: "#a8a29e",
    colorBorder: "#e8e6e1",
    colorBorderSecondary: "#e8e6e1",
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
    borderRadius: 8,
    controlHeight: 36,
  },
  components: {
    Table: {
      headerBg: "#f3f2ef",
      headerColor: "#57534e",
      rowHoverBg: "rgba(217, 119, 6, 0.04)",
      borderColor: "#e8e6e1",
    },
    Menu: {
      darkItemBg: "#1c1917",
      darkSubMenuItemBg: "#292524",
      darkItemSelectedBg: "rgba(217, 119, 6, 0.15)",
      darkItemSelectedColor: "#f59e0b",
      darkItemColor: "#d6d3d1",
      darkItemHoverColor: "#fafaf9",
      darkItemHoverBg: "rgba(255, 255, 255, 0.06)",
    },
    Layout: {
      headerBg: "#ffffff",
      siderBg: "#1c1917",
      bodyBg: "#f8f7f4",
      footerBg: "#f8f7f4",
    },
    Modal: {
      contentBg: "#ffffff",
      headerBg: "#ffffff",
      titleColor: "#1c1917",
    },
    Card: {
      colorBgContainer: "#ffffff",
      colorBorderSecondary: "#e8e6e1",
    },
    Breadcrumb: {
      itemColor: "#a8a29e",
      separatorColor: "#d6d3d1",
      linkColor: "#57534e",
      linkHoverColor: "#d97706",
    },
    Input: {
      colorBgContainer: "#ffffff",
      colorBorder: "#e8e6e1",
      activeBorderColor: "#d97706",
      hoverBorderColor: "rgba(217, 119, 6, 0.5)",
      activeShadow: "0 0 0 2px rgba(217, 119, 6, 0.1)",
    },
    Select: {
      colorBgContainer: "#ffffff",
      colorBorder: "#e8e6e1",
      optionSelectedBg: "rgba(217, 119, 6, 0.1)",
      optionActiveBg: "rgba(217, 119, 6, 0.06)",
    },
    Button: {
      defaultBg: "#ffffff",
      defaultBorderColor: "#e8e6e1",
      defaultColor: "#1c1917",
      primaryShadow: "0 2px 8px rgba(217, 119, 6, 0.2)",
    },
    Collapse: {
      headerBg: "#ffffff",
      contentBg: "#f8f7f4",
      colorBorder: "#e8e6e1",
    },
  },
};

function RootLayout() {
  dayjs.locale("zh-cn");

  return (
    <ConfigProvider locale={zhCN} theme={antTheme}>
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
        trigger={null}
        style={{
          background: "#1c1917",
          borderRight: "1px solid #292524",
        }}
      >
        <div className="flex items-center justify-center h-16 select-none">
          {collapsed ? (
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "#f59e0b" }}
            >
              NF
            </span>
          ) : (
            <span
              className="text-base font-bold tracking-wider"
              style={{
                color: "#f59e0b",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Nine Forum
            </span>
          )}
        </div>
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
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: "#a8a29e" }}
          />
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#ffffff",
            borderBottom: "1px solid #e8e6e1",
          }}
        >
          <div className="flex items-center h-full px-10">
            <div
              className="font-semibold text-base tracking-wide"
              style={{ color: "#1c1917" }}
            >
              Nine Forum 后台管理
            </div>
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
              background: "#ffffff",
              borderRadius: "var(--radius-lg)",
              border: "1px solid #e8e6e1",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: "#f8f7f4",
            color: "#a8a29e",
            borderTop: "1px solid #e8e6e1",
            fontSize: "0.8rem",
            padding: "12px 0",
          }}
        >
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
