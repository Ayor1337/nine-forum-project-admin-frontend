import { Table, Button, Space, message, Popconfirm } from "antd";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { deletePost } from "@/features/post/api";
import { formatDate } from "@/shared/utils/DateConvert";
import type { Post } from "@/shared/types";

export default function PostTable() {
  const { data } = useLoaderData() as { data: { totalSize: number; data: Post[] } };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleDelete = async (postId: number) => {
    try {
      await deletePost(postId);
      message.success("删除成功");
      navigate(0);
    } catch {
      message.error("删除失败");
    }
  };

  const columns = [
    {
      title: "回复ID",
      dataIndex: "postId",
      key: "postId",
    },
    {
      title: "帖子ID",
      dataIndex: "threadId",
      key: "threadId",
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
      title: "状态",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted: boolean) => (isDeleted ? "已删除" : "正常"),
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Post) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/post/edit/${record.postId}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该回复？"
            onConfirm={() => handleDelete(record.postId)}
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
        <Button type="primary" onClick={() => navigate("/post/create")}>
          新建回复
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="postId"
        pagination={{
          current: parseInt(searchParams.get("pageNum") || "1", 10),
          pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
          total: data?.totalSize,
        }}
      />
    </div>
  );
}
