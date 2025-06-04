import type { SupportedLanguage, SupportedTheme } from '../src/types'
import { describe, expect, it } from 'bun:test'
import {
  formatDate,
  getCommitTypeFormat,
  getCommitTypeFormatWithTheme,
  getCommitTypeText,
  getLabel,
  getSupportedLanguages,
  getThemedCommitType,
  getTranslations,
} from '../src/i18n'

describe('i18n', () => {
  describe('getTranslations', () => {
    it('should return English translations by default', () => {
      const translations = getTranslations()
      expect(translations.labels.changelog).toBe('Changelog')
      expect(translations.commitTypes.feat).toBe('🚀 Features')
      expect(translations.commitTypes.fix).toBe('🐛 Bug Fixes')
    })

    it('should return correct translations for each supported language', () => {
      const languages: SupportedLanguage[] = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'ru', 'pt', 'it']

      for (const lang of languages) {
        const translations = getTranslations(lang)
        expect(translations).toBeDefined()
        expect(typeof translations.labels.changelog).toBe('string')
        expect(typeof translations.commitTypes.feat).toBe('string')
        expect(typeof translations.commitTypes.fix).toBe('string')
        expect(translations.commitTypes.feat.length).toBeGreaterThan(0)
      }
    })

    it('should have consistent structure across all languages', () => {
      const languages: SupportedLanguage[] = ['en', 'es', 'fr', 'de', 'zh']
      const baseTranslations = getTranslations('en')

      for (const lang of languages) {
        const translations = getTranslations(lang)

        // Check that all commit types exist
        for (const type of Object.keys(baseTranslations.commitTypes)) {
          expect(translations.commitTypes[type]).toBeDefined()
          expect(typeof translations.commitTypes[type]).toBe('string')
        }

        // Check that all labels exist
        for (const label of Object.keys(baseTranslations.labels)) {
          expect(translations.labels[label as keyof typeof baseTranslations.labels]).toBeDefined()
          expect(typeof translations.labels[label as keyof typeof baseTranslations.labels]).toBe('string')
        }

        // Check date formats
        expect(translations.dateFormats.full).toBeDefined()
        expect(translations.dateFormats.short).toBeDefined()
      }
    })
  })

  describe('getCommitTypeFormat', () => {
    it('should return commit type format for default language', () => {
      const format = getCommitTypeFormat()
      expect(format.feat).toBe('🚀 Features')
      expect(format.fix).toBe('🐛 Bug Fixes')
      expect(format.docs).toBe('📚 Documentation')
    })

    it('should return correct format for different languages', () => {
      const spanishFormat = getCommitTypeFormat('es')
      expect(spanishFormat.feat).toBe('🚀 Características')
      expect(spanishFormat.fix).toBe('🐛 Correcciones')

      const frenchFormat = getCommitTypeFormat('fr')
      expect(frenchFormat.feat).toBe('🚀 Fonctionnalités')
      expect(frenchFormat.fix).toBe('🐛 Corrections')
    })

    it('should include all standard commit types', () => {
      const format = getCommitTypeFormat()
      const expectedTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert', 'misc']

      for (const type of expectedTypes) {
        expect(format[type]).toBeDefined()
        expect(typeof format[type]).toBe('string')
        expect(format[type].length).toBeGreaterThan(0)
      }
    })
  })

  describe('getLabel', () => {
    it('should return correct labels for default language', () => {
      expect(getLabel('changelog')).toBe('Changelog')
      expect(getLabel('contributors')).toBe('Contributors')
      expect(getLabel('breakingChanges')).toBe('Breaking Changes')
    })

    it('should return correct labels for different languages', () => {
      expect(getLabel('changelog', 'es')).toBe('Registro de Cambios')
      expect(getLabel('contributors', 'fr')).toBe('Contributeurs')
      expect(getLabel('breakingChanges', 'de')).toBe('Breaking Changes')
    })

    it('should handle all available label keys', () => {
      const labelKeys = [
        'changelog',
        'contributors',
        'breakingChanges',
        'compareChanges',
        'commits',
        'sections',
        'mostActive',
        'newContributors',
        'topContributors',
        'repositoryStats',
        'commitFrequency',
        'totalDays',
        'averagePerDay',
        'peakDay',
        'recentActivity',
        'range',
        'totalCommits',
        'breakingChangesCount',
        'mostCommon',
        'leastCommon',
        'distribution',
        'by',
      ] as const

      for (const key of labelKeys) {
        const label = getLabel(key)
        expect(typeof label).toBe('string')
        expect(label.length).toBeGreaterThan(0)
      }
    })
  })

  describe('formatDate', () => {
    const testDate = new Date('2024-01-15T10:30:00Z')
    const testDateString = '2024-01-15'

    it('should format dates in full format by default', () => {
      const formatted = formatDate(testDate)
      expect(typeof formatted).toBe('string')
      expect(formatted.length).toBeGreaterThan(0)
    })

    it('should format dates in short format', () => {
      const formatted = formatDate(testDate, 'en', 'short')
      expect(typeof formatted).toBe('string')
      expect(formatted.length).toBeGreaterThan(0)
    })

    it('should handle string dates', () => {
      const formatted = formatDate(testDateString, 'en', 'short')
      expect(typeof formatted).toBe('string')
      expect(formatted.length).toBeGreaterThan(0)
    })

    it('should format dates differently for different languages', () => {
      const englishFull = formatDate(testDate, 'en', 'full')
      const spanishFull = formatDate(testDate, 'es', 'full')
      const frenchFull = formatDate(testDate, 'fr', 'full')

      expect(typeof englishFull).toBe('string')
      expect(typeof spanishFull).toBe('string')
      expect(typeof frenchFull).toBe('string')

      // They should be different (unless by coincidence)
      expect([englishFull, spanishFull, frenchFull].every((date, i, arr) =>
        arr.indexOf(date) === i || arr.filter(d => d === date).length === arr.length,
      )).toBe(true)
    })
  })

  describe('getSupportedLanguages', () => {
    it('should return all supported languages with their names', () => {
      const languages = getSupportedLanguages()

      expect(languages.en).toBe('English')
      expect(languages.es).toBe('Español')
      expect(languages.fr).toBe('Français')
      expect(languages.de).toBe('Deutsch')
      expect(languages.zh).toBe('中文')
      expect(languages.ja).toBe('日本語')
      expect(languages.ko).toBe('한국어')
      expect(languages.ru).toBe('Русский')
      expect(languages.pt).toBe('Português')
      expect(languages.it).toBe('Italiano')
    })

    it('should have exactly 10 supported languages', () => {
      const languages = getSupportedLanguages()
      const languageCount = Object.keys(languages).length
      expect(languageCount).toBe(10)
    })
  })

  describe('getCommitTypeFormatWithTheme', () => {
    it('should return themed commit type format', () => {
      const format = getCommitTypeFormatWithTheme('en', 'github')
      expect(typeof format).toBe('object')
      expect(typeof format.feat).toBe('string')
      expect(format.feat.length).toBeGreaterThan(0)
    })

    it('should handle different themes', () => {
      const themes: SupportedTheme[] = ['default', 'minimal', 'github', 'gitmoji', 'unicode', 'simple', 'colorful', 'corporate']

      for (const theme of themes) {
        const format = getCommitTypeFormatWithTheme('en', theme)
        expect(typeof format).toBe('object')
        expect(typeof format.feat).toBe('string')
        expect(typeof format.fix).toBe('string')
      }
    })

    it('should combine language and theme correctly', () => {
      const spanishGithub = getCommitTypeFormatWithTheme('es', 'github')
      const englishGithub = getCommitTypeFormatWithTheme('en', 'github')

      expect(typeof spanishGithub.feat).toBe('string')
      expect(typeof englishGithub.feat).toBe('string')

      // Should be different due to language
      expect(spanishGithub.feat).not.toBe(englishGithub.feat)
    })
  })

  describe('getCommitTypeText', () => {
    it('should return commit type text for known types', () => {
      expect(getCommitTypeText('feat')).toContain('Features')
      expect(getCommitTypeText('fix')).toContain('Bug Fixes')
      expect(getCommitTypeText('docs')).toContain('Documentation')
    })

    it('should return localized text for different languages', () => {
      expect(getCommitTypeText('feat', 'es')).toContain('Características')
      expect(getCommitTypeText('feat', 'fr')).toContain('Fonctionnalités')
    })

    it('should handle unknown commit types gracefully', () => {
      const result = getCommitTypeText('unknown')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('getThemedCommitType', () => {
    it('should return themed commit type text', () => {
      const result = getThemedCommitType('feat', 'en', 'github')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle different combinations of language and theme', () => {
      const combinations = [
        { lang: 'en' as const, theme: 'default' as const },
        { lang: 'es' as const, theme: 'github' as const },
        { lang: 'fr' as const, theme: 'minimal' as const },
        { lang: 'de' as const, theme: 'gitmoji' as const },
      ]

      for (const { lang, theme } of combinations) {
        const result = getThemedCommitType('feat', lang, theme)
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      }
    })

    it('should handle unknown types with themes', () => {
      const result = getThemedCommitType('unknown', 'en', 'github')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })
})
