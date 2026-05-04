import { Button, Space, Table, type TableColumnsType, Tag } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getThreadList } from "@/features/thread/api";
import type { PageEntity, ThreadTableVO } from "@/shared/types";
import { formatDate } from "@/shared/utils/DateConvert";

interface ThreadPanelProps {
  topicId: number;
}

const columns: TableColumnsType<ThreadTableVO> = [
  { title: "标题", dataIndex: "title", key: "title", ellipsis: true },
  { title: "作者", dataIndex: "accountName", key: "accountName", width: 120 },
  {
    title: "标签",
    dataIndex: "tagName",
    key: "tagName",
    width: 100,
    render: (val: string) => (val ? <Tag>{val}</Tag> : "-"),
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 160,
    render: (val: Date) => formatDate(val),
  },
  {
    title: "状态",
    dataIndex: "isDeleted",
    key: "status",
    width: 80,
    render: (val: boolean) => (
      <Tag color={val ? "error" : "success"}>
        {val ? "已隐藏" : "正常"}
      </Tag>
    ),
  },
  {
    title: "操作",
    key: "action",
    width: 150,
    render: () => (
      <Space>
        <Button type="link" size="small">
          查看
        </Button>
        <Button type="link" size="small" danger>
          删除
        </Button>
      </Space>
    ),
  },
];

export default function ThreadPanel({ topicId }: ThreadPanelProps) {
  const [data, setData] = useState<PageEntity<ThreadTableVO>>();
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 10;

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getThreadList({
        page_num: pageNum,
        page_size: pageSize,
        topic_id: topicId,
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [topicId, pageNum]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-(--color-border)">
        <span className="text-sm text-(--color-text-tertiary)">
          话题 #{topicId} 下的帖子 · {data?.totalSize ?? 0} 篇
        </span>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <Table<ThreadTableVO>
          rowKey="threadId"
          columns={columns}
          dataSource={data?.data ?? []}
          loading={loading}
          pagination={{
            current: pageNum,
            pageSize,
            total: data?.totalSize ?? 0,
            onChange: (page) => setPageNum(page),
          }}
          locale={{ emptyText: "暂无帖子数据" }}
        />
      </div>
    </div>
  );
}
