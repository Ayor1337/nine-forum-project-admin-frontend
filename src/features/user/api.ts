import { client } from "@/shared/api/client";
import type { UpdateAccountPayload } from "@/shared/types";

export async function getAccountList(params: {
  query: string;
  pageNum: number;
  pageSize: number;
}) {
  const res = await client.get("/api/accounts", {
    params: {
      query: params.query,
      page_num: params.pageNum,
      page_size: params.pageSize,
    },
  });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getAccountById(accountId: number) {
  const res = await client.get(`/api/accounts/${accountId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateAccount(
  accountId: number,
  data: UpdateAccountPayload,
) {
  const res = await client.put(`/api/accounts/${accountId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function submitAccountViolation(accountId: number, type: string) {
  const res = await client.post(
    `/api/accounts/${accountId}/violations`,
    {},
    { params: { type } },
  );
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getUserOptions(query?: string) {
  const res = await client.get("/api/accounts/options", {
    params: { query },
  });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getRoleList() {
  const res = await client.get("/api/roles");
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getAccountByRoleId(params: {
  page_num: number;
  page_size: number;
  role_id: number;
}) {
  const res = await client.get("/api/accounts", {
    params,
  });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
