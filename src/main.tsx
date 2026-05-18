import {
  AlertOutlined,
  DesktopOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
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
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { removeToken } from "@/shared/api/token";
import UserListPage, {
  loader as userListLoader,
} from "@/routes/user_list/route";
import UserRolePage from "@/routes/user_role/route";
import PermissionListPage, {
  loader as permissionListLoader,
} from "@/routes/permission_list/route";
import SystemSettingPage from "@/routes/system_setting/route";
import "@/globals.css";
import { antTheme } from "./antd.theme";

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
  { label: "帖子管理", key: "/content", icon: <FileTextOutlined /> },
  { label: "举报审查", key: "/check", icon: <AlertOutlined /> },
  {
    label: "系统",
    key: "/system",
    icon: <DesktopOutlined />,
    children: [
      { label: "通知广播", key: "/system/broadcast" },
      { label: "权限管理", key: "/permission/list" },
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
          background: "#0f1011",
          borderRight: "1px solid #23252a",
        }}
      >
        <div className="flex h-16 items-center justify-center select-none px-4">
          {collapsed ? (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-base font-black tracking-[-0.08em]"
              style={{
                color: "#f7f8f8",
                background:
                  "linear-gradient(135deg, rgba(94,106,210,0.95), rgba(245,158,11,0.72))",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.08), 0 12px 32px rgba(94,106,210,0.28)",
              }}
            >
              N
            </div>
          ) : (
            <div className="flex w-full items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-black tracking-[-0.08em]"
                style={{
                  color: "#f7f8f8",
                  background:
                    "linear-gradient(135deg, rgba(94,106,210,0.96), rgba(245,158,11,0.7))",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.08), 0 14px 36px rgba(94,106,210,0.26)",
                }}
              >
                N
              </div>
              <div className="min-w-0">
                <div
                  className="truncate text-sm font-bold tracking-[-0.02em]"
                  style={{
                    color: "#f7f8f8",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Nine Forum
                </div>
                <div
                  className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#8a8f98" }}
                >
                  Console
                </div>
              </div>
            </div>
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
            style={{ color: "#8a8f98" }}
          />
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#010102",
            borderBottom: "1px solid #23252a",
          }}
        >
          <div className="flex items-center justify-between h-full px-10">
            <div
              className="font-semibold text-base tracking-wide"
              style={{ color: "#f7f8f8" }}
            >
              Nine Forum 后台管理
            </div>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={() => {
                removeToken();
                navigate("/");
              }}
              style={{ color: "#8a8f98" }}
            >
              退出登录
            </Button>
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
              background: "#0f1011",
              borderRadius: "var(--radius-lg)",
              border: "1px solid #23252a",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: "#010102",
            color: "#8a8f98",
            borderTop: "1px solid #23252a",
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
        element: <ProtectedRoute />,
        children: [
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
              { path: "content", element: <ThemePage />, loader: themeLoader },
              { path: "check", element: <CheckPage /> },
              {
                path: "system/broadcast",
                element: <BroadcastPage />,
                loader: broadcastLoader,
              },
              {
                path: "permission/list",
                element: <PermissionListPage />,
                loader: permissionListLoader,
              },
              {
                path: "system/systemSetting",
                element: <SystemSettingPage />,
              },
            ],
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
