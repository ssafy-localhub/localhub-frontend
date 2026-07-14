<script setup>
import { MapPin } from "lucide-vue-next";
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-top">
        <!-- 브랜드 영역 -->
        <section class="footer-brand">
          <div class="footer-logo">
            <span class="footer-logo-icon">
              <MapPin :size="16" :stroke-width="2.4" />
            </span>

            <strong>LocalHub 구미</strong>
          </div>

          <p>
            구미 시민과 여행자를 위한<br />
            지역 정보 커뮤니티 플랫폼
          </p>
        </section>

        <!-- 바로가기 -->
        <section class="footer-column">
          <h3>바로가기</h3>

          <nav>
            <RouterLink to="/community/tour">관광명소</RouterLink>
            <RouterLink to="/community/restaurant">맛집</RouterLink>
            <RouterLink to="/community/festival">축제 & 행사</RouterLink>
            <RouterLink to="/community">커뮤니티</RouterLink>
          </nav>
        </section>

        <!-- 고객지원 -->
        <section class="footer-column">
          <h3>고객지원</h3>

          <nav>
            <a href="#" @click.prevent>이용약관</a>
            <a href="#" @click.prevent>개인정보처리방침</a>
            <a href="#" @click.prevent>문의하기</a>
          </nav>
        </section>
      </div>

      <div class="footer-bottom">
        <p>© 2026 LocalHub. All rights reserved.</p>
        <p>경상북도 구미시 공식 파트너 서비스</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  width: 100%;
  margin-top: 80px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}

.footer-inner {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 28px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 72px;
  padding-bottom: 32px;
}

.footer-brand {
  min-width: 0;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 12px;
  color: #111827;
}

.footer-logo-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;

  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.footer-logo strong {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.footer-brand p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.7;
}

.footer-column h3 {
  margin: 0 0 14px;
  color: #111827;
  font-size: 14px;
  font-weight: 800;
}

.footer-column nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-column a {
  color: #64748b;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-column a:hover {
  color: #2563eb;
}

.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.footer-bottom p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
}

/* 태블릿 */
@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

/* 모바일 */
@media (max-width: 520px) {
  .app-footer {
    margin-top: 56px;
  }

  .footer-inner {
    padding: 32px 18px 24px;
  }

  .footer-top {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer-brand {
    grid-column: auto;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>