<template>
  <div class="auth-strip">
    <div class="auth-left">
      <template v-if="isAuthenticated">
        <label class="uid-label">User ID: <strong>{{ uid }}</strong></label>
        <button class="end-session-btn" @click="$emit('endSession')">
          End session
        </button>
      </template>
      <template v-else>
        <label for="uid-input">User ID:</label>
        <input
          id="uid-input"
          v-model="localUid"
          type="text"
          placeholder="e.g., user123"
          :disabled="isAuthenticating"
          @keyup.enter="onAuth"
        />
        <button
          :disabled="isAuthenticating || !localUid.trim()"
          @click="onAuth"
        >
          <span v-if="isAuthenticating" class="spinner" />
          {{ isAuthenticating ? 'Authenticating...' : 'Authenticate' }}
        </button>
        <span v-if="error" class="error-text">{{ error }}</span>
      </template>
    </div>
    <div class="auth-right">
      <span class="auth-title">🔐 Secure Authentication</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isAuthenticating: boolean
  isAuthenticated: boolean
  uid: string
  error: string
}>()

const emit = defineEmits<{
  authenticate: [uid: string]
  endSession: []
}>()

const localUid = ref('vue-fastify-demo')

function onAuth() {
  if (localUid.value.trim()) {
    emit('authenticate', localUid.value.trim())
  }
}
</script>

<style scoped>
.auth-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #7638ff;
  padding: 12px 20px;
  flex-shrink: 0;
}
.auth-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.auth-left label {
  color: white;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}
.auth-left input {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 14px;
  outline: none;
  min-width: 180px;
}
.auth-left input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
.auth-left input:focus {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
}
.auth-left button {
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.auth-left button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.35);
}
.auth-left button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.uid-label {
  color: white;
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
}
.uid-label strong {
  font-weight: 600;
}
.end-session-btn {
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
  white-space: nowrap;
}
.end-session-btn:hover {
  background: rgba(255, 80, 80, 0.5);
  border-color: rgba(255, 80, 80, 0.7);
}
.auth-right {
  display: flex;
  align-items: center;
}
.auth-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3px;
}
.error-text {
  color: #ffcdd2;
  font-size: 13px;
  white-space: nowrap;
}
.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
