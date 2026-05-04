import { client } from "@/shared/api/client";
import type { TopicStat } from "@/shared/types";

export async function getTopicStatList(params: {
  topic_id?: number;
  page_num: number;
  page_size: number;
}) {
  const res = await client.get("/api/topic_stats", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getTopicStatById(statId: number) {
  const res = await client.get(`/api/topic_stats/${statId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createTopicStat(data: TopicStat) {
  const res = await client.post("/api/topic_stats", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateTopicStat(
  statId: number,
  data: Partial<TopicStat>,
) {
  const res = await client.put(`/api/topic_stats/${statId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deleteTopicStat(statId: number) {
  const res = await client.delete(`/api/topic_stats/${statId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
