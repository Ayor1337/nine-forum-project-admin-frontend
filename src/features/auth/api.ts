import { client } from "@/shared/api/client";

export async function login(username: string, password: string) {
  const res = await client.post("/api/auth/login", { username, password });
  if (res.data.code === 200) {
    return res.data.data;
  }
  throw new Error(res.data.message || "登录失败");
}
