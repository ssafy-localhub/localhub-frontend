// src/api/community.js
import api from "./index"; // 공통 Axios 인스턴스 임포트

export async function getPosts({page = 1, size = 5, filter = "", search = "",} = {}) {
  const response = await api.get("/posts/", {
    params: {
      page,
      size,
      filter: filter || undefined,
      search: search || undefined,
    },
  });

  return response.data;
}

export async function getPostDetail(postId) {
  if (!postId) {
    throw new Error("게시글 ID가 필요합니다.");
  }

  const response = await api.get(`/posts/${postId}`);

  return response.data;
}

export async function createPost({ title, content, tag = null, category = null, password,}) {
  const payload = {
    title,
    content,
    password,
  };

  if (tag) {
    payload.tag = tag;
  }

  if (category) {
    payload.category = category;
  }

  const response = await api.post("/posts/", payload);

  return response.data;
}

export async function updatePost( postId, {title = null, content = null, category = null, password, },) {
  if (!postId) {
    throw new Error("게시글 ID가 필요합니다.");
  }

  const payload = {
    password,
  };

  if (title !== null) {
    payload.title = title;
  }

  if (content !== null) {
    payload.content = content;
  }

  if (category !== null) {
    payload.category = category;
  }

  const response = await api.post(
    `/posts/${postId}`,
    payload,
  );

  return response.data;
}

export async function deletePost(postId, password) {
  if (!postId) {
    throw new Error("게시글 ID가 필요합니다.");
  }

  const response = await api.delete(
    `/posts/${postId}`,
    {
      data: {
        password,
      },
    },
  );

  return response.data;
}

export async function likePost(postId) {
  if (!postId) {
    throw new Error("게시글 ID가 필요합니다.");
  }

  const response = await api.get(
    `/posts/like/${postId}`,
  );

  return response.status;
}

export async function createComment(postId, content) {
  if (!postId) {
    throw new Error("게시글 ID가 필요합니다.");
  }

  const response = await api.post(
    `/posts/${postId}/comments/`,
    {
      content,
    },
  );

  return response.data;
}

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
