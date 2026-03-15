import { ref, onUnmounted, type Ref } from 'vue'

export interface UseSplitPanel {
  splitPosition: Ref<number>
  isDragging: Ref<boolean>
  onDividerMouseDown: (e: MouseEvent) => void
  onDividerKeyDown: (e: KeyboardEvent) => void
}

export function useSplitPanel(
  containerRef: Ref<HTMLElement | null>,
  initialPosition = 60,
): UseSplitPanel {
  const splitPosition = ref(initialPosition)
  const isDragging = ref(false)

  function onMouseMove(e: MouseEvent) {
    if (!isDragging.value || !containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    splitPosition.value = Math.min(75, Math.max(25, pct))
  }

  function onMouseUp() {
    if (!isDragging.value) return
    isDragging.value = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  function onDividerMouseDown(e: MouseEvent) {
    e.preventDefault()
    isDragging.value = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function onDividerKeyDown(e: KeyboardEvent) {
    const step = 2
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      splitPosition.value = Math.max(25, splitPosition.value - step)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      splitPosition.value = Math.min(75, splitPosition.value + step)
    }
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })

  return {
    splitPosition,
    isDragging,
    onDividerMouseDown,
    onDividerKeyDown,
  }
}
