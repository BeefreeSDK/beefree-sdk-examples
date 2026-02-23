import { describe, expect, it, vi } from 'vitest'
import { bootstrap } from '.'
import { createRoot } from 'react-dom/client'

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}))

vi.mock('./components/ReactEmailBuilderExampleFrame', () => ({
  ReactEmailBuilderExampleFrame: () => <div data-testid="frame-mock">Frame</div>,
}))

describe('index', () => {
  it('throws error when root element is null', () => {
    expect(() => bootstrap(null)).toThrow('Root element not found')
  })

  it('creates a React root and renders when root element exists', () => {
    const mockRenderFn = vi.fn()
    const mockCreateRoot = vi.fn(() => ({ render: mockRenderFn }))
    vi.mocked(createRoot).mockImplementation(mockCreateRoot)

    const rootElement = document.createElement('div')
    bootstrap(rootElement)

    expect(mockCreateRoot).toHaveBeenCalledWith(rootElement)
    expect(mockRenderFn).toHaveBeenCalled()
  })
})
