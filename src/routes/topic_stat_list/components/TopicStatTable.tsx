import { Table, Button, Space, message, Popconfirm } from "antd";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { deleteTopicStat } from "@/features/topic-stat/api";
import type { TopicStat } from "@/shared/types";

export default function TopicStatTable() {
  const { data } = useLoaderData() as {
    data: { totalSize: number; data: TopicStat[] };
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleDelete = async (statId: number) => {
    try {
      await deleteTopicStat(statId);
      message.success("删除成功");
      navigate(0);
    } catch {
      message.error("删除失败");
    }
  };

  const columns = [
    {
      title: "统计ID",
      dataIndex: "statId",
      key: "statId",
    },
    {
      title: "话题ID",
      dataIndex: "topicId",
      key: "topicId",
    },
    {
      title: "帖子数",
      dataIndex: "threadCount",
      key: "threadCount",
    },
    {
      title: "回复数",
      dataIndex: "postCount",
      key: "postCount",
    },
    {
      title: "浏览数",
      dataIndex: "viewCount",
      key: "viewCount",
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: TopicStat) => (
        <Space>
          <Button
            type="link"
            onClick={() =>
              navigate(`/topic-stat/edit/${record.topicStatId}`)
            }
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该统计记录？"
            onConfirm={() => handleDelete(record.topicStatId)}
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
        <Button
          type="primary"
          onClick={() => navigate("/topic-stat/create")}
        >
          新建统计
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="statId"
        pagination={{
          current: parseInt(searchParams.get("pageNum") || "1", 10),
          pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
          total: data?.totalSize,
        }}
      />
    </div>
  );
}
