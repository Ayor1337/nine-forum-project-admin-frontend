"use client";

import service from "@/axios";
import { Button, Table } from "antd";
import { useCallback, useEffect, useState } from "react";

export default function AccountRoleTable() {
  const [data, setData] = useState<Role[]>();
  const tableColumns = [
    { title: "权限名称", dataIndex: "roleName", key: "roleName" },
    { title: "权限称呼", dataIndex: "roleNick", key: "roleNick" },
    { title: "管辖范围", dataIndex: "topicName", key: "topicName" },
    { title: "权限等级", dataIndex: "priority", key: "priority" },
    {
      title: "操作",
      key: "action",
      render: (value: number, record: Role) => (
        <div className="flex">
          <Button type="link">新增</Button>
        </div>
      ),
    },
  ];

  const expandedRowRender = (record: Role) => {
    return <ExpandedTable roleId={record.roleId} />;
  };

  const fetchRoleData = useCallback(async () => {
    await service.get("/api/role/list").then((res) => {
      if (res.data.code === 200) {
        setData(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    fetchRoleData();
  }, [fetchRoleData]);

  return (
    data && (
      <div>
        <Table
          rowKey="roleId"
          columns={tableColumns}
          expandable={{
            expandedRowRender,
            defaultExpandedRowKeys: ["roleName"],
          }}
          dataSource={data}
          pagination={false}
        />
      </div>
    )
  );
}

function ExpandedTable({ roleId }: { roleId: number }) {
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [expandeTableData, setExpandeTableData] =
    useState<PageEntity<Account>>();
  const tableExpandColumns = [
    { title: "ID", dataIndex: "accountId", key: "accountId" },
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "昵称", dataIndex: "nickname", key: "nickname" },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: () => (
        <div className="flex gap-3">
          <Button type="link" danger className="text-red-500">
            除名
          </Button>
        </div>
      ),
    },
  ];

  const fetchAccountDataByRole = async () => {
    await service
      .get("/api/account/get_account_by_role_id", {
        params: {
          page_num: pageNum,
          page_size: pageSize,
          role_id: roleId,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setExpandeTableData(res.data.data);
        }
      });
  };

  useEffect(() => {
    fetchAccountDataByRole();
  }, [fetchAccountDataByRole]);

  return (
    expandeTableData && (
      <Table
        rowKey="accountId"
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
