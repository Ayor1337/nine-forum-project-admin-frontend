import { client } from "@/shared/api/client";

export async function login(username: string, password: string) {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const res = await client.post("/api/auth/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (res.data.code === 200) {
    return res.data.data;
  }
  throw new Error(res.data.message || "登录失败");
}
