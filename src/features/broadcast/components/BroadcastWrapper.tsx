import { Tabs } from "antd";
import {
  BellOutlined,
  HomeOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import IndexBroadcast from "./broadcastItem/IndexBroadcast";
import SystemBroadcast from "./broadcastItem/SystemBroadcast";
import TopicBroadcast from "./broadcastItem/TopicBroadcast";
import UserBroadcast from "./broadcastItem/UserBroadcast";

export default function BroadcastWrapper() {
  return (
    <div className="page-enter">
      <div
        className="text-2xl mb-4 font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        广播发布
      </div>
      <div
        className="rounded-(--radius-lg) border overflow-hidden"
        style={{
          background: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        <Tabs
          className="
            [&_.ant-tabs-nav]:px-4 [&_.ant-tabs-nav]:mb-0
            [&_.ant-tabs-nav]:border-b
            [&_.ant-tabs-nav]:border-(--color-border)
            [&_.ant-tabs-nav]:bg-(--color-bg-tertiary)
            [&_.ant-tabs-tab]:py-3
            [&_.ant-tabs-content-holder]:p-6
            [&_.ant-tabs-ink-bar]:bg-(--color-accent)
          "
          items={[
            {
              key: "user",
              label: (
                <span className="flex items-center gap-1.5">
                  <TeamOutlined />
                  用户广播
                </span>
              ),
              children: <UserBroadcast />,
            },
            {
              key: "topic",
              label: (
                <span className="flex items-center gap-1.5">
                  <ThunderboltOutlined />
                  话题广播
                </span>
              ),
              children: <TopicBroadcast />,
            },
            {
              key: "system",
              label: (
                <span className="flex items-center gap-1.5">
                  <BellOutlined />
                  系统通知
                </span>
              ),
              children: <SystemBroadcast />,
            },
            {
              key: "index",
              label: (
                <span className="flex items-center gap-1.5">
                  <HomeOutlined />
                  首页广播
                </span>
              ),
              children: <IndexBroadcast />,
            },
          ]}
        />
      </div>
    </div>
  );
}
