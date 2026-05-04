import type { LoaderFunctionArgs } from "react-router-dom";
import { getConversationMessages } from "@/features/conversation/api";
import MessageTable from "./components/MessageTable";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const conversationId = parseInt(params.id!, 10);
  const url = new URL(request.url);
  const pageNum = parseInt(url.searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

  const data = await getConversationMessages({
    conversationId,
    page_num: pageNum,
    page_size: pageSize,
  });
  return { data, conversationId };
}

export default function ConversationMessagesPage() {
  return <MessageTable />;
}
