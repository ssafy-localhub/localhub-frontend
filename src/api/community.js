// src/api/community.js
import api from './index.js'; // 공통 Axios 인스턴스 임포트

/**
 * 단일 게시글 상세 조회
 * @param {number|string} id - 조회할 게시글의 고유 ID
 * @returns {Promise<any>} 게시글 상세 데이터
 */
export const getPostDetail = async (post_id) => {
  const response = await api.get(`/posts/${post_id}`);
  return response.data;
};

export const getPostComment = async (post_id) => {
  const response = await api.get(`/posts/${post_id}/comments/`);
  return response.data;
};

/**
 * 댓글 등록
 * @param {number|string} post_id - 댓글을 등록할 게시글 ID
 * @param {Object} commentData - 댓글 데이터 (예: { content: "댓글 내용" })
 * @returns {Promise<any>} 등록된 댓글 데이터
 */
export const createComment = async (post_id, commentData) => {
  const response = await api.post(`/posts/${post_id}/comments/`, commentData);
  return response.data;
};