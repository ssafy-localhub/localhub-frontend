import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";

import CommunityListView from "@/views/community/CommunityListView.vue";
import CommunityDetailView from "@/views/community/CommunityDetailView.vue";
import CommunityWriteView from "@/views/community/CommunityWriteView.vue";
import CommunityEditView from "@/views/community/CommunityEditView.vue";

import CultureListView from "@/views/culture/CultureListView.vue";
import CultureDetailView from "@/views/culture/CultureDetailView.vue";

import NotFoundView from "@/views/NotFoundView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },

  // 커뮤니티
  {
    path: "/community",
    name: "community",
    component: CommunityListView,
  },
  {
    path: "/community/write",
    name: "community-write",
    component: CommunityWriteView,
  },
  {
    path: "/community/edit/:id",
    name: "community-edit",
    component: CommunityEditView,
    props: true,
  },
  {
    path: "/community/:category/:id",
    name: "community-detail",
    component: CommunityDetailView,
    props: true,
  },
  {
    path: "/community/:category",
    name: "community-category",
    component: CommunityListView,
    props: true,
  },

  // 문화
  {
    path: "/culture",
    name: "culture",
    component: CultureListView,
  },
  {
    path: "/culture/:category/:id",
    name: "culture-detail",
    component: CultureDetailView,
    props: true,
  },
  {
    path: "/culture/:category",
    name: "culture-category",
    component: CultureListView,
    props: true,
  },

  // 404는 반드시 마지막
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    return {
      top: 0,
      behavior: "smooth",
    };
  },
});

export default router;