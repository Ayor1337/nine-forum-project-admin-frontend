import { Table, Button, Space, message, Popconfirm } from "antd";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { deleteLike } from "@/features/like/api";
import { formatDate } from "@/shared/utils/DateConvert";
import type { Like } from "@/shared/types";

export default function LikeTable() {
  const { data } = useLoaderData() as { data: { totalSize: number; data: Like[] } };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleDelete = async (likeId: number) => {
    try {
      await deleteLike(likeId);
      message.success("删除成功");
      navigate(0);
    } catch {
      message.error("删除失败");
    }
  };

  const columns = [
    {
      title: "点赞ID",
      dataIndex: "likeId",
      key: "likeId",
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
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      render: (date: Date) => formatDate(date),
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Like) => (
        <Space>
          <Popconfirm
            title="确定删除该点赞记录？"
            onConfirm={() => handleDelete(record.likeId)}
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
        rowKey="likeId"
        pagination={{
          current: parseInt(searchParams.get("pageNum") || "1", 10),
          pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
          total: data?.totalSize,
        }}
      />
    </div>
  );
}
