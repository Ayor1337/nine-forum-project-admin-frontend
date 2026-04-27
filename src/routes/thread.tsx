import type { LoaderFunctionArgs } from "react-router-dom";
import { getThreadList, getUserOptions } from "@/features/thread/api";
import ThreadTable from "@/features/thread/components/ThreadTable";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pageNum = parseInt(url.searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

  const [data, userOptions] = await Promise.all([
    getThreadList({ page_num: pageNum, page_size: pageSize }),
    getUserOptions(),
  ]);

  return { data, userOptions };
}

export default function ThreadPage() {
  return <ThreadTable />;
}
