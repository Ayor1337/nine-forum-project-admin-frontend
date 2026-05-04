import { client } from "@/shared/api/client";

export async function getThreadList(params: {
  page_num: number;
  page_size: number;
  topic_id?: number;
}) {
  const res = await client.get("/api/threads", { params });
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
