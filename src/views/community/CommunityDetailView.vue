<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ChevronRight,
  UserRound,
  Clock3,
  Eye,
  Pencil,
  Trash2,
  Heart,
  MessageSquare,
  Send,
  ArrowLeft,
  ChevronLeft,
  X,
  LockKeyhole,
} from "lucide-vue-next";
import { getPostDetail, getPostComment, createComment } from "@/api/community.js";

const commentAuthor = ref("");

const props = defineProps({
  category: {
    type: String,
    default: "",
  },
  id: {
    type: [String, Number],
    default: "",
  },
});

const route = useRoute();
const router = useRouter();

const COMMENTS_PER_PAGE = 5;

const categoryLabels = {
  restaurant: "맛집",
  tour: "관광",
  festival: "축제",
  life: "생활",
  question: "질문",
  living: "생활"
};

// API 연동을 위한 상태 관리
const post = ref(null);
const comments = ref([]);
const isLoading = ref(true);

const commentText = ref("");
const currentCommentPage = ref(1);
const likedPost = ref(false);
const isPasswordModalOpen = ref(false);
const passwordAction = ref("");
const passwordInput = ref("");
const passwordError = ref("");

// 파라미터에서 ID 추출
const postId = computed(() => props.id || route.params.id);

// 데이터 가져오기 함수
const fetchPostData = async () => {
  if (!postId.value) return;
  
  try {
    isLoading.value = true;
    // 두 API를 병렬로 호출하여 성능 최적화
    const [postData, commentsData] = await Promise.all([
      getPostDetail(postId.value),
      getPostComment(postId.value)
    ]);
    
    post.value = postData;
    comments.value = commentsData;
  } catch (error) {
    console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPostData();
});

const categoryLabel = computed(
  () => post.value ? (categoryLabels[post.value.category] || "커뮤니티") : "커뮤니티",
);

const totalCommentPages = computed(() =>
  Math.max(1, Math.ceil(comments.value.length / COMMENTS_PER_PAGE)),
);

const paginatedComments = computed(() => {
  const startIndex = (currentCommentPage.value - 1) * COMMENTS_PER_PAGE;
  return comments.value.slice(
    startIndex,
    startIndex + COMMENTS_PER_PAGE,
  );
});

const commentPageNumbers = computed(() =>
  Array.from(
    { length: totalCommentPages.value },
    (_, index) => index + 1,
  ),
);

const formatDate = (dateTime) => {
  if (!dateTime) return "";
  return dateTime.slice(0, 10).replaceAll("-", ".");
};

const formatNumber = (value) => {
  if (value === undefined || value === null) return 0;
  if (value >= 1000) {
    const converted = value / 1000;
    return `${Number.isInteger(converted) ? converted : converted.toFixed(1)}K`;
  }

  return value.toLocaleString("ko-KR");
};

const togglePostLike = () => {
  if (!post.value) return;
  likedPost.value = !likedPost.value;
  post.value.like_count += likedPost.value ? 1 : -1;
};

const submitComment = async() => {
  const trimmedText = commentText.value.trim();
  if (!trimmedText || !post.value) return;
  
  try {
    const newComment = await createComment(postId.value, {
      comment_content: trimmedText,
      comment_author: commentAuthor.value.trim()
    });

    comments.value.unshift(newComment);
    
    post.value.comment_count = comments.value.length;
    commentText.value = "";
    commentAuthor.value = "";
    currentCommentPage.value = 1; // 댓글이 작성되면 첫 페이지로 이동
  } catch (error) {
    console.error("댓글 등록에 실패했습니다:", error);
    window.alert("댓글 등록에 실패했습니다. 다시 시도해 주세요.");
  }

};

const goToCommentPage = (pageNumber) => {
  if (
    pageNumber < 1 ||
    pageNumber > totalCommentPages.value
  ) {
    return;
  }

  currentCommentPage.value = pageNumber;
};

const goBackToList = () => {
  const category = post.value?.category || props.category || route.params.category;
  router.push({
    name:
      category && category !== "all"
        ? "community-category"
        : "community",
    params:
      category && category !== "all"
        ? { category }
        : {},
  });
};

const openPasswordModal = (action) => {
  passwordAction.value = action;
  passwordInput.value = "";
  passwordError.value = "";
  isPasswordModalOpen.value = true;
};

const closePasswordModal = () => {
  isPasswordModalOpen.value = false;
  passwordInput.value = "";
  passwordError.value = "";
};

const confirmPassword = () => {
  if (!post.value) return;
  if (passwordInput.value !== post.value.password) {
    passwordError.value = "비밀번호가 일치하지 않습니다.";
    return;
  }

  if (passwordAction.value === "edit") {
    closePasswordModal();
    router.push({
      name: "community-edit",
      params: { id: post.value.content_id || postId.value },
      query: { category: post.value.category },
    });
    return;
  }

  if (passwordAction.value === "delete") {
    const confirmed = window.confirm("게시글을 삭제하시겠습니까?");
    if (!confirmed) return;

    closePasswordModal();
    window.alert("더미 데이터 기준으로 삭제 처리되었습니다.");
    goBackToList();
  }
};
</script>

<template>
  <main class="detail-page">
    <div class="detail-container">
      <!-- 로딩 중 화면 표시 -->
      <div v-if="isLoading" class="loading-state">
        <p>게시글을 불러오는 중입니다...</p>
      </div>

      <template v-else-if="post">
        <nav class="breadcrumb" aria-label="현재 위치">
          <RouterLink to="/">홈</RouterLink>
          <ChevronRight :size="15" />
          <RouterLink to="/community">커뮤니티</RouterLink>
          <ChevronRight :size="15" />
          <span>{{ post.title }}</span>
        </nav>

        <article class="post-card">
          <header class="post-header">
            <span :class="[
              'category-tag',
              `category-${post.category}`,
            ]">
              # {{ categoryLabel }}
            </span>

            <h1>{{ post.title }}</h1>

            <div class="post-info-row">
              <div class="post-meta">
                <span class="author-avatar">
                  <UserRound :size="15" />
                </span>
                <strong>{{ post.author }}</strong>

                <span>
                  <Clock3 :size="15" />
                  {{ formatDate(post.created_at) }}
                </span>

                <span>
                  <Eye :size="15" />
                  {{ formatNumber(post.views) }}
                </span>
              </div>

              <div class="post-actions">
                <button type="button" class="action-button" @click="openPasswordModal('edit')">
                  <Pencil :size="15" />
                  수정
                </button>

                <button type="button" class="action-button delete" @click="openPasswordModal('delete')">
                  <Trash2 :size="15" />
                  삭제
                </button>
              </div>
            </div>
          </header>

          <section class="post-content">
            <!-- content가 배열인 경우와 일반 문자열인 경우 모두 호환되도록 처리 -->
            <template v-if="Array.isArray(post.content)">
              <p v-for="(paragraph, index) in post.content" :key="index">
                {{ paragraph }}
              </p>
            </template>
            <template v-else>
              <p>{{ post.content }}</p>
            </template>
          </section>

          <footer class="post-footer">
            <button type="button" :class="['like-button', { active: likedPost }]" @click="togglePostLike">
              <Heart :size="18" :fill="likedPost ? 'currentColor' : 'none'" />
              {{ formatNumber(post.like_count) }}
            </button>

            <span class="comment-count">
              <MessageSquare :size="17" />
              댓글 {{ comments.length }}
            </span>
          </footer>
        </article>

        <section class="comment-section">
          <h2>
            <MessageSquare :size="18" />
            댓글 {{ comments.length }}개
          </h2>

          <form class="comment-form" @submit.prevent="submitComment">
            <div class="comment-author-input">
              <input 
                v-model="commentAuthor" 
                type="text" 
                placeholder="닉네임 (미입력 시 익명)" 
                maxlength="10"
              />
            </div>
            <textarea v-model="commentText" maxlength="500" placeholder="댓글을 입력해주세요. 서로를 존중하는 댓글 문화를 만들어요 💙"
              aria-label="댓글 내용"></textarea>

            <div class="comment-form-bottom">
              <span>익명으로 작성됩니다</span>

              <button type="submit" :disabled="!commentText.trim()">
                <Send :size="16" />
                등록
              </button>
            </div>
          </form>

          <div class="comment-list">
            <article v-for="comment in paginatedComments" :key="comment.comment_id" class="comment-card">
              <span class="comment-avatar">
                <UserRound :size="15" />
              </span>

              <div class="comment-main">
                <div class="comment-header">
                  <strong>{{comment.comment_author}}</strong>
                  <time>{{ formatDate(comment.created_at) }}</time>
                </div>

                <p>{{ comment.comment_content }}</p>
              </div>
            </article>
          </div>

          <nav v-if="totalCommentPages > 1" class="comment-pagination" aria-label="댓글 페이지 이동">
            <button type="button" :disabled="currentCommentPage === 1" aria-label="이전 댓글 페이지"
              @click="goToCommentPage(currentCommentPage - 1)">
              <ChevronLeft :size="17" />
            </button>

            <button v-for="pageNumber in commentPageNumbers" :key="pageNumber" type="button"
              :class="{ active: currentCommentPage === pageNumber }" @click="goToCommentPage(pageNumber)">
              {{ pageNumber }}
            </button>

            <button type="button" :disabled="currentCommentPage === totalCommentPages" aria-label="다음 댓글 페이지" 
              @click="goToCommentPage(currentCommentPage + 1)">
              <ChevronRight :size="17" />
            </button>
          </nav>
        </section>

        <button type="button" class="back-button" @click="goBackToList">
          <ArrowLeft :size="17" />
          목록으로
        </button>
      </template>

      <!-- 데이터를 찾을 수 없는 경우 예외 처리 -->
      <div v-else class="error-state">
        <p>존재하지 않거나 삭제된 게시글입니다.</p>
        <button type="button" class="back-button" @click="goBackToList">
          <ArrowLeft :size="17" />
          목록으로 돌아가기
        </button>
      </div>
    </div>

    <!-- 비밀번호 모달 영역 -->
    <div v-if="isPasswordModalOpen" class="modal-backdrop" @click.self="closePasswordModal">
      <section class="password-modal" role="dialog" aria-modal="true" aria-labelledby="password-modal-title">
        <button type="button" class="modal-close" aria-label="닫기" @click="closePasswordModal">
          <X :size="19" />
        </button>

        <span class="modal-icon">
          <LockKeyhole :size="23" />
        </span>

        <h2 id="password-modal-title">비밀번호 확인</h2>
        <p>
          게시글 {{ passwordAction === "edit" ? "수정" : "삭제" }}을
          위해 작성 시 입력한 비밀번호를 입력해주세요.
        </p>

        <input v-model="passwordInput" type="password" placeholder="비밀번호 입력" @keyup.enter="confirmPassword" />

        <span v-if="passwordError" class="password-error">
          {{ passwordError }}
        </span>

        <div class="modal-actions">
          <button type="button" class="modal-cancel" @click="closePasswordModal">
            취소
          </button>

          <button type="button" class="modal-confirm" @click="confirmPassword">
            확인
          </button>
        </div>

        <small>더미 비밀번호: {{ post?.password || '1234' }}</small>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* 기존 스타일과 동일하되 로딩/에러 레이아웃용 추가 */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #64748b;
  font-size: 16px;
  font-weight: 700;
  gap: 16px;
}

/* ...기존 스타일 유지... */
</style>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f6f8fb;
}

.detail-container {
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 34px 24px 72px;
}

.breadcrumb {
  overflow: hidden;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #64748b;
  font-size: 12px;
  white-space: nowrap;
}

.breadcrumb a {
  color: #64748b;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #2563eb;
}

.breadcrumb span {
  overflow: hidden;
  color: #0f172a;
  font-weight: 700;
  text-overflow: ellipsis;
}

.post-card,
.comment-section {
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.06);
}

.post-header {
  padding: 28px 26px 21px;
  border-bottom: 1px solid #e5e7eb;
}

.category-tag {
  display: inline-flex;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.category-restaurant {
  color: #f97316;
  background: #fff7ed;
  border: 1px solid #fed7aa;
}

.category-tour {
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
}

.category-festival {
  color: #9333ea;
  background: #faf5ff;
  border: 1px solid #e9d5ff;
}

.category-life {
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.category-question {
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
}

.post-header h1 {
  margin: 17px 0 20px;
  color: #0f172a;
  font-size: 27px;
  line-height: 1.35;
  font-weight: 900;
  letter-spacing: -1px;
}

.post-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.post-meta,
.post-actions {
  display: flex;
  align-items: center;
}

.post-meta {
  flex-wrap: wrap;
  gap: 12px;
  color: #64748b;
  font-size: 12px;
}

.post-meta span:not(.author-avatar) {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.author-avatar,
.comment-avatar {
  flex-shrink: 0;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.author-avatar {
  width: 29px;
  height: 29px;
}

.post-meta strong {
  color: #0f172a;
}

.post-actions {
  gap: 8px;
}

.action-button {
  height: 35px;
  padding: 0 14px;
  border: 1px solid #dbe2ea;
  border-radius: 999px;
  background: #ffffff;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.action-button:hover {
  background: #f8fafc;
}

.action-button.delete {
  border-color: #fecaca;
}

.action-button.delete:hover {
  color: #dc2626;
  background: #fef2f2;
}

.post-content {
  min-height: 285px;
  padding: 28px 26px;
  color: #0f172a;
  font-size: 14px;
  line-height: 1.95;
}

.post-content p {
  margin: 0 0 22px;
}

.post-content p:last-child {
  margin-bottom: 0;
}

.post-footer {
  padding: 17px 26px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.like-button {
  min-width: 84px;
  height: 38px;
  padding: 0 16px;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  background: #f1f5f9;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.like-button.active {
  border-color: #fecdd3;
  background: #fff1f2;
  color: #e11d48;
}

.comment-count {
  color: #64748b;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.comment-section {
  margin-top: 24px;
  padding: 26px;
}

.comment-section h2 {
  margin: 0 0 19px;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 900;
}

.comment-section h2 svg {
  color: #2563eb;
}

.comment-form {
  padding: 16px;
  border: 1px solid #dbe2ea;
  border-radius: 17px;
  background: #f8fafc;
}

.comment-form textarea {
  width: 95%;
  min-height: 94px;
  padding: 14px;
  border: 1px solid #dbe2ea;
  border-radius: 15px;
  outline: 0;
  resize: vertical;
  background: #ffffff;
  color: #0f172a;
  font: inherit;
  font-size: 13px;
  line-height: 1.6;
}

.comment-form textarea:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}

.comment-form-bottom {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.comment-form-bottom span {
  color: #64748b;
  font-size: 11px;
}

.comment-form-bottom button {
  height: 34px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: #2563eb;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.comment-form-bottom button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.comment-list {
  margin-top: 19px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-card {
  padding: 17px;
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.comment-avatar {
  width: 30px;
  height: 30px;
}

.comment-main {
  min-width: 0;
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-header strong {
  color: #0f172a;
  font-size: 12px;
}

.comment-header time {
  color: #64748b;
  font-size: 10px;
}

.comment-main p {
  margin: 7px 0 9px;
  color: #0f172a;
  font-size: 13px;
  line-height: 1.65;
}

.comment-like {
  padding: 0;
  border: 0;
  background: transparent;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  cursor: pointer;
}

.comment-pagination {
  margin-top: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.comment-pagination button {
  width: 31px;
  height: 31px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.comment-pagination button.active {
  background: #2563eb;
  color: #ffffff;
}

.comment-pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.back-button {
  margin-top: 20px;
  height: 40px;
  padding: 0 17px;
  border: 1px solid #dbe2ea;
  border-radius: 14px;
  background: #ffffff;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  padding: 20px;
  background: rgba(15, 23, 42, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-modal {
  position: relative;
  width: 100%;
  max-width: 390px;
  padding: 30px;
  border-radius: 20px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 14px;
  border-radius: 16px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-modal h2 {
  margin: 0;
  color: #0f172a;
  font-size: 20px;
}

.password-modal p {
  margin: 12px 0 18px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.password-modal input {
  width: 100%;
  height: 44px;
  padding: 0 13px;
  border: 1px solid #dbe2ea;
  border-radius: 12px;
  outline: 0;
  font: inherit;
}

.password-modal input:focus {
  border-color: #2563eb;
}

.password-error {
  display: block;
  margin-top: 8px;
  color: #dc2626;
  font-size: 11px;
  text-align: left;
}

.modal-actions {
  margin-top: 18px;
  display: flex;
  gap: 9px;
}

.modal-actions button {
  height: 41px;
  border-radius: 12px;
  flex: 1;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.modal-cancel {
  border: 1px solid #dbe2ea;
  background: #ffffff;
  color: #475569;
}

.modal-confirm {
  border: 0;
  background: #2563eb;
  color: #ffffff;
}

.password-modal small {
  display: block;
  margin-top: 12px;
  color: #94a3b8;
  font-size: 10px;
}

.comment-author-input input {
  width: 150px;             /* 적절한 입력창 너비 설정 */
  height: 38px;
  padding: 0 14px;
  margin-bottom: 10px;      /* 아래 textarea와의 간격 */
  border: 1px solid #dbe2ea; /* 기존 textarea와 동일한 테두리 색상 */
  border-radius: 10px;
  outline: 0;
  background: #ffffff;
  color: #0f172a;
  font-size: 13px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

@media (max-width: 640px) {
  .detail-container {
    padding: 25px 16px 56px;
  }

  .post-header,
  .post-content,
  .post-footer,
  .comment-section {
    padding-left: 18px;
    padding-right: 18px;
  }

  .post-header h1 {
    font-size: 22px;
  }

  .post-info-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .post-actions {
    width: 100%;
  }

  .action-button {
    flex: 1;
    justify-content: center;
  }

  .post-content {
    min-height: 230px;
    font-size: 13px;
  }

  .comment-card {
    padding: 15px;
  }

  .comment-form-bottom {
    align-items: flex-end;
  }
}

</style>
