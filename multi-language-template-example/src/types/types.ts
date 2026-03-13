export type LanguageOption = { label: string; value: string }

export type BuilderApiRef = {
  getTemplateJson: () => Promise<unknown>
  switchTemplateLanguage: (opts: { language: string }) => void
  save: (options?: { language?: string }) => void
  saveAsTemplate: () => void
}
