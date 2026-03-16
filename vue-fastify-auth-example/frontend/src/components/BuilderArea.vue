<template>
  <div class="builder-area">
    <div class="builder-menu-bar">
      <button :disabled="isLoading" @click="loadTemplate('sample')">
        Load Sample Template
      </button>
      <button :disabled="isLoading" @click="loadTemplate('blank')">
        Load Blank Template
      </button>
    </div>
    <div class="builder-container">
      <Builder
        v-if="token && currentTemplate"
        :token="token"
        :template="currentTemplate"
        :config="builderConfig"
        width="100%"
        height="100%"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Builder, useBuilder } from '@beefree.io/vue-email-builder'
import type { IEntityContentJson } from '@beefree.io/vue-email-builder'
import type { IToken } from '../types'
import { TEMPLATE_SAMPLE_URL, TEMPLATE_BLANK_URL } from '../config/constants'

const props = defineProps<{
  token: IToken | null
  uid: string
  monitoredFetch: typeof fetch
}>()

const isLoading = ref(false)
const currentTemplate = ref<IEntityContentJson | null>(null)

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const builderConfig = {
  uid: props.uid || 'vue-fastify-demo',
  container: 'bee-plugin-container',
  onSave: (_pageJson: string, pageHtml: string) => {
    downloadFile(
      `design-${Date.now()}.html`,
      pageHtml,
      'text/html;charset=utf-8',
    )
  },
  onSaveAsTemplate: (pageJson: string | Record<string, unknown>) => {
    const parsed =
      typeof pageJson === 'string' ? JSON.parse(pageJson) : pageJson
    const content = JSON.stringify(parsed, null, 2)
    downloadFile(
      `template-${Date.now()}.json`,
      content,
      'application/json',
    )
  },
}
const builder = useBuilder(builderConfig)

async function fetchTemplate(url: string) {
  isLoading.value = true
  try {
    const response = await props.monitoredFetch(url)
    const data = (await response.json()) as IEntityContentJson
    if (currentTemplate.value) {
      builder.load(data)
    }

    currentTemplate.value = data
  } catch (err) {
    console.error('Failed to load template:', err)
  } finally {
    isLoading.value = false
  }
}

async function loadTemplate(type: 'sample' | 'blank') {
  const url = type === 'sample' ? TEMPLATE_SAMPLE_URL : TEMPLATE_BLANK_URL
  await fetchTemplate(url)
}

// Load initial template when token becomes available
let initialized = false
watch(
  () => props.token,
  (newToken) => {
    if (newToken && !initialized) {
      initialized = true
      fetchTemplate(TEMPLATE_SAMPLE_URL)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.builder-area {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.builder-menu-bar {
  background: #262626;
  color: white;
  padding: 0 15px;
  height: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.builder-menu-bar button {
  padding: 7px 16px;
  background: #7638ff;
  color: white;
  border: 1px solid #7638ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: opacity 0.2s;
}
.builder-menu-bar button:hover:not(:disabled) {
  opacity: 0.8;
}
.builder-menu-bar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.builder-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
}
</style>
