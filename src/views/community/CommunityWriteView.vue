<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  LockKeyhole,
  PenLine,
  ImagePlus,
  X,
  Upload,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

const categories = [
  { key: "restaurant", label: "맛집" },
  { key: "tour", label: "관광" },
  { key: "festival", label: "축제" },
  { key: "life", label: "생활" },
  { key: "question", label: "질문" },
];

const isEditMode = computed(() => route.name === "community-edit");

const selectedCategory = ref(
  typeof route.query.category === "string"
    ? route.query.category
    : "restaurant",
);

const title = ref(
  isEditMode.value
    ? "구미 인동 신규 라멘집 발견 🍜 강추합니다"
    : "",
);

const content = ref(
  isEditMode.value
    ? `인동 CGV 근처에 최근 오픈한 '멘야 하루카제'라는 라멘집을 다녀왔어요.

육수가 진하고 깔끔한데 느끼하지 않고, 면발도 탱탱해서 정말 맛있더라고요. 차슈가 두툼하게 올라가 있고 반숙 계란도 잘 절여져 있어요.

웨이팅이 평일 점심엔 30분, 주말엔 1시간 넘게 걸리는데 충분히 기다릴 가치가 있습니다.`
    : "",
);

const password = ref("");
const selectedImages = ref([]);
const fileInput = ref(null);
const validationMessage = ref("");

const titleLength = computed(() => title.value.length);
const contentLength = computed(() => content.value.length);

const openFilePicker = () => {
  fileInput.value?.click();
};

const handleFileChange = (event) => {
  const files = Array.from(event.target.files ?? []);
  const remainingCount = Math.max(0, 5 - selectedImages.value.length);

  files.slice(0, remainingCount).forEach((file) => {
    if (!file.type.startsWith("image/")) return;

    selectedImages.value.push({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    });
  });

  event.target.value = "";
};

const removeImage = (imageId) => {
  const target = selectedImages.value.find((image) => image.id === imageId);

  if (target) {
    URL.revokeObjectURL(target.previewUrl);
  }

  selectedImages.value = selectedImages.value.filter(
    (image) => image.id !== imageId,
  );
};

const formatFileSize = (size) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

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

const submitPost = () => {
  if (!validateForm()) return;

  const dummyPayload = {
    content_id: Number(route.params.id || 9),
    category: selectedCategory.value,
    title: title.value.trim(),
    content: content.value.trim(),
    password: password.value,
    image_files: selectedImages.value.map((image) => image.file),
  };

  console.log("전송 예정 데이터:", dummyPayload);

  window.alert(
    isEditMode.value
      ? "더미 데이터 기준으로 게시글이 수정되었습니다."
      : "더미 데이터 기준으로 게시글이 등록되었습니다.",
  );

  router.push({
    name: "community-detail",
    params: {
      category: selectedCategory.value,
      id: dummyPayload.content_id,
    },
  });
};

const cancel = () => {
  if (isEditMode.value && route.params.id) {
    router.push({
      name: "community-detail",
      params: {
        category: selectedCategory.value,
        id: route.params.id,
      },
    });
    return;
  }

  router.push({ name: "community" });
};

onBeforeUnmount(() => {
  selectedImages.value.forEach((image) => {
    URL.revokeObjectURL(image.previewUrl);
  });
});
</script>

<template>
  <main class="write-page">
    <div class="write-container">
      <button type="button" class="back-link" @click="cancel">
        <ArrowLeft :size="17" />
        커뮤니티로 돌아가기
      </button>

      <header class="page-header">
        <h1>{{ isEditMode ? "게시글 수정" : "글쓰기" }}</h1>
        <p>모든 게시글은 익명으로 작성됩니다</p>
      </header>

      <form class="write-card" @submit.prevent="submitPost">
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
                { active: selectedCategory === category.key },
              ]"
              @click="selectedCategory = category.key"
            >
              {{ category.label }}
            </button>
          </div>
        </section>

        <div class="divider"></div>

        <section class="form-section">
          <label for="post-title" class="field-label">
            제목
            <span>*</span>
          </label>

          <input
            id="post-title"
            v-model="title"
            type="text"
            maxlength="100"
            placeholder="제목을 입력해주세요 (5~100자)"
          />

          <p class="character-count">{{ titleLength }}/100</p>
        </section>

        <section class="form-section">
          <label for="post-content" class="field-label">
            내용
            <span>*</span>
          </label>

          <textarea
            id="post-content"
            v-model="content"
            maxlength="5000"
            placeholder="내용을 입력해주세요. 구체적인 정보일수록 다른 분들께 더 도움이 됩니다. (10자 이상)"
          ></textarea>

          <p class="character-count">{{ contentLength }}자</p>
        </section>

        <section class="form-section">
          <div class="image-title-row">
            <label class="field-label">이미지 첨부</label>
            <span>{{ selectedImages.length }}/5</span>
          </div>

          <input
            ref="fileInput"
            class="hidden-file-input"
            type="file"
            accept="image/*"
            multiple
            @change="handleFileChange"
          />

          <button
            type="button"
            class="image-upload-button"
            :disabled="selectedImages.length >= 5"
            @click="openFilePicker"
          >
            <ImagePlus :size="22" />
            <span>
              <strong>이미지 추가</strong>
              <small>JPG, PNG, WEBP · 최대 5개</small>
            </span>
          </button>

          <div v-if="selectedImages.length" class="image-preview-grid">
            <article
              v-for="image in selectedImages"
              :key="image.id"
              class="image-preview-card"
            >
              <img :src="image.previewUrl" :alt="image.name" />

              <button
                type="button"
                class="remove-image-button"
                aria-label="첨부 이미지 삭제"
                @click="removeImage(image.id)"
              >
                <X :size="15" />
              </button>

              <div class="image-info">
                <strong>{{ image.name }}</strong>
                <span>{{ formatFileSize(image.size) }}</span>
              </div>
            </article>
          </div>
        </section>

        <div class="divider"></div>

        <section class="form-section">
          <label for="post-password" class="field-label">
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
              placeholder="수정·삭제 시 사용할 비밀번호 (4자 이상)"
            />
          </div>

          <p class="password-help">
            <LockKeyhole :size="13" />
            비밀번호는 게시글 수정·삭제 시에만 사용됩니다.
          </p>
        </section>

        <p v-if="validationMessage" class="validation-message">
          {{ validationMessage }}
        </p>

        <footer class="form-actions">
          <button type="button" class="cancel-button" @click="cancel">
            취소
          </button>

          <button type="submit" class="submit-button">
            <PenLine :size="17" />
            {{ isEditMode ? "게시글 수정" : "게시글 등록" }}
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
.password-input-wrapper:focus-within {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}

.character-count {
  margin: 7px 0 0;
  color: #64748b;
  font-size: 11px;
  text-align: right;
}

.image-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.image-title-row > span {
  color: #64748b;
  font-size: 11px;
}

.hidden-file-input {
  display: none;
}

.image-upload-button {
  width: 100%;
  min-height: 82px;
  padding: 16px;
  border: 1px dashed #93c5fd;
  border-radius: 15px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  cursor: pointer;
}

.image-upload-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.image-upload-button span {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 3px;
}

.image-upload-button strong {
  font-size: 13px;
}

.image-upload-button small {
  color: #64748b;
  font-size: 10px;
}

.image-preview-grid {
  margin-top: 13px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 11px;
}

.image-preview-card {
  position: relative;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 13px;
  background: #ffffff;
}

.image-preview-card img {
  width: 100%;
  height: 110px;
  object-fit: cover;
  display: block;
}

.remove-image-button {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 27px;
  height: 27px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.72);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.image-info {
  min-width: 0;
  padding: 9px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.image-info strong {
  overflow: hidden;
  color: #0f172a;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-info span {
  color: #64748b;
  font-size: 9px;
}

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

.password-input-wrapper input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
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

.submit-button:hover {
  background: #1d4ed8;
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

  .divider {
    margin-left: 18px;
    margin-right: 18px;
  }

  .category-button {
    padding: 0 15px;
  }

  .image-preview-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-actions {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>
