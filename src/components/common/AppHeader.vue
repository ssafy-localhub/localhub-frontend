<script setup>
import { MapPin, PenLine } from "lucide-vue-next";
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
      <nav class="navigation">

        <RouterLink to="/" class="nav-link">
          홈
        </RouterLink>

        <RouterLink to="/community" class="nav-link">
          커뮤니티
        </RouterLink>

        <RouterLink to="/culture" class="nav-link">
          문화
        </RouterLink>

      </nav>

      <!-- 우측 -->
      <div class="header-actions">

        <RouterLink
          to="/community/write"
          class="write-button"
        >
          <PenLine :size="17" />
          글쓰기
        </RouterLink>

      </div>

    </div>
  </header>
</template>

<style scoped>

.app-header{
    position:sticky;
    top:0;
    z-index:100;
    background:#fff;
    border-bottom:1px solid #e5e7eb;
}

.header-inner{
    max-width:1200px;
    margin:auto;
    height:72px;
    padding:0 24px;

    display:flex;
    align-items:center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  background: transparent;
}

.brand.router-link-active,
.brand.router-link-exact-active {
  background: transparent;
}

.navigation .nav-link.router-link-active,
.navigation .nav-link.router-link-exact-active {
  background: #dbeafe;
  color: #2563eb;
}

.brand-icon{
    width:38px;
    height:38px;

    border-radius:12px;

    background:#2563eb;
    color:white;

    display:flex;
    align-items:center;
    justify-content:center;
}

.brand-text{

    color:#111827;

    font-size:30px;
    font-weight:800;
}

.brand-text span{

    color:#2563eb;
}

.navigation{
    display:flex;
    align-items:center;
    gap:4px;
    margin-left:24px;
}

.nav-link{

    text-decoration:none;

    color:#64748b;

    font-weight:700;

    padding:10px 18px;

    border-radius:12px;

    transition:.2s;
}

.nav-link:hover{

    background:#eff6ff;

    color:#2563eb;
}

.navigation .router-link-active {
  background: #dbeafe;
  color: #2563eb;
}

.header-actions{
    margin-left:auto;

    display:flex;
    align-items:center;
}

.write-button{

    display:flex;
    align-items:center;
    gap:6px;

    text-decoration:none;

    color:white;

    background:#2563eb;

    height:42px;

    padding:0 20px;

    border-radius:999px;

    font-weight:700;

    box-shadow:0 5px 12px rgba(37,99,235,.25);
}

.write-button:hover{

    background:#1d4ed8;
}

</style>