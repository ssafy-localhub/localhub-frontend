<script setup>
import { MapPin, Bell, PenLine } from "lucide-vue-next";
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <!-- 로고 -->
      <RouterLink to="/" class="brand">
        <span class="brand-icon">
          <MapPin :size="19" :stroke-width="2.4" />
        </span>

        <span class="brand-text">
          Local<span>Hub</span>
        </span>
      </RouterLink>

      <!-- 메뉴 -->
      <nav class="navigation" aria-label="주요 메뉴">
        <RouterLink to="/" class="nav-link">
          홈
        </RouterLink>

        <RouterLink to="/community" class="nav-link">
          커뮤니티
        </RouterLink>
      </nav>

      <!-- 우측 기능 -->
      <div class="header-actions">
        <button
          type="button"
          class="notification-button"
          aria-label="알림"
        >
          <Bell :size="20" :stroke-width="1.8" />
        </button>

        <RouterLink
          to="/community/write"
          class="write-button"
        >
          <PenLine :size="16" :stroke-width="2" />
          <span>글쓰기</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 60px;
  background: #ffffff;
  border-top: 1px solid #d1d5db;
  border-bottom: 3px solid #2563eb;
}

.header-inner {
  width: 100%;
  max-width: 1100px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;

  display: flex;
  align-items: center;
}

/* 로고 */
.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #111827;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-icon {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: #2563eb;
  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.25);
}

.brand-text {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.brand-text span {
  color: #2563eb;
}

/* 메뉴 */
.navigation {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 24px;
}

.nav-link {
  min-width: 44px;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    color 0.2s,
    background-color 0.2s;
}

.nav-link:hover {
  color: #2563eb;
  background: #f1f5f9;
}

.nav-link.router-link-exact-active {
  color: #2563eb;
  background: #eff6ff;
}

/* 오른쪽 영역 */
.header-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.notification-button {
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #64748b;
  border-radius: 50%;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    color 0.2s,
    background-color 0.2s;
}

.notification-button:hover {
  color: #2563eb;
  background: #eff6ff;
}

.write-button {
  height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  background: #2563eb;
  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 700;
  text-decoration: none;

  transition:
    background-color 0.2s,
    transform 0.2s;
}

.write-button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

/* 모바일 */
@media (max-width: 640px) {
  .header-inner {
    padding: 0 14px;
  }

  .brand-text {
    font-size: 16px;
  }

  .navigation {
    margin-left: 12px;
  }

  .nav-link {
    padding: 0 9px;
    font-size: 13px;
  }

  .notification-button {
    display: none;
  }

  .write-button {
    width: 38px;
    padding: 0;
  }

  .write-button span {
    display: none;
  }
}
</style>