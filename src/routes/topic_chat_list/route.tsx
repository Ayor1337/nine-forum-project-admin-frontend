import type { LoaderFunctionArgs } from "react-router-dom";
import { getTopicChatList } from "@/features/topic-chat/api";
import TopicChatTable from "./components/TopicChatTable";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pageNum = parseInt(url.searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const topicId = url.searchParams.get("topic_id")
    ? parseInt(url.searchParams.get("topic_id")!, 10)
    : undefined;

  const data = await getTopicChatList({
    page_num: pageNum,
    page_size: pageSize,
    topic_id: topicId,
  });
  return { data };
}

export default function TopicChatListPage() {
  return <TopicChatTable />;
}
