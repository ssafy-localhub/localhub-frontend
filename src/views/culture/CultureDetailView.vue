<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ChevronRight,
  Clock3,
  Eye,
  Heart,
  MessageSquare,
  MapPin,
  Phone,
  Globe2,
  Navigation,
  ImageIcon,
  Send,
  UserRound,
  ChevronLeft,
  ArrowLeft,
  CalendarDays,
} from "lucide-vue-next";

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

/*
  공공데이터 기반 더미 상세 데이터입니다.
  추후 FastAPI 연동 시 GET /api/culture/:contentId 응답으로 교체하면 됩니다.
*/
const culture = ref({
  contentid: String(props.id || route.params.id || "3035970"),
  contenttypeid: "12",
  category: props.category || route.params.category || "leisure",
  category_label: "레포츠",
  title: "구미낙동강체육공원",
  addr1: "경상북도 구미시 낙동제방길 200",
  addr2: "(양호동)",
  zipcode: "39193",
  tel: "",
  homepage: "",
  mapx: "128.3677035180",
  mapy: "36.1376514681",
  firstimage:
    "https://tong.visitkorea.or.kr/cms/resource/71/4067671_image2_1.jpg",
  firstimage2:
    "https://tong.visitkorea.or.kr/cms/resource/71/4067671_image3_1.jpg",
  createdtime: "20231110120822",
  modifiedtime: "20260610113357",
  views: 2300,
  like_count: 421,
  comment_count: 7,
  overview: [
    "구미낙동강체육공원은 낙동강변을 따라 조성된 구미의 대표적인 여가·체육 공간입니다. 넓은 잔디광장과 산책로, 자전거길이 마련되어 있어 시민과 관광객 모두 편하게 이용할 수 있습니다.",
    "축구장, 야구장, 농구장 등 다양한 체육시설과 계절별 행사 공간이 함께 구성되어 있으며, 가족 단위 나들이와 가벼운 운동 장소로도 인기가 높습니다.",
    "공원 방문 전 행사 일정과 일부 시설의 운영 여부를 확인하는 것을 권장합니다.",
  ],
  info_items: [
    { label: "주소", value: "경상북도 구미시 낙동제방길 200 (양호동)" },
    { label: "우편번호", value: "39193" },
    { label: "전화번호", value: "제공된 정보 없음" },
    { label: "이용시간", value: "상시 이용 가능 · 시설별 상이" },
    { label: "주차", value: "공원 내 주차장 이용 가능" },
    { label: "좌표", value: "위도 36.137651 · 경도 128.367704" },
  ],
});

const comments = ref([
  {
    comment_id: 1,
    culture_content_id: culture.value.contentid,
    author: "익명",
    content: "산책로가 넓고 자전거 타기 좋아요. 해질 무렵 풍경도 예쁩니다 😊",
    like_count: 12,
    created_at: "2026-07-13T15:10:00",
  },
  {
    comment_id: 2,
    culture_content_id: culture.value.contentid,
    author: "익명",
    content: "주말에는 사람이 많지만 주차 공간은 생각보다 넉넉했어요.",
    like_count: 8,
    created_at: "2026-07-13T16:20:00",
  },
  {
    comment_id: 3,
    culture_content_id: culture.value.contentid,
    author: "익명",
    content: "아이들과 공놀이하기 좋은 장소인지 궁금합니다.",
    like_count: 3,
    created_at: "2026-07-14T09:05:00",
  },
  {
    comment_id: 4,
    culture_content_id: culture.value.contentid,
    author: "익명",
    content: "잔디광장이 넓어서 가족 단위로 방문하기 괜찮았습니다.",
    like_count: 5,
    created_at: "2026-07-14T09:40:00",
  },
  {
    comment_id: 5,
    culture_content_id: culture.value.contentid,
    author: "익명",
    content: "행사 있는 날에는 주변 도로가 조금 붐빌 수 있어요.",
    like_count: 7,
    created_at: "2026-07-14T10:15:00",
  },
  {
    comment_id: 6,
    culture_content_id: culture.value.contentid,
    author: "익명",
    content: "자전거 코스가 잘 연결돼 있어서 다시 가고 싶어요.",
    like_count: 4,
    created_at: "2026-07-14T11:00:00",
  },
  {
    comment_id: 7,
    culture_content_id: culture.value.contentid,
    author: "익명",
    content: "공원 근처 편의시설 정보도 추가되면 좋겠습니다.",
    like_count: 6,
    created_at: "2026-07-14T11:30:00",
  },
]);

const commentText = ref("");
const currentCommentPage = ref(1);
const likedCulture = ref(false);

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

const fullAddress = computed(() =>
  [culture.value.addr1, culture.value.addr2].filter(Boolean).join(" "),
);

const formatDate = (dateTime) => {
  if (!dateTime) return "";

  if (/^\d{14}$/.test(dateTime)) {
    return `${dateTime.slice(0, 4)}.${dateTime.slice(4, 6)}.${dateTime.slice(6, 8)}`;
  }

  return dateTime.slice(0, 10).replaceAll("-", ".");
};

const formatNumber = (value) => {
  if (value >= 1000) {
    const converted = value / 1000;
    return `${Number.isInteger(converted) ? converted : converted.toFixed(1)}K`;
  }

  return value.toLocaleString("ko-KR");
};

const submitComment = () => {
  const trimmedText = commentText.value.trim();
  if (!trimmedText) return;

  const nextId =
    Math.max(0, ...comments.value.map((comment) => comment.comment_id)) + 1;

  comments.value.unshift({
    comment_id: nextId,
    culture_content_id: culture.value.contentid,
    author: "익명",
    content: trimmedText,
    like_count: 0,
    created_at: new Date().toISOString(),
  });

  culture.value.comment_count = comments.value.length;
  commentText.value = "";
  currentCommentPage.value = 1;
};

const toggleCultureLike = () => {
  likedCulture.value = !likedCulture.value;
  culture.value.like_count += likedCulture.value ? 1 : -1;
};

const likeComment = (comment) => {
  comment.like_count += 1;
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
  router.push({ name: "culture" });
};

const openMap = () => {
  const query = encodeURIComponent(fullAddress.value || culture.value.title);
  window.open(`https://map.kakao.com/?q=${query}`, "_blank", "noopener");
};
</script>

<template>
  <main class="culture-detail-page">
    <div class="detail-container">
      <nav class="breadcrumb" aria-label="현재 위치">
        <RouterLink to="/">홈</RouterLink>
        <ChevronRight :size="15" />
        <RouterLink to="/culture">문화</RouterLink>
        <ChevronRight :size="15" />
        <span>{{ culture.title }}</span>
      </nav>

      <article class="culture-card">
        <header class="culture-header">
          <span
            :class="[
              'category-tag',
              `category-${culture.category}`,
            ]"
          >
            # {{ culture.category_label }}
          </span>

          <h1>{{ culture.title }}</h1>

          <div class="culture-meta">
            <span>
              <Clock3 :size="15" />
              {{ formatDate(culture.modifiedtime) }}
            </span>

            <span>
              <Eye :size="15" />
              {{ formatNumber(culture.views) }}
            </span>

            <span>
              <Heart :size="15" />
              {{ formatNumber(culture.like_count) }}
            </span>
          </div>
        </header>

        <figure class="main-image">
          <img :src="culture.firstimage" :alt="culture.title" />
          <figcaption>
            <ImageIcon :size="14" />
            대표 이미지
          </figcaption>
        </figure>

        <section class="culture-body">
          <div class="overview">
            <p
              v-for="(paragraph, index) in culture.overview"
              :key="index"
            >
              {{ paragraph }}
            </p>
          </div>

          <section class="information-section">
            <h2>상세 정보</h2>

            <dl class="information-grid">
              <div
                v-for="item in culture.info_items"
                :key="item.label"
                class="information-item"
              >
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            </dl>
          </section>

          <section class="location-section">
            <div class="location-heading">
              <div>
                <span>LOCATION</span>
                <h2>위치 정보</h2>
              </div>

              <button type="button" @click="openMap">
                <Navigation :size="16" />
                지도에서 보기
              </button>
            </div>

            <div class="location-card">
              <MapPin :size="22" />
              <div>
                <strong>{{ culture.title }}</strong>
                <p>{{ fullAddress }}</p>
                <small>
                  {{ culture.mapy }}, {{ culture.mapx }}
                </small>
              </div>
            </div>
          </section>

          <figure v-if="culture.firstimage2" class="sub-image">
            <img :src="culture.firstimage2" :alt="`${culture.title} 추가 이미지`" />
          </figure>

          <section class="source-notice">
            <Globe2 :size="17" />
            <div>
              <strong>공공데이터 기반 관광 정보</strong>
              <p>
                실제 운영시간과 시설 이용 정보는 현장 사정에 따라 변경될 수 있습니다.
              </p>
            </div>
          </section>
        </section>

        <footer class="culture-footer">
          <button
            type="button"
            :class="['like-button', { active: likedCulture }]"
            @click="toggleCultureLike"
          >
            <Heart
              :size="18"
              :fill="likedCulture ? 'currentColor' : 'none'"
            />
            {{ formatNumber(culture.like_count) }}
          </button>

          <span>
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

        <form
          class="comment-form"
          @submit.prevent="submitComment"
        >
          <textarea
            v-model="commentText"
            maxlength="500"
            placeholder="이 장소에 대한 방문 후기나 유용한 정보를 남겨주세요 💙"
            aria-label="댓글 내용"
          ></textarea>

          <div class="comment-form-bottom">
            <span>익명으로 작성됩니다</span>

            <button
              type="submit"
              :disabled="!commentText.trim()"
            >
              <Send :size="16" />
              등록
            </button>
          </div>
        </form>

        <div class="comment-list">
          <article
            v-for="comment in paginatedComments"
            :key="comment.comment_id"
            class="comment-card"
          >
            <span class="comment-avatar">
              <UserRound :size="15" />
            </span>

            <div class="comment-main">
              <div class="comment-header">
                <strong>{{ comment.author }}</strong>
                <time>{{ formatDate(comment.created_at) }}</time>
              </div>

              <p>{{ comment.content }}</p>

              <button
                type="button"
                class="comment-like"
                @click="likeComment(comment)"
              >
                <Heart :size="14" />
                {{ comment.like_count }}
              </button>
            </div>
          </article>
        </div>

        <nav
          v-if="totalCommentPages > 1"
          class="comment-pagination"
          aria-label="댓글 페이지 이동"
        >
          <button
            type="button"
            :disabled="currentCommentPage === 1"
            aria-label="이전 댓글 페이지"
            @click="goToCommentPage(currentCommentPage - 1)"
          >
            <ChevronLeft :size="17" />
          </button>

          <button
            v-for="pageNumber in commentPageNumbers"
            :key="pageNumber"
            type="button"
            :class="{ active: currentCommentPage === pageNumber }"
            @click="goToCommentPage(pageNumber)"
          >
            {{ pageNumber }}
          </button>

          <button
            type="button"
            :disabled="currentCommentPage === totalCommentPages"
            aria-label="다음 댓글 페이지"
            @click="goToCommentPage(currentCommentPage + 1)"
          >
            <ChevronRight :size="17" />
          </button>
        </nav>
      </section>

      <button
        type="button"
        class="back-button"
        @click="goBackToList"
      >
        <ArrowLeft :size="17" />
        목록으로
      </button>
    </div>
  </main>
</template>

<style scoped>
.culture-detail-page {
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

.culture-card,
.comment-section {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.06);
}

.culture-header {
  padding: 28px 26px 21px;
}

.category-tag {
  display: inline-flex;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.category-leisure {
  color: #0284c7;
  background: #ecfeff;
  border: 1px solid #a5f3fc;
}

.category-tour {
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
}

.category-culture {
  color: #d946ef;
  background: #fdf4ff;
  border: 1px solid #f5d0fe;
}

.culture-header h1 {
  margin: 17px 0 16px;
  color: #0f172a;
  font-size: 27px;
  line-height: 1.35;
  font-weight: 900;
  letter-spacing: -1px;
}

.culture-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  color: #64748b;
  font-size: 12px;
}

.culture-meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.main-image {
  position: relative;
  height: 360px;
  margin: 0;
  overflow: hidden;
  background: #e2e8f0;
}

.main-image img,
.sub-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.main-image figcaption {
  position: absolute;
  right: 14px;
  bottom: 13px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.7);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
}

.culture-body {
  padding: 30px 26px;
}

.overview {
  color: #0f172a;
  font-size: 14px;
  line-height: 1.95;
}

.overview p {
  margin: 0 0 21px;
}

.information-section,
.location-section {
  margin-top: 32px;
}

.information-section h2,
.location-heading h2 {
  margin: 0;
  color: #0f172a;
  font-size: 19px;
  font-weight: 900;
}

.information-grid {
  margin: 17px 0 0;
  border-top: 1px solid #e2e8f0;
}

.information-item {
  min-height: 54px;
  padding: 13px 0;
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 16px;
  align-items: center;
}

.information-item dt {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.information-item dd {
  margin: 0;
  color: #0f172a;
  font-size: 13px;
  line-height: 1.6;
}

.location-heading {
  margin-bottom: 14px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.location-heading span {
  display: block;
  margin-bottom: 5px;
  color: #2563eb;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.7px;
}

.location-heading button {
  height: 36px;
  padding: 0 13px;
  border: 1px solid #bfdbfe;
  border-radius: 11px;
  background: #eff6ff;
  color: #2563eb;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.location-card {
  padding: 17px;
  border: 1px solid #dbeafe;
  border-radius: 15px;
  background: #f8fbff;
  color: #2563eb;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.location-card div {
  min-width: 0;
}

.location-card strong {
  color: #0f172a;
  font-size: 13px;
}

.location-card p {
  margin: 5px 0;
  color: #475569;
  font-size: 12px;
}

.location-card small {
  color: #94a3b8;
  font-size: 10px;
}

.sub-image {
  height: 300px;
  margin: 30px 0 0;
  overflow: hidden;
  border-radius: 16px;
  background: #e2e8f0;
}

.source-notice {
  margin-top: 24px;
  padding: 15px;
  border-radius: 14px;
  background: #f8fafc;
  color: #2563eb;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.source-notice strong {
  color: #334155;
  font-size: 12px;
}

.source-notice p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 10px;
  line-height: 1.5;
}

.culture-footer {
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

.culture-footer > span {
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
  width: 100%;
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
  flex-shrink: 0;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

@media (max-width: 640px) {
  .detail-container {
    padding: 25px 16px 56px;
  }

  .culture-header,
  .culture-body,
  .culture-footer,
  .comment-section {
    padding-left: 18px;
    padding-right: 18px;
  }

  .culture-header h1 {
    font-size: 22px;
  }

  .main-image {
    height: 260px;
  }

  .sub-image {
    height: 220px;
  }

  .information-item {
    grid-template-columns: 82px 1fr;
  }

  .location-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .location-heading button {
    align-self: flex-end;
  }
}
</style>
