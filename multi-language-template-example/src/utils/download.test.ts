import { beforeEach, describe, expect, it, vi } from 'vitest'
import { downloadFile } from './download'

describe('downloadFile', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('downloads using a temporary anchor element', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild')
    const removeSpy = vi.spyOn(document.body, 'removeChild')
    const link = document.createElement('a')
    const clickSpy = vi.spyOn(link, 'click').mockImplementation(() => {})
    vi.spyOn(document, 'createElement').mockReturnValue(link)

    downloadFile('<h1>Hello</h1>', 'sample.html')

    expect(appendSpy).toHaveBeenCalledWith(link)
    expect(clickSpy).toHaveBeenCalled()
    expect(removeSpy).toHaveBeenCalledWith(link)
    expect(link.download).toBe('sample.html')
    expect(link.href.startsWith('data:text/html;base64,')).toBe(true)
  })

  it('falls back to window.open when click flow throws', () => {
    const link = document.createElement('a')
    vi.spyOn(document, 'createElement').mockReturnValue(link)
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {
      throw new Error('append failed')
    })
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    downloadFile('{"page":{}}', 'template.json', 'application/json')

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringMatching(/^data:application\/json;base64,/),
      '_blank'
    )
  })
})
