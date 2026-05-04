import type { LoaderFunctionArgs } from "react-router-dom";
import { getConversationList } from "@/features/conversation/api";
import ConversationTable from "./components/ConversationTable";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pageNum = parseInt(url.searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const alphaAccountId = url.searchParams.get("alpha_account_id")
    ? parseInt(url.searchParams.get("alpha_account_id")!, 10)
    : undefined;
  const betaAccountId = url.searchParams.get("beta_account_id")
    ? parseInt(url.searchParams.get("beta_account_id")!, 10)
    : undefined;

  const data = await getConversationList({
    page_num: pageNum,
    page_size: pageSize,
    alpha_account_id: alphaAccountId,
    beta_account_id: betaAccountId,
  });
  return { data };
}

export default function ConversationListPage() {
  return <ConversationTable />;
}
