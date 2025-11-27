"use client";

import service from "@/axios";
import { formatDate } from "@/func/DateConvert";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import { useCallback, useEffect, useState } from "react";

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
  const [userQuery, setUserQuery] = useState<string>("");
  const [topicQuery, setTopicQuery] = useState<string>("");
  const [data, setData] = useState<PageEntity<Thread>>();
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [userFilterOptions, setUserFilterOptions] = useState<Account[]>([]);
  const [topicFilterOptions, setTopicFilterOptions] = useState<Topic[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalAccountId, setModalAccountId] = useState<number | null>();

  const fetchUserOptionsData = async () => {
    await service
      .get("/api/account/list_user_options", {
        params: {
          query: userQuery,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setUserFilterOptions(res.data.data);
        }
      });
  };

  const fetchTopicOptionsData = async () => {
    await service
      .get("/api/account/list_options", {
        params: {
          query: topicQuery,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setUserFilterOptions(res.data.data);
        }
      });
  };

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
          userFilterOptions,
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
    fetchUserOptionsData();
  }, []);

  useEffect(() => {
    fetchUserOptionsData();
  }, [userQuery]);

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
    <Divider size="small" />
    <div className="flex flex-col px-1 gap-1">
      {userFilterOptions.map((item) => (
        <Checkbox
          key={item.username}
          checked={selectedKeys.includes(item.username)}
          onChange={() => {
            if (selectedKeys.includes(item.username)) {
              setSelectedKeys(
                selectedKeys.filter((key) => key !== item.username)
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
    <Divider size="small" />
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
    {/* 搜索框部分 */}
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

    <Divider size="small" />

    {/* Topic 复选框列表 */}
    <div className="flex flex-col px-1 gap-1">
      {topicFilterOptions
        // 如果你想让 query 影响下面的列表，加这一段过滤
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

    <Divider size="small" />

    {/* 底部按钮 */}
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
