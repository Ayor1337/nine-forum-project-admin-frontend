import { Tabs, Empty } from "antd";
import { FileTextOutlined, TagsOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useLoaderData, useNavigation, useSearchParams } from "react-router-dom";
import type { PageEntity, Theme, Topic } from "@/shared/types";
import ThemeModal from "@/features/theme/components/ThemeModal";
import TopicModal from "@/features/theme/components/TopicModal";
import TopicTree from "./TopicTree";
import ThreadPanel from "./ThreadPanel";
import TagPanel from "./TagPanel";

export default function ContentPage() {
  const { data: initialData } = useLoaderData() as {
    data: PageEntity<Theme>;
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const pageNum = parseInt(searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const isLoading = navigation.state === "loading";

  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("threads");

  // Theme modal state
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<number | undefined>();

  // Topic modal state
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<{
    id?: number;
    themeId: number;
    initialValues?: { title: string; description: string; coverUrl: string };
  }>({ themeId: 0 });

  const handleRefresh = () => {
    setSearchParams({
      pageNum: String(pageNum),
      pageSize: String(pageSize),
    });
  };

  // Theme handlers
  const handleAddTheme = () => {
    setEditingThemeId(undefined);
    setThemeModalOpen(true);
  };

  const handleEditTheme = (themeId: number) => {
    setEditingThemeId(themeId);
    setThemeModalOpen(true);
  };

  const handleThemeModalOk = () => {
    setThemeModalOpen(false);
    handleRefresh();
  };

  // Topic handlers
  const handleAddTopic = (themeId: number) => {
    setEditingTopic({ themeId });
    setTopicModalOpen(true);
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic({
      id: topic.topicId,
      themeId: topic.themeId,
      initialValues: {
        title: topic.title,
        description: topic.description,
        coverUrl: topic.coverUrl,
      },
    });
    setTopicModalOpen(true);
  };

  const handleTopicModalOk = () => {
    setTopicModalOpen(false);
    handleRefresh();
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-220px)]">
      {/* 左侧：主题+话题树 */}
      <div className="w-64 shrink-0 border border-(--color-border) rounded-lg bg-(--color-bg-secondary)">
        <TopicTree
          themes={initialData.data}
          loading={isLoading}
          selectedTopicId={selectedTopicId}
          onSelectTopic={setSelectedTopicId}
          onAddTheme={handleAddTheme}
          onEditTheme={handleEditTheme}
          onRefresh={handleRefresh}
          onAddTopic={handleAddTopic}
          onEditTopic={handleEditTopic}
        />
      </div>

      {/* 右侧：帖子/标签 Tabs */}
      <div className="flex-1 border border-(--color-border) rounded-lg bg-(--color-bg-secondary) overflow-hidden">
        {selectedTopicId ? (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="h-full flex flex-col [&_.ant-tabs-nav]:px-3 [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-content-holder]:flex-1 [&_.ant-tabs-content-holder]:overflow-hidden [&_.ant-tabs-content]:h-full"
            items={[
              {
                key: "threads",
                label: (
                  <span className="flex items-center gap-1">
                    <FileTextOutlined />
                    帖子
                  </span>
                ),
                children: <ThreadPanel topicId={selectedTopicId} />,
              },
              {
                key: "tags",
                label: (
                  <span className="flex items-center gap-1">
                    <TagsOutlined />
                    标签
                  </span>
                ),
                children: <TagPanel topicId={selectedTopicId} />,
              },
            ]}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Empty description="请在左侧选择一个话题" />
          </div>
        )}
      </div>

      {/* Modals */}
      <ThemeModal
        themeId={editingThemeId}
        isOpen={themeModalOpen}
        onOk={handleThemeModalOk}
        onCancel={() => setThemeModalOpen(false)}
      />
      <TopicModal
        topicId={editingTopic.id}
        themeId={editingTopic.themeId}
        isOpen={topicModalOpen}
        onOk={handleTopicModalOk}
        onCancel={() => setTopicModalOpen(false)}
        initialValues={editingTopic.initialValues}
      />
    </div>
  );
}
