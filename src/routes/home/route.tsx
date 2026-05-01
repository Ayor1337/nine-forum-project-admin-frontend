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
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";

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

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e8e6e1",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main
      className="min-h-screen"
      style={{
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        {/* Hero Card */}
        <Card variant="borderless" style={cardStyle} className="page-enter">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <Space direction="vertical" size={12} className="max-w-3xl">
              <Space size="middle">
                <Badge color="#d97706" text="后台管理系统" />
              </Space>
              <Title level={1} className="mb-2!">
                Nine Forum
              </Title>
              <Paragraph
                className="mb-0! text-base"
                style={{ color: "var(--color-text-secondary)" }}
              >
                采用暖纸配色与精致布局，开箱即可体验基础导航、亮点卡片与行动入口。
              </Paragraph>
              <Space size="middle" wrap>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate("/dashboard")}
                >
                  进入控制台
                </Button>
                <Button size="large">查看组件示例</Button>
              </Space>
            </Space>
            <Card
              variant="outlined"
              className="w-full max-w-xs text-center"
              style={{
                background: "var(--color-bg-tertiary)",
                borderColor: "var(--color-border)",
              }}
            >
              <Title level={4} className="mb-2!">
                快速指引
              </Title>
              <Paragraph
                className="mb-3!"
                style={{ color: "var(--color-text-secondary)" }}
              >
                常用入口一键抵达
              </Paragraph>
              <Space direction="vertical" size={8} className="w-full">
                <Button block onClick={() => navigate("/user/list")}>
                  用户管理
                </Button>
                <Button block onClick={() => navigate("/dashboard")}>
                  数据报表
                </Button>
                <Button block onClick={() => navigate("/system/broadcast")}>
                  系统设置
                </Button>
              </Space>
            </Card>
          </div>
        </Card>

        {/* Highlight Cards */}
        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map((item, i) => (
            <Card
              key={item.title}
              variant="borderless"
              style={cardStyle}
              className={`page-enter stagger-${i + 1}`}
            >
              <Space size="middle" align="start">
                <span className="text-xl" style={{ color: "var(--color-accent)" }}>
                  {item.icon}
                </span>
                <Space direction="vertical" size={4}>
                  <Text strong>{item.title}</Text>
                  <Paragraph
                    className="mb-0!"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {item.desc}
                  </Paragraph>
                </Space>
              </Space>
            </Card>
          ))}
        </section>

        {/* Dashboard Preview Card */}
        <Card variant="borderless" style={cardStyle}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16}>
              <Title level={3} className="mb-3!">
                今日看板（示意）
              </Title>
              <Paragraph
                className="mb-4!"
                style={{ color: "var(--color-text-secondary)" }}
              >
                使用简洁卡片呈现核心指标，保持充足留白，便于团队快速浏览。
              </Paragraph>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    size="small"
                    variant="outlined"
                    style={{
                      background: "var(--color-bg-tertiary)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <Text type="secondary">活跃用户</Text>
                    <Title
                      level={3}
                      className="mb-0! font-mono"
                    >
                      12,480
                    </Title>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    size="small"
                    variant="outlined"
                    style={{
                      background: "var(--color-bg-tertiary)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <Text type="secondary">本周新增</Text>
                    <Title
                      level={3}
                      className="mb-0! font-mono"
                    >
                      1,026
                    </Title>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    size="small"
                    variant="outlined"
                    style={{
                      background: "var(--color-bg-tertiary)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <Text type="secondary">待办工单</Text>
                    <Title
                      level={3}
                      className="mb-0! font-mono"
                    >
                      32
                    </Title>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={8}>
              <Divider
                type="vertical"
                className="hidden md:inline-block h-full!"
                style={{ borderColor: "var(--color-border)" }}
              />
              <Space
                direction="vertical"
                size="small"
                className="w-full md:pl-6"
              >
                <Title level={4} className="mb-2!">
                  快捷信息
                </Title>
                <Paragraph
                  className="mb-1!"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  · 支持中英文界面切换
                </Paragraph>
                <Paragraph
                  className="mb-1!"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  · 采用 Ant Design v5 组件
                </Paragraph>
                <Paragraph
                  className="mb-1!"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  · Tailwind 辅助间距与布局
                </Paragraph>
                <Paragraph
                  className="mb-0!"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  · 暖纸主题，琥珀色强调
                </Paragraph>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* CTA Banner */}
        <Card
          variant="borderless"
          style={{
            background: "linear-gradient(135deg, rgba(217,119,6,0.08) 0%, rgba(79,70,229,0.04) 100%)",
            border: "1px solid rgba(217,119,6,0.2)",
          }}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <Title
                level={3}
                className="mb-1!"
                style={{ color: "var(--color-accent)" }}
              >
                准备好开始了吗？
              </Title>
              <Paragraph
                className="mb-0!"
                style={{ color: "var(--color-text-secondary)" }}
              >
                暖纸主题搭配琥珀色强调，打造清爽专业的管理后台体验。
              </Paragraph>
            </div>
            <Space size="middle" wrap>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/dashboard")}
              >
                进入控制台
              </Button>
              <Button size="large">
                了解设计规范
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </main>
  );
}
