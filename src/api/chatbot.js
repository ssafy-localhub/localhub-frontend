// src/api/chatbot.js
import api from "./index";

/**
 * 챗봇 메시지 전송
 *
 * 요청:
 * {
 *   message,
 *   history: [
 *     {
 *       role: "user" | "assistant" | "system",
 *       content
 *     }
 *   ]
 * }
 *
 * 응답:
 * {
 *   response
 * }
 */
export async function sendChatMessage({
  message,
  history = [],
}) {
  const response = await api.post("/chat", {
    message,
    history,
  });

  return response.data;
}