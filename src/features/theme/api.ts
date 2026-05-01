import { client } from "@/shared/api/client";

// Theme CRUD

export async function getThemeList(params: {
  page_num: number;
  page_size: number;
}) {
  const res = await client.get("/api/themes", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getThemeById(themeId: number) {
  const res = await client.get(`/api/themes/${themeId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createTheme(data: { title: string }) {
  const res = await client.post("/api/themes", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateTheme(
  themeId: number,
  data: { title?: string; isDeleted?: boolean },
) {
  const res = await client.put(`/api/themes/${themeId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deleteTheme(themeId: number) {
  const res = await client.delete(`/api/themes/${themeId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

// Topic CRUD

export async function getTopicsByThemeId(params: {
  page_num: number;
  page_size: number;
  theme_id: number;
}) {
  const res = await client.get("/api/topics", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createTopic(data: {
  title: string;
  coverUrl?: string;
  description?: string;
  themeId: number;
}) {
  const res = await client.post("/api/topics", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateTopic(
  topicId: number,
  data: { title?: string; coverUrl?: string; description?: string; isDeleted?: boolean },
) {
  const res = await client.put(`/api/topics/${topicId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deleteTopic(topicId: number) {
  const res = await client.delete(`/api/topics/${topicId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
