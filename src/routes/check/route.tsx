import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Card, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";

const { Title } = Typography;

interface Report {
  key: string;
  reportId: number;
  reporter: string;
  targetType: string;
  targetContent: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  createTime: string;
}

const mockReports: Report[] = [
  {
    key: "1",
    reportId: 1001,
    reporter: "用户A",
    targetType: "帖子",
    targetContent: "《快速致富秘籍》",
    reason: "涉嫌诈骗广告",
    status: "pending",
    createTime: "2026-04-30 10:23",
  },
  {
    key: "2",
    reportId: 1002,
    reporter: "用户B",
    targetType: "用户",
    targetContent: "spam_bot_01",
    reason: "批量发送垃圾信息",
    status: "pending",
    createTime: "2026-04-30 09:15",
  },
  {
    key: "3",
    reportId: 1003,
    reporter: "用户C",
    targetType: "帖子",
    targetContent: "《免费VPN下载》",
    reason: "传播恶意软件链接",
    status: "pending",
    createTime: "2026-04-29 22:40",
  },
  {
    key: "4",
    reportId: 1004,
    reporter: "用户D",
    targetType: "评论",
    targetContent: "人身攻击性言论",
    reason: "辱骂他人",
    status: "resolved",
    createTime: "2026-04-29 18:05",
  },
  {
    key: "5",
    reportId: 1005,
    reporter: "用户E",
    targetType: "头像",
    targetContent: "违规头像图片",
    reason: "包含不当内容",
    status: "dismissed",
    createTime: "2026-04-29 14:30",
  },
  {
    key: "6",
    reportId: 1006,
    reporter: "用户F",
    targetType: "帖子",
    targetContent: "《代写论文请联系》",
    reason: "广告引流",
    status: "pending",
    createTime: "2026-04-29 11:12",
  },
  {
    key: "7",
    reportId: 1007,
    reporter: "用户G",
    targetType: "用户",
    targetContent: "fake_admin",
    reason: "冒充管理员身份",
    status: "pending",
    createTime: "2026-04-28 20:45",
  },
];

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: "orange", label: "待处理" },
  resolved: { color: "green", label: "已处理" },
  dismissed: { color: "default", label: "已驳回" },
};

const targetTypeColor: Record<string, string> = {
  帖子: "blue",
  用户: "cyan",
  评论: "purple",
  头像: "magenta",
};

export default function CheckPage() {
  const [reports, setReports] = useState(mockReports);

  const handleResolve = (key: string) => {
    setReports((prev) =>
      prev.map((r) => (r.key === key ? { ...r, status: "resolved" } : r)),
    );
  };

  const handleDismiss = (key: string) => {
    setReports((prev) =>
      prev.map((r) => (r.key === key ? { ...r, status: "dismissed" } : r)),
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "reportId",
      key: "reportId",
      width: 80,
      render: (v: number) => (
        <span
          className="font-mono text-xs"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          #{v}
        </span>
      ),
    },
    {
      title: "举报人",
      dataIndex: "reporter",
      key: "reporter",
      width: 100,
    },
    {
      title: "类型",
      dataIndex: "targetType",
      key: "targetType",
      width: 80,
      render: (v: string) => (
        <Tag color={targetTypeColor[v] || "default"}>{v}</Tag>
      ),
    },
    {
      title: "被举报内容",
      dataIndex: "targetContent",
      key: "targetContent",
      ellipsis: true,
    },
    {
      title: "举报原因",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (v: string) => {
        const cfg = statusConfig[v];
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: "时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 140,
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
      title: "操作",
      key: "action",
      width: 160,
      render: (_: unknown, record: Report) =>
        record.status === "pending" ? (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              onClick={() => handleResolve(record.key)}
            >
              处理
            </Button>
            <Button size="small" onClick={() => handleDismiss(record.key)}>
              驳回
            </Button>
          </Space>
        ) : (
          <span style={{ color: "var(--color-text-tertiary)" }}>—</span>
        ),
    },
  ];

  const pendingCount = reports.filter((r) => r.status === "pending").length;

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <Space align="center">
          <ExclamationCircleOutlined style={{ color: "var(--color-danger)" }} />
          <Title level={4} className="mb-0!">
            举报审查
          </Title>
        </Space>
        <Tag color="orange" className="text-sm! px-3! py-1!">
          待处理：{pendingCount}
        </Tag>
      </div>

      <Card
        variant="borderless"
        style={{
          background: "#ffffff",
          border: "1px solid #e8e6e1",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <Table columns={columns} dataSource={reports} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
