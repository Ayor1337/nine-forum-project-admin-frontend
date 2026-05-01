import type { LoaderFunctionArgs } from "react-router-dom";
import { getThemeList } from "@/features/theme/api";
import ThemeTable from "@/features/theme/components/ThemeTable";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pageNum = parseInt(url.searchParams.get("pageNum") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

  const data = await getThemeList({ page_num: pageNum, page_size: pageSize });
  return { data };
}

export default function ThemePage() {
  return <ThemeTable />;
}
