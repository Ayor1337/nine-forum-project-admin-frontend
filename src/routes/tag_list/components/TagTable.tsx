import { Table, Button, Space, message, Popconfirm } from "antd";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { deleteTag } from "@/features/tag/api";
import type { Tag } from "@/shared/types";

export default function TagTable() {
  const { data } = useLoaderData() as {
    data: { totalSize: number; data: Tag[] };
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleDelete = async (tagId: number) => {
    try {
      await deleteTag(tagId);
      message.success("删除成功");
      navigate(0);
    } catch {
      message.error("删除失败");
    }
  };

  const columns = [
    {
      title: "标签ID",
      dataIndex: "tagId",
      key: "tagId",
    },
    {
      title: "标签名称",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "话题ID",
      dataIndex: "topicId",
      key: "topicId",
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Tag) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/tag/edit/${record.tagId}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该标签？"
            onConfirm={() => handleDelete(record.tagId)}
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
        <Button type="primary" onClick={() => navigate("/tag/create")}>
          新建标签
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="tagId"
        pagination={{
          current: parseInt(searchParams.get("pageNum") || "1", 10),
          pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
          total: data?.totalSize,
        }}
      />
    </div>
  );
}
