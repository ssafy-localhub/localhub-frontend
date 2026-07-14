import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import CommunityListView from "@/views/community/CommunityListView.vue";
import CommunityDetailView from "@/views/community/CommunityDetailView.vue";
import CommunityWriteView from "@/views/community/CommunityWriteView.vue";
import CommunityEditView from "@/views/community/CommunityEditView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
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
    path: "/community/:category",
    name: "community-category",
    component: CommunityListView,
    props: true,
  },
  {
    path: "/community/:category/:id",
    name: "community-detail",
    component: CommunityDetailView,
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
      behavior: "smooth",
    };
  },
});

export default router;