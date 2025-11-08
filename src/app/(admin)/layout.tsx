"use client";

import { DesktopOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, MenuProps, theme } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import "./style.css";

interface defineProps {
  children: Readonly<React.ReactNode>;
}

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

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

const items: MenuItem[] = [
  getItem("主页", "/home", <HomeOutlined />),
  getItem("用户", "user", <UserOutlined />, [
    getItem("用户列表", "/user/list"),
    getItem("用户角色", "/user/role"),
  ]),
  getItem("主题", "/theme"),
  getItem("帖子", "/thread"),
  getItem("举报审查", "/check"),
  getItem("系统", "/system", <DesktopOutlined />, [
    getItem("通知广播", "/system/broadcast"),
    getItem("系统设置", "/system/systemSetting"),
  ]),
];

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
          defaultSelectedKeys={["home"]}
          mode="inline"
          items={items}
          selectedKeys={[pathname]}
          onClick={(e) => {
            router.push(e.key);
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content
          style={{ margin: "0 16px" }}
          className="overflow-y-scroll scroller-hidden"
        >
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[{ title: "User" }, { title: "Bill" }]}
          />
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
