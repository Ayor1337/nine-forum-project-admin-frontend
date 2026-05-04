import type { LoaderFunctionArgs } from "react-router-dom";
import { getChatboardHistoryList } from "@/features/chatboard-history/api";
import ChatboardHistoryTable from "./components/ChatboardHistoryTable";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pageNum = parseInt(url.searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const topicId = url.searchParams.get("topic_id")
    ? parseInt(url.searchParams.get("topic_id")!, 10)
    : undefined;

  const data = await getChatboardHistoryList({
    page_num: pageNum,
    page_size: pageSize,
    topic_id: topicId,
  });
  return { data };
}

export default function ChatboardHistoryListPage() {
  return <ChatboardHistoryTable />;
}
