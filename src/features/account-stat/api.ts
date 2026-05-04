import { client } from "@/shared/api/client";
import type { AccountStat } from "@/shared/types";

export async function getAccountStatList(params: {
  account_id?: number;
  page_num: number;
  page_size: number;
}) {
  const res = await client.get("/api/account_stats", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getAccountStatById(statId: number) {
  const res = await client.get(`/api/account_stats/${statId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createAccountStat(data: AccountStat) {
  const res = await client.post("/api/account_stats", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateAccountStat(
  statId: number,
  data: Partial<AccountStat>,
) {
  const res = await client.put(`/api/account_stats/${statId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deleteAccountStat(statId: number) {
  const res = await client.delete(`/api/account_stats/${statId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
