<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Search,
  Filter,
  Eye,
  Heart,
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

const ITEMS_PER_PAGE = 6;

const categories = [
  { key: "all", label: "전체" },
  { key: "tour", label: "관광지" },
  { key: "leisure", label: "레포츠" },
  { key: "culture", label: "문화시설" },
  { key: "shopping", label: "쇼핑" },
  { key: "stay", label: "숙박" },
  { key: "course", label: "여행코스" },
  { key: "restaurant", label: "음식점" },
  { key: "festival", label: "축제공연행사" },
];

const contents = ref([
  {
    content_id: 1,
    category: "tour",
    category_label: "관광지",
    title: "금오산 도립공원 — 구미의 상징 명산",
    description:
      "케이블카, 도선굴, 마애불 등 볼거리 가득한 구미의 대표 명산입니다.",
    image_url:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    views: 4800,
    like_count: 892,
    comment_count: 134,
    created_at: "2025-07-10T09:00:00",
  },
  {
    content_id: 2,
    category: "leisure",
    category_label: "레포츠",
    title: "낙동강 체육공원 카약 & 래프팅",
    description:
      "낙동강변에서 즐기는 카약, 래프팅, 자전거 등 다양한 수상·육상 레포츠 체험.",
    image_url:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=80",
    views: 2300,
    like_count: 421,
    comment_count: 67,
    created_at: "2025-07-09T10:30:00",
  },
  {
    content_id: 3,
    category: "culture",
    category_label: "문화시설",
    title: "구미 문화예술회관 — 문화의 중심",
    description:
      "클래식 콘서트, 연극, 뮤지컬 등 다양한 공연이 열리는 구미 최대 공연장.",
    image_url:
      "https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=900&q=80",
    views: 1900,
    like_count: 302,
    comment_count: 43,
    created_at: "2025-07-08T14:20:00",
  },
  {
    content_id: 4,
    category: "shopping",
    category_label: "쇼핑",
    title: "구미 인동 로데오 쇼핑 거리",
    description:
      "구미 최대 번화가 인동 로데오 거리. 패션, 뷰티, 음식 등 트렌디한 쇼핑 명소.",
    image_url:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    views: 3100,
    like_count: 512,
    comment_count: 88,
    created_at: "2025-07-07T17:40:00",
  },
  {
    content_id: 5,
    category: "stay",
    category_label: "숙박",
    title: "금오산 케이블카 숙박 패키지",
    description:
      "금오산 자락의 펜션·리조트 모음. 자연 속에서 즐기는 특별한 하루.",
    image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    views: 1500,
    like_count: 278,
    comment_count: 52,
    created_at: "2025-07-06T11:10:00",
  },
  {
    content_id: 6,
    category: "course",
    category_label: "여행코스",
    title: "구미 당일치기 여행 코스 추천",
    description:
      "외지인도 쉽게 따라하는 구미 당일치기 최적 코스 3선.",
    image_url:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    views: 5200,
    like_count: 1000,
    comment_count: 201,
    created_at: "2025-07-05T08:50:00",
  },
  {
    content_id: 7,
    category: "restaurant",
    category_label: "음식점",
    title: "구미 원평동 현지인 추천 맛집",
    description:
      "현지인이 자주 찾는 한식, 국밥, 분식 맛집을 한 번에 소개합니다.",
    image_url:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
    views: 2700,
    like_count: 486,
    comment_count: 76,
    created_at: "2025-07-04T12:25:00",
  },
  {
    content_id: 8,
    category: "festival",
    category_label: "축제공연행사",
    title: "구미 여름 축제 & 공연 일정",
    description:
      "여름밤을 채우는 지역 축제와 공연 일정을 정리했습니다.",
    image_url:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
    views: 3600,
    like_count: 744,
    comment_count: 121,
    created_at: "2025-07-03T18:00:00",
  },
]);

const searchInput = ref(
  typeof route.query.keyword === "string" ? route.query.keyword : "",
);
const appliedKeyword = ref(searchInput.value.trim());
const selectedCategory = ref(
  typeof route.params.category === "string" ? route.params.category : "all",
);
const selectedSort = ref("latest");
const currentPage = ref(1);

const filteredContents = computed(() => {
  const keyword = appliedKeyword.value.toLowerCase();

  let result = contents.value.filter((item) => {
    const matchesCategory =
      selectedCategory.value === "all" ||
      item.category === selectedCategory.value;

    const searchableText =
      `${item.title} ${item.description}`.toLowerCase();

    const matchesKeyword =
      !keyword || searchableText.includes(keyword);

    return matchesCategory && matchesKeyword;
  });

  if (selectedSort.value === "popular") {
    return [...result].sort((a, b) => b.views - a.views);
  }

  return [...result].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );
});

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(filteredContents.value.length / ITEMS_PER_PAGE),
  ),
);

const paginatedContents = computed(() => {
  const startIndex = (currentPage.value - 1) * ITEMS_PER_PAGE;

  return filteredContents.value.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
});

const pageNumbers = computed(() =>
  Array.from({ length: totalPages.value }, (_, index) => index + 1),
);

const formatNumber = (value) => {
  if (value >= 1000) {
    const converted = value / 1000;
    return `${Number.isInteger(converted) ? converted : converted.toFixed(1)}K`;
  }

  return value.toLocaleString("ko-KR");
};

const formatDate = (dateTime) => {
  if (!dateTime) return "";
  return dateTime.slice(0, 10).replaceAll("-", ".");
};

const submitSearch = () => {
  appliedKeyword.value = searchInput.value.trim();
  currentPage.value = 1;

  router.replace({
    query: appliedKeyword.value
      ? { keyword: appliedKeyword.value }
      : {},
  });
};

const selectCategory = (categoryKey) => {
  selectedCategory.value = categoryKey;
  currentPage.value = 1;

  const query = appliedKeyword.value
    ? { keyword: appliedKeyword.value }
    : {};

  if (categoryKey === "all") {
    router.push({ path: "/culture", query });
    return;
  }

  router.push({
    path: `/culture/${categoryKey}`,
    query,
  });
};

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPages.value) return;

  currentPage.value = pageNumber;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const goToDetail = (item) => {
  router.push(`/culture/${item.category}/${item.content_id}`);
};

watch(
  () => route.params.category,
  (category) => {
    selectedCategory.value =
      typeof category === "string" ? category : "all";
    currentPage.value = 1;
  },
);

watch(
  () => route.query.keyword,
  (keyword) => {
    const nextKeyword = typeof keyword === "string" ? keyword : "";
    searchInput.value = nextKeyword;
    appliedKeyword.value = nextKeyword.trim();
    currentPage.value = 1;
  },
);

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount;
  }
});
</script>

<template>
  <main class="culture-page">
    <div class="culture-container">
      <header class="page-header">
        <h1>문화</h1>
        <p>구미의 관광지, 레포츠, 문화시설, 행사 정보</p>
      </header>

      <section class="filter-panel">
        <form class="search-form" @submit.prevent="submitSearch">
          <div class="search-input-wrapper">
            <Search class="search-icon" :size="20" />

            <input
              v-model="searchInput"
              type="search"
              placeholder="장소, 행사 이름으로 검색..."
              aria-label="문화 콘텐츠 검색"
            />
          </div>

          <button type="submit" class="search-button">
            검색
          </button>
        </form>

        <div class="filter-row">
          <div class="category-filter">
            <Filter :size="17" class="filter-icon" />

            <button
              v-for="category in categories"
              :key="category.key"
              type="button"
              :class="[
                'category-button',
                { active: selectedCategory === category.key },
              ]"
              @click="selectCategory(category.key)"
            >
              {{ category.label }}
            </button>
          </div>

          <div class="sort-wrapper">
            <select
              v-model="selectedSort"
              aria-label="문화 콘텐츠 정렬"
              @change="currentPage = 1"
            >
              <option value="latest">최신순</option>
              <option value="popular">조회순</option>
            </select>

            <ChevronDown :size="16" class="sort-icon" />
          </div>
        </div>
      </section>

      <p class="content-count">
        총 <strong>{{ filteredContents.length }}</strong>개의 콘텐츠
      </p>

      <section
        v-if="paginatedContents.length"
        class="culture-grid"
      >
        <article
          v-for="item in paginatedContents"
          :key="item.content_id"
          class="culture-card"
          tabindex="0"
          role="button"
          @click="goToDetail(item)"
          @keydown.enter="goToDetail(item)"
        >
          <div class="image-area">
            <img :src="item.image_url" :alt="item.title" />

            <span
              :class="[
                'category-tag',
                `category-${item.category}`,
              ]"
            >
              # {{ item.category_label }}
            </span>

            <div class="image-stats">
              <span>
                <Eye :size="13" />
                {{ formatNumber(item.views) }}
              </span>

              <span>
                <Heart :size="13" />
                {{ formatNumber(item.like_count) }}
              </span>
            </div>
          </div>

          <div class="card-content">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>

            <footer class="card-footer">
              <time>{{ formatDate(item.created_at) }}</time>

              <span>
                <MessageSquare :size="13" />
                {{ item.comment_count }}
              </span>
            </footer>
          </div>
        </article>
      </section>

      <section v-else class="empty-state">
        <Search :size="36" />
        <h2>검색 결과가 없습니다.</h2>
        <p>다른 검색어나 카테고리를 선택해보세요.</p>
      </section>

      <nav
        v-if="totalPages > 1"
        class="pagination"
        aria-label="문화 콘텐츠 페이지 이동"
      >
        <button
          type="button"
          class="pagination-arrow"
          :disabled="currentPage === 1"
          aria-label="이전 페이지"
          @click="goToPage(currentPage - 1)"
        >
          <ChevronLeft :size="18" />
        </button>

        <button
          v-for="pageNumber in pageNumbers"
          :key="pageNumber"
          type="button"
          :class="[
            'pagination-number',
            { active: currentPage === pageNumber },
          ]"
          @click="goToPage(pageNumber)"
        >
          {{ pageNumber }}
        </button>

        <button
          type="button"
          class="pagination-arrow"
          :disabled="currentPage === totalPages"
          aria-label="다음 페이지"
          @click="goToPage(currentPage + 1)"
        >
          <ChevronRight :size="18" />
        </button>
      </nav>
    </div>
  </main>
</template>

<style scoped>
.culture-page {
  min-height: 100vh;
  background: #f6f8fb;
}

.culture-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 34px 24px 72px;
}

.page-header {
  margin-bottom: 25px;
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

.filter-panel {
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
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-icon,
.filter-icon {
  flex-shrink: 0;
  color: #64748b;
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

.filter-row {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.category-filter {
  min-width: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
}

.category-button {
  height: 30px;
  padding: 0 13px;
  border: 0;
  border-radius: 999px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.category-button:hover {
  color: #2563eb;
  background: #eff6ff;
}

.category-button.active {
  color: #ffffff;
  background: #2563eb;
  box-shadow: 0 2px 5px rgba(37, 99, 235, 0.2);
}

.sort-wrapper {
  position: relative;
  flex-shrink: 0;
}

.sort-wrapper select {
  height: 34px;
  padding: 0 36px 0 14px;
  border: 1px solid #e2e8f0;
  border-radius: 13px;
  outline: 0;
  appearance: none;
  background: #ffffff;
  color: #0f172a;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.sort-icon {
  position: absolute;
  top: 50%;
  right: 11px;
  color: #64748b;
  pointer-events: none;
  transform: translateY(-50%);
}

.content-count {
  margin: 25px 3px 14px;
  color: #64748b;
  font-size: 12px;
}

.content-count strong {
  color: #0f172a;
}

.culture-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 17px;
}

.culture-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  background: #ffffff;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.culture-card:hover {
  border-color: #bfdbfe;
  transform: translateY(-3px);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.09);
}

.image-area {
  position: relative;
  height: 192px;
  overflow: hidden;
  background: #e2e8f0;
}

.image-area::after {
  position: absolute;
  inset: 45% 0 0;
  content: "";
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(15, 23, 42, 0.62)
  );
}

.image-area img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.culture-card:hover .image-area img {
  transform: scale(1.04);
}

.category-tag {
  position: absolute;
  z-index: 1;
  top: 12px;
  left: 12px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.category-tour {
  color: #059669;
  background: #ecfdf5;
}

.category-leisure {
  color: #0284c7;
  background: #f0f9ff;
}

.category-culture {
  color: #d946ef;
  background: #fdf4ff;
}

.category-shopping {
  color: #db2777;
  background: #fdf2f8;
}

.category-stay {
  color: #4f46e5;
  background: #eef2ff;
}

.category-course {
  color: #ea580c;
  background: #fff7ed;
}

.category-restaurant {
  color: #b45309;
  background: #fffbeb;
}

.category-festival {
  color: #7c3aed;
  background: #f5f3ff;
}

.image-stats {
  position: absolute;
  z-index: 1;
  right: 12px;
  bottom: 12px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 11px;
}

.image-stats span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.card-content {
  padding: 17px 16px 15px;
}

.card-content h2 {
  margin: 0 0 9px;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.4;
  font-weight: 900;
  letter-spacing: -0.3px;
}

.card-content p {
  min-height: 42px;
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.65;
}

.card-footer {
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64748b;
  font-size: 10px;
}

.card-footer span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.empty-state {
  padding: 70px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  background: #ffffff;
  color: #94a3b8;
  text-align: center;
}

.empty-state h2 {
  margin: 15px 0 8px;
  color: #334155;
  font-size: 18px;
}

.empty-state p {
  margin: 0;
  font-size: 13px;
}

.pagination {
  margin-top: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.pagination-arrow,
.pagination-number {
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.pagination-number.active {
  background: #2563eb;
  color: #ffffff;
}

.pagination-arrow:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

@media (max-width: 900px) {
  .culture-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .sort-wrapper {
    align-self: flex-end;
  }
}

@media (max-width: 600px) {
  .culture-container {
    padding: 26px 16px 56px;
  }

  .page-header h1 {
    font-size: 23px;
  }

  .culture-grid {
    grid-template-columns: 1fr;
  }

  .image-area {
    height: 220px;
  }

  .category-button {
    padding: 0 11px;
  }
}
</style>
