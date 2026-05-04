import { client } from "@/shared/api/client";
import type { Permission } from "@/shared/types";

export async function getPermissionList(params: {
  role_id?: number;
}) {
  const res = await client.get("/api/permissions", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getPermissionById(permissionId: number) {
  const res = await client.get(`/api/permissions/${permissionId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createPermission(data: Permission) {
  const res = await client.post("/api/permissions", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updatePermission(
  permissionId: number,
  data: Partial<Permission>,
) {
  const res = await client.put(`/api/permissions/${permissionId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deletePermission(permissionId: number) {
  const res = await client.delete(`/api/permissions/${permissionId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
