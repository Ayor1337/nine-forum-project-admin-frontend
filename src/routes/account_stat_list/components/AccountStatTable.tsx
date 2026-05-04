import { Table, Button, Space, message, Popconfirm } from "antd";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { deleteAccountStat } from "@/features/account-stat/api";
import type { AccountStat } from "@/shared/types";

export default function AccountStatTable() {
  const { data } = useLoaderData() as {
    data: { totalSize: number; data: AccountStat[] };
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleDelete = async (statId: number) => {
    try {
      await deleteAccountStat(statId);
      message.success("删除成功");
      navigate(0);
    } catch {
      message.error("删除失败");
    }
  };

  const columns = [
    {
      title: "统计ID",
      dataIndex: "statId",
      key: "statId",
    },
    {
      title: "用户ID",
      dataIndex: "accountId",
      key: "accountId",
    },
    {
      title: "帖子数",
      dataIndex: "threadCount",
      key: "threadCount",
    },
    {
      title: "回复数",
      dataIndex: "postCount",
      key: "postCount",
    },
    {
      title: "点赞数",
      dataIndex: "likedCount",
      key: "likedCount",
    },
    {
      title: "收藏数",
      dataIndex: "collectedCount",
      key: "collectedCount",
    },
    {
      title: "关注数",
      dataIndex: "followingCount",
      key: "followingCount",
    },
    {
      title: "粉丝数",
      dataIndex: "followerCount",
      key: "followerCount",
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: AccountStat) => (
        <Space>
          <Button
            type="link"
            onClick={() =>
              navigate(`/account-stat/edit/${record.userStatId}`)
            }
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该统计记录？"
            onConfirm={() => handleDelete(record.userStatId)}
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
        <Button
          type="primary"
          onClick={() => navigate("/account-stat/create")}
        >
          新建统计
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="statId"
        pagination={{
          current: parseInt(searchParams.get("pageNum") || "1", 10),
          pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
          total: data?.totalSize,
        }}
      />
    </div>
  );
}
