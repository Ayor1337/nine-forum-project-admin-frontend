import { client } from "@/shared/api/client";

export async function getThemeList(params: {
  page_num: number;
  page_size: number;
}) {
  const res = await client.get("/api/themes", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getTopicsByThemeId(params: {
  page_num: number;
  page_size: number;
  theme_id: number;
}) {
  const res = await client.get("/api/topics", {
    params,
  });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
