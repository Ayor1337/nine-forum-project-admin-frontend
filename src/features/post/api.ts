import { client } from "@/shared/api/client";
import type { Post } from "@/shared/types";

export async function getPostList(params: {
  thread_id?: number;
  account_id?: number;
  page_num: number;
  page_size: number;
}) {
  const res = await client.get("/api/posts", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getPostById(postId: number) {
  const res = await client.get(`/api/posts/${postId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createPost(data: Post) {
  const res = await client.post("/api/posts", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updatePost(
  postId: number,
  data: Partial<Post>,
) {
  const res = await client.put(`/api/posts/${postId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deletePost(postId: number) {
  const res = await client.delete(`/api/posts/${postId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
