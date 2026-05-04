import { Table, Button, Space, message, Popconfirm } from "antd";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { deletePermission } from "@/features/permission/api";
import type { Permission } from "@/shared/types";

export default function PermissionTable() {
  const { data } = useLoaderData() as { data: Permission[] };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleDelete = async (permissionId: number) => {
    try {
      await deletePermission(permissionId);
      message.success("删除成功");
      navigate(0);
    } catch {
      message.error("删除失败");
    }
  };

  const columns = [
    {
      title: "权限ID",
      dataIndex: "permissionId",
      key: "permissionId",
    },
    {
      title: "权限名称",
      dataIndex: "permissionName",
      key: "permissionName",
    },
    {
      title: "权限标识",
      dataIndex: "permissionKey",
      key: "permissionKey",
    },
    {
      title: "角色ID",
      dataIndex: "roleId",
      key: "roleId",
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Permission) => (
        <Space>
          <Button
            type="link"
            onClick={() =>
              navigate(`/permission/edit/${record.permissionId}`)
            }
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该权限？"
            onConfirm={() => handleDelete(record.permissionId)}
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
        <Button type="primary" onClick={() => navigate("/permission/create")}>
          新建权限
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="permissionId"
        pagination={{
          current: parseInt(searchParams.get("pageNum") || "1", 10),
          pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
        }}
      />
    </div>
  );
}
