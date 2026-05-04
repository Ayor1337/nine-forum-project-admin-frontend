import type { LoaderFunctionArgs } from "react-router-dom";
import { getPermissionList } from "@/features/permission/api";
import PermissionTable from "./components/PermissionTable";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const roleId = url.searchParams.get("role_id")
    ? parseInt(url.searchParams.get("role_id")!, 10)
    : undefined;

  const data = await getPermissionList({ role_id: roleId });
  return { data };
}

export default function PermissionListPage() {
  return <PermissionTable />;
}
