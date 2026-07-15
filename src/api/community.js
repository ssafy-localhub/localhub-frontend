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
  const response = await api.get(`/posts/${post_id}/comments`);
  return response.data;
};