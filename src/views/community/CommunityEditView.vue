<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  LockKeyhole,
  PenLine,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-vue-next";

import {
  getPostDetail,
  updatePost,
} from "@/api/community";

const route = useRoute();
const router = useRouter();

const postId = computed(() => Number(route.params.id));

const categories = [
  { key: "restaurant", label: "맛집" },
  { key: "tour", label: "관광" },
  { key: "festival", label: "축제" },
  { key: "life", label: "생활" },
  { key: "question", label: "질문" },
];

const selectedCategory = ref("life");
const title = ref("");
const content = ref("");
const tag = ref("");
const password = ref("");

const isLoading = ref(false);
const isSubmitting = ref(false);
const loadErrorMessage = ref("");
const validationMessage = ref("");

const titleLength = computed(() => title.value.length);
const contentLength = computed(() => content.value.length);
const tagLength = computed(() => tag.value.length);

const validateForm = () => {
  if (!selectedCategory.value) {
    validationMessage.value = "카테고리를 선택해주세요.";
    return false;
  }

  if (title.value.trim().length < 5) {
    validationMessage.value = "제목을 5자 이상 입력해주세요.";
    return false;
  }

  if (content.value.trim().length < 10) {
    validationMessage.value = "내용을 10자 이상 입력해주세요.";
    return false;
  }

  if (password.value.length < 4) {
    validationMessage.value =
      "게시글 수정 확인을 위해 비밀번호를 4자 이상 입력해주세요.";
    return false;
  }

  validationMessage.value = "";
  return true;
};

const getApiErrorMessage = (error, fallbackMessage) => {
  const status = error.response?.status;
  const detail = error.response?.data?.detail;

  if (!error.response) {
    return "백엔드 서버에 연결할 수 없습니다. FastAPI 실행 상태를 확인해주세요.";
  }

  if (status === 403) {
    return "비밀번호가 일치하지 않습니다.";
  }

  if (status === 404) {
    return "게시글을 찾을 수 없습니다.";
  }

  if (status === 422) {
    if (Array.isArray(detail)) {
      const firstError = detail[0];
      const field = firstError?.loc?.at(-1);
      const message = firstError?.msg;

      return field && message
        ? `입력값 오류: ${field} - ${message}`
        : "백엔드가 입력 데이터를 처리하지 못했습니다.";
    }

    return "백엔드가 입력 데이터를 처리하지 못했습니다.";
  }

  if (typeof detail === "string") {
    return detail;
  }

  return fallbackMessage;
};

const fetchPost = async () => {
  if (!postId.value) {
    loadErrorMessage.value = "유효한 게시글 ID가 없습니다.";
    return;
  }

  isLoading.value = true;
  loadErrorMessage.value = "";

  try {
    const data = await getPostDetail(postId.value);

    title.value = data?.title ?? "";
    content.value = data?.content ?? "";
    tag.value = data?.tag ?? "";

    const responseCategory = data?.category;

    if (
      typeof responseCategory === "string" &&
      categories.some(
        (category) => category.key === responseCategory,
      )
    ) {
      selectedCategory.value = responseCategory;
    } else if (
      typeof route.query.category === "string" &&
      categories.some(
        (category) =>
          category.key === route.query.category,
      )
    ) {
      selectedCategory.value = route.query.category;
    } else {
      selectedCategory.value = "life";
    }

    password.value = "";
  } catch (error) {
    console.error("게시글 상세 조회 실패:", error);

    loadErrorMessage.value = getApiErrorMessage(
      error,
      "게시글 정보를 불러오지 못했습니다.",
    );
  } finally {
    isLoading.value = false;
  }
};

const submitEdit = async () => {
  if (
    !validateForm() ||
    isSubmitting.value ||
    !postId.value
  ) {
    return;
  }

  isSubmitting.value = true;
  validationMessage.value = "";

  try {
    const result = await updatePost(postId.value, {
      title: title.value.trim(),
      content: content.value.trim(),
      category: selectedCategory.value,
      tag: tag.value.trim() || null,
      password: password.value,
    });

    window.alert(
      result?.message || "게시글이 수정되었습니다.",
    );

    await router.push({
      name: "community",
    });
  } catch (error) {
    console.error("게시글 수정 실패:", error);

    validationMessage.value = getApiErrorMessage(
      error,
      "게시글 수정에 실패했습니다.",
    );
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => {
  router.push({
    name: "community",
  });
};

onMounted(fetchPost);
</script>

<template>
  <main class="edit-page">
    <div class="edit-container">
      <button
        type="button"
        class="back-link"
        @click="cancel"
      >
        <ArrowLeft :size="17" />
        커뮤니티로 돌아가기
      </button>

      <header class="page-header">
        <h1>게시글 수정</h1>
        <p>
          기존 작성 내용을 확인하고 필요한 부분만
          수정해주세요.
        </p>
      </header>

      <section
        v-if="isLoading"
        class="state-card"
      >
        <Loader2
          :size="35"
          class="loading-icon"
        />

        <p>게시글 정보를 불러오고 있습니다.</p>
      </section>

      <section
        v-else-if="loadErrorMessage"
        class="state-card error-card"
      >
        <AlertCircle :size="38" />

        <h2>게시글을 불러오지 못했습니다.</h2>

        <p>{{ loadErrorMessage }}</p>

        <div class="state-actions">
          <button
            type="button"
            class="retry-button"
            @click="fetchPost"
          >
            다시 시도
          </button>

          <button
            type="button"
            class="list-button"
            @click="cancel"
          >
            목록으로
          </button>
        </div>
      </section>

      <form
        v-else
        class="edit-card"
        @submit.prevent="submitEdit"
      >
        <section class="form-section">
          <label class="field-label">
            카테고리
            <span>*</span>
          </label>

          <div class="category-list">
            <button
              v-for="category in categories"
              :key="category.key"
              type="button"
              :class="[
                'category-button',
                {
                  active:
                    selectedCategory === category.key,
                },
              ]"
              :disabled="isSubmitting"
              @click="selectedCategory = category.key"
            >
              {{ category.label }}
            </button>
          </div>
        </section>

        <section class="form-section">
          <label
            for="edit-tag"
            class="field-label"
          >
            태그
          </label>

          <div class="tag-input-wrapper">
            <Tag :size="18" />

            <input
              id="edit-tag"
              v-model="tag"
              type="text"
              maxlength="100"
              :disabled="isSubmitting"
              placeholder="예: 구미 인동 라멘 주차"
            />
          </div>

          <div class="field-help-row">
            <p>
              검색에 사용할 키워드를 띄어쓰기로 구분해
              입력하세요.
            </p>

            <span>{{ tagLength }}/100</span>
          </div>
        </section>

        <div class="divider"></div>

        <section class="form-section">
          <label
            for="edit-title"
            class="field-label"
          >
            제목
            <span>*</span>
          </label>

          <input
            id="edit-title"
            v-model="title"
            type="text"
            maxlength="100"
            :disabled="isSubmitting"
            placeholder="제목을 입력해주세요 (5~100자)"
          />

          <p class="character-count">
            {{ titleLength }}/100
          </p>
        </section>

        <section class="form-section">
          <label
            for="edit-content"
            class="field-label"
          >
            내용
            <span>*</span>
          </label>

          <textarea
            id="edit-content"
            v-model="content"
            maxlength="5000"
            :disabled="isSubmitting"
            placeholder="내용을 입력해주세요. (10자 이상)"
          ></textarea>

          <p class="character-count">
            {{ contentLength }}/5000
          </p>
        </section>

        <section class="api-notice">
          <AlertCircle :size="17" />

          <div>
            <strong>
              이미지 수정은 현재 제외되어 있습니다.
            </strong>

            <p>
              이번 수정 요청에는 제목, 내용, 카테고리,
              태그, 비밀번호를 전송합니다.
            </p>
          </div>
        </section>

        <div class="divider"></div>

        <section class="form-section">
          <label
            for="edit-password"
            class="field-label"
          >
            비밀번호 확인
            <span>*</span>
          </label>

          <div class="password-input-wrapper">
            <LockKeyhole :size="18" />

            <input
              id="edit-password"
              v-model="password"
              type="password"
              minlength="4"
              maxlength="100"
              autocomplete="current-password"
              :disabled="isSubmitting"
              placeholder="작성 시 사용한 비밀번호를 입력해주세요."
            />
          </div>

          <p class="password-help">
            <LockKeyhole :size="13" />
            기존 비밀번호는 화면에 표시하지 않으며,
            수정 요청 시 일치 여부만 확인합니다.
          </p>
        </section>

        <p
          v-if="validationMessage"
          class="validation-message"
        >
          {{ validationMessage }}
        </p>

        <footer class="form-actions">
          <button
            type="button"
            class="cancel-button"
            :disabled="isSubmitting"
            @click="cancel"
          >
            취소
          </button>

          <button
            type="submit"
            class="submit-button"
            :disabled="isSubmitting"
          >
            <Loader2
              v-if="isSubmitting"
              :size="17"
              class="loading-icon"
            />

            <PenLine
              v-else
              :size="17"
            />

            {{
              isSubmitting
                ? "수정 중..."
                : "수정 완료"
            }}
          </button>
        </footer>
      </form>
    </div>
  </main>
</template>

<style scoped>
.edit-page {
  min-height: 100vh;
  background: #f6f8fb;
}

.edit-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 30px 24px 72px;
}

.back-link {
  margin-bottom: 25px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.back-link:hover {
  color: #2563eb;
}

.page-header {
  margin-bottom: 25px;
}

.page-header h1 {
  margin: 0 0 5px;
  color: #0f172a;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -1px;
}

.page-header p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.edit-card,
.state-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.07);
}

.state-card {
  padding: 72px 24px;
  color: #64748b;
  text-align: center;
}

.state-card p {
  margin: 13px 0 0;
  font-size: 13px;
}

.error-card {
  color: #ef4444;
}

.error-card h2 {
  margin: 15px 0 7px;
  color: #334155;
  font-size: 19px;
}

.error-card p {
  color: #64748b;
}

.state-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 9px;
}

.state-actions button {
  height: 39px;
  padding: 0 15px;
  border-radius: 11px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.retry-button {
  border: 0;
  background: #2563eb;
  color: #ffffff;
}

.list-button {
  border: 1px solid #dbe2ea;
  background: #ffffff;
  color: #334155;
}

.form-section {
  padding: 25px 24px 0;
}

.field-label {
  margin-bottom: 11px;
  color: #0f172a;
  display: block;
  font-size: 14px;
  font-weight: 900;
}

.field-label span {
  color: #ef4444;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-button {
  height: 40px;
  padding: 0 19px;
  border: 1px solid #dbe2ea;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.category-button.active {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.category-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.divider {
  height: 1px;
  margin: 21px 24px 0;
  background: #e5e7eb;
}

.form-section > input,
.form-section textarea {
  width: 100%;
  border: 1px solid #dbe2ea;
  border-radius: 15px;
  outline: 0;
  background: #f8fafc;
  color: #0f172a;
  font: inherit;
}

.form-section > input {
  height: 47px;
  padding: 0 15px;
}

.form-section textarea {
  min-height: 260px;
  padding: 15px;
  resize: vertical;
  line-height: 1.65;
}

.form-section > input:focus,
.form-section textarea:focus,
.tag-input-wrapper:focus-within,
.password-input-wrapper:focus-within {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}

.form-section > input:disabled,
.form-section textarea:disabled,
.tag-input-wrapper input:disabled,
.password-input-wrapper input:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.tag-input-wrapper,
.password-input-wrapper {
  height: 47px;
  padding: 0 14px;
  border: 1px solid #dbe2ea;
  border-radius: 15px;
  background: #f8fafc;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tag-input-wrapper input,
.password-input-wrapper input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #0f172a;
  font: inherit;
}

.field-help-row {
  margin-top: 7px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  font-size: 10px;
}

.field-help-row p {
  margin: 0;
}

.field-help-row span {
  flex-shrink: 0;
}

.character-count {
  margin: 7px 0 0;
  color: #64748b;
  font-size: 11px;
  text-align: right;
}

.api-notice {
  margin: 24px 24px 0;
  padding: 14px;
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.api-notice strong {
  color: #1e3a8a;
  font-size: 12px;
}

.api-notice p {
  margin: 4px 0 0;
  color: #475569;
  font-size: 10px;
  line-height: 1.6;
}

.password-help {
  margin: 8px 0 0;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
}

.validation-message {
  margin: 17px 24px 0;
  padding: 11px 13px;
  border-radius: 10px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 12px;
  line-height: 1.6;
}

.form-actions {
  margin-top: 25px;
  padding: 17px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px;
}

.form-actions button {
  height: 51px;
  border-radius: 15px;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
}

.form-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.cancel-button {
  border: 1px solid #dbe2ea;
  background: #ffffff;
  color: #0f172a;
}

.submit-button {
  border: 0;
  background: #2563eb;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.submit-button:not(:disabled):hover {
  background: #1d4ed8;
}

.loading-icon {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .edit-container {
    padding: 24px 16px 56px;
  }

  .page-header h1 {
    font-size: 25px;
  }

  .form-section {
    padding-left: 18px;
    padding-right: 18px;
  }

  .divider,
  .api-notice {
    margin-left: 18px;
    margin-right: 18px;
  }

  .category-button {
    padding: 0 15px;
  }

  .form-actions {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>


