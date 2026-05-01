import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Empty,
  Image,
  List,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from "antd";
import useApp from "antd/es/app/useApp";
import { useCallback, useEffect, useState } from "react";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import {
  deleteTheme,
  deleteTopic,
  getTopicsByThemeId,
  updateTopic,
} from "@/features/theme/api";
import { getImageUrl } from "@/shared/api/image";
import type { PageEntity, Theme, Topic } from "@/shared/types";
import { formatDate } from "@/shared/utils/DateConvert";
import ThemeModal from "./ThemeModal";
import TopicModal from "./TopicModal";

export default function ThemeTable() {
  const { data: initialData } = useLoaderData() as {
    data: PageEntity<Theme>;
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const pageNum = parseInt(searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const isLoading = navigation.state === "loading";

  const { message } = useApp();
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<number | undefined>();
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);

  // 默认选中第一个主题
  useEffect(() => {
    if (initialData.data.length > 0 && selectedThemeId === null) {
      setSelectedThemeId(initialData.data[0].themeId);
    }
  }, [initialData.data, selectedThemeId]);

  const handleRefresh = () => {
    setSearchParams({
      pageNum: String(pageNum),
      pageSize: String(pageSize),
    });
  };

  const handleAddTheme = () => {
    setEditingThemeId(undefined);
    setThemeModalOpen(true);
  };

  const handleEditTheme = (themeId: number) => {
    setEditingThemeId(themeId);
    setThemeModalOpen(true);
  };

  const handleDeleteTheme = async (themeId: number) => {
    await deleteTheme(themeId);
    message.success("删除成功");
    if (selectedThemeId === themeId) {
      setSelectedThemeId(null);
    }
    handleRefresh();
  };

  const handleThemeModalOk = () => {
    setThemeModalOpen(false);
    handleRefresh();
  };

  const selectedTheme = initialData.data.find(
    (t) => t.themeId === selectedThemeId,
  );

  return (
    <div className="flex gap-4 h-[calc(100vh-220px)]">
      {/* 左侧：主题列表 */}
      <div className="w-64 shrink-0 flex flex-col border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)]">
        <div className="flex items-center justify-between p-3 border-b border-[var(--color-border)]">
          <span className="font-medium text-[var(--color-text-primary)]">
            主题
          </span>
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={handleAddTheme}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <List
            loading={isLoading}
            dataSource={initialData.data}
            renderItem={(theme) => (
              <div
                className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                  selectedThemeId === theme.themeId
                    ? "bg-[var(--color-accent-muted)]"
                    : "hover:bg-[var(--color-bg-tertiary)]"
                }`}
                onClick={() => setSelectedThemeId(theme.themeId)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="truncate">{theme.title}</span>
                  {theme.isDeleted && (
                    <Tag color="error" className="shrink-0 text-xs">
                      隐藏
                    </Tag>
                  )}
                </div>
                <Space
                  size={0}
                  className="shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditTheme(theme.themeId)}
                  />
                  <Popconfirm
                    title="确定删除该主题？"
                    onConfirm={() => handleDeleteTheme(theme.themeId)}
                  >
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </Space>
              </div>
            )}
          />
        </div>
        <div className="p-2 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-tertiary)]">
          共 {initialData.totalSize} 个主题
        </div>
      </div>

      {/* 右侧：话题列表 */}
      <div className="flex-1 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] overflow-hidden">
        {selectedThemeId ? (
          <TopicPanel themeId={selectedThemeId} themeTitle={selectedTheme?.title ?? ""} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Empty description="请选择一个主题" />
          </div>
        )}
      </div>

      <ThemeModal
        themeId={editingThemeId}
        isOpen={themeModalOpen}
        onOk={handleThemeModalOk}
        onCancel={() => setThemeModalOpen(false)}
      />
    </div>
  );
}

function TopicPanel({
  themeId,
  themeTitle,
}: {
  themeId: number;
  themeTitle: string;
}) {
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PageEntity<Topic>>();

  const { message } = useApp();
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<{
    id?: number;
    initialValues?: { title: string; description: string; coverUrl: string };
  }>({});

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const topics = await getTopicsByThemeId({
        page_num: pageNum,
        page_size: pageSize,
        theme_id: themeId,
      });
      setData(topics);
    } finally {
      setLoading(false);
    }
  }, [themeId, pageNum, pageSize]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleAddTopic = () => {
    setEditingTopic({});
    setTopicModalOpen(true);
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic({
      id: topic.topicId,
      initialValues: {
        title: topic.title,
        description: topic.description,
        coverUrl: topic.coverUrl,
      },
    });
    setTopicModalOpen(true);
  };

  const handleDeleteTopic = async (topicId: number) => {
    await deleteTopic(topicId);
    message.success("删除成功");
    fetchTopics();
  };

  const handleRestoreTopic = async (topicId: number) => {
    await updateTopic(topicId, { isDeleted: false });
    message.success("恢复成功");
    fetchTopics();
  };

  const handleTopicModalOk = () => {
    setTopicModalOpen(false);
    fetchTopics();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--color-text-primary)]">
            {themeTitle}
          </span>
          <span className="text-xs text-[var(--color-text-tertiary)]">
            · {data?.totalSize ?? 0} 个话题
          </span>
        </div>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={handleAddTopic}
        >
          添加话题
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <List
          loading={loading}
          dataSource={data?.data ?? []}
          renderItem={(topic) => (
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors">
              <Image
                src={getImageUrl(topic.coverUrl)}
                width={80}
                height={60}
                className="rounded-md object-cover shrink-0"
                alt="封面"
                preview={{ mask: <div className="text-xs">预览</div> }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Typography.Text strong className="truncate">
                    {topic.title}
                  </Typography.Text>
                  <Tag color={topic.isDeleted ? "error" : "success"} className="text-xs shrink-0">
                    {topic.isDeleted ? "已隐藏" : "正常"}
                  </Tag>
                </div>
                <Typography.Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  className="text-sm mb-1"
                >
                  {topic.description || "暂无描述"}
                </Typography.Paragraph>
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  {formatDate(topic.createTime)}
                </span>
              </div>
              <Space
                size={0}
                className="shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEditTopic(topic)}
                />
                {topic.isDeleted ? (
                  <Popconfirm
                    title="确定恢复该话题？"
                    onConfirm={() => handleRestoreTopic(topic.topicId)}
                  >
                    <Button type="text" size="small" icon={<ReloadOutlined />} />
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="确定删除该话题？"
                    onConfirm={() => handleDeleteTopic(topic.topicId)}
                  >
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                )}
              </Space>
            </div>
          )}
        />
      </div>

      {data && data.totalSize > pageSize && (
        <div className="flex justify-center p-3 border-t border-[var(--color-border)]">
          <Space>
            <Button
              size="small"
              disabled={pageNum === 1}
              onClick={() => setPageNum(pageNum - 1)}
            >
              上一页
            </Button>
            <span className="text-sm text-[var(--color-text-tertiary)]">
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

      <TopicModal
        topicId={editingTopic.id}
        themeId={themeId}
        isOpen={topicModalOpen}
        onOk={handleTopicModalOk}
        onCancel={() => setTopicModalOpen(false)}
        initialValues={editingTopic.initialValues}
      />
    </div>
  );
}
