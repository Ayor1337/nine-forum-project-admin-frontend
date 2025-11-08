"use client";

import service from "@/axios";
import { formatDate } from "@/func/DateConvert";
import { Table } from "antd";
import { title } from "process";
import { useCallback, useEffect, useState } from "react";

export default function ThreadTable() {
  const [data, setData] = useState<PageEntity<Thread>>();
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalAccountId, setModalAccountId] = useState<number | null>();
  const handleModalOpen = (accountId: number) => {
    setModalAccountId(accountId);
    setIsModalOpen(true);
  };

  const handleModalFinish = () => {
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const tableColumns = [
    { title: "标题", dataIndex: "title", key: "title" },
    { title: "作者", dataIndex: "accountName", key: "accountName" },
    { title: "话题", dataIndex: "topicName", key: "topicName" },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      render: (value: Date) => formatDate(value),
    },
    { title: "操作", key: "action" },
  ];

  const fetchData = useCallback(async () => {
    await service
      .get("/api/thread/get_threads", {
        params: {
          page_num: pageNum,
          page_size: pageSize,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setData(res.data.data);
        }
      });
  }, [pageNum, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    data && (
      <>
        <Table
          rowKey="threadId"
          columns={tableColumns}
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
      </>
    )
  );
}
