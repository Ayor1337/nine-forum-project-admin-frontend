import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Space,
  Table,
  type TableColumnsType,
} from "antd";
import useApp from "antd/es/app/useApp";
import { useCallback, useEffect, useState } from "react";
import { deleteTag, getTagList } from "@/features/tag/api";
import TagModal from "@/features/tag/components/TagModal";
import type { PageEntity, Tag } from "@/shared/types";
import { formatDate } from "@/shared/utils/DateConvert";

interface TagPanelProps {
  topicId: number;
}

export default function TagPanel({ topicId }: TagPanelProps) {
  const [data, setData] = useState<PageEntity<Tag>>();
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 10;
  const { message } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTagId, setEditingTagId] = useState<number | undefined>();

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTagList({
        topic_id: topicId,
        page_num: pageNum,
        page_size: pageSize,
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [topicId, pageNum]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleDelete = async (tagId: number) => {
    await deleteTag(tagId);
    message.success("删除成功");
    fetchTags();
  };

  const handleEdit = (tagId: number) => {
    setEditingTagId(tagId);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTagId(undefined);
    setModalOpen(true);
  };

  const handleModalOk = () => {
    setModalOpen(false);
    fetchTags();
  };

  const columns: TableColumnsType<Tag> = [
    { title: "标签名称", dataIndex: "tag", key: "tag" },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      render: (val: Date) => formatDate(val),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (_: unknown, record: Tag) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.tagId)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该标签？"
            onConfirm={() => handleDelete(record.tagId)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-(--color-border)">
        <span className="text-sm text-(--color-text-tertiary)">
          话题 #{topicId} 下的标签 · {data?.totalSize ?? 0} 个
        </span>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新建标签
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <Table<Tag>
          rowKey="tagId"
          columns={columns}
          dataSource={data?.data ?? []}
          loading={loading}
          pagination={{
            current: pageNum,
            pageSize,
            total: data?.totalSize ?? 0,
            onChange: (page) => setPageNum(page),
          }}
          locale={{ emptyText: "暂无标签数据" }}
        />
      </div>

      <TagModal
        tagId={editingTagId}
        topicId={topicId}
        isOpen={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
