"use client";

import { Collapse, CollapseProps } from "antd";
import UserBroadcast from "./broadcastItem/UserBroadcast";
import TopicBroadcast from "./broadcastItem/TopicBroadcast";
import SystemBroadcast from "./broadcastItem/SystemBroadcast";
import IndexBroadcast from "./broadcastItem/IndexBroadcast";

export default function BroadcastWrapper() {
  const collapseItem: CollapseProps["items"] = [
    {
      key: "1",
      label: "用户广播",
      children: <UserBroadcast />,
    },
    {
      key: "2",
      label: "话题广播",
      children: <TopicBroadcast />,
    },
    {
      key: "3",
      label: "系统通知",
      children: <SystemBroadcast />,
    },
    {
      key: "4",
      label: "首页广播",
      children: <IndexBroadcast />,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="text-2xl  mb-3">广播发布</div>
          <Collapse items={collapseItem} />
        </div>
        <div className="col-span-1">
          <div className="text-2xl  mb-3">历史广播</div>
          <Collapse items={collapseItem} />
        </div>
        <div className="bg-green-200">内容3</div>
        <div className="bg-green-200">内容4</div>
        <div className="bg-green-200">内容5</div>
      </div>
    </>
  );
}
