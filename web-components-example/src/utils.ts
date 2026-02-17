import type { IEntityContentJson, IToken } from '@beefree.io/sdk/dist/types/bee'
import { AUTH_PROXY_URL, DEFAULT_UID, DEFAULT_TEMPLATE_URL } from './config/constants.ts'

type BeefreeElement = HTMLElement & Record<string, unknown>

interface PendingUpdate {
  method: string
  fallbackProp: string
  value: unknown
}

const pendingBeefreeUpdates: PendingUpdate[] = []
let beefreeComponentListenerBound = false

const getBeefreeComponent = (): BeefreeElement | null => {
  return document.querySelector('beefree-component') as BeefreeElement | null
}

const flushBeefreeUpdates = (element: BeefreeElement): void => {
  while (pendingBeefreeUpdates.length) {
    const update = pendingBeefreeUpdates.shift()!
    if (typeof element[update.method] === 'function') {
      (element[update.method] as (value: unknown) => void)(update.value)
    } else {
      element[update.fallbackProp] = update.value
    }
  }
}

const ensureBeefreeComponentListener = (): void => {
  if (beefreeComponentListenerBound) {
    return
  }

  beefreeComponentListenerBound = true

  const applyUpdates = (): void => {
    const element = getBeefreeComponent()
    if (element) {
      flushBeefreeUpdates(element)
    } else if (pendingBeefreeUpdates.length) {
      requestAnimationFrame(applyUpdates)
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyUpdates, { once: true })
  } else {
    applyUpdates()
  }
}

export const updateBeefreeComponent = (prop: string, value: unknown): void => {
  const methodName = `set${prop.charAt(0).toUpperCase()}${prop.slice(1)}`
  const element = getBeefreeComponent()
  if (element) {
    element[prop] = value
    return
  }

  pendingBeefreeUpdates.push({ method: methodName, fallbackProp: prop, value })
  ensureBeefreeComponentListener()
}

export const getTemplate = async (): Promise<IEntityContentJson> => {
  const response = await fetch(DEFAULT_TEMPLATE_URL)
  if (!response.ok) {
    throw new Error(`Failed to load template: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<IEntityContentJson>
}

export const loginV2 = async (): Promise<IToken> => {
  const response = await fetch(AUTH_PROXY_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid: DEFAULT_UID,
    }),
  })
  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<IToken>
}
