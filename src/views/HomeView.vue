<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  MapPin,
  Search,
  Landmark,
  UtensilsCrossed,
  CalendarDays,
  MessageSquare,
  TrendingUp,
  Zap,
  Eye,
  Heart,
  ChevronRight,
  Send,
} from "lucide-vue-next";

const router = useRouter();
const searchKeyword = ref("");

const categories = [
  {
    key: "tour",
    title: "관광명소",
    englishTitle: "TOURIST SPOTS",
    count: 42,
    description: "금오산, 낙동강 등 구미의 숨겨진 보석 같은 명소들을 발견하세요.",
    icon: Landmark,
    color: "#00b894",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "restaurant",
    title: "맛집",
    englishTitle: "RESTAURANTS",
    count: 128,
    description: "현지인이 인정한 맛집부터 숨은 로컬 명소까지 다양한 식당 정보",
    icon: UtensilsCrossed,
    color: "#ff5722",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "festival",
    title: "축제 & 행사",
    englishTitle: "FESTIVALS",
    count: 23,
    description: "벚꽃 축제, 선산 5일장 등 구미에서 열리는 다양한 행사 일정",
    icon: CalendarDays,
    color: "#9333ea",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
  },
];

const recentPosts = [
  {
    id: 1,
    category: "restaurant",
    categoryLabel: "맛집",
    title: "구미 인동 신규 라멘집 발견 🍜 강추합니다",
    views: "847",
    likes: 124,
    comments: 34,
    date: "2026.07.13",
  },
  {
    id: 2,
    category: "tour",
    categoryLabel: "관광",
    notice: true,
    title: "금오산 등산 코스 완전 정복 가이드 (초보~중급)",
    views: "1.2K",
    likes: 287,
    comments: 62,
    date: "2026.07.12",
  },
  {
    id: 3,
    category: "festival",
    categoryLabel: "축제",
    title: "낙동강 벚꽃 축제 일정 공유해요 🌸",
    views: "2.2K",
    likes: 445,
    comments: 98,
    date: "2026.07.11",
  },
  {
    id: 4,
    category: "restaurant",
    categoryLabel: "맛집",
    title: "구미역 근처 공부하기 좋은 카페 모음",
    views: "934",
    likes: 167,
    comments: 45,
    date: "2026.07.10",
  },
];

const statistics = [
  {
    value: "2,400+",
    label: "등록 장소",
    icon: MapPin,
  },
  {
    value: "12K+",
    label: "커뮤니티 글",
    icon: MessageSquare,
  },
  {
    value: "84K",
    label: "월간 이용자",
    icon: TrendingUp,
  },
  {
    value: "147",
    label: "오늘 새 글",
    icon: Zap,
  },
];

const goToSearch = () => {
  const keyword = searchKeyword.value.trim();

  router.push({
    name: "community",
    query: keyword ? { keyword } : {},
  });
};

const goToCategory = (category) => {
  router.push(`/community/${category}`);
};

const goToPost = (post) => {
  router.push(`/community/${post.category}/${post.id}`);
};
</script>

<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-grid"></div>
      <div class="hero-glow"></div>

      <div class="hero-inner">
        <div class="partner-badge">
          <Send :size="13" />
          <span>경상북도 구미시 · 공식 파트너</span>
        </div>

        <h1>
          구미의 모든 것을<br />
          한 곳에서 만나세요
        </h1>

        <p class="hero-description">
          관광명소, 맛집, 축제 정보부터 이웃과의 소통까지.<br />
          구미를 더 풍성하게 즐기는 방법을 알려드릴게요.
        </p>

        <form class="search-box" @submit.prevent="goToSearch">
          <Search class="search-icon" :size="22" />

          <input
            v-model="searchKeyword"
            type="search"
            placeholder="장소, 맛집, 축제 이름으로 검색..."
            aria-label="지역 정보 검색"
          />

          <button type="submit">검색</button>
        </form>

        <div class="keyword-list">
          <button type="button" @click="searchKeyword = '금오산'">#금오산</button>
          <button type="button" @click="searchKeyword = '낙동강벚꽃'">
            #낙동강벚꽃
          </button>
          <button type="button" @click="searchKeyword = '인동맛집'">
            #인동맛집
          </button>
          <button type="button" @click="searchKeyword = '선산5일장'">
            #선산5일장
          </button>
          <button type="button" @click="searchKeyword = '구미야경'">
            #구미야경
          </button>
        </div>
      </div>
    </section>

    <!-- 통계 -->
    <section class="statistics">
      <div class="statistics-inner">
        <article
          v-for="statistic in statistics"
          :key="statistic.label"
          class="statistic-item"
        >
          <component
            :is="statistic.icon"
            :size="18"
            :stroke-width="2"
            aria-hidden="true"
          />

          <div>
            <strong>{{ statistic.value }}</strong>
            <span>{{ statistic.label }}</span>
          </div>
        </article>
      </div>
    </section>

    <!-- 메인 콘텐츠 -->
    <main class="home-content">
      <!-- 카테고리 -->
      <section class="content-section">
        <div class="section-heading">
          <div>
            <span class="section-eyebrow blue">EXPLORE</span>
            <h2>카테고리 탐색</h2>
          </div>

          <RouterLink to="/community" class="section-more">
            전체보기
            <ChevronRight :size="17" />
          </RouterLink>
        </div>

        <div class="category-grid">
          <article
            v-for="category in categories"
            :key="category.key"
            class="category-card"
            tabindex="0"
            role="button"
            @click="goToCategory(category.key)"
            @keydown.enter="goToCategory(category.key)"
          >
            <div
              class="category-image"
              :style="{ backgroundImage: `url(${category.image})` }"
            >
              <div class="category-overlay"></div>

              <span
                class="category-icon"
                :style="{ backgroundColor: category.color }"
              >
                <component :is="category.icon" :size="27" />
              </span>

              <span class="category-count">{{ category.count }}곳</span>

              <div class="category-title">
                <span>{{ category.englishTitle }}</span>
                <h3>{{ category.title }}</h3>
              </div>
            </div>

            <div class="category-content">
              <p>{{ category.description }}</p>

              <span class="category-detail" :style="{ color: category.color }">
                자세히 보기
                <ChevronRight :size="16" />
              </span>
            </div>
          </article>
        </div>
      </section>

      <!-- 최근 커뮤니티 글 -->
      <section class="content-section community-section">
        <div class="section-heading">
          <div>
            <span class="section-eyebrow orange">COMMUNITY</span>
            <h2>최근 커뮤니티 글</h2>
          </div>

          <RouterLink to="/community" class="section-more">
            전체보기
            <ChevronRight :size="17" />
          </RouterLink>
        </div>

        <div class="post-grid">
          <article
            v-for="post in recentPosts"
            :key="post.id"
            class="post-card"
            tabindex="0"
            role="button"
            @click="goToPost(post)"
            @keydown.enter="goToPost(post)"
          >
            <div class="post-main">
              <div class="post-tags">
                <span :class="['post-tag', `tag-${post.category}`]">
                  # {{ post.categoryLabel }}
                </span>

                <span v-if="post.notice" class="post-notice">
                  📌 공지
                </span>
              </div>

              <h3>{{ post.title }}</h3>

              <div class="post-meta">
                <span>
                  <Eye :size="13" />
                  {{ post.views }}
                </span>

                <span>
                  <Heart :size="13" />
                  {{ post.likes }}
                </span>

                <span>
                  <MessageSquare :size="13" />
                  {{ post.comments }}
                </span>
              </div>
            </div>

            <div class="post-side">
              <ChevronRight :size="20" />
              <time>{{ post.date }}</time>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  background: #f6f8fb;
}

/* Hero */
.hero {
  position: relative;
  min-height: 530px;
  overflow: hidden;
  color: #ffffff;
  background:
    linear-gradient(130deg, #1769f2 0%, #2864e8 52%, #343dcc 100%);
}

.hero-grid {
  position: absolute;
  inset: 0;
  opacity: 0.09;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px);
  background-size: 80px 80px;
}

.hero-glow {
  position: absolute;
  right: -100px;
  bottom: -180px;
  width: 660px;
  height: 660px;
  border-radius: 50%;
  background: rgba(46, 72, 207, 0.4);
  filter: blur(10px);
}

.hero-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 95px 24px 70px;
}

.partner-badge {
  width: fit-content;
  margin-bottom: 23px;
  padding: 7px 14px;
  border: 1px solid rgba(255, 255, 255, 0.27);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);

  display: flex;
  align-items: center;
  gap: 7px;

  font-size: 12px;
  font-weight: 700;
}

.hero h1 {
  margin: 0;
  font-size: clamp(42px, 5vw, 61px);
  line-height: 1.08;
  letter-spacing: -2.5px;
  font-weight: 900;
}

.hero-description {
  margin: 24px 0 32px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 18px;
  line-height: 1.65;
  font-weight: 500;
}

.search-box {
  width: min(100%, 515px);
  height: 54px;
  padding: 5px 5px 5px 17px;
  border-radius: 16px;
  background: #ffffff;

  display: flex;
  align-items: center;
  gap: 11px;
}

.search-icon {
  flex-shrink: 0;
  color: #64748b;
}

.search-box input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  color: #111827;
  font-size: 14px;
}

.search-box input::placeholder {
  color: #64748b;
}

.search-box button {
  height: 44px;
  padding: 0 20px;
  border: 0;
  border-radius: 14px;
  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.keyword-list {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-list button {
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.13);
  color: rgba(255, 255, 255, 0.82);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

/* 통계 */
.statistics {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.statistics-inner {
  max-width: 760px;
  margin: 0 auto;
  padding: 20px 24px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.statistic-item {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  color: #2563eb;
}

.statistic-item div {
  display: flex;
  flex-direction: column;
}

.statistic-item strong {
  font-size: 20px;
  line-height: 1;
  font-weight: 900;
}

.statistic-item span {
  margin-top: 7px;
  color: #64748b;
  font-size: 11px;
}

/* 콘텐츠 공통 */
.home-content {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 72px;
}

.content-section + .content-section {
  margin-top: 72px;
}

.section-heading {
  margin-bottom: 21px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.section-eyebrow {
  display: block;
  margin-bottom: 7px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.7px;
}

.section-eyebrow.blue {
  color: #2563eb;
}

.section-eyebrow.orange {
  color: #f97316;
}

.section-heading h2 {
  margin: 0;
  color: #0f172a;
  font-size: 24px;
  letter-spacing: -0.8px;
}

.section-more {
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

/* 카테고리 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 17px;
}

.category-card {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 17px;
  background: #ffffff;
  box-shadow: 0 2px 3px rgba(15, 23, 42, 0.09);
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.13);
}

.category-image {
  position: relative;
  height: 194px;
  background-position: center;
  background-size: cover;
}

.category-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.76),
    rgba(0, 0, 0, 0.05) 65%
  );
}

.category-icon {
  position: absolute;
  top: 13px;
  left: 13px;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;
}

.category-count {
  position: absolute;
  top: 13px;
  right: 13px;
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.65);
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
}

.category-title {
  position: absolute;
  left: 15px;
  bottom: 16px;
  color: #ffffff;
}

.category-title span {
  font-size: 10px;
  font-weight: 700;
}

.category-title h3 {
  margin: 5px 0 0;
  font-size: 18px;
}

.category-content {
  padding: 17px 15px 18px;
}

.category-content p {
  min-height: 40px;
  margin: 0 0 15px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.65;
}

.category-detail {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: 800;
}

/* 최근 커뮤니티 */
.community-section {
  /* 인기 관광 명소가 제거되어 카테고리 바로 아래에 배치 */
  margin-top: 64px !important;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 13px;
}

.post-card {
  min-height: 103px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 17px;
  background: #ffffff;

  display: flex;
  justify-content: space-between;
  gap: 16px;

  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
}

.post-main {
  min-width: 0;
}

.post-tags {
  display: flex;
  gap: 7px;
  margin-bottom: 9px;
}

.post-tag,
.post-notice {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.tag-restaurant {
  color: #f97316;
  background: #fff7ed;
  border: 1px solid #fed7aa;
}

.tag-tour {
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
}

.tag-festival {
  color: #9333ea;
  background: #faf5ff;
  border: 1px solid #e9d5ff;
}

.post-notice {
  color: #2563eb;
  background: #eff6ff;
}

.post-card h3 {
  overflow: hidden;
  margin: 0 0 10px;
  color: #111827;
  font-size: 14px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-meta {
  display: flex;
  gap: 10px;
  color: #64748b;
  font-size: 11px;
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 3px;
}

.post-side {
  flex-shrink: 0;
  color: #64748b;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.post-side time {
  font-size: 10px;
}

@media (max-width: 800px) {
  .category-grid {
    grid-template-columns: 1fr;
  }

  .category-image {
    height: 230px;
  }

  .post-grid {
    grid-template-columns: 1fr;
  }

  .statistics-inner {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .hero {
    min-height: 500px;
  }

  .hero-inner {
    padding: 70px 18px 55px;
  }

  .hero h1 {
    font-size: 39px;
  }

  .hero-description {
    font-size: 15px;
  }

  .search-box button {
    padding: 0 16px;
  }

  .statistics-inner {
    gap: 22px 12px;
  }

  .statistic-item {
    justify-content: flex-start;
  }

  .home-content {
    padding: 38px 18px 56px;
  }

  .section-heading h2 {
    font-size: 21px;
  }

  .category-image {
    height: 200px;
  }

  .post-card {
    min-height: 112px;
  }
}
</style>