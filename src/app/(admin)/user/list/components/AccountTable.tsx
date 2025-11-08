"use client";

import service from "@/axios";
import { getImageUrl } from "@/axios/ImageService";
import { Table, Image, Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import AccountModal from "./AccountModal";

export default function AccountTable() {
  const [data, setData] = useState<PageEntity<Account>>();
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
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "昵称", dataIndex: "nickname", key: "nickname" },
    {
      title: "头像",
      dataIndex: "avatarUrl",
      key: "avatar",
      render: (value: string) => (
        <Image
          src={getImageUrl(value)}
          className="size-15!"
          alt="用户头像"
          preview={{ mask: <div className="text-xs">预览</div> }}
        />
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (value: number) => (
        <div className={value === 1 ? "text-green-500" : "text-red-500"}>
          {value === 1 ? "正常" : "禁用"}
        </div>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (value: number, record: Account) => (
        <div className="flex">
          <Button
            type="link"
            className="mr-2"
            onClick={() => handleModalOpen(record.accountId)}
          >
            编辑
          </Button>
          <Button type="link" danger>
            删除
          </Button>
        </div>
      ),
    },
  ];

  const fetchData = useCallback(async () => {
    await service
      .get("/api/account/list", {
        params: {
          page_num: pageNum,
          page_size: pageSize,
          status: status,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          console.log(res.data.data);
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
          rowKey="accountId"
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

        {modalAccountId && (
          <AccountModal
            isOpen={isModalOpen}
            accountId={modalAccountId}
            onOk={handleModalFinish}
            onCancel={handleModalCancel}
          />
        )}
      </>
    )
  );
}
