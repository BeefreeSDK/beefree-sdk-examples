<template>
  <div ref="containerRef" class="split-container">
    <div
      class="left-panel"
      :class="{ dragging: isDragging }"
      :style="{ width: splitPosition + '%' }"
    >
      <slot name="left" />
    </div>
    <SplitDivider
      :split-position="splitPosition"
      :is-dragging="isDragging"
      @mousedown="onDividerMouseDown"
      @keydown="onDividerKeyDown"
    />
    <div
      class="right-panel"
      :class="{ dragging: isDragging }"
      :style="{ width: (100 - splitPosition) + '%' }"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SplitDivider from './SplitDivider.vue'
import { useSplitPanel } from '../composables/useSplitPanel'

const containerRef = ref<HTMLElement | null>(null)
const { splitPosition, isDragging, onDividerMouseDown, onDividerKeyDown } =
  useSplitPanel(containerRef)
</script>

<style scoped>
.split-container {
  display: flex;
  width: 100%;
  height: 100%;
  flex: 1;
  overflow: hidden;
}
.left-panel,
.right-panel {
  overflow: hidden;
  height: 100%;
  min-width: 0;
  position: relative;
}
.left-panel.dragging,
.right-panel.dragging {
  pointer-events: none;
  user-select: none;
}
</style>
