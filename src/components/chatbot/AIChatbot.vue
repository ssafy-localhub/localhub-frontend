<script setup>
import { nextTick, ref } from "vue";
import {
  Sparkles,
  X,
  Send,
  Bot,
} from "lucide-vue-next";

const isOpen = ref(false);
const messageInput = ref("");
const messageList = ref(null);

const messages = ref([
  {
    id: 1,
    role: "assistant",
    content:
      "안녕하세요! 구미 로컬 AI 어시스턴트예요 🗺️\n관광지, 맛집, 축제 일정 등 무엇이든 물어보세요!",
    time: "10:37",
  },
]);

const quickQuestions = [
  "구미 맛집 추천해줘",
  "금오산 등산 정보",
  "이번 주 축제 일정",
  "구미 관광지 추천",
  "주차 가능한 식당",
];

const toggleChat = async () => {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    await scrollToBottom();
  }
};

const closeChat = () => {
  isOpen.value = false;
};

const sendMessage = async (presetMessage = "") => {
  const text = (presetMessage || messageInput.value).trim();

  if (!text) return;

  messages.value.push({
    id: Date.now(),
    role: "user",
    content: text,
    time: getCurrentTime(),
  });

  messageInput.value = "";
  await scrollToBottom();

  window.setTimeout(async () => {
    messages.value.push({
      id: Date.now() + 1,
      role: "assistant",
      content: createDummyAnswer(text),
      time: getCurrentTime(),
    });

    await scrollToBottom();
  }, 500);
};

const getCurrentTime = () => {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
};

const createDummyAnswer = (question) => {
  if (question.includes("맛집")) {
    return "구미에서는 인동, 원평동, 금오산 주변에 식당이 많이 모여 있어요. 원하는 메뉴나 지역을 알려주시면 더 구체적으로 추천해드릴게요.";
  }

  if (question.includes("금오산")) {
    return "금오산은 도립공원, 케이블카, 대혜폭포 등 볼거리가 많아요. 등산 난이도와 주차 여부도 함께 확인해드릴 수 있어요.";
  }

  if (question.includes("축제")) {
    return "현재 더미 데이터 기준으로 구미 지역 축제와 행사 일정을 안내하고 있어요. FastAPI 연동 후 실제 일정 데이터를 제공하게 됩니다.";
  }

  if (question.includes("관광지")) {
    return "금오산도립공원, 구미낙동강체육공원, 구미에코랜드 등이 대표적인 관광지예요.";
  }

  if (question.includes("주차")) {
    return "주차 가능 여부는 장소별 상세 페이지에서 확인할 수 있어요. 특정 장소 이름을 알려주시면 확인해드릴게요.";
  }

  return "현재는 더미 응답으로 동작하고 있어요. 추후 FastAPI의 POST /api/chat과 연결하면 실제 AI 답변을 받을 수 있습니다.";
};

const scrollToBottom = async () => {
  await nextTick();

  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  }
};
</script>

<template>
  <aside class="chatbot-wrapper" aria-label="AI 도우미">
    <Transition name="chat-window">
      <section
        v-if="isOpen"
        class="chat-window"
        role="dialog"
        aria-modal="false"
        aria-label="구미 AI 어시스턴트"
      >
        <header class="chat-header">
          <div class="assistant-profile">
            <span class="assistant-icon">
              <Sparkles :size="22" />
            </span>

            <div>
              <strong>구미 AI 어시스턴트</strong>

              <span class="assistant-status">
                <i></i>
                항상 응답 준비됨
              </span>
            </div>
          </div>

          <button
            type="button"
            class="close-button"
            aria-label="AI 채팅창 닫기"
            @click="closeChat"
          >
            <X :size="19" />
          </button>
        </header>

        <div ref="messageList" class="chat-body">
          <div class="message-list">
            <article
              v-for="message in messages"
              :key="message.id"
              :class="[
                'message-row',
                `message-${message.role}`,
              ]"
            >
              <span
                v-if="message.role === 'assistant'"
                class="message-avatar"
              >
                <Sparkles :size="15" />
              </span>

              <div class="message-bubble">
                <p>{{ message.content }}</p>
                <time>{{ message.time }}</time>
              </div>
            </article>
          </div>

          <section class="quick-question-section">
            <h3>자주 묻는 질문</h3>

            <div class="quick-question-list">
              <button
                v-for="question in quickQuestions"
                :key="question"
                type="button"
                @click="sendMessage(question)"
              >
                {{ question }}
              </button>
            </div>
          </section>
        </div>

        <form
          class="chat-input-area"
          @submit.prevent="sendMessage()"
        >
          <input
            v-model="messageInput"
            type="text"
            maxlength="500"
            placeholder="무엇이든 물어보세요..."
            aria-label="AI에게 보낼 메시지"
          />

          <button
            type="submit"
            :disabled="!messageInput.trim()"
            aria-label="메시지 전송"
          >
            <Send :size="18" />
          </button>
        </form>
      </section>
    </Transition>

    <div class="chatbot-launcher-area">
      <Transition name="label-fade">
        <span v-if="!isOpen" class="chatbot-label">
          <Sparkles :size="15" />
          AI 도우미
        </span>
      </Transition>

      <button
        type="button"
        :class="[
          'chatbot-button',
          { opened: isOpen },
        ]"
        :aria-label="
          isOpen ? 'AI 채팅창 닫기' : 'AI 채팅창 열기'
        "
        @click="toggleChat"
      >
        <X v-if="isOpen" :size="25" />
        <Sparkles v-else :size="27" />

        <span v-if="!isOpen" class="online-dot"></span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  right: 28px;
  bottom: 26px;
  z-index: 500;
  pointer-events: none;
}

.chatbot-wrapper button,
.chatbot-wrapper input,
.chatbot-window {
  pointer-events: auto;
}

.chatbot-launcher-area {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 11px;
}

.chatbot-label {
  height: 36px;
  padding: 0 14px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #ffffff;
  color: #334155;
  box-shadow: 0 7px 20px rgba(15, 23, 42, 0.12);

  display: inline-flex;
  align-items: center;
  gap: 6px;

  font-size: 12px;
  font-weight: 800;
}

.chatbot-label svg {
  color: #2563eb;
}

.chatbot-button {
  position: relative;
  width: 58px;
  height: 58px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.35);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.chatbot-button:hover {
  transform: translateY(-2px);
  background: #1d4ed8;
  box-shadow: 0 15px 30px rgba(37, 99, 235, 0.42);
}

.chatbot-button.opened {
  width: 55px;
  height: 55px;
  background: #475569;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.28);
}

.chatbot-button.opened:hover {
  background: #334155;
}

.online-dot {
  position: absolute;
  top: 1px;
  right: 1px;
  width: 13px;
  height: 13px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  background: #10b981;
}

.chat-window {
  width: 380px;
  height: 510px;
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid #dbe2ea;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.22);

  display: flex;
  flex-direction: column;
}

.chat-header {
  min-height: 66px;
  padding: 0 16px;
  background: #2454e8;
  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.assistant-profile {
  display: flex;
  align-items: center;
  gap: 11px;
}

.assistant-icon {
  width: 38px;
  height: 38px;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.18);

  display: flex;
  align-items: center;
  justify-content: center;
}

.assistant-profile > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.assistant-profile strong {
  font-size: 14px;
  font-weight: 900;
}

.assistant-status {
  color: rgba(255, 255, 255, 0.82);
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
}

.assistant-status i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
}

.close-button {
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: rgba(255, 255, 255, 0.78);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.chat-body {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #ffffff;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 9px;
}

.message-user {
  justify-content: flex-end;
}

.message-avatar {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;

  display: flex;
  align-items: center;
  justify-content: center;
}

.message-bubble {
  max-width: 78%;
  padding: 11px 13px;
  border-radius: 16px;
  background: #f1f5f9;
  color: #0f172a;
}

.message-assistant .message-bubble {
  border-top-left-radius: 5px;
}

.message-user .message-bubble {
  border-top-right-radius: 5px;
  background: #2563eb;
  color: #ffffff;
}

.message-bubble p {
  margin: 0;
  white-space: pre-line;
  font-size: 12px;
  line-height: 1.65;
}

.message-bubble time {
  display: block;
  margin-top: 6px;
  color: #94a3b8;
  font-size: 9px;
}

.message-user .message-bubble time {
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
}

.quick-question-section {
  margin-top: 27px;
}

.quick-question-section h3 {
  margin: 0 0 10px;
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
}

.quick-question-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.quick-question-list button {
  min-height: 31px;
  padding: 0 11px;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;

  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.quick-question-list button:hover {
  border-color: #93c5fd;
  background: #dbeafe;
}

.chat-input-area {
  min-height: 66px;
  padding: 11px 13px;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;

  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-input-area input {
  min-width: 0;
  height: 42px;
  flex: 1;
  padding: 0 13px;
  border: 2px solid #93c5fd;
  border-radius: 15px;
  outline: 0;
  background: #ffffff;
  color: #0f172a;
  font: inherit;
  font-size: 12px;
}

.chat-input-area input:focus {
  border-color: #2563eb;
}

.chat-input-area button {
  width: 39px;
  height: 39px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #93b4f8;
  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.chat-input-area button:not(:disabled) {
  background: #2563eb;
}

.chat-input-area button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.chat-window-enter-active,
.chat-window-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform-origin: bottom right;
}

.chat-window-enter-from,
.chat-window-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

.label-fade-enter-active,
.label-fade-leave-active {
  transition: opacity 0.15s ease;
}

.label-fade-enter-from,
.label-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .chatbot-wrapper {
    right: 15px;
    bottom: 16px;
  }

  .chat-window {
    width: calc(100vw - 30px);
    height: min(520px, calc(100vh - 110px));
  }

  .chatbot-label {
    display: none;
  }

  .chatbot-button {
    width: 54px;
    height: 54px;
  }
}
</style>
