import { client } from "@/shared/api/client";
import type { TopicChat } from "@/shared/types";

export async function getTopicChatList(params: {
  topic_id?: number;
  page_num: number;
  page_size: number;
}) {
  const res = await client.get("/api/topic_chats", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getTopicChatById(topicChatId: number) {
  const res = await client.get(`/api/topic_chats/${topicChatId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createTopicChat(data: TopicChat) {
  const res = await client.post("/api/topic_chats", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateTopicChat(
  topicChatId: number,
  data: Partial<TopicChat>,
) {
  const res = await client.put(`/api/topic_chats/${topicChatId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deleteTopicChat(topicChatId: number) {
  const res = await client.delete(`/api/topic_chats/${topicChatId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
