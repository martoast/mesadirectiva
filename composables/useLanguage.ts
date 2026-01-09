/**
 * Language/Translation composable
 * Provides Spanish (es) and English (en) language support
 */

type Language = 'es' | 'en'

interface TranslationEntry {
  es: string
  en: string
}

interface TranslationObject {
  [key: string]: TranslationEntry | TranslationObject
}

// Global reactive state - shared across all components
const currentLanguage = ref<Language>('es')

// Watchers for language changes
const languageWatchers: Array<(lang: Language) => void> = []

export const useLanguage = () => {
  /**
   * Current language as computed ref
   */
  const language = computed(() => currentLanguage.value)

  /**
   * Switch language and persist to localStorage
   */
  const switchLanguage = (lang: Language) => {
    currentLanguage.value = lang

    if (import.meta.client) {
      localStorage.setItem('preferredLanguage', lang)
    }

    // Notify all watchers
    languageWatchers.forEach(callback => callback(lang))
  }

  /**
   * Initialize language from localStorage on app mount
   */
  const initializeLanguage = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('preferredLanguage') as Language | null
      if (saved && (saved === 'es' || saved === 'en')) {
        currentLanguage.value = saved
      }
    }
  }

  /**
   * Create reactive translations from a translations object
   * Usage:
   *   const translations = { title: { es: 'Hola', en: 'Hello' } }
   *   const t = createTranslations(translations)
   *   // In template: {{ t.title }}
   */
  const t = <T extends TranslationObject>(translations: T): { [K in keyof T]: T[K] extends TranslationEntry ? string : any } => {
    const result: any = {}

    for (const key in translations) {
      const value = translations[key]

      // Check if it's a translation entry (has 'es' and 'en' keys)
      if (value && typeof value === 'object' && 'es' in value && 'en' in value) {
        // Create a getter that returns the correct language
        Object.defineProperty(result, key, {
          get: () => (value as TranslationEntry)[currentLanguage.value],
          enumerable: true
        })
      } else if (value && typeof value === 'object') {
        // Nested translations object - recurse
        result[key] = t(value as TranslationObject)
      }
    }

    return result
  }

  /**
   * Register a callback for language changes
   */
  const onLanguageChange = (callback: (lang: Language) => void) => {
    languageWatchers.push(callback)

    // Return unsubscribe function
    return () => {
      const index = languageWatchers.indexOf(callback)
      if (index > -1) {
        languageWatchers.splice(index, 1)
      }
    }
  }

  /**
   * Get a single translated value
   * Usage: tr({ es: 'Hola', en: 'Hello' })
   */
  const tr = (entry: TranslationEntry): string => {
    return entry[currentLanguage.value]
  }

  return {
    language,
    switchLanguage,
    initializeLanguage,
    t,
    tr,
    onLanguageChange
  }
}
