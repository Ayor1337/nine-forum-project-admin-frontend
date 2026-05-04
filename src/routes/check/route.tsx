import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Input,
} from "antd";
import useApp from "antd/es/app/useApp";
import { useCallback, useEffect, useState } from "react";
import { getReportList, handleReport } from "@/features/report/api";
import type { PageEntity, ReportVO } from "@/shared/types";

const { Title } = Typography;
const { TextArea } = Input;

const statusConfig: Record<string, { color: string; label: string }> = {
  PENDING: { color: "orange", label: "待处理" },
  PROCESSING: { color: "blue", label: "处理中" },
  RESOLVED: { color: "green", label: "已处理" },
  REJECTED: { color: "default", label: "已驳回" },
};

const targetTypeConfig: Record<string, { color: string; label: string }> = {
  USER: { color: "cyan", label: "用户" },
  THREAD: { color: "blue", label: "帖子" },
  POST: { color: "purple", label: "评论" },
};

export default function CheckPage() {
  const { message } = useApp();

  const [data, setData] = useState<PageEntity<ReportVO>>({
    totalSize: 0,
    data: [],
  });
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterTargetType, setFilterTargetType] = useState<
    string | undefined
  >();

  // 处理弹窗状态
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReportId, setModalReportId] = useState<number | null>(null);
  const [modalAction, setModalAction] = useState<"RESOLVED" | "REJECTED">(
    "RESOLVED",
  );
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReportList({
        pageNum,
        pageSize,
        status: filterStatus,
        targetType: filterTargetType,
      });
      setData(res);
    } catch {
      message.error("加载举报列表失败");
    } finally {
      setLoading(false);
    }
  }, [pageNum, pageSize, filterStatus, filterTargetType, message]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 接单：PENDING -> PROCESSING
  const handleClaim = async (reportId: number) => {
    try {
      await handleReport(reportId, { status: "PROCESSING" });
      message.success("接单成功");
      fetchData();
    } catch {
      message.error("接单失败");
    }
  };

  // 打开处理弹窗
  const openHandleModal = (reportId: number, action: "RESOLVED" | "REJECTED") => {
    setModalReportId(reportId);
    setModalAction(action);
    form.resetFields();
    if (action === "REJECTED") {
      form.setFieldsValue({ accountAction: "NONE" });
    }
    setModalOpen(true);
  };

  // 提交处理结果
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleReport(modalReportId!, {
        status: modalAction,
        handleNote: values.handleNote,
        accountAction: values.accountAction || "NONE",
      });
      message.success(modalAction === "RESOLVED" ? "已通过" : "已驳回");
      setModalOpen(false);
      fetchData();
    } catch {
      // validation failed or API error
    }
  };

  const pendingCount = data.data.filter(
    (r) => r.status === "PENDING",
  ).length;

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
      title: "举报人ID",
      dataIndex: "reporterAccountId",
      key: "reporterAccountId",
      width: 100,
    },
    {
      title: "被举报人",
      dataIndex: "reportedUsernameSnapshot",
      key: "reportedUsernameSnapshot",
      width: 120,
      render: (v: string | null) => v || "—",
    },
    {
      title: "目标类型",
      dataIndex: "targetType",
      key: "targetType",
      width: 90,
      render: (v: string) => {
        const cfg = targetTypeConfig[v] || { color: "default", label: v };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: "举报原因",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (v: string) => {
        const cfg = statusConfig[v] || { color: "default", label: v };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: "处理人ID",
      dataIndex: "handlerAccountId",
      key: "handlerAccountId",
      width: 100,
      render: (v: number | null) => v ?? "—",
    },
    {
      title: "处理备注",
      dataIndex: "handleNote",
      key: "handleNote",
      width: 140,
      ellipsis: true,
      render: (v: string | null) => v || "—",
    },
    {
      title: "时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 160,
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
      width: 180,
      render: (_: unknown, record: ReportVO) => {
        if (record.status === "PENDING") {
          return (
            <Button
              type="primary"
              size="small"
              onClick={() => handleClaim(record.reportId)}
            >
              接单
            </Button>
          );
        }
        if (record.status === "PROCESSING") {
          return (
            <Space size="small">
              <Button
                type="primary"
                size="small"
                onClick={() => openHandleModal(record.reportId, "RESOLVED")}
              >
                通过
              </Button>
              <Button
                size="small"
                onClick={() => openHandleModal(record.reportId, "REJECTED")}
              >
                驳回
              </Button>
            </Space>
          );
        }
        return (
          <span style={{ color: "var(--color-text-tertiary)" }}>—</span>
        );
      },
    },
  ];

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

      <div className="flex gap-4 mb-4">
        <Select
          placeholder="按状态筛选"
          allowClear
          style={{ width: 160 }}
          value={filterStatus}
          onChange={(v) => {
            setFilterStatus(v);
            setPageNum(1);
          }}
        >
          <Select.Option value="PENDING">待处理</Select.Option>
          <Select.Option value="PROCESSING">处理中</Select.Option>
          <Select.Option value="RESOLVED">已处理</Select.Option>
          <Select.Option value="REJECTED">已驳回</Select.Option>
        </Select>
        <Select
          placeholder="按目标类型筛选"
          allowClear
          style={{ width: 160 }}
          value={filterTargetType}
          onChange={(v) => {
            setFilterTargetType(v);
            setPageNum(1);
          }}
        >
          <Select.Option value="USER">用户</Select.Option>
          <Select.Option value="THREAD">帖子</Select.Option>
          <Select.Option value="POST">评论</Select.Option>
        </Select>
      </div>

      <Card
        variant="borderless"
        style={{
          background: "#ffffff",
          border: "1px solid #e8e6e1",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <Table
          rowKey="reportId"
          columns={columns}
          dataSource={data.data}
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: data.totalSize,
            current: pageNum,
            pageSize: pageSize,
            onChange: (page, size) => {
              setPageNum(page);
              setPageSize(size);
            },
          }}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={modalAction === "RESOLVED" ? "通过举报" : "驳回举报"}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          {modalAction === "RESOLVED" && (
            <Form.Item
              name="accountAction"
              label="账号处置"
              initialValue="NONE"
            >
              <Select>
                <Select.Option value="NONE">不处理</Select.Option>
                <Select.Option value="MUTE">禁言</Select.Option>
                <Select.Option value="BAN">封禁</Select.Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item
            name="handleNote"
            label="处理备注"
            rules={[{ required: true, message: "请填写处理备注" }]}
          >
            <TextArea rows={3} placeholder="请填写处理备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
