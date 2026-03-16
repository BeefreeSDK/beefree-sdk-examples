<template>
  <div
    class="split-divider"
    :class="{ dragging: isDragging }"
    role="separator"
    aria-orientation="vertical"
    :aria-valuenow="splitPosition"
    :aria-valuemin="25"
    :aria-valuemax="75"
    aria-label="Resize panels"
    tabindex="0"
    @mousedown="onDividerMouseDown"
    @keydown="onDividerKeyDown"
  >
    <div class="split-divider-handle" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  splitPosition: number
  isDragging: boolean
}>()

const emit = defineEmits<{
  mousedown: [event: MouseEvent]
  keydown: [event: KeyboardEvent]
}>()

function onDividerMouseDown(e: MouseEvent) {
  emit('mousedown', e)
}

function onDividerKeyDown(e: KeyboardEvent) {
  emit('keydown', e)
}
</script>

<style scoped>
.split-divider {
  flex-shrink: 0;
  width: 6px;
  cursor: col-resize;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.split-divider:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}
.split-divider:hover,
.split-divider.dragging {
  background: #b0b0b0;
}
.split-divider-handle {
  width: 2px;
  height: 32px;
  border-radius: 1px;
  background: #999;
}
.split-divider.dragging .split-divider-handle {
  background: #666;
}
</style>
