import { client } from "@/shared/api/client";
import type { Like } from "@/shared/types";

export async function getLikeList(params: {
  thread_id?: number;
  account_id?: number;
  page_num: number;
  page_size: number;
}) {
  const res = await client.get("/api/likes", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getLikeById(likeId: number) {
  const res = await client.get(`/api/likes/${likeId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createLike(data: Like) {
  const res = await client.post("/api/likes", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateLike(
  likeId: number,
  data: Partial<Like>,
) {
  const res = await client.put(`/api/likes/${likeId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deleteLike(likeId: number) {
  const res = await client.delete(`/api/likes/${likeId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
