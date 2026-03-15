<template>
  <div class="app">
    <AppHeader />
    <AuthSection
      :is-authenticating="auth.isAuthenticating.value"
      :is-authenticated="auth.isAuthenticated.value"
      :uid="auth.uid.value"
      :error="auth.error.value"
      @authenticate="onAuthenticate"
      @end-session="auth.logout()"
    />
    <SplitLayout>
      <template #left>
        <LeftPanel
          :is-authenticated="auth.isAuthenticated.value"
          :token="auth.token.value"
          :uid="auth.uid.value"
          :monitored-fetch="monitor.monitoredFetch"
        />
      </template>
      <template #right>
        <ApiMonitorPanel
          :api-calls="monitor.apiCalls.value"
          @clear="monitor.clearHistory()"
        />
      </template>
    </SplitLayout>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AuthSection from './components/AuthSection.vue'
import SplitLayout from './components/SplitLayout.vue'
import LeftPanel from './components/LeftPanel.vue'
import ApiMonitorPanel from './components/ApiMonitorPanel.vue'
import { useAuth } from './composables/useAuth'
import { useApiMonitor } from './composables/useApiMonitor'

const auth = useAuth()
const monitor = useApiMonitor()

function onAuthenticate(uid: string) {
  auth.authenticate(uid, monitor.monitoredFetch)
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
</style>
