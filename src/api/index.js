// src/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://localhub-backend-5263.onrender.com//api",

  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    if (!error.response) {
      console.error(
        "백엔드 서버에 연결할 수 없습니다. FastAPI 실행 상태를 확인해주세요.",
      );
    } else if (status === 400) {
      console.error("잘못된 요청입니다.", detail);
    } else if (status === 403) {
      console.error("비밀번호가 일치하지 않습니다.", detail);
    } else if (status === 404) {
      console.error("요청한 데이터를 찾을 수 없습니다.", detail);
    } else if (status === 422) {
      console.error(
        "입력값 검증에 실패했습니다.",
        error.response.data,
      );
    } else if (status >= 500) {
      console.error("백엔드 서버 오류가 발생했습니다.", detail);
    } else {
      console.error("API 요청 중 오류가 발생했습니다.", error);
    }

    return Promise.reject(error);
  },
);

export default api;
