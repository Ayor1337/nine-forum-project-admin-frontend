import { client } from "@/shared/api/client";
import type { Collect } from "@/shared/types";

export async function getCollectList(params: {
  thread_id?: number;
  account_id?: number;
  page_num: number;
  page_size: number;
}) {
  const res = await client.get("/api/collects", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getCollectById(collectId: number) {
  const res = await client.get(`/api/collects/${collectId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createCollect(data: Collect) {
  const res = await client.post("/api/collects", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateCollect(
  collectId: number,
  data: Partial<Collect>,
) {
  const res = await client.put(`/api/collects/${collectId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deleteCollect(collectId: number) {
  const res = await client.delete(`/api/collects/${collectId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
