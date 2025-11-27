"use client";

import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  CompassOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";

const { Title, Paragraph, Text } = Typography;

const highlights = [
  {
    icon: <DashboardOutlined />,
    title: "即时概览",
    desc: "一屏掌握关键数据与常用入口。",
  },
  {
    icon: <CompassOutlined />,
    title: "清晰导航",
    desc: "分区式导航与分组标签，快速找到页面。",
  },
  {
    icon: <CheckCircleOutlined />,
    title: "开箱即用",
    desc: "静态示例即可预览布局与交互风格。",
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <Card variant="borderless" className="bg-white shadow-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <Space direction="vertical" size={12} className="max-w-3xl">
              <Space size="middle">
                <Badge color="blue" text="后台管理系统" />
              </Space>
              <Title level={1} className="mb-2">
                Nine Forum
              </Title>
              <Paragraph className="mb-0 text-base text-gray-600">
                采用日间配色与轻量布局，开箱即可体验基础导航、亮点卡片与行动入口，无需依赖任何动态数据。
              </Paragraph>
              <Space size="middle" wrap>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  onClick={() => router.push("/dashboard")}
                >
                  进入控制台
                </Button>
                <Button size="large">查看组件示例</Button>
              </Space>
            </Space>
            <Card
              variant="outlined"
              className="w-full max-w-xs bg-gray-50 text-center"
            >
              <Title level={4} className="mb-2">
                快速指引
              </Title>
              <Paragraph className="mb-3 text-gray-600">
                常用入口一键抵达
              </Paragraph>
              <Space direction="vertical" size={8} className="w-full">
                <Button block>用户管理</Button>
                <Button block>数据报表</Button>
                <Button block>系统设置</Button>
              </Space>
            </Card>
          </div>
        </Card>

        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Card
              key={item.title}
              variant="borderless"
              className="bg-white shadow-sm"
            >
              <Space size="middle" align="start">
                <span className="text-xl text-blue-500">{item.icon}</span>
                <Space direction="vertical" size={4}>
                  <Text strong>{item.title}</Text>
                  <Paragraph className="mb-0 text-gray-600">
                    {item.desc}
                  </Paragraph>
                </Space>
              </Space>
            </Card>
          ))}
        </section>

        <Card variant="borderless" className="bg-white shadow-sm">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16}>
              <Title level={3} className="mb-3">
                今日看板（示意）
              </Title>
              <Paragraph className="mb-4 text-gray-600">
                使用简洁卡片呈现核心指标，保持充足留白，便于团队快速浏览。
              </Paragraph>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                  <Card size="small" variant="outlined">
                    <Text type="secondary">活跃用户</Text>
                    <Title level={3} className="mb-0">
                      12,480
                    </Title>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card size="small" variant="outlined">
                    <Text type="secondary">本周新增</Text>
                    <Title level={3} className="mb-0">
                      1,026
                    </Title>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card size="small" variant="outlined">
                    <Text type="secondary">待办工单</Text>
                    <Title level={3} className="mb-0">
                      32
                    </Title>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={8}>
              <Divider
                type="vertical"
                className="hidden md:inline-block h-full"
              />
              <Space
                direction="vertical"
                size="small"
                className="w-full md:pl-6"
              >
                <Title level={4} className="mb-2">
                  快捷信息
                </Title>
                <Paragraph className="mb-1 text-gray-600">
                  · 支持中英文界面切换
                </Paragraph>
                <Paragraph className="mb-1 text-gray-600">
                  · 采用 Ant Design v5 组件
                </Paragraph>
                <Paragraph className="mb-1 text-gray-600">
                  · Tailwind 辅助间距与布局
                </Paragraph>
                <Paragraph className="mb-0 text-gray-600">
                  · 全静态内容，便于预览
                </Paragraph>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card
          variant="borderless"
          className="bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow-md"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <Title level={3} className="mb-1 text-white">
                准备好开始了吗？
              </Title>
              <Paragraph className="mb-0 text-white">
                所有内容均为静态示例，保持清爽的白天模式，适合演示与快速验证。
              </Paragraph>
            </div>
            <Space size="middle" wrap>
              <Button type="default" size="large">
                浏览更多页
              </Button>
              <Button size="large" ghost>
                了解设计规范
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </main>
  );
}
