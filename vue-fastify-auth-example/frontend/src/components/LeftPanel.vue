<template>
  <div class="left-panel-wrapper">
    <BuilderArea
      v-if="isAuthenticated"
      :token="token"
      :uid="uid"
      :monitored-fetch="monitoredFetch"
    />
    <UnauthInfo v-else />
  </div>
</template>

<script setup lang="ts">
import BuilderArea from './BuilderArea.vue'
import UnauthInfo from './UnauthInfo.vue'
import type { IToken } from '../types'

defineProps<{
  isAuthenticated: boolean
  token: IToken | null
  uid: string
  monitoredFetch: typeof fetch
}>()
</script>

<style scoped>
.left-panel-wrapper {
  height: 100%;
}
</style>
