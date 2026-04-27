import type { LoaderFunctionArgs } from "react-router-dom";
import { getAccountList } from "@/features/user/api";
import AccountTable from "@/features/user/components/AccountTable";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "";
  const pageNum = parseInt(url.searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

  const data = await getAccountList({ query, pageNum, pageSize });
  return { data };
}

export default function UserListPage() {
  return <AccountTable />;
}
