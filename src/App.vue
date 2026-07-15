<script setup>
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import AIChatbot from "@/components/chatbot/AIChatbot.vue";
</script>

<template>
  <div class="app">
    <AppHeader />

    <RouterView />

    <AppFooter />

    <AIChatbot />
  </div>
</template>
