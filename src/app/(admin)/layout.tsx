"use client";

import { DesktopOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, MenuProps, theme } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import "./style.css";

interface defineProps {
  children: Readonly<React.ReactNode>;
}

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
  children?: MenuItem[]
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
    item.children?.map((child) => getItem(child.label, child.key))
  )
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

// useEffect(() => {
//   get("/api/user").then((res) => {
//     console.log(res);
//   });
// }, []);

export default function AdminLayout({ children }: defineProps) {
  const router = useRouter();
  const pathname = usePathname();
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
            router.push(e.key);
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
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Nine Console ©{new Date().getFullYear()} Created by Ayor
        </Footer>
      </Layout>
    </Layout>
  );
}
