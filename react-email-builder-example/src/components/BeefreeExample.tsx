import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BeePluginError,
  Builder,
  IBeeConfig,
  IEntityContentJson,
  IToken,
  useBuilder,
} from '@beefree.io/react-email-builder'
import { authenticate } from '../services/beefree'
import { TEMPLATE_URLS } from '../config/constants'
import i18nEnUS from '../i18n/en-US.json'
import i18nItIT from '../i18n/it-IT.json'
import i18nEsES from '../i18n/es-ES.json'
import i18nFrFR from '../i18n/fr-FR.json'
import i18nDeDE from '../i18n/de-DE.json'
import i18nPtBR from '../i18n/pt-BR.json'
import i18nIdID from '../i18n/id-ID.json'
import i18nJaJP from '../i18n/ja-JP.json'
import i18nZhCN from '../i18n/zh-CN.json'
import i18nZhHK from '../i18n/zh-HK.json'
import i18nCsCZ from '../i18n/cs-CZ.json'
import i18nNbNO from '../i18n/nb-NO.json'
import i18nDaDK from '../i18n/da-DK.json'
import i18nSvSE from '../i18n/sv-SE.json'
import i18nPlPL from '../i18n/pl-PL.json'
import i18nHuHU from '../i18n/hu-HU.json'
import i18nRuRU from '../i18n/ru-RU.json'
import i18nKoKR from '../i18n/ko-KR.json'
import i18nNlNL from '../i18n/nl-NL.json'
import i18nFiFI from '../i18n/fi-FI.json'
import i18nRoRO from '../i18n/ro-RO.json'
import i18nSlSI from '../i18n/sl-SI.json'

type BuilderType = 'emailBuilder' | 'pageBuilder' | 'popupBuilder' | 'fileManager'

interface BeefreeExampleProps {
  builderType: string
  builderLanguage: string
}

const BLANK_TEMPLATE: IEntityContentJson = {
  comments: {},
  page: {} as unknown as IEntityContentJson['page'],
}

const DEFAULT_CONTENT_LANGUAGE = { label: 'en-US', value: 'en-US' }

const ADDITIONAL_CONTENT_LANGUAGES = [
  { label: 'it-IT', value: 'it-IT' },
  { label: 'es-ES', value: 'es-ES' },
  { label: 'fr-FR', value: 'fr-FR' },
  { label: 'de-DE', value: 'de-DE' },
  { label: 'pt-BR', value: 'pt-BR' },
  { label: 'id-ID', value: 'id-ID' },
  { label: 'ja-JP', value: 'ja-JP' },
  { label: 'zh-CN', value: 'zh-CN' },
  { label: 'zh-HK', value: 'zh-HK' },
  { label: 'cs-CZ', value: 'cs-CZ' },
  { label: 'nb-NO', value: 'nb-NO' },
  { label: 'da-DK', value: 'da-DK' },
  { label: 'sv-SE', value: 'sv-SE' },
  { label: 'pl-PL', value: 'pl-PL' },
  { label: 'hu-HU', value: 'hu-HU' },
  { label: 'ru-RU', value: 'ru-RU' },
  { label: 'ko-KR', value: 'ko-KR' },
  { label: 'nl-NL', value: 'nl-NL' },
  { label: 'fi-FI', value: 'fi-FI' },
  { label: 'ro-RO', value: 'ro-RO' },
  { label: 'sl-SI', value: 'sl-SI' },
]

const ALL_CONTENT_LANGUAGES = [DEFAULT_CONTENT_LANGUAGE, ...ADDITIONAL_CONTENT_LANGUAGES]

const I18N_MAP: Record<string, typeof i18nEnUS> = {
  'en-US': i18nEnUS,
  'it-IT': i18nItIT,
  'es-ES': i18nEsES,
  'fr-FR': i18nFrFR,
  'de-DE': i18nDeDE,
  'pt-BR': i18nPtBR,
  'id-ID': i18nIdID,
  'ja-JP': i18nJaJP,
  'zh-CN': i18nZhCN,
  'zh-HK': i18nZhHK,
  'cs-CZ': i18nCsCZ,
  'nb-NO': i18nNbNO,
  'da-DK': i18nDaDK,
  'sv-SE': i18nSvSE,
  'pl-PL': i18nPlPL,
  'hu-HU': i18nHuHU,
  'ru-RU': i18nRuRU,
  'ko-KR': i18nKoKR,
  'nl-NL': i18nNlNL,
  'fi-FI': i18nFiFI,
  'ro-RO': i18nRoRO,
  'sl-SI': i18nSlSI,
}

function renderSafeHtml(html: string): React.ReactNode {
  const parts = html.split(/(<strong>.*?<\/strong>|<code>.*?<\/code>)/g)
  return parts.map((part, i) => {
    const strongMatch = part.match(/^<strong>(.*)<\/strong>$/)
    if (strongMatch) return <strong key={i}>{strongMatch[1]}</strong>
    const codeMatch = part.match(/^<code>(.*)<\/code>$/)
    if (codeMatch) return <code key={i}>{codeMatch[1]}</code>
    return part
  })
}

function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    return msg.includes('authentication failed') || msg.includes('unauthorized')
      || msg.includes('401') || msg.includes('403') || msg.includes('400')
      || msg.includes('invalid') || msg.includes('credentials') || msg.includes('client')
  }
  return false
}

export const BeefreeExample = ({ builderType, builderLanguage }: BeefreeExampleProps) => {
  const [token, setToken] = useState<IToken | null>(null)
  const [isLoadingToken, setIsLoadingToken] = useState(true)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [credentialsError, setCredentialsError] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [builderLoaded, setBuilderLoaded] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<IEntityContentJson>(BLANK_TEMPLATE)

  const [isShared, setIsShared] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [secondToken, setSecondToken] = useState<IToken | null>(null)
  const [splitPosition, setSplitPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [focusedInstanceId, setFocusedInstanceId] = useState<string | null>(null)
  const [builderKey, setBuilderKey] = useState(0)

  const buildersAreaRef = useRef<HTMLDivElement>(null)
  const isSharedRef = useRef(isShared)
  const builderTypeRef = useRef(builderType)

  useEffect(() => { isSharedRef.current = isShared }, [isShared])
  useEffect(() => { builderTypeRef.current = builderType }, [builderType])

  const clientConfig = useMemo<IBeeConfig>(() => ({
    uid: 'demo-user',
    container: 'beefree-sdk-builder',
    language: 'en-US',
    username: 'User 1',
    userColor: '#00aced',
    userHandle: 'user1',
    templateLanguage: DEFAULT_CONTENT_LANGUAGE,
    templateLanguages: ADDITIONAL_CONTENT_LANGUAGES,
  }), [])

  const coEditingConfig = useMemo<IBeeConfig>(() => ({
    uid: 'demo-user-2',
    container: 'beefree-sdk-builder-2',
    language: 'en-US',
    username: 'User 2',
    userColor: '#000000',
    userHandle: 'user2',
    templateLanguage: DEFAULT_CONTENT_LANGUAGE,
    templateLanguages: ADDITIONAL_CONTENT_LANGUAGES,
  }), [])

  const {
    id: primaryId,
    updateConfig,
    preview,
    save,
    saveAsTemplate,
    toggleStructure,
    load,
    getTemplateJson,
    switchTemplateLanguage,
  } = useBuilder(clientConfig)

  const {
    id: coEditingId,
    updateConfig: coEditingUpdateConfig,
    switchTemplateLanguage: coEditingSwitchTemplateLanguage,
  } = useBuilder(coEditingConfig)

  const builderReady = !!token && !credentialsError && !tokenError && !isLoadingToken

  const instanceIds = useMemo(() => {
    if (!builderReady) return []
    const ids = [primaryId]
    if (isShared && secondToken && sessionId) {
      ids.push(coEditingId)
    }
    return ids
  }, [primaryId, coEditingId, isShared, secondToken, sessionId, builderReady])

  const activeInstanceId = builderReady ? (focusedInstanceId ?? instanceIds[0] ?? null) : null

  const i18nStrings = useMemo(
    () => (I18N_MAP[builderLanguage] ?? i18nEnUS).credentials,
    [builderLanguage],
  )

  const i18nDescription = useMemo(
    () => i18nStrings.description.replace('{{type}}', builderType),
    [i18nStrings, builderType],
  )

  // ---- Token management ----

  const loadBeefreeToken = useCallback(async (bt: BuilderType) => {
    try {
      setIsLoadingToken(true)
      setTokenError(null)
      setCredentialsError(false)
      setFocusedInstanceId(null)
      setBuilderLoaded(false)

      const newToken = await authenticate('demo-user', bt)
      setToken(newToken)
    } catch (error) {
      console.error('Failed to load Beefree token:', error)
      if (isAuthError(error)) {
        setCredentialsError(true)
      } else {
        setTokenError(`Failed to load ${bt}. Please try again.`)
      }
    } finally {
      setIsLoadingToken(false)
    }
  }, [])

  const refreshToken = useCallback(() => {
    void loadBeefreeToken(builderTypeRef.current as BuilderType)
  }, [loadBeefreeToken])

  const fetchSecondToken = useCallback(async () => {
    try {
      const bt = builderTypeRef.current as BuilderType
      const newToken = await authenticate('demo-user-2', bt)
      setSecondToken(newToken)
    } catch (error) {
      console.error('Failed to get second token:', error)
    }
  }, [])

  // ---- Co-editing ----

  const stopCoEditing = useCallback(() => {
    setIsShared(false)
    setSessionId(null)
    setSecondToken(null)
    setFocusedInstanceId(null)
    setBuilderLoaded(false)
    setBuilderKey((k) => k + 1)
  }, [])

  const toggleCoEditing = useCallback(() => {
    if (isSharedRef.current) {
      stopCoEditing()
    } else {
      setIsShared(true)
      setBuilderKey((k) => k + 1)
    }
  }, [stopCoEditing])

  // ---- Builder actions ----

  const loadSampleTemplate = useCallback(async () => {
    try {
      setIsExecuting(true)
      const bt = builderTypeRef.current as BuilderType
      const templateUrl = TEMPLATE_URLS[bt]
      if (!templateUrl) {
        alert('No sample template available for this builder type.')
        return
      }
      const data = await fetch(templateUrl).then((res) => res.json())
      const templateData: IEntityContentJson = data.page ? data : data.json

      if (isSharedRef.current) {
        setSessionId(null)
        setSecondToken(null)
        setCurrentTemplate(templateData)
        setBuilderKey((k) => k + 1)
      } else {
        load(templateData)
      }
    } catch (error) {
      console.error('Load template failed:', error)
      alert(`Load failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExecuting(false)
    }
  }, [load])

  const exportTemplateJson = useCallback(async () => {
    try {
      setIsExecuting(true)
      const json = await getTemplateJson()
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `template-${Date.now()}.json`
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExecuting(false)
    }
  }, [getTemplateJson])

  const onContentLanguageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = { language: event.target.value }
    switchTemplateLanguage(lang)
    if (isSharedRef.current) {
      coEditingSwitchTemplateLanguage(lang)
    }
  }, [switchTemplateLanguage, coEditingSwitchTemplateLanguage])

  // ---- Draggable split divider ----

  const onMouseMove = useCallback((e: MouseEvent) => {
    const area = buildersAreaRef.current
    if (!area) return
    const rect = area.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    setSplitPosition(Math.min(80, Math.max(20, pct)))
  }, [])

  const onMouseUp = useCallback(() => {
    setIsDragging(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }, [onMouseMove])

  const onDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [onMouseMove, onMouseUp])

  // ---- Effects ----

  useEffect(() => {
    if (isSharedRef.current) {
      stopCoEditing()
    } else {
      setBuilderKey((k) => k + 1)
    }
    void loadBeefreeToken(builderType as BuilderType)
  }, [builderType, loadBeefreeToken, stopCoEditing])

  useEffect(() => {
    if (!builderReady || !builderLoaded) return
    void updateConfig({ language: builderLanguage })
    if (isSharedRef.current) {
      void coEditingUpdateConfig({ language: builderLanguage })
    }
  }, [builderLanguage, builderReady, builderLoaded, updateConfig, coEditingUpdateConfig])

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  // ---- Builder callbacks ----

  const handleSessionStarted = useCallback((event: { sessionId?: string }) => {
    if (event?.sessionId) {
      setSessionId(event.sessionId)
      void fetchSecondToken()
    }
  }, [fetchSecondToken])

  const handlePrimaryError = useCallback((error: BeePluginError) => {
    console.error('Beefree error:', error)
    const msg = error.message || JSON.stringify(error)
    if (isSharedRef.current && /co-editing/i.test(msg)) {
      alert('Co-editing is only available on Superpowers or Enterprise plans.')
      stopCoEditing()
    } else {
      alert(`Error: ${msg}`)
    }
  }, [stopCoEditing])

  // ---- Render ----

  return (
    <div className="beefree-example">
      <div className="controls">
        <div className="selectors">
          <div className="language-selector">
            <label htmlFor="contentLanguage">Content language:</label>
            <select
              id="contentLanguage"
              disabled={!builderReady || isExecuting}
              onChange={onContentLanguageChange}
            >
              {ALL_CONTENT_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="button-group">
          <button disabled={!builderReady || isExecuting} onClick={() => preview()}>
            Preview
          </button>
          <button disabled={!builderReady || isExecuting} onClick={() => save()}>
            Save
          </button>
          <button disabled={!builderReady || isExecuting} onClick={() => saveAsTemplate()}>
            Save as Template
          </button>
          <button disabled={!builderReady || isExecuting} onClick={() => toggleStructure()}>
            Toggle Structure
          </button>
          <button disabled={!builderReady || isExecuting} onClick={loadSampleTemplate}>
            Load Sample Template
          </button>
          <button disabled={!builderReady || isExecuting} onClick={exportTemplateJson}>
            Export JSON
          </button>
          <button
            disabled={!builderReady || isExecuting}
            className={isShared ? 'active' : undefined}
            onClick={toggleCoEditing}
          >
            Co-editing
          </button>
        </div>

        <div className="info">
          <p><strong>Selected Type:</strong> {builderType}</p>
          <p><strong>Active Instance:</strong> {activeInstanceId || 'None'}</p>
          <p><strong>Available Instances:</strong> {instanceIds.join(', ') || 'None'}</p>
        </div>
      </div>

      {credentialsError ? (
        <div className="credentials-notice">
          <h2>{i18nStrings.title}</h2>
          <p>{renderSafeHtml(i18nDescription)}</p>
          <ol>
            <li>
              <a href="https://developers.beefree.io/console" target="_blank" rel="noopener noreferrer">
                {i18nStrings.step1}
              </a>
            </li>
            <li>{i18nStrings.step2}</li>
            <li>{i18nStrings.step3}</li>
          </ol>
          <p>
            {i18nStrings.docs}{' '}
            <a href="https://docs.beefree.io/get-started" target="_blank" rel="noopener noreferrer">
              Getting Started guide
            </a>.
          </p>
          <button onClick={refreshToken}>{i18nStrings.retry}</button>
        </div>
      ) : isLoadingToken ? (
        <div className="loading">
          Loading {builderType}...
        </div>
      ) : tokenError ? (
        <div className="error">
          <p>{tokenError}</p>
          <button onClick={refreshToken}>Retry</button>
        </div>
      ) : token ? (
        <div
          className={`builders-area${isShared ? ' co-editing' : ''}`}
          ref={buildersAreaRef}
        >
          <div
            className={`builder-panel${isDragging ? ' dragging' : ''}`}
            style={{ width: isShared ? `${splitPosition}%` : '100%' }}
            onClick={() => setFocusedInstanceId(clientConfig.container ?? null)}
          >
            <Builder
              key={`primary-${builderKey}`}
              id={primaryId}
              template={currentTemplate}
              token={token}
              shared={isShared}
              onSave={(pageJson: string, pageHtml: string) => {
                console.log('onSave called:', { pageJson, pageHtml })
                alert('Template saved! Check console for details.')
              }}
              onSaveAsTemplate={(pageJson: string) => {
                console.log('onSaveAsTemplate called:', { pageJson })
                alert('Template saved as template! Check console for details.')
              }}
              onSend={(htmlFile: string) => {
                console.log('onSend called:', htmlFile)
                alert('Template sent! Check console for details.')
              }}
              onError={handlePrimaryError}
              onSessionStarted={handleSessionStarted}
              onWarning={(warning: BeePluginError) => {
                console.warn('Beefree warning:', warning)
              }}
              onLoad={() => {
                console.log('Builder is ready')
                setBuilderLoaded(true)
              }}
            />
          </div>

          {isShared && (
            <>
              <div
                className={`split-divider${isDragging ? ' dragging' : ''}`}
                onMouseDown={onDividerMouseDown}
              >
                <div className="split-divider-handle" />
              </div>
              <div
                className={`builder-panel${isDragging ? ' dragging' : ''}`}
                style={{ width: `${100 - splitPosition}%` }}
                onClick={() => setFocusedInstanceId(coEditingConfig.container ?? null)}
              >
                {secondToken && sessionId ? (
                  <Builder
                    key={`co-editing-${builderKey}`}
                    id={coEditingId}
                    template={BLANK_TEMPLATE}
                    token={secondToken}
                    shared
                    sessionId={sessionId}
                    onSave={(pageJson: string) => {
                      console.log('Co-editing onSave called:', pageJson)
                    }}
                    onError={(error: BeePluginError) => {
                      console.error('Co-editing error:', error)
                    }}
                    onWarning={(warning: BeePluginError) => {
                      console.warn('Co-editing warning:', warning)
                    }}
                  />
                ) : (
                  <div className="loading">Joining session...</div>
                )}
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}
