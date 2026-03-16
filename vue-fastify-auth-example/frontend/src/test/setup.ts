import { vi } from 'vitest'
import { defineComponent, h } from 'vue'

const mockBuilderApi = {
  load: vi.fn(),
  save: vi.fn(),
}

// Mock @beefree.io/vue-email-builder
vi.mock('@beefree.io/vue-email-builder', () => ({
  Builder: defineComponent({
    name: 'MockBuilder',
    props: ['token', 'template', 'config', 'width', 'height'],
    setup(props) {
      return () =>
        h('div', {
          class: 'mock-builder',
          'data-uid': props.config?.uid,
          'data-has-onsave': !!props.config?.onSave,
          'data-has-onsaveastemplate': !!props.config?.onSaveAsTemplate,
        }, `Builder (uid: ${props.config?.uid})`)
    },
    // Expose config for testing
    expose: ['config'],
  }),
  useBuilder: vi.fn(() => mockBuilderApi),
}))
