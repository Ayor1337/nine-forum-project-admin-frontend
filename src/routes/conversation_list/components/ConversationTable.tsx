import { Table, Button, Space, message, Popconfirm } from "antd";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { deleteConversation } from "@/features/conversation/api";
import { formatDate } from "@/shared/utils/DateConvert";
import type { Conversation } from "@/shared/types";

export default function ConversationTable() {
  const { data } = useLoaderData() as {
    data: { totalSize: number; data: Conversation[] };
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleDelete = async (conversationId: number) => {
    try {
      await deleteConversation(conversationId);
      message.success("删除成功");
      navigate(0);
    } catch {
      message.error("删除失败");
    }
  };

  const columns = [
    {
      title: "会话ID",
      dataIndex: "conversationId",
      key: "conversationId",
    },
    {
      title: "用户A ID",
      dataIndex: "alphaAccountId",
      key: "alphaAccountId",
    },
    {
      title: "用户B ID",
      dataIndex: "betaAccountId",
      key: "betaAccountId",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      render: (date: Date) => formatDate(date),
    },
    {
      title: "状态",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted: boolean) => (isDeleted ? "已删除" : "正常"),
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Conversation) => (
        <Space>
          <Button
            type="link"
            onClick={() =>
              navigate(`/conversation/${record.conversationId}/messages`)
            }
          >
            查看消息
          </Button>
          <Popconfirm
            title="确定删除该会话？"
            onConfirm={() => handleDelete(record.conversationId)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="conversationId"
        pagination={{
          current: parseInt(searchParams.get("pageNum") || "1", 10),
          pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
          total: data?.totalSize,
        }}
      />
    </div>
  );
}
