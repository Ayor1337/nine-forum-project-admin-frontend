import type { LoaderFunctionArgs } from "react-router-dom";
import { getAccountStatList } from "@/features/account-stat/api";
import AccountStatTable from "./components/AccountStatTable";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pageNum = parseInt(url.searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const accountId = url.searchParams.get("account_id")
    ? parseInt(url.searchParams.get("account_id")!, 10)
    : undefined;

  const data = await getAccountStatList({
    page_num: pageNum,
    page_size: pageSize,
    account_id: accountId,
  });
  return { data };
}

export default function AccountStatListPage() {
  return <AccountStatTable />;
}
