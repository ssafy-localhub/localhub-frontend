<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Search,
  PenLine,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  X,
  LockKeyhole,
} from "lucide-vue-next";

import {
  deletePost,
  getPosts,
} from "@/api/community";

const route = useRoute();
const router = useRouter();

const POSTS_PER_PAGE = 5;

const posts = ref([]);
const totalPosts = ref(0);
const isLoading = ref(false);
const errorMessage = ref("");

const searchInput = ref(
  typeof route.query.keyword === "string"
    ? route.query.keyword
    : "",
);

const currentPage = ref(
  Number.isInteger(Number(route.query.page)) &&
    Number(route.query.page) > 0
    ? Number(route.query.page)
    : 1,
);

const isDeleteModalOpen = ref(false);
const deleteTargetPost = ref(null);
const deletePassword = ref("");
const deleteErrorMessage = ref("");
const isDeleting = ref(false);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalPosts.value / POSTS_PER_PAGE)),
);

const pageNumbers = computed(() =>
  Array.from(
    { length: totalPages.value },
    (_, index) => index + 1,
  ),
);

const formatDate = (dateTime) => {
  if (!dateTime) return "";
  return String(dateTime)
    .slice(0, 10)
    .replaceAll("-", ".");
};

const getPostId = (post) => {
  const rawId = post?.post_id ?? post?.id;
  const resolvedId = Number(rawId);

  return Number.isInteger(resolvedId) && resolvedId > 0
    ? resolvedId
    : null;
};

const buildQuery = () => {
  const query = {};

  if (searchInput.value.trim()) {
    query.keyword = searchInput.value.trim();
  }

  if (currentPage.value > 1) {
    query.page = String(currentPage.value);
  }

  return query;
};

const fetchPosts = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const data = await getPosts({
      page: currentPage.value,
      size: POSTS_PER_PAGE,
      filter: "",
      search: searchInput.value.trim(),
    });

    posts.value = Array.isArray(data?.posts)
      ? data.posts
      : [];

    totalPosts.value = Number(data?.total) || 0;

    if (
      currentPage.value > totalPages.value &&
      totalPosts.value > 0
    ) {
      currentPage.value = totalPages.value;

      await router.replace({
        query: buildQuery(),
      });

      await fetchPosts();
    }
  } catch (error) {
    console.error("게시글 목록 조회 실패:", error);

    posts.value = [];
    totalPosts.value = 0;

    if (!error.response) {
      errorMessage.value =
        "백엔드 서버에 연결할 수 없습니다. FastAPI 실행 상태를 확인해주세요.";
    } else {
      errorMessage.value =
        error.response?.data?.detail ||
        "게시글 목록을 불러오지 못했습니다.";
    }
  } finally {
    isLoading.value = false;
  }
};

const submitSearch = async () => {
  currentPage.value = 1;

  await router.replace({
    query: buildQuery(),
  });

  await fetchPosts();
};

const goToPage = async (pageNumber) => {
  if (
    pageNumber < 1 ||
    pageNumber > totalPages.value ||
    pageNumber === currentPage.value
  ) {
    return;
  }

  currentPage.value = pageNumber;

  await router.replace({
    query: buildQuery(),
  });

  await fetchPosts();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const goToDetail = (post) => {
  const postId = getPostId(post);

  if (!postId) {
    console.error("상세 이동에 필요한 게시글 ID가 없습니다.", post);
    return;
  }

  router.push({
    path: `/community/post/${postId}`,
  });
};

const goToWrite = () => {
  router.push({
    name: "community-write",
  });
};

const goToEdit = (post) => {
  const postId = getPostId(post);

  if (!postId) {
    console.error("수정에 필요한 게시글 ID가 없습니다.", post);
    return;
  }

  router.push({
    name: "community-edit",
    params: {
      id: postId,
    },
  });
};

const openDeleteModal = (post) => {
  const postId = getPostId(post);

  if (!postId) {
    console.error("삭제할 게시글 ID가 없습니다.", post);
    window.alert("게시글 정보를 확인할 수 없어 삭제할 수 없습니다.");
    return;
  }

  deleteTargetPost.value = {
    ...post,
    resolvedId: postId,
  };

  deletePassword.value = "";
  deleteErrorMessage.value = "";
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deleteTargetPost.value = null;
  deletePassword.value = "";
  deleteErrorMessage.value = "";
};

const confirmDelete = async () => {
  if (!deleteTargetPost.value || isDeleting.value) {
    return;
  }

  if (deletePassword.value.length < 4) {
    deleteErrorMessage.value =
      "비밀번호를 4자 이상 입력해주세요.";
    return;
  }

  isDeleting.value = true;
  deleteErrorMessage.value = "";

  try {
    await deletePost(
      deleteTargetPost.value.resolvedId,
      deletePassword.value,
    );

    if (
      posts.value.length === 1 &&
      currentPage.value > 1
    ) {
      currentPage.value -= 1;

      await router.replace({
        query: buildQuery(),
      });
    }

    isDeleteModalOpen.value = false;
    deleteTargetPost.value = null;
    deletePassword.value = "";
    deleteErrorMessage.value = "";

    await fetchPosts();

    window.alert("게시글이 삭제되었습니다.");
  } catch (error) {
    console.error("게시글 삭제 실패:", error);

    const status = error.response?.status;

    if (status === 403) {
      deleteErrorMessage.value =
        "비밀번호가 일치하지 않습니다.";
    } else if (status === 404) {
      deleteErrorMessage.value =
        "이미 삭제되었거나 존재하지 않는 게시글입니다.";
    } else if (error.code === "ECONNABORTED") {
      deleteErrorMessage.value =
        "서버 응답 시간이 초과되었습니다. 잠시 후 목록을 확인해주세요.";
    } else if (!error.response) {
      deleteErrorMessage.value =
        error.message || "게시글 삭제 중 프론트 오류가 발생했습니다.";
    } else {
      deleteErrorMessage.value =
        error.response?.data?.detail ||
        "게시글 삭제에 실패했습니다.";
    }
  } finally {
    isDeleting.value = false;
  }
};

watch(
  () => route.query.keyword,
  async (keyword) => {
    const nextKeyword =
      typeof keyword === "string" ? keyword : "";

    if (searchInput.value === nextKeyword) return;

    searchInput.value = nextKeyword;
    currentPage.value = 1;

    await fetchPosts();
  },
);

watch(
  () => route.query.page,
  async (page) => {
    const nextPage =
      Number.isInteger(Number(page)) &&
        Number(page) > 0
        ? Number(page)
        : 1;

    if (currentPage.value === nextPage) return;

    currentPage.value = nextPage;

    await fetchPosts();
  },
);

onMounted(fetchPosts);
</script>

<template>
  <main class="community-page">
    <div class="community-container">
      <header class="page-header">
        <div>
          <h1>커뮤니티</h1>
          <p>구미 시민과 여행자가 함께하는 정보 공간</p>
        </div>

        <button type="button" class="write-button" @click="goToWrite">
          <PenLine :size="17" />
          <span>글쓰기</span>
        </button>
      </header>

      <section class="search-panel">
        <form class="search-form" @submit.prevent="submitSearch">
          <div class="search-input-wrapper">
            <Search :size="20" />

            <input v-model="searchInput" type="search" placeholder="제목으로 검색..." aria-label="게시글 검색" />
          </div>

          <button type="submit" class="search-button" :disabled="isLoading">
            검색
          </button>
        </form>
      </section>

      <p class="post-count">
        총 <strong>{{ totalPosts }}</strong>개의 게시글
      </p>

      <section v-if="isLoading" class="state-panel">
        <Loader2 :size="34" class="loading-icon" />

        <p>게시글을 불러오고 있습니다.</p>
      </section>

      <section v-else-if="errorMessage" class="state-panel error-panel">
        <AlertCircle :size="36" />

        <h2>게시글을 불러오지 못했습니다.</h2>

        <p>{{ errorMessage }}</p>

        <button type="button" @click="fetchPosts">
          다시 시도
        </button>
      </section>

      <section v-else-if="posts.length" class="post-list">
        <article v-for="post in posts" :key="getPostId(post) ?? post.title" class="post-card" tabindex="0" role="button"
          @click="goToDetail(post)" @keydown.enter="goToDetail(post)">
          <div class="post-card-top">
            <span class="anonymous-badge">
              익명
            </span>

            <time>
              {{ formatDate(post.created_at) }}
            </time>
          </div>

          <h2>{{ post.title }}</h2>

          <p class="post-guide">
            게시글을 선택하면 상세 내용을 확인할 수 있습니다.
          </p>

          <footer class="post-card-actions">
            <button type="button" class="edit-button" @click.stop="goToEdit(post)" @keydown.stop>
              <Pencil :size="15" />
              수정
            </button>

            <button type="button" class="delete-button" @click.stop="openDeleteModal(post)" @keydown.stop>
              <Trash2 :size="15" />
              삭제
            </button>
          </footer>
        </article>
      </section>

      <section v-else class="empty-state">
        <Search :size="36" />

        <h2>게시글이 없습니다.</h2>

        <p>
          검색어를 바꾸거나 새 글을 작성해보세요.
        </p>
      </section>

      <nav v-if="
        !isLoading &&
        !errorMessage &&
        totalPages > 1
      " class="pagination" aria-label="게시글 페이지 이동">
        <button type="button" class="pagination-arrow" :disabled="currentPage === 1" aria-label="이전 페이지"
          @click="goToPage(currentPage - 1)">
          <ChevronLeft :size="18" />
        </button>

        <button v-for="pageNumber in pageNumbers" :key="pageNumber" type="button" :class="[
          'pagination-number',
          {
            active:
              currentPage === pageNumber,
          },
        ]" @click="goToPage(pageNumber)">
          {{ pageNumber }}
        </button>

        <button type="button" class="pagination-arrow" :disabled="currentPage === totalPages
          " aria-label="다음 페이지" @click="goToPage(currentPage + 1)">
          <ChevronRight :size="18" />
        </button>
      </nav>
    </div>

    <div v-if="isDeleteModalOpen" class="modal-backdrop" role="presentation" @click.self="closeDeleteModal">
      <section class="delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
        <button type="button" class="modal-close-button" aria-label="삭제 창 닫기" :disabled="isDeleting"
          @click="closeDeleteModal">
          <X :size="18" />
        </button>

        <div class="modal-icon">
          <Trash2 :size="21" />
        </div>

        <h2 id="delete-modal-title">
          게시글 삭제
        </h2>

        <p class="modal-description">
          삭제된 게시글은 복구할 수 없습니다.
          작성할 때 사용한 비밀번호를 입력해주세요.
        </p>

        <p class="delete-target-title">
          {{ deleteTargetPost?.title }}
        </p>

        <form class="delete-form" @submit.prevent="confirmDelete">
          <label for="delete-password">
            비밀번호
          </label>

          <div class="delete-password-wrapper">
            <LockKeyhole :size="18" />

            <input id="delete-password" v-model="deletePassword" type="password" minlength="4"
              autocomplete="current-password" placeholder="비밀번호 입력" :disabled="isDeleting" />
          </div>

          <p v-if="deleteErrorMessage" class="delete-error-message">
            {{ deleteErrorMessage }}
          </p>

          <div class="modal-actions">
            <button type="button" class="modal-cancel-button" :disabled="isDeleting" @click="closeDeleteModal">
              취소
            </button>

            <button type="submit" class="modal-delete-button" :disabled="isDeleting">
              <Loader2 v-if="isDeleting" :size="17" class="loading-icon" />

              <Trash2 v-else :size="17" />

              {{
                isDeleting
                  ? "삭제 중..."
                  : "삭제"
              }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
.community-page {
  min-height: 100vh;
  background: #f6f8fb;
}

.community-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 34px 24px 72px;
}

.page-header {
  margin-bottom: 25px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.page-header h1 {
  margin: 0 0 5px;
  color: #0f172a;
  font-size: 25px;
  font-weight: 900;
  letter-spacing: -0.8px;
}

.page-header p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.write-button {
  min-width: 87px;
  height: 38px;
  padding: 0 17px;
  border: 0;
  border-radius: 999px;
  background: #2563eb;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.24);
}

.write-button:hover {
  background: #1d4ed8;
}

.search-panel {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  background: #ffffff;
}

.search-form {
  display: flex;
  gap: 8px;
}

.search-input-wrapper {
  min-width: 0;
  height: 43px;
  padding: 0 14px;
  border: 1px solid #dbe2ea;
  border-radius: 15px;
  background: #f8fafc;
  color: #64748b;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input-wrapper input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #0f172a;
  font-size: 14px;
}

.search-input-wrapper input::placeholder {
  color: #64748b;
}

.search-button {
  width: 61px;
  height: 43px;
  border: 0;
  border-radius: 15px;
  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.search-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.post-count {
  margin: 17px 3px 12px;
  color: #64748b;
  font-size: 12px;
}

.post-count strong {
  color: #0f172a;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card {
  padding: 18px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  background: #ffffff;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.post-card:hover {
  border-color: #bfdbfe;
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.07);
}

.post-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.anonymous-badge {
  padding: 4px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
}

.post-card time {
  flex-shrink: 0;
  color: #64748b;
  font-size: 10px;
}

.post-card h2 {
  margin: 13px 0 8px;
  color: #0f172a;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.25px;
}

.post-guide {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.post-card-actions {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.post-card-actions button {
  height: 34px;
  padding: 0 13px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.edit-button {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #2563eb;
}

.edit-button:hover {
  background: #dbeafe;
}

.delete-button {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #ef4444;
}

.delete-button:hover {
  background: #fee2e2;
}

.state-panel,
.empty-state {
  padding: 70px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  background: #ffffff;
  color: #94a3b8;
  text-align: center;
}

.state-panel p,
.empty-state p {
  margin: 10px 0 0;
  font-size: 13px;
}

.empty-state h2,
.error-panel h2 {
  margin: 15px 0 8px;
  color: #334155;
  font-size: 18px;
}

.error-panel {
  color: #ef4444;
}

.error-panel p {
  color: #64748b;
}

.error-panel button {
  margin-top: 18px;
  height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 11px;
  background: #2563eb;
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
}

.loading-icon {
  animation: spin 0.8s linear infinite;
}

.pagination {
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.pagination-arrow,
.pagination-number {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.pagination-number.active {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.pagination-arrow:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-modal {
  position: relative;
  width: 100%;
  max-width: 410px;
  padding: 28px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.28);
}

.modal-close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-close-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.modal-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #fef2f2;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-modal h2 {
  margin: 17px 0 7px;
  color: #0f172a;
  font-size: 21px;
  font-weight: 900;
}

.modal-description {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.7;
}

.delete-target-title {
  overflow: hidden;
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 11px;
  background: #f8fafc;
  color: #334155;
  font-size: 12px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-form {
  margin-top: 20px;
}

.delete-form>label {
  margin-bottom: 9px;
  color: #0f172a;
  display: block;
  font-size: 13px;
  font-weight: 900;
}

.delete-password-wrapper {
  height: 47px;
  padding: 0 14px;
  border: 1px solid #dbe2ea;
  border-radius: 13px;
  background: #f8fafc;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 9px;
}

.delete-password-wrapper:focus-within {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}

.delete-password-wrapper input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #0f172a;
  font: inherit;
}

.delete-error-message {
  margin: 10px 0 0;
  color: #dc2626;
  font-size: 12px;
}

.modal-actions {
  margin-top: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.modal-actions button {
  height: 46px;
  border-radius: 13px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
}

.modal-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.modal-cancel-button {
  border: 1px solid #dbe2ea;
  background: #ffffff;
  color: #0f172a;
}

.modal-delete-button {
  border: 0;
  background: #ef4444;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.modal-delete-button:not(:disabled):hover {
  background: #dc2626;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .community-container {
    padding: 26px 16px 56px;
  }

  .page-header h1 {
    font-size: 23px;
  }

  .write-button {
    min-width: 40px;
    width: 40px;
    padding: 0;
  }

  .write-button span {
    display: none;
  }

  .post-card {
    padding: 16px;
  }

  .post-card h2 {
    font-size: 14px;
  }

  .post-card-actions {
    justify-content: stretch;
  }

  .post-card-actions button {
    flex: 1;
  }

  .delete-modal {
    padding: 24px 20px;
  }
}
</style>
