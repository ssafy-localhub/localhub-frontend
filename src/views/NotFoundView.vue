<template>
  <main class="not-found-page">
    <section class="not-found-card">
      <p class="status-code">404</p>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>
        요청한 주소가 잘못되었거나<br />
        페이지가 이동 또는 삭제되었습니다.
      </p>

      <RouterLink to="/" class="home-button">
        홈으로 돌아가기
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.not-found-page {
  min-height: 70vh;
  padding: 80px 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f6f8fb;
}

.not-found-card {
  width: 100%;
  max-width: 520px;
  padding: 48px 32px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.status-code {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 72px;
  line-height: 1;
  font-weight: 900;
}

.not-found-card h1 {
  margin: 0 0 16px;
  color: #111827;
  font-size: 26px;
}

.not-found-card p {
  margin: 0 0 28px;
  color: #64748b;
  font-size: 15px;
  line-height: 1.7;
}

.home-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 150px;
  height: 44px;
  padding: 0 20px;
  border-radius: 999px;

  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
}

.home-button:hover {
  background: #1d4ed8;
}
</style>