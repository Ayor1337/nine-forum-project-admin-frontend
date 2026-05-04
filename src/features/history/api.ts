import { client } from "@/shared/api/client";
import type { History } from "@/shared/types";

export async function getHistoryList(params: {
  thread_id?: number;
  account_id?: number;
  page_num: number;
  page_size: number;
}) {
  const res = await client.get("/api/histories", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getHistoryById(historyId: number) {
  const res = await client.get(`/api/histories/${historyId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createHistory(data: History) {
  const res = await client.post("/api/histories", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateHistory(
  historyId: number,
  data: Partial<History>,
) {
  const res = await client.put(`/api/histories/${historyId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deleteHistory(historyId: number) {
  const res = await client.delete(`/api/histories/${historyId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
