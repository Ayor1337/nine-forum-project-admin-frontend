import { Table, Button, Space, message, Popconfirm } from "antd";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { deleteTopicChat } from "@/features/topic-chat/api";
import { formatDate } from "@/shared/utils/DateConvert";
import type { TopicChat } from "@/shared/types";

export default function TopicChatTable() {
  const { data } = useLoaderData() as {
    data: { totalSize: number; data: TopicChat[] };
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleDelete = async (topicChatId: number) => {
    try {
      await deleteTopicChat(topicChatId);
      message.success("删除成功");
      navigate(0);
    } catch {
      message.error("删除失败");
    }
  };

  const columns = [
    {
      title: "聊天ID",
      dataIndex: "topicChatId",
      key: "topicChatId",
    },
    {
      title: "话题ID",
      dataIndex: "topicId",
      key: "topicId",
    },
    {
      title: "用户ID",
      dataIndex: "accountId",
      key: "accountId",
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
      title: "操作",
      key: "action",
      render: (_: unknown, record: TopicChat) => (
        <Space>
          <Popconfirm
            title="确定删除该聊天记录？"
            onConfirm={() => handleDelete(record.topicChatId)}
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
        rowKey="topicChatId"
        pagination={{
          current: parseInt(searchParams.get("pageNum") || "1", 10),
          pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
          total: data?.totalSize,
        }}
      />
    </div>
  );
}
