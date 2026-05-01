import { client } from "@/shared/api/client";
import type { UserBroadcastPayload } from "@/shared/types";

export async function getUserOptions() {
  const res = await client.get("/api/accounts/options");
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function sendUserBroadcast(data: UserBroadcastPayload) {
  const res = await client.post("/api/user_broadcasts", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
