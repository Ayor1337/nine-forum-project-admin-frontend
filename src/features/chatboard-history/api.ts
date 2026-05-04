import { client } from "@/shared/api/client";
import type { ChatboardHistory } from "@/shared/types";

export async function getChatboardHistoryList(params: {
  topic_id?: number;
  page_num: number;
  page_size: number;
}) {
  const res = await client.get("/api/chatboard_histories", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getChatboardHistoryById(historyId: number) {
  const res = await client.get(`/api/chatboard_histories/${historyId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createChatboardHistory(data: ChatboardHistory) {
  const res = await client.post("/api/chatboard_histories", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateChatboardHistory(
  historyId: number,
  data: Partial<ChatboardHistory>,
) {
  const res = await client.put(`/api/chatboard_histories/${historyId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deleteChatboardHistory(historyId: number) {
  const res = await client.delete(`/api/chatboard_histories/${historyId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
