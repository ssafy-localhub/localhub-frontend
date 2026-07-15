<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowLeft,
  LockKeyhole,
  PenLine,
  Tag,
  Loader2,
  AlertCircle,
} from "lucide-vue-next";

import { createPost } from "@/api/community";

const router = useRouter();

const categories = [
  { key: "restaurant", label: "맛집" },
  { key: "tour", label: "관광" },
  { key: "festival", label: "축제" },
  { key: "life", label: "생활" },
  { key: "question", label: "질문" },
];

const selectedCategory = ref("restaurant");
const title = ref("");
const content = ref("");
const tag = ref("");
const password = ref("");

const validationMessage = ref("");
const isSubmitting = ref(false);

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
    validationMessage.value = "비밀번호를 4자 이상 입력해주세요.";
    return false;
  }

  validationMessage.value = "";
  return true;
};

const getApiErrorMessage = (error) => {
  const status = error.response?.status;
  const detail = error.response?.data?.detail;

  if (!error.response) {
    return "백엔드 서버에 연결할 수 없습니다. FastAPI 실행 상태를 확인해주세요.";
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

  return "게시글 등록 중 오류가 발생했습니다.";
};

const submitPost = async () => {
  if (!validateForm() || isSubmitting.value) return;

  isSubmitting.value = true;
  validationMessage.value = "";

  try {
    const result = await createPost({
      title: title.value.trim(),
      content: content.value.trim(),
      category: selectedCategory.value,
      tag: tag.value.trim() || null,
      password: password.value,
    });

    window.alert(result.message || "게시글이 등록되었습니다.");

    /*
     * 백엔드 응답:
     * {
     *   id: number,
     *   message: string
     * }
     *
     * 상세 페이지 작업이 끝난 경우 해당 게시글 상세로 이동합니다.
     */
    if (result.id) {
      await router.push({
        name: "community-detail",
        params: {
          category: selectedCategory.value,
          id: result.id,
        },
      });
      return;
    }

    await router.push({ name: "community" });
  } catch (error) {
    console.error("게시글 등록 실패:", error);
    validationMessage.value = getApiErrorMessage(error);
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => {
  router.push({ name: "community" });
};
</script>

<template>
  <main class="write-page">
    <div class="write-container">
      <button
        type="button"
        class="back-link"
        @click="cancel"
      >
        <ArrowLeft :size="17" />
        커뮤니티로 돌아가기
      </button>

      <header class="page-header">
        <h1>글쓰기</h1>
        <p>모든 게시글은 익명으로 작성됩니다</p>
      </header>

      <form
        class="write-card"
        @submit.prevent="submitPost"
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
          <label for="post-tag" class="field-label">
            태그
          </label>

          <div class="tag-input-wrapper">
            <Tag :size="18" />

            <input
              id="post-tag"
              v-model="tag"
              type="text"
              maxlength="100"
              :disabled="isSubmitting"
              placeholder="예: 구미 인동 라멘 주차"
            />
          </div>

          <div class="field-help-row">
            <p>
              검색에 사용할 키워드를 띄어쓰기로 구분해 입력하세요.
            </p>
            <span>{{ tagLength }}/100</span>
          </div>
        </section>

        <div class="divider"></div>

        <section class="form-section">
          <label
            for="post-title"
            class="field-label"
          >
            제목
            <span>*</span>
          </label>

          <input
            id="post-title"
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
            for="post-content"
            class="field-label"
          >
            내용
            <span>*</span>
          </label>

          <textarea
            id="post-content"
            v-model="content"
            maxlength="5000"
            :disabled="isSubmitting"
            placeholder="내용을 입력해주세요. 구체적인 정보일수록 다른 분들께 더 도움이 됩니다. (10자 이상)"
          ></textarea>

          <p class="character-count">
            {{ contentLength }}/5000
          </p>
        </section>

        <section class="api-notice">
          <AlertCircle :size="17" />

          <div>
            <strong>이미지 첨부는 현재 제외되어 있습니다.</strong>
            <p>
              1차 API 통합 테스트에서는 백엔드의 JSON 요청 형식에 맞춰
              제목, 내용, 카테고리, 태그, 비밀번호만 전송합니다.
            </p>
          </div>
        </section>

        <div class="divider"></div>

        <section class="form-section">
          <label
            for="post-password"
            class="field-label"
          >
            비밀번호
            <span>*</span>
          </label>

          <div class="password-input-wrapper">
            <LockKeyhole :size="18" />

            <input
              id="post-password"
              v-model="password"
              type="password"
              minlength="4"
              maxlength="100"
              :disabled="isSubmitting"
              placeholder="수정·삭제 시 사용할 비밀번호 (4자 이상)"
            />
          </div>

          <p class="password-help">
            <LockKeyhole :size="13" />
            비밀번호는 게시글 수정·삭제 시에만 사용됩니다.
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
            <PenLine v-else :size="17" />

            {{
              isSubmitting
                ? "등록 중..."
                : "게시글 등록"
            }}
          </button>
        </footer>
      </form>
    </div>
  </main>
</template>

<style scoped>
.write-page {
  min-height: 100vh;
  background: #f6f8fb;
}

.write-container {
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

.write-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.07);
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
  min-height: 230px;
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
  box-shadow: 0 3px 7px rgba(37, 99, 235, 0.22);
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
  .write-container {
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
