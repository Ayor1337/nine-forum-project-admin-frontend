import { client } from "@/shared/api/client";
import type { Tag } from "@/shared/types";

export async function getTagList(params?: {
  topic_id?: number;
  page_num?: number;
  page_size?: number;
}) {
  const res = await client.get("/api/tags", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getTagById(tagId: number) {
  const res = await client.get(`/api/tags/${tagId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createTag(data: Tag) {
  const res = await client.post("/api/tags", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateTag(
  tagId: number,
  data: Partial<Tag>,
) {
  const res = await client.put(`/api/tags/${tagId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deleteTag(tagId: number) {
  const res = await client.delete(`/api/tags/${tagId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
