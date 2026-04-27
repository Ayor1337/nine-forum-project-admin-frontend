import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Table,
  type TableColumnsType,
} from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { useCallback, useEffect, useState } from "react";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import type { Account, PageEntity, Thread } from "@/shared/types";
import { formatDate } from "@/shared/utils/DateConvert";

interface UserFilterOption {
  username: string;
}

interface UserFilterDropdownProps extends FilterDropdownProps {
  userFilterOptions: UserFilterOption[];
  query: string;
  setQuery: (v: string) => void;
}

interface TopicFilterOption {
  id: string | number;
  name: string;
}

interface TopicFilterDropdownProps extends FilterDropdownProps {
  topicFilterOptions: TopicFilterOption[];
  query: string;
  setQuery: (v: string) => void;
}

export default function ThreadTable() {
  const { data: initialData, userOptions } = useLoaderData() as {
    data: PageEntity<Thread>;
    userOptions: Account[];
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const pageNum = parseInt(searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const isLoading = navigation.state === "loading";

  const [userQuery, setUserQuery] = useState<string>("");

  const handlePageChange = (page: number, size: number) => {
    setSearchParams({
      pageNum: String(page),
      pageSize: String(size),
    });
  };

  const tableColumns: TableColumnsType<Thread> = [
    { title: "标题", dataIndex: "title", key: "title" },
    {
      title: "作者",
      dataIndex: "accountName",
      key: "accountName",
      onFilter: (value, record) => record.accountName.includes(value as string),
      filterDropdown: (props) =>
        renderUserFilterDropdown({
          ...props,
          userFilterOptions: userOptions.map((u) => ({ username: u.username })),
          query: userQuery,
          setQuery: setUserQuery,
        }),
    },
    { title: "话题", dataIndex: "topicName", key: "topicName" },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      render: (value: Date) => formatDate(value),
    },
    { title: "操作", key: "action" },
  ];

  return (
    initialData && (
      <Table
        rowKey="threadId"
        columns={tableColumns}
        dataSource={initialData.data}
        loading={isLoading}
        pagination={{
          total: initialData.totalSize,
          current: pageNum,
          pageSize: pageSize,
          onChange: handlePageChange,
        }}
      />
    )
  );
}

const renderUserFilterDropdown = ({
  query,
  setQuery,
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  userFilterOptions,
}: UserFilterDropdownProps) => (
  <div className="flex flex-col w-60 px-2 py-3">
    <div className="flex">
      <Input
        prefix={<SearchOutlined />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
    <Divider />
    <div className="flex flex-col px-1 gap-1">
      {userFilterOptions.map((item) => (
        <Checkbox
          key={item.username}
          checked={selectedKeys.includes(item.username)}
          onChange={() => {
            if (selectedKeys.includes(item.username)) {
              setSelectedKeys(
                selectedKeys.filter((key) => key !== item.username),
              );
            } else {
              setSelectedKeys([...selectedKeys, item.username]);
            }
          }}
        >
          {item.username}
        </Checkbox>
      ))}
    </div>
    <Divider />
    <div className="flex justify-between">
      <Button
        type="link"
        onClick={() => {
          clearFilters?.();
          setSelectedKeys([]);
          confirm();
        }}
      >
        重置
      </Button>
      <Button type="primary" onClick={() => confirm()}>
        确定
      </Button>
    </div>
  </div>
);

const renderTopicFilterDropdown = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  topicFilterOptions,
  query,
  setQuery,
}: TopicFilterDropdownProps) => (
  <div className="flex flex-col w-60 px-2 py-3">
    <div className="flex">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onPressEnter={() => {
          setSelectedKeys(query ? [query] : []);
          confirm();
        }}
      />
      <Button
        type="link"
        onClick={() => {
          setSelectedKeys(query ? [query] : []);
          confirm();
        }}
      >
        搜索
      </Button>
    </div>
    <Divider />
    <div className="flex flex-col px-1 gap-1">
      {topicFilterOptions
        .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
        .map((item) => (
          <Checkbox
            key={item.id}
            checked={selectedKeys.includes(String(item.id))}
            onChange={() => {
              const id = String(item.id);
              if (selectedKeys.includes(id)) {
                setSelectedKeys(selectedKeys.filter((key) => key !== id));
              } else {
                setSelectedKeys([...selectedKeys, id]);
              }
            }}
          >
            {item.name}
          </Checkbox>
        ))}
    </div>
    <Divider />
    <div className="flex justify-between">
      <Button
        type="link"
        onClick={() => {
          clearFilters?.();
          setSelectedKeys([]);
          setQuery("");
          confirm();
        }}
      >
        重置
      </Button>
      <Button type="primary" onClick={() => confirm()}>
        确定
      </Button>
    </div>
  </div>
);
