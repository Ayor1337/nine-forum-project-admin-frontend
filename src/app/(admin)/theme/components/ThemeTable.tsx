"use client";

import service from "@/axios";
import { getImageUrl } from "@/axios/ImageService";
import { formatDate } from "@/func/DateConvert";
import { Table, Image } from "antd";
import { get } from "http";
import { useCallback, useEffect, useState } from "react";

export default function ThemeTable() {
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [data, setData] = useState<PageEntity<Theme>>();
  const tableColumns = [
    { title: "主题", dataIndex: "title", key: "title" },
    {
      title: "是否隐藏",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted: boolean) => <div>{isDeleted ? "是" : "否"}</div>,
    },
  ];

  const expandedRowRender = (record: Theme) => {
    return <ExpandedTable themeId={record.themeId} />;
  };

  const fetchRoleData = useCallback(async () => {
    await service
      .get("/api/theme/get_themes", {
        params: {
          page_num: pageNum,
          page_size: pageSize,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setData(res.data.data);
          console.log(res.data.data);
        }
      });
  }, [pageSize, pageNum]);

  useEffect(() => {
    fetchRoleData();
  }, [fetchRoleData]);

  return (
    data && (
      <div>
        <Table
          rowKey="themeId"
          columns={tableColumns}
          expandable={{
            expandedRowRender,
          }}
          dataSource={data.data}
          pagination={{
            total: data.totalSize,
            current: pageNum,
            pageSize: pageSize,
            onChange: (pageNum, pageSize) => {
              setPageNum(pageNum);
              setPageSize(pageSize);
            },
          }}
        />
      </div>
    )
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
      dataIndex: "isDelete",
      key: "isDelete",
      render: (isDelete: boolean) => <div>{isDelete ? "是" : "否"}</div>,
    },
  ];

  const fetchAccountDataByRole = useCallback(async () => {
    await service
      .get("/api/topic/get_topics_by_theme_id", {
        params: {
          page_num: pageNum,
          page_size: pageSize,
          theme_id: themeId,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setExpandeTableData(res.data.data);
        }
      });
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
