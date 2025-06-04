import type { SupportedTheme } from '../src/types'
import { describe, expect, it } from 'bun:test'
import {
  getAvailableThemes,
  getHtmlStyles,
  getMarkdownStyles,
  getTheme,
  getThemeEmoji,
  themeHasEmojis,
} from '../src/themes'

describe('themes', () => {
  describe('getTheme', () => {
    it('should return default theme when no theme specified', () => {
      const theme = getTheme()
      expect(theme.name).toBe('Default')
      expect(theme.description).toContain('Standard emoji theme')
      expect(theme.emojis.feat).toBe('🚀')
      expect(theme.emojis.fix).toBe('🐛')
    })

    it('should return correct theme for each supported theme', () => {
      const themes: SupportedTheme[] = ['default', 'minimal', 'github', 'gitmoji', 'unicode', 'simple', 'colorful', 'corporate']

      for (const themeName of themes) {
        const theme = getTheme(themeName)
        expect(theme).toBeDefined()
        expect(typeof theme.name).toBe('string')
        expect(typeof theme.description).toBe('string')
        expect(typeof theme.emojis).toBe('object')
        expect(theme.name.length).toBeGreaterThan(0)
      }
    })

    it('should have consistent emoji structure across all themes', () => {
      const themes: SupportedTheme[] = ['default', 'minimal', 'github', 'gitmoji', 'unicode', 'simple']
      const expectedEmojiTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert', 'misc', 'breaking']

      for (const themeName of themes) {
        const theme = getTheme(themeName)

        for (const emojiType of expectedEmojiTypes) {
          expect(theme.emojis[emojiType as keyof typeof theme.emojis]).toBeDefined()
          expect(typeof theme.emojis[emojiType as keyof typeof theme.emojis]).toBe('string')
        }
      }
    })
  })

  describe('getThemeEmoji', () => {
    it('should return correct emoji for commit types in default theme', () => {
      expect(getThemeEmoji('feat')).toBe('🚀')
      expect(getThemeEmoji('fix')).toBe('🐛')
      expect(getThemeEmoji('docs')).toBe('📚')
      expect(getThemeEmoji('breaking')).toBe('💥')
    })

    it('should return correct emoji for different themes', () => {
      expect(getThemeEmoji('feat', 'minimal')).toBe('✨')
      expect(getThemeEmoji('feat', 'github')).toBe('✨')
      expect(getThemeEmoji('feat', 'gitmoji')).toBe('✨')
      expect(getThemeEmoji('feat', 'unicode')).toBe('→')
      expect(getThemeEmoji('feat', 'simple')).toBe('')
    })

    it('should handle unknown commit types gracefully', () => {
      const result = getThemeEmoji('unknown')
      expect(typeof result).toBe('string')
      // Should return empty string or the misc emoji for unknown types
      expect(result === '' || result === getThemeEmoji('misc')).toBe(true)
    })

    it('should return different emojis for different themes', () => {
      const themes: SupportedTheme[] = ['default', 'minimal', 'github', 'unicode']
      const emojis = themes.map(theme => getThemeEmoji('feat', theme))

      // At least some themes should have different emojis
      const uniqueEmojis = new Set(emojis)
      expect(uniqueEmojis.size).toBeGreaterThan(1)
    })
  })

  describe('getAvailableThemes', () => {
    it('should return all available themes with name and description', () => {
      const themes = getAvailableThemes()

      expect(themes.default).toBeDefined()
      expect(themes.default.name).toBe('Default')
      expect(typeof themes.default.description).toBe('string')

      expect(themes.minimal).toBeDefined()
      expect(themes.minimal.name).toBe('Minimal')
      expect(typeof themes.minimal.description).toBe('string')

      expect(themes.github).toBeDefined()
      expect(themes.github.name).toBe('GitHub')
      expect(typeof themes.github.description).toBe('string')
    })

    it('should include all supported theme types', () => {
      const themes = getAvailableThemes()
      const expectedThemes: SupportedTheme[] = ['default', 'minimal', 'github', 'gitmoji', 'unicode', 'simple', 'colorful', 'corporate']

      for (const themeName of expectedThemes) {
        expect(themes[themeName]).toBeDefined()
        expect(typeof themes[themeName].name).toBe('string')
        expect(typeof themes[themeName].description).toBe('string')
      }
    })

    it('should have exactly 8 available themes', () => {
      const themes = getAvailableThemes()
      const themeCount = Object.keys(themes).length
      expect(themeCount).toBe(8)
    })
  })

  describe('getMarkdownStyles', () => {
    it('should return markdown styles for default theme', () => {
      const styles = getMarkdownStyles()
      expect(styles).toBeDefined()
      if (styles) {
        expect(typeof styles.headerPrefix).toBe('string')
        expect(typeof styles.listItemPrefix).toBe('string')
      }
    })

    it('should return styles for different themes', () => {
      const defaultStyles = getMarkdownStyles('default')
      const minimalStyles = getMarkdownStyles('minimal')

      expect(defaultStyles).toBeDefined()
      expect(minimalStyles).toBeDefined()
    })

    it('should handle all theme types', () => {
      const themes: SupportedTheme[] = ['default', 'minimal', 'github', 'gitmoji', 'unicode', 'simple']

      for (const theme of themes) {
        const styles = getMarkdownStyles(theme)
        expect(styles).toBeDefined()
        if (styles) {
          expect(typeof styles.headerPrefix).toBe('string')
          expect(typeof styles.listItemPrefix).toBe('string')
        }
      }
    })
  })

  describe('getHtmlStyles', () => {
    it('should return HTML styles for default theme', () => {
      const styles = getHtmlStyles()
      expect(styles).toBeDefined()
      if (styles) {
        expect(typeof styles.fontFamily).toBe('string')
      }
    })

    it('should return styles for different themes', () => {
      const defaultStyles = getHtmlStyles('default')
      const minimalStyles = getHtmlStyles('minimal')

      expect(defaultStyles).toBeDefined()
      expect(minimalStyles).toBeDefined()
    })

    it('should handle GitHub theme with custom CSS', () => {
      const githubStyles = getHtmlStyles('github')
      expect(githubStyles).toBeDefined()
      if (githubStyles && githubStyles.customCss) {
        expect(typeof githubStyles.customCss).toBe('string')
        expect(githubStyles.customCss.length).toBeGreaterThan(0)
      }
    })

    it('should handle all theme types', () => {
      const themes: SupportedTheme[] = ['default', 'minimal', 'github', 'gitmoji', 'unicode']

      for (const theme of themes) {
        const styles = getHtmlStyles(theme)
        expect(styles).toBeDefined()
        if (styles) {
          expect(typeof styles.fontFamily).toBe('string')
        }
      }
    })
  })

  describe('themeHasEmojis', () => {
    it('should return true for themes with emojis', () => {
      expect(themeHasEmojis('default')).toBe(true)
      expect(themeHasEmojis('minimal')).toBe(true)
      expect(themeHasEmojis('github')).toBe(true)
      expect(themeHasEmojis('gitmoji')).toBe(true)
    })

    it('should return false for simple theme (no emojis)', () => {
      expect(themeHasEmojis('simple')).toBe(false)
    })

    it('should handle unicode theme correctly', () => {
      // Unicode theme has symbols, not emojis, but should still return true
      const result = themeHasEmojis('unicode')
      expect(typeof result).toBe('boolean')
    })

    it('should return consistent results', () => {
      const themes: SupportedTheme[] = ['default', 'minimal', 'github', 'gitmoji', 'unicode', 'simple']

      for (const theme of themes) {
        const hasEmojis = themeHasEmojis(theme)
        expect(typeof hasEmojis).toBe('boolean')

        // Simple theme should not have emojis, others should
        if (theme === 'simple') {
          expect(hasEmojis).toBe(false)
        }
        else {
          expect(hasEmojis).toBe(true)
        }
      }
    })
  })

  describe('theme consistency', () => {
    it('should have consistent emoji types across all themes', () => {
      const availableThemes = getAvailableThemes()
      const baseEmojis = getTheme('default').emojis
      const expectedEmojiKeys = Object.keys(baseEmojis)

      for (const themeName of Object.keys(availableThemes) as SupportedTheme[]) {
        const theme = getTheme(themeName)
        const themeEmojiKeys = Object.keys(theme.emojis)

        expect(themeEmojiKeys.sort()).toEqual(expectedEmojiKeys.sort())
      }
    })
  })
})
