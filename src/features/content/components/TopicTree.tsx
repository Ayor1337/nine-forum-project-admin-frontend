import {
  CaretDownOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Empty, Image, List, Popconfirm, Space, Tag } from "antd";
import useApp from "antd/es/app/useApp";
import { useCallback, useEffect, useState } from "react";
import {
  deleteTheme,
  deleteTopic,
  getTopicsByThemeId,
  updateTopic,
} from "@/features/theme/api";
import { getImageUrl } from "@/shared/api/image";
import type { PageEntity, Theme, Topic } from "@/shared/types";

interface TopicTreeProps {
  themes: Theme[];
  loading: boolean;
  selectedTopicId: number | null;
  onSelectTopic: (topicId: number) => void;
  onAddTheme: () => void;
  onEditTheme: (themeId: number) => void;
  onRefresh: () => void;
  onAddTopic: (themeId: number) => void;
  onEditTopic: (topic: Topic) => void;
}

export default function TopicTree({
  themes,
  loading,
  selectedTopicId,
  onSelectTopic,
  onAddTheme,
  onEditTheme,
  onRefresh,
  onAddTopic,
  onEditTopic,
}: TopicTreeProps) {
  const { message } = useApp();
  const [expandedThemeIds, setExpandedThemeIds] = useState<Set<number>>(
    new Set(),
  );
  const [topicsMap, setTopicsMap] = useState<
    Record<number, PageEntity<Topic>>
  >({});
  const [loadingTopics, setLoadingTopics] = useState<Set<number>>(new Set());

  // 默认展开第一个主题
  useEffect(() => {
    if (themes.length > 0 && expandedThemeIds.size === 0) {
      setExpandedThemeIds(new Set([themes[0].themeId]));
    }
  }, [themes, expandedThemeIds.size]);

  const fetchTopics = useCallback(async (themeId: number) => {
    setLoadingTopics((prev) => new Set(prev).add(themeId));
    try {
      const data = await getTopicsByThemeId({
        page_num: 1,
        page_size: 100,
        theme_id: themeId,
      });
      setTopicsMap((prev) => ({ ...prev, [themeId]: data }));
    } finally {
      setLoadingTopics((prev) => {
        const next = new Set(prev);
        next.delete(themeId);
        return next;
      });
    }
  }, []);

  // 展开主题时加载话题
  useEffect(() => {
    for (const themeId of expandedThemeIds) {
      if (!topicsMap[themeId]) {
        fetchTopics(themeId);
      }
    }
  }, [expandedThemeIds, topicsMap, fetchTopics]);

  const toggleTheme = (themeId: number) => {
    setExpandedThemeIds((prev) => {
      const next = new Set(prev);
      if (next.has(themeId)) {
        next.delete(themeId);
      } else {
        next.add(themeId);
      }
      return next;
    });
  };

  const handleDeleteTheme = async (themeId: number) => {
    await deleteTheme(themeId);
    message.success("删除成功");
    onRefresh();
  };

  const handleDeleteTopic = async (topicId: number) => {
    await deleteTopic(topicId);
    message.success("删除成功");
    // 刷新该主题下的话题列表
    const themeId = Object.entries(topicsMap).find(([, v]) =>
      v.data.some((t) => t.topicId === topicId),
    )?.[0];
    if (themeId) fetchTopics(Number(themeId));
  };

  const handleRestoreTopic = async (topicId: number) => {
    await updateTopic(topicId, { isDeleted: false });
    message.success("恢复成功");
    const themeId = Object.entries(topicsMap).find(([, v]) =>
      v.data.some((t) => t.topicId === topicId),
    )?.[0];
    if (themeId) fetchTopics(Number(themeId));
  };

  return (
    <div className="flex flex-col h-full">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between p-3 border-b border-(--color-border)">
        <span className="font-medium text-(--color-text-primary)">
          内容结构
        </span>
        <Space size={0}>
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={onAddTheme}
          />
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            onClick={onRefresh}
          />
        </Space>
      </div>

      {/* 树形列表 */}
      <div className="flex-1 overflow-y-auto">
        <List
          loading={loading}
          dataSource={themes}
          locale={{ emptyText: <Empty description="暂无主题" /> }}
          renderItem={(theme) => {
            const isExpanded = expandedThemeIds.has(theme.themeId);
            const topics = topicsMap[theme.themeId]?.data ?? [];
            const isLoadingTopics = loadingTopics.has(theme.themeId);

            return (
              <div key={theme.themeId}>
                {/* 主题行 */}
                <div
                  className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-(--color-bg-tertiary) transition-colors"
                  onClick={() => toggleTheme(theme.themeId)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isExpanded ? (
                      <CaretDownOutlined className="text-xs text-(--color-text-tertiary)" />
                    ) : (
                      <CaretRightOutlined className="text-xs text-(--color-text-tertiary)" />
                    )}
                    <span className="truncate font-medium text-sm">
                      {theme.title}
                    </span>
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
                      onClick={() => onEditTheme(theme.themeId)}
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

                {/* 话题子列表 */}
                {isExpanded && (
                  <div className="bg-(--color-bg-tertiary) opacity-80">
                    {isLoadingTopics ? (
                      <div className="px-6 py-2 text-xs text-(--color-text-tertiary)">
                        加载中...
                      </div>
                    ) : topics.length === 0 ? (
                      <div className="px-6 py-2 text-xs text-(--color-text-tertiary)">
                        暂无话题
                      </div>
                    ) : (
                      topics.map((topic) => (
                        <div
                          key={topic.topicId}
                          className={`flex items-center justify-between pl-6 pr-3 py-1.5 cursor-pointer transition-colors ${
                            selectedTopicId === topic.topicId
                              ? "bg-(--color-accent-muted)"
                              : "hover:bg-(--color-bg-tertiary)"
                          }`}
                          onClick={() => onSelectTopic(topic.topicId)}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Image
                              src={getImageUrl(topic.coverUrl)}
                              width={32}
                              height={24}
                              className="rounded shrink-0 object-cover"
                              alt=""
                              preview={{
                                mask: <div className="text-xs">预览</div>,
                              }}
                            />
                            <span className="truncate text-sm">
                              {topic.title}
                            </span>
                            {topic.isDeleted && (
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
                              onClick={() => onEditTopic(topic)}
                            />
                            {topic.isDeleted ? (
                              <Popconfirm
                                title="确定恢复该话题？"
                                onConfirm={() =>
                                  handleRestoreTopic(topic.topicId)
                                }
                              >
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<ReloadOutlined />}
                                />
                              </Popconfirm>
                            ) : (
                              <Popconfirm
                                title="确定删除该话题？"
                                onConfirm={() =>
                                  handleDeleteTopic(topic.topicId)
                                }
                              >
                                <Button
                                  type="text"
                                  size="small"
                                  danger
                                  icon={<DeleteOutlined />}
                                />
                              </Popconfirm>
                            )}
                          </Space>
                        </div>
                      ))
                    )}

                    {/* 添加话题按钮 */}
                    <div
                      className="pl-8 pr-3 py-1.5 cursor-pointer text-xs text-(--color-accent) hover:bg-(--color-bg-tertiary) transition-colors"
                      onClick={() => onAddTopic(theme.themeId)}
                    >
                      + 添加话题
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* 底部统计 */}
      <div className="p-2 border-t border-(--color-border) text-center text-xs text-(--color-text-tertiary)">
        共 {themes.length} 个主题
      </div>
    </div>
  );
}
