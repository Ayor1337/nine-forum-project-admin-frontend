import { client } from "@/shared/api/client";
import type { Conversation, ConversationMessage } from "@/shared/types";

// Conversation CRUD

export async function getConversationList(params: {
  alpha_account_id?: number;
  beta_account_id?: number;
  page_num: number;
  page_size: number;
}) {
  const res = await client.get("/api/conversations", { params });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getConversationById(conversationId: number) {
  const res = await client.get(`/api/conversations/${conversationId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createConversation(data: Conversation) {
  const res = await client.post("/api/conversations", data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateConversation(
  conversationId: number,
  data: Partial<Conversation>,
) {
  const res = await client.put(`/api/conversations/${conversationId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deleteConversation(conversationId: number) {
  const res = await client.delete(`/api/conversations/${conversationId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

// Conversation Messages

export async function getConversationMessages(params: {
  conversationId: number;
  page_num: number;
  page_size: number;
}) {
  const res = await client.get(
    `/api/conversations/${params.conversationId}/messages`,
    {
      params: {
        page_num: params.page_num,
        page_size: params.page_size,
      },
    },
  );
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getConversationMessageById(messageId: number) {
  const res = await client.get(`/api/conversation_messages/${messageId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function createConversationMessage(
  conversationId: number,
  data: ConversationMessage,
) {
  const res = await client.post(
    `/api/conversations/${conversationId}/messages`,
    data,
  );
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function updateConversationMessage(
  messageId: number,
  data: Partial<ConversationMessage>,
) {
  const res = await client.put(`/api/conversation_messages/${messageId}`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function deleteConversationMessage(messageId: number) {
  const res = await client.delete(`/api/conversation_messages/${messageId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}
