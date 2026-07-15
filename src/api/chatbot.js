// src/api/chat.js
import api from './index';

/**
 * AI 어시스턴트에게 메시지를 전송하고 답변을 받습니다.
 * @param {string} message - 사용자가 새로 보낸 메시지
 * @param {Array<{role: string, content: string}>} history - 이전 대화 내역 목록
 * @returns {Promise<{response: string}>} FastAPI의 응답 데이터
 */
export const sendChatMessage = async (message, history = []) => {
  // 백엔드의 ChatRequest 스키마 구조에 맞춰서 전송
  const response = await api.post('/chat', {
    message,
    history
  });
  return response.data;
};