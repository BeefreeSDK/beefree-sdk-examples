import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  type BeePluginError,
  Builder,
  type IBeeConfig,
  type IEntityContentJson,
  type IToken,
  useBuilder,
} from '@beefree.io/react-email-builder'

import type { BuilderApiRef, LanguageOption } from '../types/types'

const BLANK_TEMPLATE: IEntityContentJson = {
  comments: {},
  page: {} as unknown as IEntityContentJson['page'],
}

type BuilderPanelProps = {
  token: IToken
  useRtl: boolean
  languages: LanguageOption[]
  templateUrl: string | null
  builderApiRef: React.RefObject<BuilderApiRef | null>
  onLoad: () => void
  onError: (error: BeePluginError) => void
}

export function BuilderPanel({
  token,
  useRtl,
  languages,
  templateUrl,
  builderApiRef,
  onLoad,
  onError,
}: BuilderPanelProps) {
  const clientConfig = useMemo<IBeeConfig>(() => {
    const defaultLang = languages[0]
    const additionalLangs = languages.slice(1)
    return {
      uid: 'demo-user',
      container: `beefree-sdk-builder-${useRtl ? 'rtl' : 'ltr'}`,
      editorFonts: {
        showDefaultFonts: true,
        customFonts: useRtl ? [
          {
            name: 'Noto Sans Arabic',
            fontFamily: "'Noto Sans Arabic', sans-serif",
            url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap',
            weights: [400, 700],
          },
          {
            name: 'Noto Nastaliq Urdu',
            fontFamily: "'Noto Nastaliq Urdu', serif",
            url: 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap',
            weights: [400, 700],
          },
          {
            name: 'Noto Sans',
            fontFamily: "'Noto Sans', sans-serif",
            url: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap',
            weights: [400, 700],
          },
        ]
        :
        [],
      },
      language: 'en-US',
      username: 'User 1',
      userColor: '#00aced',
      userHandle: 'user1',
      topBarEnabled: false,
      templateLanguage: { label: defaultLang.label, value: defaultLang.value },
      templateLanguages: additionalLangs.map((l) => ({ label: l.label, value: l.value })),
    }
  }, [useRtl, languages])

  const { id: primaryId, save, saveAsTemplate, getTemplateJson, switchTemplateLanguage } =
    useBuilder(clientConfig)

  useEffect(() => {
    builderApiRef.current = { getTemplateJson, switchTemplateLanguage, save, saveAsTemplate }
    return () => {
      builderApiRef.current = null
    }
  }, [builderApiRef, getTemplateJson, switchTemplateLanguage, save, saveAsTemplate])

  const [template, setTemplate] = useState<IEntityContentJson | null>(
    templateUrl ? null : BLANK_TEMPLATE
  )

  // Fetch template from URL; use BLANK_TEMPLATE when no URL is provided
  useEffect(() => {
    if (!templateUrl) {
      setTemplate(BLANK_TEMPLATE)
      return
    }
    setTemplate(null)
    let cancelled = false
    fetch(templateUrl)
      .then((res) => (res.ok ? (res.json() as Promise<IEntityContentJson>) : null))
      .then((t) => {
        if (!cancelled) setTemplate(t ?? BLANK_TEMPLATE)
      })
      .catch((err) => {
        console.error(`Failed to load template ${templateUrl}:`, err)
        if (!cancelled) setTemplate(BLANK_TEMPLATE)
      })
    return () => { cancelled = true }
  }, [templateUrl])

  if (!template) return null

  return (
    <Builder
      id={primaryId}
      template={template}
      token={token}
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
      onError={onError}
      onWarning={(warning: BeePluginError) => {
        console.warn('Beefree warning:', warning)
      }}
      onLoad={onLoad}
    />
  )
}
