import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useSplitPanel } from './useSplitPanel'

// Capture onUnmounted callbacks so we can invoke them manually
const unmountCallbacks: (() => void)[] = []
vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue')>()
  return {
    ...actual,
    onUnmounted: vi.fn((cb: () => void) => unmountCallbacks.push(cb)),
  }
})

describe('useSplitPanel', () => {
  let containerRef: ReturnType<typeof ref<HTMLElement | null>>
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 500,
      top: 0,
      right: 600,
      bottom: 400,
      height: 400,
      x: 100,
      y: 0,
      toJSON: () => ({}),
    })
    containerRef = ref(container) as ReturnType<typeof ref<HTMLElement | null>>
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    unmountCallbacks.length = 0
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses default initial position of 60', () => {
    const { splitPosition } = useSplitPanel(containerRef)
    expect(splitPosition.value).toBe(60)
  })

  it('accepts custom initial position', () => {
    const { splitPosition } = useSplitPanel(containerRef, 45)
    expect(splitPosition.value).toBe(45)
  })

  it('starts drag and sets body styles', () => {
    const { onDividerMouseDown, isDragging } = useSplitPanel(containerRef)
    const event = {
      preventDefault: vi.fn(),
    } as unknown as MouseEvent

    onDividerMouseDown(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(isDragging.value).toBe(true)
    expect(document.body.style.cursor).toBe('col-resize')
    expect(document.body.style.userSelect).toBe('none')
  })

  it('moves divider with mouse when dragging', () => {
    const { onDividerMouseDown, splitPosition } = useSplitPanel(containerRef)

    onDividerMouseDown({
      preventDefault: vi.fn(),
    } as unknown as MouseEvent)

    // Simulate mousemove via document event
    const moveEvent = new MouseEvent('mousemove', { clientX: 350 })
    document.dispatchEvent(moveEvent)

    // (350 - 100) / 500 * 100 = 50%
    expect(splitPosition.value).toBe(50)
  })

  it('clamps position to 25% minimum', () => {
    const { onDividerMouseDown, splitPosition } = useSplitPanel(containerRef)

    onDividerMouseDown({
      preventDefault: vi.fn(),
    } as unknown as MouseEvent)

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 110 }))

    // (110 - 100) / 500 * 100 = 2% → clamped to 25
    expect(splitPosition.value).toBe(25)
  })

  it('clamps position to 75% maximum', () => {
    const { onDividerMouseDown, splitPosition } = useSplitPanel(containerRef)

    onDividerMouseDown({
      preventDefault: vi.fn(),
    } as unknown as MouseEvent)

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 590 }))

    // (590 - 100) / 500 * 100 = 98% → clamped to 75
    expect(splitPosition.value).toBe(75)
  })

  it('stops dragging on mouseup', () => {
    const { onDividerMouseDown, isDragging } = useSplitPanel(containerRef)

    onDividerMouseDown({
      preventDefault: vi.fn(),
    } as unknown as MouseEvent)
    expect(isDragging.value).toBe(true)

    document.dispatchEvent(new MouseEvent('mouseup'))

    expect(isDragging.value).toBe(false)
    expect(document.body.style.cursor).toBe('')
    expect(document.body.style.userSelect).toBe('')
  })

  it('ignores mousemove when not dragging', () => {
    const { splitPosition } = useSplitPanel(containerRef, 50)

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 300 }))

    expect(splitPosition.value).toBe(50)
  })

  it('ignores mouseup when not dragging', () => {
    const { isDragging, onDividerMouseDown } = useSplitPanel(containerRef)

    // Start dragging so that onMouseUp listener is registered
    onDividerMouseDown({ preventDefault: vi.fn() } as unknown as MouseEvent)
    expect(isDragging.value).toBe(true)

    // Manually set isDragging to false while listener is still active
    isDragging.value = false

    // Fire mouseup — the listener sees isDragging is false and returns early
    document.dispatchEvent(new MouseEvent('mouseup'))

    expect(isDragging.value).toBe(false)
  })

  it('handles ArrowLeft key to decrease position', () => {
    const { onDividerKeyDown, splitPosition } = useSplitPanel(containerRef, 50)
    const event = {
      key: 'ArrowLeft',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent

    onDividerKeyDown(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(splitPosition.value).toBe(48)
  })

  it('handles ArrowRight key to increase position', () => {
    const { onDividerKeyDown, splitPosition } = useSplitPanel(containerRef, 50)
    const event = {
      key: 'ArrowRight',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent

    onDividerKeyDown(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(splitPosition.value).toBe(52)
  })

  it('clamps ArrowLeft at 25%', () => {
    const { onDividerKeyDown, splitPosition } = useSplitPanel(containerRef, 26)
    const event = {
      key: 'ArrowLeft',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent

    onDividerKeyDown(event)

    expect(splitPosition.value).toBe(25)

    onDividerKeyDown(event)
    expect(splitPosition.value).toBe(25)
  })

  it('clamps ArrowRight at 75%', () => {
    const { onDividerKeyDown, splitPosition } = useSplitPanel(containerRef, 74)
    const event = {
      key: 'ArrowRight',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent

    onDividerKeyDown(event)

    expect(splitPosition.value).toBe(75)

    onDividerKeyDown(event)
    expect(splitPosition.value).toBe(75)
  })

  it('ignores unrelated keys', () => {
    const { onDividerKeyDown, splitPosition } = useSplitPanel(containerRef, 50)
    const event = {
      key: 'Enter',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent

    onDividerKeyDown(event)

    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(splitPosition.value).toBe(50)
  })

  it('ignores mousemove when containerRef is null', () => {
    const nullRef = ref<HTMLElement | null>(null)
    const { onDividerMouseDown, splitPosition } = useSplitPanel(nullRef, 50)

    onDividerMouseDown({
      preventDefault: vi.fn(),
    } as unknown as MouseEvent)

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 300 }))

    expect(splitPosition.value).toBe(50)
  })

  it('cleans up event listeners on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const { onDividerMouseDown } = useSplitPanel(containerRef)

    // Start dragging to add listeners
    onDividerMouseDown({ preventDefault: vi.fn() } as unknown as MouseEvent)

    // Call the onUnmounted callback
    expect(unmountCallbacks).toHaveLength(1)
    unmountCallbacks[0]()

    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
  })
})
