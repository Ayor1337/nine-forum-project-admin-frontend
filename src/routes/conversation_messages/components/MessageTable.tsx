import { Table, Button, Space, message, Popconfirm } from "antd";
import {
  useLoaderData,
  useNavigate,
  useSearchParams,
  useParams,
} from "react-router-dom";
import { deleteConversationMessage } from "@/features/conversation/api";
import { formatDate } from "@/shared/utils/DateConvert";
import type { ConversationMessage } from "@/shared/types";

export default function MessageTable() {
  const { data } = useLoaderData() as {
    data: { totalSize: number; data: ConversationMessage[] };
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleDelete = async (messageId: number) => {
    try {
      await deleteConversationMessage(messageId);
      message.success("删除成功");
      navigate(0);
    } catch {
      message.error("删除失败");
    }
  };

  const columns = [
    {
      title: "消息ID",
      dataIndex: "messageId",
      key: "messageId",
    },
    {
      title: "发送者ID",
      dataIndex: "senderId",
      key: "senderId",
    },
    {
      title: "内容",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      render: (date: Date) => formatDate(date),
    },
    {
      title: "已读",
      dataIndex: "isRead",
      key: "isRead",
      render: (isRead: boolean) => (isRead ? "是" : "否"),
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: ConversationMessage) => (
        <Space>
          <Popconfirm
            title="确定删除该消息？"
            onConfirm={() => handleDelete(record.conversationMessageId)}
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
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate("/conversation/list")}>返回会话列表</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="messageId"
        pagination={{
          current: parseInt(searchParams.get("pageNum") || "1", 10),
          pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
          total: data?.totalSize,
        }}
      />
    </div>
  );
}
