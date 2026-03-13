import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type BeePluginError,
  type IToken,
} from '@beefree.io/react-email-builder'
import { authenticate } from '../services/beefree'
import {
  type MltWarningReason,
  type Plan,
  getLanguageLimitForPlan,
  getMltWarningReason,
  getPlanFromToken,
} from '../utils/plan'
import i18nEnUS from '../i18n/en-US.json'
import { BuilderPanel } from './BuilderPanel'
import type { BuilderApiRef, LanguageOption } from '../types/types'

/**
 * Controls how languages exceeding the plan-tier limit appear in the dropdown:
 *
 * - `false` (default): all languages are shown; those beyond the limit are
 *   decorated with --dashes-- and selecting one triggers an alert explaining
 *   the Enterprise requirement.
 *
 * - `true`: the dropdown is capped to only the languages the current plan
 *   allows — no decoration or alert is needed because out-of-range options
 *   simply don't appear.
 */
const SHOULD_HIDE_EXCEEDING_LANGUAGES = false

const LTR_TEMPLATE_URL = '/templates/multi-ltr-language-template.json'
const RTL_TEMPLATE_URL = '/templates/multi-rtl-language-template.json'
const BLANK_LTR_TEMPLATE_URL = '/templates/blank-ltr-template.json'
const BLANK_RTL_TEMPLATE_URL = '/templates/blank-rtl-template.json'
const BUILDER_HEIGHT_WITH_BANNER = 'calc(100vh - 234px)'
const BUILDER_HEIGHT_NO_BANNER = 'calc(100vh - 128px)'

type TemplateMode = 'sample' | 'blank'

const LTR_LANGUAGES: LanguageOption[] = [
  { label: 'English', value: 'en-US' },
  { label: '普通话', value: 'zh-CN' },
  { label: 'हिन्दी', value: 'hi-IN' },
  { label: 'Español', value: 'es-ES' },
  { label: 'Français', value: 'fr-FR' },
  { label: 'বাংলা', value: 'bn-BD' },
  { label: 'Napulitano', value: 'nap-IT' },
  { label: 'Català', value: 'ca-ES' },
  { label: 'Euskara', value: 'eu-ES' },
  { label: 'Galego', value: 'gl-ES' },
]

const RTL_LANGUAGES: LanguageOption[] = [
  { label: 'فارسی', value: 'fa-IR' },
  { label: '日本語', value: 'ja-JP' },
  { label: 'العربية', value: 'ar-SA' },
  { label: 'Türkçe', value: 'tr-TR' },
  { label: 'ދިވެހި', value: 'dv-MV' },
  { label: 'اردو', value: 'ur-PK' },
  { label: 'پښتو', value: 'ps-AF' },
  { label: 'سنڌي', value: 'sd-PK' },
  { label: 'ئۇيغۇرچە', value: 'ug-CN' },
  { label: 'سۆرانی', value: 'ckb-IQ' },
]

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
    return (
      msg.includes('authentication failed') ||
      msg.includes('unauthorized') ||
      msg.includes('401') ||
      msg.includes('403') ||
      msg.includes('400') ||
      msg.includes('invalid') ||
      msg.includes('credentials') ||
      msg.includes('client')
    )
  }
  return false
}

export function MultiLanguageExample() {
  const [token, setToken] = useState<IToken | null>(null)
  const [isLoadingToken, setIsLoadingToken] = useState(true)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [credentialsError, setCredentialsError] = useState(false)
  const [builderLoaded, setBuilderLoaded] = useState(false)
  const [useRtl, setUseRtl] = useState(false)
  const [plan, setPlan] = useState<Plan>('Unknown')
  const [contentLanguage, setContentLanguage] = useState(LTR_LANGUAGES[0].value)
  const [mltWarningReason, setMltWarningReason] = useState<MltWarningReason | null>(null)
  const [mltWarningDismissed, setMltWarningDismissed] = useState(false)
  const [mltTipDismissed, setMltTipDismissed] = useState(false)
  const [templateMode, setTemplateMode] = useState<TemplateMode>('sample')

  const languageLimit = getLanguageLimitForPlan(plan)

  const contentLanguages = useMemo(() => {
    const all = useRtl ? RTL_LANGUAGES : LTR_LANGUAGES
    return SHOULD_HIDE_EXCEEDING_LANGUAGES ? all.slice(0, languageLimit) : all
  }, [useRtl, languageLimit])

  const builderApiRef = useRef<BuilderApiRef | null>(null)
  const builderReady = !!token && !credentialsError && !tokenError && !isLoadingToken && builderLoaded
  const i18nCredentials = i18nEnUS.credentials
  const i18nWarning = i18nEnUS.mltWarning
  const i18nTip = i18nEnUS.mltTip
  const hasMltRestriction = !!mltWarningReason
  const showMltWarning = hasMltRestriction && !mltWarningDismissed
  const showMltTip = !hasMltRestriction && !mltTipDismissed
  const sampleTemplateUrl = useRtl ? RTL_TEMPLATE_URL : LTR_TEMPLATE_URL
  const blankTemplateUrl = useRtl ? BLANK_RTL_TEMPLATE_URL : BLANK_LTR_TEMPLATE_URL
  const selectedTemplateUrl = templateMode === 'blank' ? blankTemplateUrl : sampleTemplateUrl
  const templateUrl = hasMltRestriction ? null : selectedTemplateUrl
  const templateToggleLabel = templateMode === 'blank' ? 'Load Sample Template' : 'Load Blank Template'
  const builderAreaHeight = (showMltWarning || showMltTip)
    ? BUILDER_HEIGHT_WITH_BANNER
    : BUILDER_HEIGHT_NO_BANNER

  const mltWarning = useMemo(() => (
      <div className="mlt-warning-banner" role="alert">
        <div className="mlt-warning-content">
          <strong>{i18nWarning.title}</strong>
          <p>
            {mltWarningReason === 'plan' ? i18nWarning.plan : i18nWarning.unknown}
          </p>
          <div className="mlt-warning-actions">
            <a
              href="https://developers.beefree.io/console"
              target="_blank"
              rel="noopener noreferrer"
            >
              {i18nWarning.consoleLink}
            </a>
            <button
              type="button"
              onClick={() => setMltWarningDismissed(true)}
              aria-label={i18nWarning.dismiss}
            >
              {i18nWarning.dismiss}
            </button>
          </div>
        </div>
      </div>
    ), [i18nWarning, mltWarningReason]
  )

  const mltTip = useMemo(() => (
      <div className="mlt-warning-banner" role="alert">
        <div className="mlt-warning-content">
          <strong>{i18nTip.title}</strong>
          <p>
            {i18nTip.tip1}
            <a
              href="https://github.com/BeefreeSDK/beefree-sdk-examples/tree/main/multi-language-template-example#readme"
              target="_blank"
              rel="noopener noreferrer"
            >
              {i18nTip.tip2}
            </a>
            {i18nTip.tip3}
          </p>
          <div className="mlt-warning-actions">
            <a
              href="https://developers.beefree.io/console"
              target="_blank"
              rel="noopener noreferrer"
            >
              {i18nTip.consoleLink}
            </a>
            <button
              type="button"
              onClick={() => setMltTipDismissed(true)}
              aria-label={i18nTip.dismiss}
            >
              {i18nTip.dismiss}
            </button>
          </div>
        </div>
      </div>
  ), [i18nTip])

  const loadBeefreeToken = useCallback(async () => {
    try {
      setIsLoadingToken(true)
      setTokenError(null)
      setCredentialsError(false)
      setBuilderLoaded(false)
      setMltWarningReason(null)
      setMltWarningDismissed(false)
      setMltTipDismissed(false)
      const newToken = await authenticate()
      setToken(newToken)
      const detectedPlan = getPlanFromToken(newToken.access_token)
      setPlan(detectedPlan)
      const reason = getMltWarningReason(detectedPlan)
      if (reason) {
        setMltWarningReason(reason)
      }
    } catch (error) {
      console.error('Failed to load Beefree token:', error)
      if (isAuthError(error)) {
        setCredentialsError(true)
      } else {
        setTokenError('Failed to load Email Builder. Please try again.')
      }
    } finally {
      setIsLoadingToken(false)
    }
  }, [])

  const refreshToken = useCallback(() => {
    void loadBeefreeToken()
  }, [loadBeefreeToken])

  const switchLanguageDirection = useCallback(() => {
    setBuilderLoaded(false)
    setUseRtl((prev) => {
      const next = !prev
      setContentLanguage(next ? RTL_LANGUAGES[0].value : LTR_LANGUAGES[0].value)
      return next
    })
  }, [])

  const onContentLanguageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    const idx = contentLanguages.findIndex((l) => l.value === value)
    if (idx >= languageLimit) {
      const limitMsg = `The Beefree SDK supports up to ${languageLimit} template languages ` +
        `(1 main language + ${languageLimit - 1} translations) on your current plan.\n\n`
      const alertMsg = (plan === 'Enterprise') ? 
        `A "${contentLanguages[idx]?.label}" translation would go beyond your current plan limits.\n` + limitMsg
        :
        `The "${contentLanguages[idx]?.label}" translation would exceed your Superpowers plan.\n` + limitMsg +
        `Upgrade to Enterprise to unlock additional languages.\n\n`
      alert(
        alertMsg +
        `See: https://docs.beefree.io/beefree-sdk/other-customizations/multi-language-templates`
      )
      return
    }
    setContentLanguage(value)
    builderApiRef.current?.switchTemplateLanguage({ language: value })
  }, [contentLanguages, languageLimit, plan])

  useEffect(() => {
    void loadBeefreeToken()
  }, [loadBeefreeToken])

  const handleBuilderLoad = useCallback(() => {
    setBuilderLoaded(true)
    builderApiRef.current?.switchTemplateLanguage({ language: contentLanguage })
  }, [contentLanguage])

  const handleError = useCallback((error: BeePluginError) => {
    console.error('Beefree error:', error)
    alert(`Error: ${error.message || JSON.stringify(error)}`)
  }, [])

  if (credentialsError) {
    return (
      <div className="beefree-example">
        <div className="credentials-notice">
          <h2>{i18nCredentials.title}</h2>
          <p>{renderSafeHtml(i18nCredentials.description)}</p>
          <ol>
            <li>
              <a
                href="https://developers.beefree.io/console"
                target="_blank"
                rel="noopener noreferrer"
              >
                {i18nCredentials.step1}
              </a>
            </li>
            <li>{i18nCredentials.step2}</li>
            <li>{i18nCredentials.step3}</li>
          </ol>
          <p>
            {i18nCredentials.docs}{' '}
            <a href="https://docs.beefree.io/get-started" target="_blank" rel="noopener noreferrer">
              Getting Started guide
            </a>
            .
          </p>
          <button type="button" onClick={refreshToken}>
            {i18nCredentials.retry}
          </button>
        </div>
      </div>
    )
  }

  if (isLoadingToken) {
    return (
      <div className="beefree-example">
        <div className="loading">Loading Email Builder...</div>
      </div>
    )
  }

  if (tokenError) {
    return (
      <div className="beefree-example">
        <div className="error">
          <p>{tokenError}</p>
          <button type="button" onClick={refreshToken}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  // token is always set if we reach this point (all null/error states are caught above),
  // but the guard narrows the type from IToken | null to IToken for TypeScript.
  /* istanbul ignore next */
  if (!token) return null

  return (
    <div className="beefree-example">
      {showMltWarning && mltWarning}
      {showMltTip && mltTip}
      <div className="controls">
        <div
          className={`controls-left-wrapper${hasMltRestriction ? ' controls-left-disabled' : ''}`}
        >
          <div className="controls-left">
            <div className="language-selector">
              <label htmlFor="contentLanguage">Content language:</label>
              <div className="language-select-wrapper">
                <select
                  id="contentLanguage"
                  value={contentLanguage}
                  disabled={!builderReady || hasMltRestriction}
                  onChange={onContentLanguageChange}
                >
                  {contentLanguages.map((lang, idx) => (
                    <option key={lang.value} value={lang.value}>
                      {idx >= languageLimit ? `--${lang.label} (${lang.value})--` : `${lang.label} (${lang.value})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="orientation-toggle" role="group" aria-label="Orientation">
              <span className="orientation-label">Orientation:</span>
              <div className="orientation-buttons">
                <button
                  type="button"
                  className={!useRtl ? 'active' : ''}
                  disabled={!builderReady || hasMltRestriction}
                  onClick={() => useRtl && switchLanguageDirection()}
                  aria-pressed={!useRtl}
                >
                  LTR
                </button>
                <button
                  type="button"
                  className={useRtl ? 'active' : ''}
                  disabled={!builderReady || hasMltRestriction}
                  onClick={() => !useRtl && switchLanguageDirection()}
                  aria-pressed={useRtl}
                >
                  RTL
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button 
            type="button"
            disabled={!builderReady || hasMltRestriction}
            onClick={() => {
              setBuilderLoaded(false)
              setTemplateMode((prev) => (prev === 'blank' ? 'sample' : 'blank'))
            }}
          >
            {templateToggleLabel}
          </button>
          <button
            type="button"
            disabled={!builderReady || hasMltRestriction}
            onClick={() => builderApiRef.current?.save()}
          >
            Save
          </button>
          <button
            type="button"
            disabled={!builderReady || hasMltRestriction}
            onClick={() => builderApiRef.current?.saveAsTemplate()}
          >
            Save as Template
          </button>
        </div>
      </div>

      <div className="builders-area" style={{ height: builderAreaHeight }}>
        <div className="builder-panel" style={{ width: '100%' }}>
          <BuilderPanel
            key={`${useRtl ? 'rtl' : 'ltr'}-${templateMode}`}
            token={token}
            useRtl={useRtl}
            languages={contentLanguages}
            templateUrl={templateUrl}
            builderApiRef={builderApiRef}
            onLoad={handleBuilderLoad}
            onError={handleError}
          />
        </div>
      </div>
    </div>
  )
}
