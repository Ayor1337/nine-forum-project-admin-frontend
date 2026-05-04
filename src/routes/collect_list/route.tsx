import type { LoaderFunctionArgs } from "react-router-dom";
import { getCollectList } from "@/features/collect/api";
import CollectTable from "./components/CollectTable";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pageNum = parseInt(url.searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const threadId = url.searchParams.get("thread_id")
    ? parseInt(url.searchParams.get("thread_id")!, 10)
    : undefined;
  const accountId = url.searchParams.get("account_id")
    ? parseInt(url.searchParams.get("account_id")!, 10)
    : undefined;

  const data = await getCollectList({
    page_num: pageNum,
    page_size: pageSize,
    thread_id: threadId,
    account_id: accountId,
  });
  return { data };
}

export default function CollectListPage() {
  return <CollectTable />;
}
