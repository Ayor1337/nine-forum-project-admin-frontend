import {
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  MessageOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Table, Tag, Typography } from "antd";

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

const kpiMetrics = [
  {
    label: "总用户数",
    value: "12,480",
    delta: "较昨日 +3.2%",
    icon: <UserOutlined />,
    color: "var(--color-accent)",
  },
  {
    label: "今日活跃",
    value: "3,842",
    delta: "峰值 14:00",
    icon: <ThunderboltOutlined />,
    color: "var(--color-success)",
  },
  {
    label: "帖子总数",
    value: "58,921",
    delta: "今日新增 186",
    icon: <FileTextOutlined />,
    color: "var(--color-info)",
  },
  {
    label: "待处理举报",
    value: "17",
    delta: "高优先级 4",
    icon: <AlertOutlined />,
    color: "var(--color-danger)",
  },
] as const;

const trendMetrics = [
  {
    label: "发帖",
    value: "186",
    summary: "技术交流区贡献 42%",
    bar: "78%",
  },
  {
    label: "回复",
    value: "1,024",
    summary: "较昨日同段 +12%",
    bar: "88%",
  },
  {
    label: "举报",
    value: "23",
    summary: "广告类仍为主要来源",
    bar: "34%",
  },
] as const;

const healthItems = [
  {
    icon: <CheckCircleOutlined />,
    label: "系统状态",
    value: "稳定",
    detail: "接口与资源同步正常",
    tone: "good",
  },
  {
    icon: <ClockCircleOutlined />,
    label: "处理时效",
    value: "18 分钟",
    detail: "举报平均首次响应",
    tone: "info",
  },
  {
    icon: <MessageOutlined />,
    label: "运营提醒",
    value: "4 项",
    detail: "需关注高频重复举报",
    tone: "warn",
  },
] as const;

const activityColumns = [
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
    width: 100,
    render: (v: string) => (
      <span
        className="font-mono text-xs"
        style={{ color: "var(--color-text-tertiary)" }}
      >
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

export default function DashboardPage() {
  return (
    <div className="page-enter dashboard-page">
      <style>
        {`
          .dashboard-page {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .dashboard-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 16px;
          }

          .dashboard-eyebrow {
            color: var(--color-text-tertiary);
            font-size: 12px;
            line-height: 1.7;
          }

          .dashboard-kpis {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
          }

          .dashboard-panel {
            border: 1px solid var(--color-border);
            background: color-mix(in srgb, var(--color-bg-secondary) 92%, white 8%);
            border-radius: var(--radius-md);
            transition:
              border-color 180ms ease,
              background 180ms ease,
              transform 180ms ease;
          }

          .dashboard-panel:hover {
            border-color: var(--color-border-hover);
            background: var(--color-bg-tertiary);
          }

          .dashboard-kpi {
            min-width: 0;
            padding: 16px;
          }

          .dashboard-kpi-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 18px;
          }

          .dashboard-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: var(--radius-sm);
            background: rgba(255, 255, 255, 0.045);
            flex: 0 0 auto;
          }

          .dashboard-label {
            color: var(--color-text-tertiary);
            font-size: 12px;
            line-height: 1.5;
          }

          .dashboard-value {
            color: var(--color-text-primary);
            font-family: var(--font-mono);
            font-size: clamp(24px, 3vw, 32px);
            font-weight: 700;
            line-height: 1.05;
            letter-spacing: 0;
          }

          .dashboard-delta {
            margin-top: 8px;
            color: var(--color-text-secondary);
            font-size: 12px;
          }

          .dashboard-workspace {
            display: grid;
            grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.9fr);
            gap: 12px;
          }

          .dashboard-section {
            padding: 18px;
          }

          .dashboard-section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 16px;
          }

          .dashboard-section-title {
            color: var(--color-text-primary);
            font-size: 14px;
            font-weight: 700;
          }

          .dashboard-section-note {
            color: var(--color-text-tertiary);
            font-size: 12px;
            white-space: nowrap;
          }

          .dashboard-trends {
            display: grid;
            gap: 14px;
          }

          .dashboard-trend-row {
            display: grid;
            grid-template-columns: 72px 88px minmax(120px, 1fr);
            align-items: center;
            gap: 14px;
          }

          .dashboard-trend-value {
            color: var(--color-text-primary);
            font-family: var(--font-mono);
            font-size: 20px;
            font-weight: 700;
          }

          .dashboard-trend-track {
            position: relative;
            height: 8px;
            overflow: hidden;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.06);
          }

          .dashboard-trend-fill {
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, var(--color-accent), var(--color-accent-hover));
          }

          .dashboard-trend-summary {
            margin-top: 6px;
            color: var(--color-text-tertiary);
            font-size: 12px;
          }

          .dashboard-health-list {
            display: grid;
            gap: 10px;
          }

          .dashboard-health-item {
            display: grid;
            grid-template-columns: 32px minmax(0, 1fr) auto;
            align-items: center;
            gap: 12px;
            padding: 10px;
            border-radius: var(--radius-md);
            background: rgba(255, 255, 255, 0.025);
          }

          .dashboard-health-item[data-tone="good"] .dashboard-icon {
            color: var(--color-success);
          }

          .dashboard-health-item[data-tone="info"] .dashboard-icon {
            color: var(--color-accent);
          }

          .dashboard-health-item[data-tone="warn"] .dashboard-icon {
            color: #d97706;
          }

          .dashboard-health-value {
            color: var(--color-text-primary);
            font-family: var(--font-mono);
            font-size: 14px;
            font-weight: 700;
            white-space: nowrap;
          }

          .dashboard-activity {
            padding-top: 2px;
          }

          .dashboard-activity-head {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
          }

          .dashboard-activity .ant-table-wrapper {
            border-radius: var(--radius-md) !important;
          }

          @media (max-width: 1100px) {
            .dashboard-kpis {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .dashboard-workspace {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 640px) {
            .dashboard-header {
              align-items: flex-start;
              flex-direction: column;
            }

            .dashboard-kpis {
              grid-template-columns: 1fr;
            }

            .dashboard-trend-row {
              grid-template-columns: 64px 72px minmax(0, 1fr);
              gap: 10px;
            }

            .dashboard-section-note {
              white-space: normal;
            }
          }
        `}
      </style>

      <header className="dashboard-header">
        <div>
          <Title level={4} className="mb-1!">
            运营总览
          </Title>
          <div className="dashboard-eyebrow">
            社区关键指标、健康状态与最近动态
          </div>
        </div>
      </header>

      <section className="dashboard-kpis" aria-label="关键指标">
        {kpiMetrics.map((metric) => (
          <div className="dashboard-panel dashboard-kpi" key={metric.label}>
            <div className="dashboard-kpi-head">
              <span className="dashboard-label">{metric.label}</span>
              <span className="dashboard-icon" style={{ color: metric.color }}>
                {metric.icon}
              </span>
            </div>
            <div className="dashboard-value">{metric.value}</div>
            <div className="dashboard-delta">{metric.delta}</div>
          </div>
        ))}
      </section>

      <section className="dashboard-workspace" aria-label="运营工作区">
        <div className="dashboard-panel dashboard-section">
          <div className="dashboard-section-header">
            <div className="dashboard-section-title">今日社区流量</div>
            <div className="dashboard-section-note">静态样例 · 当前自然日</div>
          </div>
          <div className="dashboard-trends">
            {trendMetrics.map((metric) => (
              <div className="dashboard-trend-row" key={metric.label}>
                <div className="dashboard-label">{metric.label}</div>
                <div className="dashboard-trend-value">{metric.value}</div>
                <div>
                  <div className="dashboard-trend-track">
                    <div
                      className="dashboard-trend-fill"
                      style={{ width: metric.bar }}
                    />
                  </div>
                  <div className="dashboard-trend-summary">
                    {metric.summary}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel dashboard-section">
          <div className="dashboard-section-header">
            <div className="dashboard-section-title">社区状态</div>
            <div className="dashboard-section-note">健康摘要</div>
          </div>
          <div className="dashboard-health-list">
            {healthItems.map((item) => (
              <div
                className="dashboard-health-item"
                data-tone={item.tone}
                key={item.label}
              >
                <span className="dashboard-icon">{item.icon}</span>
                <div>
                  <div className="dashboard-label">{item.label}</div>
                  <div className="dashboard-trend-summary">{item.detail}</div>
                </div>
                <div className="dashboard-health-value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-activity" aria-label="最近动态">
        <div className="dashboard-activity-head">
          <TeamOutlined style={{ color: "var(--color-accent)" }} />
          <Text strong>最近动态</Text>
        </div>
        <Table
          columns={activityColumns}
          dataSource={recentActivity}
          pagination={false}
          scroll={{ x: 640 }}
          size="small"
        />
      </section>
    </div>
  );
}
