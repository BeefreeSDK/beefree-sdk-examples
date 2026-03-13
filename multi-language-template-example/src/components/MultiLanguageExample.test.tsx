import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MultiLanguageExample } from './MultiLanguageExample'

const switchTemplateLanguageMock = vi.fn()
const saveMock = vi.fn()
const saveAsTemplateMock = vi.fn()
const getTemplateJsonMock = vi.fn().mockResolvedValue({ page: {}, comments: {} })

// Captures Builder callbacks so individual tests can trigger them
const mockBuilderCallbacks: {
  onError?: (error: { message?: string }) => void
} = {}

vi.mock('@beefree.io/react-email-builder', () => ({
  Builder: (props: Record<string, unknown>) => {
    const onLoad = props.onLoad as (() => void) | undefined
    if (onLoad) setTimeout(onLoad, 0)
    mockBuilderCallbacks.onError = props.onError as typeof mockBuilderCallbacks.onError
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

vi.mock('../services/beefree', () => ({
  authenticate: vi.fn(),
}))

const { authenticate } = await import('../services/beefree')

/** Build a minimal JWT whose payload carries the given JSON object. */
function makeJwt(payload: Record<string, unknown>): string {
  const b64 = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return `header.${b64}.sig`
}

/** A valid JWT for tests that need the builder to load without plan warnings. */
const VALID_TOKEN = makeJwt({ plan: 'Superpowers' })

describe('BeefreeExample', () => {
  beforeEach(() => {
    Object.keys(mockBuilderCallbacks).forEach((k) => {
      (mockBuilderCallbacks as Record<string, unknown>)[k] = undefined
    })
    // mockReset (not just mockClear) is needed here to drop queued
    // mockResolvedValueOnce / mockRejectedValueOnce from prior tests.
    vi.mocked(authenticate).mockReset()
  })
  it('shows loading state initially', () => {
    vi.mocked(authenticate).mockImplementation(() => new Promise(() => {}))
    render(<MultiLanguageExample />)
    expect(screen.getByText(/loading email builder/i)).toBeInTheDocument()
  })

  it('shows credentials error and retry when auth fails with credentials error', async () => {
    vi.mocked(authenticate).mockRejectedValueOnce(new Error('Authentication failed'))
    render(<MultiLanguageExample />)

    await waitFor(() => {
      expect(screen.getByText(/invalid or missing credentials/i)).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('shows token error and retry on generic auth failure', async () => {
    vi.mocked(authenticate).mockRejectedValueOnce(new Error('Network error'))
    render(<MultiLanguageExample />)

    await waitFor(() => {
      expect(screen.getByText(/failed to load email builder/i)).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('shows token error when auth rejects with a non-Error value', async () => {
    vi.mocked(authenticate).mockRejectedValueOnce('unexpected string error')
    render(<MultiLanguageExample />)

    await waitFor(() => {
      expect(screen.getByText(/failed to load email builder/i)).toBeInTheDocument()
    })
  })

  it('renders builder and content language select with 10 LTR options when token is loaded', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: VALID_TOKEN,
      expires: 3600,
    } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => {
      expect(screen.getByTestId('builder-mock')).toBeInTheDocument()
    })

    const select = screen.getByLabelText(/content language/i)
    expect(select).toBeInTheDocument()
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(10)
    const values = options.map((o) => (o as HTMLOptionElement).value)
    expect(values).toContain('en-US')
    expect(values).toContain('zh-CN')
    expect(values).toContain('hi-IN')
    expect(values).toContain('es-ES')
    expect(values).toContain('fr-FR')
    expect(values).toContain('bn-BD')
    expect(values).toContain('nap-IT')
    expect(values).toContain('ca-ES')
    expect(values).toContain('eu-ES')
    expect(values).toContain('gl-ES')
  })

  it('content language select is controlled and has initial value en-US for LTR', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: VALID_TOKEN,
      expires: 0,
    } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => {
      expect(screen.getByLabelText(/content language/i)).toBeInTheDocument()
    })

    const select = screen.getByLabelText(/content language/i) as HTMLSelectElement
    expect(select.value).toBe('en-US')
  })

  it('changing content language calls switchTemplateLanguage', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: VALID_TOKEN,
      expires: 0,
    } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => {
      expect(screen.getByLabelText(/content language/i)).toBeInTheDocument()
    })
    const select = screen.getByLabelText(/content language/i)
    await waitFor(() => {
      expect(select).not.toBeDisabled()
    })

    await userEvent.selectOptions(select, 'es-ES')

    expect(switchTemplateLanguageMock).toHaveBeenCalledWith({ language: 'es-ES' })
  })

  it('shows LTR/RTL toggle button and switches collection on click', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: VALID_TOKEN,
      expires: 0,
    } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => {
      expect(screen.getByLabelText(/content language/i)).toBeInTheDocument()
    })

    const rtlButton = screen.getByRole('button', { name: 'RTL' })
    expect(rtlButton).toBeInTheDocument()

    await userEvent.click(rtlButton)

    await waitFor(() => {
      const options = screen.getAllByRole('option')
      const values = options.map((o) => (o as HTMLOptionElement).value)
      expect(values).toContain('fa-IR')
      expect(values).toContain('ar-SA')
    })

    const ltrButton = screen.getByRole('button', { name: 'LTR' })
    expect(ltrButton).toBeInTheDocument()
  })

  it('clicking LTR after switching to RTL switches back to LTR languages', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByLabelText(/content language/i)).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'RTL' }))
    await waitFor(() => {
      const values = screen.getAllByRole('option').map((o) => (o as HTMLOptionElement).value)
      expect(values).toContain('fa-IR')
    })

    await userEvent.click(screen.getByRole('button', { name: 'LTR' }))
    await waitFor(() => {
      const values = screen.getAllByRole('option').map((o) => (o as HTMLOptionElement).value)
      expect(values).toContain('en-US')
      expect(values).not.toContain('fa-IR')
    })
  })

  it('Save button calls save via builder API', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())
    await waitFor(() => expect(screen.getByRole('button', { name: /^Save$/ })).not.toBeDisabled())

    await userEvent.click(screen.getByRole('button', { name: /^Save$/ }))

    expect(saveMock).toHaveBeenCalled()
  })

  it('Save as Template button calls saveAsTemplate via builder API', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())
    await waitFor(() => expect(screen.getByRole('button', { name: /save as template/i })).not.toBeDisabled())

    await userEvent.click(screen.getByRole('button', { name: /save as template/i }))

    expect(saveAsTemplateMock).toHaveBeenCalled()
  })

  it('renders Save and Save as Template buttons only', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: VALID_TOKEN,
      expires: 0,
    } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => {
      expect(screen.getByTestId('builder-mock')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /^Save$/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save as template/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /load blank template/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /preview/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /toggle structure/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /load sample template/i })).not.toBeInTheDocument()
  })

  it('toggles first button label between blank and sample template actions', async () => {
    const ltrData = { page: { title: 'LTR' }, comments: {} }
    const blankData = { page: { title: 'Blank' }, comments: {} }
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      const urlStr = typeof url === 'string' ? url : url.toString()
      if (urlStr.includes('blank-template')) {
        return Promise.resolve(new Response(JSON.stringify(blankData), { status: 200 }))
      }
      return Promise.resolve(new Response(JSON.stringify(ltrData), { status: 200 }))
    })
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    const toggleButton = screen.getByRole('button', { name: /load blank template/i })
    await userEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load sample template/i })).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /load sample template/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load blank template/i })).toBeInTheDocument()
    })
  })

  it('keeps selected content language when switching between blank and sample templates', async () => {
    const ltrData = { page: { title: 'LTR' }, comments: {} }
    const blankData = { page: { title: 'Blank' }, comments: {} }
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      const urlStr = typeof url === 'string' ? url : url.toString()
      if (urlStr.includes('blank-template')) {
        return Promise.resolve(new Response(JSON.stringify(blankData), { status: 200 }))
      }
      return Promise.resolve(new Response(JSON.stringify(ltrData), { status: 200 }))
    })
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByLabelText(/content language/i)).not.toBeDisabled())

    switchTemplateLanguageMock.mockClear()
    const select = screen.getByLabelText(/content language/i)
    await userEvent.selectOptions(select, 'bn-BD')
    expect(switchTemplateLanguageMock).toHaveBeenLastCalledWith({ language: 'bn-BD' })

    await userEvent.click(screen.getByRole('button', { name: /load blank template/i }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load sample template/i })).toBeInTheDocument()
      expect(switchTemplateLanguageMock).toHaveBeenLastCalledWith({ language: 'bn-BD' })
    })

    await userEvent.click(screen.getByRole('button', { name: /load sample template/i }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load blank template/i })).toBeInTheDocument()
      expect(switchTemplateLanguageMock).toHaveBeenLastCalledWith({ language: 'bn-BD' })
    })
  })

  it('keeps selected RTL content language when switching between blank and sample templates', async () => {
    const ltrData = { page: { title: 'LTR' }, comments: {} }
    const rtlData = { page: { title: 'RTL' }, comments: {} }
    const blankLtrData = { page: { title: 'Blank LTR' }, comments: {} }
    const blankRtlData = { page: { title: 'Blank RTL' }, comments: {} }
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      const urlStr = typeof url === 'string' ? url : url.toString()
      if (urlStr.includes('blank-rtl-template')) {
        return Promise.resolve(new Response(JSON.stringify(blankRtlData), { status: 200 }))
      }
      if (urlStr.includes('blank-template')) {
        return Promise.resolve(new Response(JSON.stringify(blankLtrData), { status: 200 }))
      }
      if (urlStr.includes('multi-rtl-language-template')) {
        return Promise.resolve(new Response(JSON.stringify(rtlData), { status: 200 }))
      }
      return Promise.resolve(new Response(JSON.stringify(ltrData), { status: 200 }))
    })
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByLabelText(/content language/i)).not.toBeDisabled())

    await userEvent.click(screen.getByRole('button', { name: 'RTL' }))
    await waitFor(() => {
      const select = screen.getByLabelText(/content language/i) as HTMLSelectElement
      expect(select.value).toBe('fa-IR')
    })

    switchTemplateLanguageMock.mockClear()
    const select = screen.getByLabelText(/content language/i)
    await userEvent.selectOptions(select, 'ur-PK')
    expect(switchTemplateLanguageMock).toHaveBeenLastCalledWith({ language: 'ur-PK' })

    await userEvent.click(screen.getByRole('button', { name: /load blank template/i }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load sample template/i })).toBeInTheDocument()
      expect(switchTemplateLanguageMock).toHaveBeenLastCalledWith({ language: 'ur-PK' })
    })

    await userEvent.click(screen.getByRole('button', { name: /load sample template/i }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load blank template/i })).toBeInTheDocument()
      expect(switchTemplateLanguageMock).toHaveBeenLastCalledWith({ language: 'ur-PK' })
    })
  })

  it('shows MLT warning banner when token payload indicates plan without MLT', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: makeJwt({ plan: 'beeplugin_free' }),
      expires: 3600,
    } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(screen.getByText(/multi-language templates may not be enabled/i)).toBeInTheDocument()
    expect(screen.getByText(/superpowers or enterprise plan/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument()
  })

  it('shows 10 RTL options after switching to RTL collection', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByLabelText(/content language/i)).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'RTL' }))

    await waitFor(() => {
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(10)
      const values = options.map((o) => (o as HTMLOptionElement).value)
      expect(values).toContain('fa-IR')
      expect(values).toContain('ar-SA')
      expect(values).toContain('ps-AF')
      expect(values).toContain('sd-PK')
      expect(values).toContain('ug-CN')
      expect(values).toContain('ckb-IQ')
    })
  })

  it('options at index >= 7 are decorated with dashes on non-enterprise plan', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByLabelText(/content language/i)).toBeInTheDocument())

    const options = screen.getAllByRole('option') as HTMLOptionElement[]
    // First 7 entries are clean
    expect(options[0].textContent).toBe('English (en-US)')
    expect(options[6].textContent).toBe('Napulitano (nap-IT)')
    // Entries at index 7+ are decorated
    expect(options[7].textContent).toBe('--Català (ca-ES)--')
    expect(options[8].textContent).toBe('--Euskara (eu-ES)--')
    expect(options[9].textContent).toBe('--Galego (gl-ES)--')
  })

  it('options have no decoration on enterprise plan', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: makeJwt({ plan: 'enterprise' }),
      expires: 0,
    } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByLabelText(/content language/i)).toBeInTheDocument())

    const options = screen.getAllByRole('option') as HTMLOptionElement[]
    expect(options[7].textContent).toBe('Català (ca-ES)')
    expect(options[8].textContent).toBe('Euskara (eu-ES)')
    expect(options[9].textContent).toBe('Galego (gl-ES)')
  })

  it('selecting a restricted language (index >= 7) on non-enterprise plan shows alert and does not switch', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByLabelText(/content language/i)).not.toBeDisabled())

    await userEvent.selectOptions(screen.getByLabelText(/content language/i), 'ca-ES')

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Upgrade to Enterprise'))
    expect(switchTemplateLanguageMock).not.toHaveBeenCalledWith({ language: 'ca-ES' })
  })

  it('selecting a restricted language on enterprise plan works without alert', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: makeJwt({ plan: 'enterprise' }),
      expires: 0,
    } as never)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByLabelText(/content language/i)).not.toBeDisabled())

    await userEvent.selectOptions(screen.getByLabelText(/content language/i), 'ca-ES')

    expect(alertSpy).not.toHaveBeenCalled()
    expect(switchTemplateLanguageMock).toHaveBeenCalledWith({ language: 'ca-ES' })
  })

  it('handleError shows alert with the error message', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    act(() => {
      mockBuilderCallbacks.onError?.({ message: 'The language is not valid' })
    })

    expect(alertSpy).toHaveBeenCalledWith('Error: The language is not valid')
  })

  it('MLT warning banner can be dismissed', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      const urlStr = typeof url === 'string' ? url : url.toString()
      if (urlStr.includes('multi-ltr-language-template')) {
        return Promise.resolve(new Response(JSON.stringify({ page: { title: 'LTR' }, comments: {} }), { status: 200 }))
      }
      if (urlStr.includes('blank')) {
        return Promise.resolve(new Response(JSON.stringify({ page: {}, comments: {} }), { status: 200 }))
      }
      return Promise.reject(new Error('not found'))
    })
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: makeJwt({ plan: 'beeplugin_free' }),
      expires: 0,
    } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    const select = screen.getByLabelText(/content language/i)
    expect(select).toBeDisabled()
    expect(screen.getByRole('button', { name: 'LTR' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'RTL' })).toBeDisabled()
    expect(screen.getByRole('button', { name: /load blank template/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /^Save$/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /save as template/i })).toBeDisabled()
    expect(screen.queryByText(/your current plan supports the multi-language template feature/i)).not.toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalledWith(expect.stringContaining('multi-ltr-language-template'))
  })

  it('MLT tip can be dismissed and builder area height expands without banner', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: makeJwt({ plan: 'Superpowers' }),
      expires: 0,
    } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())
    expect(screen.getByText(/your plan supports the multi-language templates feature/i)).toBeInTheDocument()

    const buildersArea = document.querySelector('.builders-area') as HTMLDivElement
    expect(buildersArea.style.height).toBe('calc(100vh - 234px)')

    await userEvent.click(screen.getByRole('button', { name: /got it/i }))

    expect(screen.queryByText(/your plan supports the multi-language templates feature/i)).not.toBeInTheDocument()
    expect(buildersArea.style.height).toBe('calc(100vh - 128px)')
  })

  it('retry button in credentials error re-authenticates', async () => {
    vi.mocked(authenticate)
      .mockRejectedValueOnce(new Error('Authentication failed'))
      .mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByText(/invalid or missing credentials/i)).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /retry/i }))

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())
  })

  it('retry button in token error re-authenticates', async () => {
    vi.mocked(authenticate)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByText(/failed to load email builder/i)).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /retry/i }))

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())
  })

  it('loads LTR template via fetch when component mounts', async () => {
    const templateData = { page: { title: 'LTR' }, comments: {} }
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      const urlStr = typeof url === 'string' ? url : url.toString()
      if (urlStr.includes('ltr')) {
        return Promise.resolve(new Response(JSON.stringify(templateData), { status: 200 }))
      }
      return Promise.reject(new Error('not found'))
    })
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('ltr'))
  })

  it('loads RTL template via fetch and uses it when switching to RTL', async () => {
    const ltrData = { page: { title: 'LTR' }, comments: {} }
    const rtlData = { page: { title: 'RTL' }, comments: {} }
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      const urlStr = typeof url === 'string' ? url : url.toString()
      if (urlStr.includes('rtl')) {
        return Promise.resolve(new Response(JSON.stringify(rtlData), { status: 200 }))
      }
      if (urlStr.includes('ltr')) {
        return Promise.resolve(new Response(JSON.stringify(ltrData), { status: 200 }))
      }
      return Promise.reject(new Error('not found'))
    })
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'RTL' }))

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('rtl')))

    await waitFor(() => {
      const options = screen.getAllByRole('option')
      const values = options.map((o) => (o as HTMLOptionElement).value)
      expect(values).toContain('fa-IR')
    })
  })

  it('loads RTL blank template when in blank mode and switching to RTL', async () => {
    const ltrData = { page: { title: 'LTR' }, comments: {} }
    const rtlData = { page: { title: 'RTL' }, comments: {} }
    const blankLtrData = { page: { title: 'Blank LTR' }, comments: {} }
    const blankRtlData = { page: { title: 'Blank RTL' }, comments: {} }
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      const urlStr = typeof url === 'string' ? url : url.toString()
      if (urlStr.includes('blank-rtl-template')) {
        return Promise.resolve(new Response(JSON.stringify(blankRtlData), { status: 200 }))
      }
      if (urlStr.includes('blank-template')) {
        return Promise.resolve(new Response(JSON.stringify(blankLtrData), { status: 200 }))
      }
      if (urlStr.includes('multi-rtl-language-template')) {
        return Promise.resolve(new Response(JSON.stringify(rtlData), { status: 200 }))
      }
      if (urlStr.includes('multi-ltr-language-template')) {
        return Promise.resolve(new Response(JSON.stringify(ltrData), { status: 200 }))
      }
      return Promise.reject(new Error('not found'))
    })
    vi.mocked(authenticate).mockResolvedValueOnce({ access_token: VALID_TOKEN, expires: 0 } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByTestId('builder-mock')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /load blank template/i }))
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('blank-ltr-template'))
    })

    await userEvent.click(screen.getByRole('button', { name: 'RTL' }))

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('blank-rtl-template'))
    })
  })

  it('MLT warning uses blank template even when fetch succeeds', async () => {
    const ltrData = { page: { title: 'LTR' }, comments: {} }
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify(ltrData), { status: 200 })),
    )
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: makeJwt({ plan: 'beeplugin_free' }),
      expires: 0,
    } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(screen.getByText(/multi-language templates may not be enabled/i)).toBeInTheDocument()
  })

  it('shows unknown-plan MLT warning when token has no plan field', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: makeJwt({ uid: 'test-user' }),
      expires: 0,
    } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(screen.getByText(/could not be determined/i)).toBeInTheDocument()
  })

  it('disables left bar and shows overlay class when plan is below minimum required', async () => {
    vi.mocked(authenticate).mockResolvedValueOnce({
      access_token: makeJwt({ plan: 'beeplugin_free' }),
      expires: 3600,
    } as never)
    render(<MultiLanguageExample />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    const select = screen.getByLabelText(/content language/i)
    expect(select).toBeDisabled()

    const ltrButton = screen.getByRole('button', { name: 'LTR' })
    const rtlButton = screen.getByRole('button', { name: 'RTL' })
    expect(ltrButton).toBeDisabled()
    expect(rtlButton).toBeDisabled()

    const wrapper = document.querySelector('.controls-left-wrapper.controls-left-disabled')
    expect(wrapper).toBeInTheDocument()
  })
})
