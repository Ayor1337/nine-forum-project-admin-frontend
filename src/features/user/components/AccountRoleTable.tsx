import { DeleteOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Empty, List, Popconfirm, Space, Tag } from "antd";
import useApp from "antd/es/app/useApp";
import { useCallback, useEffect, useState } from "react";
import { getAccountByRoleId, getRoleList } from "@/features/user/api";
import { getImageUrl } from "@/shared/api/image";
import type { AccountVO, PageEntity, Role } from "@/shared/types";

export default function AccountRoleTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRoleList();
      setRoles(data);
      if (data.length > 0 && selectedRoleId === null) {
        setSelectedRoleId(data[0].roleId);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedRoleId]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const selectedRole = roles.find((r) => r.roleId === selectedRoleId);

  return (
    <div className="flex gap-4 h-[calc(100vh-220px)]">
      {/* 左侧：角色列表 */}
      <div className="w-64 shrink-0 flex flex-col border border-(--color-border) rounded-lg bg-(--color-bg-secondary)">
        <div className="flex items-center justify-between p-3 border-b border-(--color-border)">
          <span className="font-medium text-(--color-text-primary)">
            角色
          </span>
          <Button type="text" size="small" icon={<PlusOutlined />} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <List
            loading={loading}
            dataSource={roles}
            renderItem={(role) => (
              <div
                className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                  selectedRoleId === role.roleId
                    ? "bg-(--color-accent-muted)"
                    : "hover:bg-(--color-bg-tertiary)"
                }`}
                onClick={() => setSelectedRoleId(role.roleId)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    className="shrink-0"
                    style={{
                      background:
                        selectedRoleId === role.roleId
                          ? "var(--color-accent)"
                          : "var(--color-text-tertiary)",
                    }}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {role.roleNick}
                    </div>
                    <div className="truncate text-xs text-(--color-text-tertiary)">
                      {role.roleName}
                    </div>
                  </div>
                </div>
                <Tag className="shrink-0 text-xs">P{role.priority}</Tag>
              </div>
            )}
          />
        </div>
        <div className="p-2 border-t border-(--color-border) text-center text-xs text-(--color-text-tertiary)">
          共 {roles.length} 个角色
        </div>
      </div>

      {/* 右侧：用户列表 */}
      <div className="flex-1 border border-(--color-border) rounded-lg bg-(--color-bg-secondary) overflow-hidden">
        {selectedRoleId ? (
          <UserPanel
            roleId={selectedRoleId}
            roleName={selectedRole?.roleNick ?? ""}
            topicName=""
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Empty description="请选择一个角色" />
          </div>
        )}
      </div>
    </div>
  );
}

function UserPanel({
  roleId,
  roleName,
  topicName,
}: {
  roleId: number;
  roleName: string;
  topicName: string;
}) {
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PageEntity<AccountVO>>();

  const { message } = useApp();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const accounts = await getAccountByRoleId({
        page_num: pageNum,
        page_size: pageSize,
        role_id: roleId,
      });
      setData(accounts);
    } finally {
      setLoading(false);
    }
  }, [roleId, pageNum, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRemoveUser = async (_accountId: number) => {
    // TODO: 调用除名 API
    message.success("除名成功");
    fetchUsers();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-(--color-border)">
        <div className="flex items-center gap-2">
          <span className="font-medium text-(--color-text-primary)">
            {roleName}
          </span>
          <span className="text-xs text-(--color-text-tertiary)">
            · {topicName}
          </span>
          <span className="text-xs text-(--color-text-tertiary)">
            · {data?.totalSize ?? 0} 人
          </span>
        </div>
        <Button type="primary" size="small" icon={<PlusOutlined />}>
          添加成员
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <List
          loading={loading}
          dataSource={data?.data ?? []}
          renderItem={(account) => (
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-(--color-bg-tertiary) transition-colors">
              <Avatar
                src={getImageUrl(account.avatarUrl)}
                size={40}
                icon={<UserOutlined />}
                className="shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">
                    {account.nickname}
                  </span>
                  <span className="text-xs text-(--color-text-tertiary)">
                    @{account.username}
                  </span>
                </div>
                <div className="text-xs text-(--color-text-tertiary)">
                  ID: {account.accountId}
                </div>
              </div>
              <Tag
                color={account.status === 1 ? "success" : "error"}
                className="shrink-0"
              >
                {account.status === 1 ? "正常" : "禁用"}
              </Tag>
              <Popconfirm
                title="确定将该用户除名？"
                onConfirm={() => handleRemoveUser(account.accountId)}
              >
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                >
                  除名
                </Button>
              </Popconfirm>
            </div>
          )}
        />
      </div>

      {data && data.totalSize > pageSize && (
        <div className="flex justify-center p-3 border-t border-(--color-border)">
          <Space>
            <Button
              size="small"
              disabled={pageNum === 1}
              onClick={() => setPageNum(pageNum - 1)}
            >
              上一页
            </Button>
            <span className="text-sm text-(--color-text-tertiary)">
              {pageNum} / {Math.ceil(data.totalSize / pageSize)}
            </span>
            <Button
              size="small"
              disabled={pageNum >= Math.ceil(data.totalSize / pageSize)}
              onClick={() => setPageNum(pageNum + 1)}
            >
              下一页
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
}
