import {
  AlertOutlined,
  FileTextOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Space, Statistic, Table, Tag, Typography } from "antd";

const { Title, Text } = Typography;

const recentActivity = [
  {
    key: "1",
    time: "2 分钟前",
    user: "张三",
    action: "发布了新帖子",
    target: "《如何优化论坛性能》",
    type: "thread",
  },
  {
    key: "2",
    time: "15 分钟前",
    user: "李四",
    action: "提交了举报",
    target: "用户 spam_bot_01",
    type: "report",
  },
  {
    key: "3",
    time: "1 小时前",
    user: "王五",
    action: "创建了新主题",
    target: "技术交流区",
    type: "theme",
  },
  {
    key: "4",
    time: "3 小时前",
    user: "赵六",
    action: "被授予版主角色",
    target: "前端开发话题",
    type: "role",
  },
  {
    key: "5",
    time: "5 小时前",
    user: "系统",
    action: "发送了广播通知",
    target: "服务器维护公告",
    type: "broadcast",
  },
];

const activityColumns = [
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
    width: 100,
    render: (v: string) => (
      <span className="font-mono text-xs" style={{ color: "var(--color-text-tertiary)" }}>
        {v}
      </span>
    ),
  },
  {
    title: "用户",
    dataIndex: "user",
    key: "user",
    width: 80,
    render: (v: string) => (
      <span style={{ color: "var(--color-accent)" }}>{v}</span>
    ),
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    width: 140,
  },
  {
    title: "对象",
    dataIndex: "target",
    key: "target",
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    width: 90,
    render: (v: string) => {
      const colorMap: Record<string, string> = {
        thread: "blue",
        report: "red",
        theme: "green",
        role: "gold",
        broadcast: "purple",
      };
      const labelMap: Record<string, string> = {
        thread: "帖子",
        report: "举报",
        theme: "主题",
        role: "角色",
        broadcast: "广播",
      };
      return <Tag color={colorMap[v]}>{labelMap[v]}</Tag>;
    },
  },
];

const statCardStyle: React.CSSProperties = {
  background: "#0f1011",
  border: "1px solid #23252a",
};

export default function DashboardPage() {
  return (
    <div className="page-enter">
      <Title level={4} className="mb-6!">
        仪表盘
      </Title>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={statCardStyle}>
            <Statistic
              title={
                <Text style={{ color: "var(--color-text-tertiary)" }}>
                  总用户数
                </Text>
              }
              value={12480}
              prefix={<UserOutlined style={{ color: "var(--color-accent)" }} />}
              valueStyle={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-mono)",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={statCardStyle}>
            <Statistic
              title={
                <Text style={{ color: "var(--color-text-tertiary)" }}>
                  今日活跃
                </Text>
              }
              value={3842}
              prefix={
                <ThunderboltOutlined style={{ color: "var(--color-success)" }} />
              }
              valueStyle={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-mono)",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={statCardStyle}>
            <Statistic
              title={
                <Text style={{ color: "var(--color-text-tertiary)" }}>
                  帖子总数
                </Text>
              }
              value={58921}
              prefix={
                <FileTextOutlined style={{ color: "var(--color-info)" }} />
              }
              valueStyle={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-mono)",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={statCardStyle}>
            <Statistic
              title={
                <Text style={{ color: "var(--color-text-tertiary)" }}>
                  待处理举报
                </Text>
              }
              value={17}
              prefix={
                <AlertOutlined style={{ color: "var(--color-danger)" }} />
              }
              valueStyle={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-mono)",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card
        variant="borderless"
        style={statCardStyle}
      >
        <Space className="mb-4" align="center">
          <TeamOutlined style={{ color: "var(--color-accent)" }} />
          <Text strong>最近动态</Text>
        </Space>
        <Table
          columns={activityColumns}
          dataSource={recentActivity}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}
