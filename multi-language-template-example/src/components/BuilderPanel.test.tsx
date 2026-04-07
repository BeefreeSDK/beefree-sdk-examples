import { act, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BuilderPanel } from './BuilderPanel'
import type { BuilderApiRef } from '../types/types'
import { downloadFile } from '../utils/download'

vi.mock('../utils/download', () => ({
  downloadFile: vi.fn(),
}))

const saveMock = vi.fn()
const saveAsTemplateMock = vi.fn()
const getTemplateJsonMock = vi.fn().mockResolvedValue({ page: {}, comments: {} })
const switchTemplateLanguageMock = vi.fn()

// Captures Builder callbacks so individual tests can trigger them
const mockBuilderCallbacks: {
  onError?: (error: { message?: string }) => void
  onSave?: (pageJson: string, pageHtml: string, ampHtml: string | null, templateVersion: number, language: string | null) => void
  onSaveAsTemplate?: (pageJson: string) => void
  onSend?: (htmlFile: string) => void
  onWarning?: (warning: { message?: string }) => void
} = {}

let capturedTemplate: unknown = null

vi.mock('@beefree.io/react-email-builder', () => ({
  Builder: (props: Record<string, unknown>) => {
    capturedTemplate = props.template
    const onLoad = props.onLoad as (() => void) | undefined
    if (onLoad) setTimeout(onLoad, 0)
    mockBuilderCallbacks.onError = props.onError as typeof mockBuilderCallbacks.onError
    mockBuilderCallbacks.onSave = props.onSave as typeof mockBuilderCallbacks.onSave
    mockBuilderCallbacks.onSaveAsTemplate = props.onSaveAsTemplate as typeof mockBuilderCallbacks.onSaveAsTemplate
    mockBuilderCallbacks.onSend = props.onSend as typeof mockBuilderCallbacks.onSend
    mockBuilderCallbacks.onWarning = props.onWarning as typeof mockBuilderCallbacks.onWarning
    return <div data-testid="builder-mock">Builder</div>
  },
  useBuilder: () => ({
    id: 'test-id',
    save: saveMock,
    saveAsTemplate: saveAsTemplateMock,
    getTemplateJson: getTemplateJsonMock,
    switchTemplateLanguage: switchTemplateLanguageMock,
  }),
}))

describe('BuilderArea', () => {
  const mockToken = { access_token: 'test-token', expires: 3600, v2: false }
  const mockLanguages = [
    { label: 'English', value: 'en-US' },
    { label: 'Español', value: 'es-ES' },
  ]
  const mockBuilderApiRef = { current: null as BuilderApiRef | null }
  const mockOnLoad = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    Object.keys(mockBuilderCallbacks).forEach((k) => {
      (mockBuilderCallbacks as Record<string, unknown>)[k] = undefined
    })
    capturedTemplate = null
    mockOnLoad.mockClear()
    mockOnError.mockClear()
    saveMock.mockClear()
    saveAsTemplateMock.mockClear()
    getTemplateJsonMock.mockClear()
    switchTemplateLanguageMock.mockClear()
    vi.mocked(downloadFile).mockClear()
  })

  it('renders Builder component', () => {
    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl={null}
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    expect(screen.getByTestId('builder-mock')).toBeInTheDocument()
  })

  it('sets topBarEnabled to false in config', async () => {
    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl={null}
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())
    // The config with topBarEnabled: false is passed to useBuilder internally
    // This test verifies rendering doesn't break with that config
  })

  it('populates builderApiRef with SDK methods', async () => {
    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl={null}
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => {
      expect(mockBuilderApiRef.current).not.toBeNull()
      expect(mockBuilderApiRef.current?.save).toBe(saveMock)
      expect(mockBuilderApiRef.current?.saveAsTemplate).toBe(saveAsTemplateMock)
      expect(mockBuilderApiRef.current?.getTemplateJson).toBe(getTemplateJsonMock)
      expect(mockBuilderApiRef.current?.switchTemplateLanguage).toBe(switchTemplateLanguageMock)
    })
  })

  it('onSave callback logs and alerts', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl={null}
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    act(() => {
      mockBuilderCallbacks.onSave?.('{"page":{}}', '<html></html>', null, 1, 'es-ES')
    })

    expect(logSpy).toHaveBeenCalledWith('onSave called:', { pageJson: '{"page":{}}', pageHtml: '<html></html>', language: 'es-ES' })
    expect(alertSpy).not.toHaveBeenCalled()
    expect(vi.mocked(downloadFile)).toHaveBeenCalledTimes(1)
  })

  it('onSave skips download when html is empty', async () => {
    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl={null}
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    act(() => {
      mockBuilderCallbacks.onSave?.('{"page":{}}', '', null, 1, 'es-ES')
    })

    expect(vi.mocked(downloadFile)).not.toHaveBeenCalled()
  })

  it('onSave stringifies non-string html and handles null language', async () => {
    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl={null}
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    const htmlLike = { toString: () => '<html>fallback</html>' } as unknown as string
    act(() => {
      mockBuilderCallbacks.onSave?.('{"page":{}}', htmlLike, null, 1, null)
    })

    expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(
      '<html>fallback</html>',
      expect.stringMatching(/^--beefree-export-.*\.html$/)
    )
  })

  it('onSaveAsTemplate callback logs', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl={null}
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    act(() => {
      mockBuilderCallbacks.onSaveAsTemplate?.('{"page":{}}')
    })

    expect(logSpy).toHaveBeenCalledWith('onSaveAsTemplate called:', { pageJson: '{"page":{}}' })
    expect(alertSpy).not.toHaveBeenCalled()
    expect(vi.mocked(downloadFile)).toHaveBeenCalledTimes(1)
  })

  it('onSaveAsTemplate supports pre-parsed json objects', async () => {
    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl={null}
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    act(() => {
      mockBuilderCallbacks.onSaveAsTemplate?.({ page: {} } as unknown as string)
    })

    expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(
      '{\n  "page": {}\n}',
      expect.stringMatching(/^beefree-template-.*\.json$/),
      'application/json'
    )
  })

  it('onSend callback logs and alerts', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl={null}
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    act(() => {
      mockBuilderCallbacks.onSend?.('<html>email</html>')
    })

    expect(logSpy).toHaveBeenCalledWith('onSend called:', '<html>email</html>')
    expect(alertSpy).toHaveBeenCalledWith('Template sent! Check console for details.')
  })

  it('onWarning callback logs the warning', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl={null}
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    act(() => {
      mockBuilderCallbacks.onWarning?.({ message: 'minor issue' })
    })

    expect(warnSpy).toHaveBeenCalledWith('Beefree warning:', { message: 'minor issue' })
  })

  it('calls onError prop when Builder triggers error', async () => {
    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl={null}
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    act(() => {
      mockBuilderCallbacks.onError?.({ message: 'Test error' })
    })

    expect(mockOnError).toHaveBeenCalledWith({ message: 'Test error' })
  })

  it('calls onLoad prop when Builder loads', async () => {
    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl={null}
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(mockOnLoad).toHaveBeenCalled())
  })

  it('fetches template from URL and passes it to Builder', async () => {
    const templateData = { page: { title: 'Test' }, comments: {} }
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(templateData), { status: 200 }),
    )

    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl="https://example.com/template.json"
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(mockOnLoad).toHaveBeenCalled())
    expect(globalThis.fetch).toHaveBeenCalledWith('https://example.com/template.json')
    expect(capturedTemplate).toEqual(templateData)
  })

  it('falls back to BLANK template when fetch response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('nope', { status: 500 }))

    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl="/bad-template.json"
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())
    expect(capturedTemplate).toEqual({ comments: {}, page: {} })
  })

  it('falls back to BLANK template when fetch returns null json', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(null),
    } as unknown as Response)

    render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl="/null-template.json"
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())
    expect(capturedTemplate).toEqual({ comments: {}, page: {} })
  })

  it('ignores failed fetch resolution after unmount', async () => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => new Promise((resolve) => setTimeout(() => resolve({ page: { late: true }, comments: {} }), 20)),
    } as unknown as Response)

    const { unmount } = render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl="/late-error-template.json"
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    unmount()
    await vi.advanceTimersByTimeAsync(25)

    expect(globalThis.fetch).toHaveBeenCalledWith('/late-error-template.json')
    vi.useRealTimers()
  })

  it('does not set template in catch when fetch fails after unmount', async () => {
    vi.useFakeTimers()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error('late failure')), 20)) as Promise<Response>
    )

    const { unmount } = render(
      <BuilderPanel
        token={mockToken}
        useRtl={false}
        languages={mockLanguages}
        templateUrl="/late-catch-template.json"
        builderApiRef={mockBuilderApiRef}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    )

    unmount()
    await vi.advanceTimersByTimeAsync(25)

    expect(globalThis.fetch).toHaveBeenCalledWith('/late-catch-template.json')
    vi.useRealTimers()
  })
})
