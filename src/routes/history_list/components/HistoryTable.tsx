import { Table, Button, Space, message, Popconfirm } from "antd";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { deleteHistory } from "@/features/history/api";
import { formatDate } from "@/shared/utils/DateConvert";
import type { History } from "@/shared/types";

export default function HistoryTable() {
  const { data } = useLoaderData() as {
    data: { totalSize: number; data: History[] };
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleDelete = async (historyId: number) => {
    try {
      await deleteHistory(historyId);
      message.success("删除成功");
      navigate(0);
    } catch {
      message.error("删除失败");
    }
  };

  const columns = [
    {
      title: "历史ID",
      dataIndex: "historyId",
      key: "historyId",
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
      render: (_: unknown, record: History) => (
        <Space>
          <Popconfirm
            title="确定删除该浏览历史？"
            onConfirm={() => handleDelete(record.historyId)}
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
        rowKey="historyId"
        pagination={{
          current: parseInt(searchParams.get("pageNum") || "1", 10),
          pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
          total: data?.totalSize,
        }}
      />
    </div>
  );
}
