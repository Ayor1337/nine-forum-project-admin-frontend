import { Button, Image, Input, Table } from "antd";
import { useState } from "react";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import { getImageUrl } from "@/shared/api/image";
import type { Account, PageEntity } from "@/shared/types";
import AccountModal from "./AccountModal";

export default function AccountTable() {
  const { data } = useLoaderData() as { data: PageEntity<Account> };
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const query = searchParams.get("query") || "";
  const pageNum = parseInt(searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const isLoading = navigation.state === "loading";

  const [searchValue, setSearchValue] = useState<string>(query);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalAccountId, setModalAccountId] = useState<number | null>();

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
          className="size-15! shrink-0"
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
      render: (_value: number, record: Account) => (
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

  const handleSearch = () => {
    setSearchParams({
      query: searchValue,
      pageNum: "1",
      pageSize: String(pageSize),
    });
  };

  const handlePageChange = (page: number, size: number) => {
    setSearchParams({
      query,
      pageNum: String(page),
      pageSize: String(size),
    });
  };

  return (
    <>
      <div className="flex w-1/3 mb-3 items-center">
        <div className="text-nowrap">按用户名搜索：</div>
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Button type="primary" className="ml-2" onClick={handleSearch}>
          搜索
        </Button>
      </div>
      <Table
        rowKey="accountId"
        columns={tableColumns}
        dataSource={data.data}
        loading={isLoading}
        pagination={{
          total: data.totalSize,
          current: pageNum,
          pageSize: pageSize,
          onChange: handlePageChange,
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
  );
}
