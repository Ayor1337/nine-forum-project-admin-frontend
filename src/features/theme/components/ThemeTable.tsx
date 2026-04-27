import { Button, Image, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import { getTopicsByThemeId } from "@/features/theme/api";
import { getImageUrl } from "@/shared/api/image";
import type { PageEntity, Theme, Topic } from "@/shared/types";
import { formatDate } from "@/shared/utils/DateConvert";

export default function ThemeTable() {
  const { data: initialData } = useLoaderData() as {
    data: PageEntity<Theme>;
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const pageNum = parseInt(searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const isLoading = navigation.state === "loading";

  const tableColumns = [
    { title: "主题", dataIndex: "title", key: "title" },
    {
      title: "是否隐藏",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted: boolean) => <div>{isDeleted ? "是" : "否"}</div>,
    },
    {
      title: "操作",
      key: "action",
      render: (_value: number, _record: Theme) => (
        <div className="flex">
          <Button type="link">编辑</Button>
          <Button type="link" danger>
            删除
          </Button>
        </div>
      ),
    },
  ];

  const expandedRowRender = (record: Theme) => {
    return <ExpandedTable themeId={record.themeId} />;
  };

  const handlePageChange = (page: number, size: number) => {
    setSearchParams({
      pageNum: String(page),
      pageSize: String(size),
    });
  };

  return (
    <div>
      <Table
        rowKey="themeId"
        columns={tableColumns}
        expandable={{ expandedRowRender }}
        dataSource={initialData.data}
        loading={isLoading}
        pagination={{
          total: initialData.totalSize,
          current: pageNum,
          pageSize: pageSize,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}

function ExpandedTable({ themeId }: { themeId: number }) {
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [expandeTableData, setExpandeTableData] = useState<PageEntity<Topic>>();
  const tableExpandColumns = [
    { title: "话题", dataIndex: "title", key: "title" },
    { title: "描述", dataIndex: "description", key: "description" },
    {
      title: "封面",
      dataIndex: "coverUrl",
      key: "coverUrl",
      render: (coverUrl: string) => (
        <Image src={getImageUrl(coverUrl)} className="w-20!" alt="封面" />
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      render: (createTime: Date) => formatDate(createTime),
    },
    {
      title: "是否隐藏",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDelete: boolean) => <div>{isDelete ? "是" : "否"}</div>,
    },
    {
      title: "操作",
      key: "action",
      render: (_value: number, record: Topic) => (
        <div className="flex">
          <Button type="link" className="mr-2">
            编辑
          </Button>
          <Button type="link" danger>
            {record.isDeleted ? "恢复" : "删除"}
          </Button>
        </div>
      ),
    },
  ];

  const fetchAccountDataByRole = useCallback(async () => {
    const topics = await getTopicsByThemeId({
      page_num: pageNum,
      page_size: pageSize,
      theme_id: themeId,
    });
    setExpandeTableData(topics);
  }, [themeId, pageNum, pageSize]);

  useEffect(() => {
    fetchAccountDataByRole();
  }, [fetchAccountDataByRole]);

  return (
    expandeTableData && (
      <Table
        rowKey="topicId"
        columns={tableExpandColumns}
        dataSource={expandeTableData.data}
        pagination={{
          total: expandeTableData.totalSize,
          current: pageNum,
          pageSize: pageSize,
          onChange: (pageNum, pageSize) => {
            setPageNum(pageNum);
            setPageSize(pageSize);
          },
        }}
      />
    )
  );
}
