import type { SupportedTheme, ThemeConfig } from './types'

// Default theme with emojis
const defaultTheme: ThemeConfig = {
  name: 'Default',
  description: 'Standard emoji theme with colorful icons',
  emojis: {
    feat: '🚀',
    fix: '🐛',
    docs: '📚',
    style: '💅',
    refactor: '♻️',
    perf: '⚡',
    test: '🧪',
    build: '📦',
    ci: '🤖',
    chore: '🧹',
    revert: '⏪',
    misc: '📄',
    breaking: '💥',
  },
  styles: {
    markdown: {
      headerPrefix: '##',
      listItemPrefix: '-',
      emphasis: 'bold',
      codeStyle: 'backticks',
    },
    html: {
      colorScheme: 'light',
      fontSize: 'medium',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
}

// Minimal theme with simple symbols
const minimalTheme: ThemeConfig = {
  name: 'Minimal',
  description: 'Clean theme with minimal symbols',
  emojis: {
    feat: '✨',
    fix: '🔧',
    docs: '📖',
    style: '🎨',
    refactor: '🔄',
    perf: '⚡',
    test: '✅',
    build: '📦',
    ci: '🔄',
    chore: '🔧',
    revert: '↩️',
    misc: '📝',
    breaking: '⚠️',
  },
  styles: {
    markdown: {
      headerPrefix: '###',
      listItemPrefix: '*',
      emphasis: 'none',
      codeStyle: 'backticks',
    },
    html: {
      colorScheme: 'light',
      fontSize: 'small',
      fontFamily: 'Georgia, serif',
    },
  },
}

// GitHub-style theme
const githubTheme: ThemeConfig = {
  name: 'GitHub',
  description: 'GitHub-inspired theme with familiar styling',
  emojis: {
    feat: '✨',
    fix: '🐛',
    docs: '📝',
    style: '💄',
    refactor: '♻️',
    perf: '⚡',
    test: '✅',
    build: '👷',
    ci: '💚',
    chore: '🔧',
    revert: '⏪',
    misc: '🎉',
    breaking: '💥',
  },
  styles: {
    markdown: {
      headerPrefix: '##',
      listItemPrefix: '-',
      emphasis: 'bold',
      codeStyle: 'backticks',
    },
    html: {
      colorScheme: 'light',
      fontSize: 'medium',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      customCss: `
        .commit-type { color: #0969da; }
        .breaking-change { color: #d1242f; }
        .commit-hash { color: #656d76; font-family: monospace; }
      `,
    },
  },
}

// Gitmoji theme (full gitmoji set)
const gitmojiTheme: ThemeConfig = {
  name: 'Gitmoji',
  description: 'Complete gitmoji emoji set for commit types',
  emojis: {
    feat: '✨',
    fix: '🐛',
    docs: '📝',
    style: '🎨',
    refactor: '♻️',
    perf: '⚡️',
    test: '✅',
    build: '👷',
    ci: '💚',
    chore: '🔧',
    revert: '⏪️',
    misc: '🎉',
    breaking: '💥',
  },
  styles: {
    markdown: {
      headerPrefix: '##',
      listItemPrefix: '-',
      emphasis: 'bold',
      codeStyle: 'backticks',
    },
    html: {
      colorScheme: 'auto',
      fontSize: 'medium',
      fontFamily: 'system-ui, sans-serif',
    },
  },
}

// Unicode symbols theme (no emojis)
const unicodeTheme: ThemeConfig = {
  name: 'Unicode',
  description: 'Unicode symbols instead of emojis for better compatibility',
  emojis: {
    feat: '→',
    fix: '✗',
    docs: '◉',
    style: '◈',
    refactor: '↻',
    perf: '▲',
    test: '✓',
    build: '■',
    ci: '●',
    chore: '○',
    revert: '←',
    misc: '◦',
    breaking: '‼',
  },
  styles: {
    markdown: {
      headerPrefix: '###',
      listItemPrefix: '•',
      emphasis: 'italic',
      codeStyle: 'backticks',
    },
    html: {
      colorScheme: 'light',
      fontSize: 'medium',
      fontFamily: 'monospace',
    },
  },
}

// Simple theme (text only)
const simpleTheme: ThemeConfig = {
  name: 'Simple',
  description: 'Text-only theme without any symbols or emojis',
  emojis: {
    feat: '',
    fix: '',
    docs: '',
    style: '',
    refactor: '',
    perf: '',
    test: '',
    build: '',
    ci: '',
    chore: '',
    revert: '',
    misc: '',
    breaking: '',
  },
  styles: {
    markdown: {
      headerPrefix: '##',
      listItemPrefix: '-',
      emphasis: 'none',
      codeStyle: 'none',
    },
    html: {
      colorScheme: 'light',
      fontSize: 'medium',
      fontFamily: 'serif',
    },
  },
}

// Colorful theme with vibrant emojis
const colorfulTheme: ThemeConfig = {
  name: 'Colorful',
  description: 'Vibrant and expressive emoji theme',
  emojis: {
    feat: '🎊',
    fix: '🔨',
    docs: '📚',
    style: '🌈',
    refactor: '🔄',
    perf: '🚀',
    test: '🧪',
    build: '🏗️',
    ci: '🔄',
    chore: '🧽',
    revert: '🔙',
    misc: '🎭',
    breaking: '💢',
  },
  styles: {
    markdown: {
      headerPrefix: '##',
      listItemPrefix: '🔹',
      emphasis: 'bold',
      codeStyle: 'fenced',
    },
    html: {
      colorScheme: 'light',
      fontSize: 'large',
      fontFamily: 'Comic Sans MS, cursive, sans-serif',
      customCss: `
        .changelog-container { background: linear-gradient(45deg, #f0f8ff, #fff8f0); }
        .commit-type { font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); }
        .breaking-change { background: #ffebee; border-left: 4px solid #f44336; padding-left: 8px; }
      `,
    },
  },
}

// Corporate theme (professional)
const corporateTheme: ThemeConfig = {
  name: 'Corporate',
  description: 'Professional theme suitable for business environments',
  emojis: {
    feat: '▶',
    fix: '▼',
    docs: '●',
    style: '◆',
    refactor: '◈',
    perf: '▲',
    test: '◇',
    build: '■',
    ci: '●',
    chore: '○',
    revert: '◀',
    misc: '◦',
    breaking: '⚠',
  },
  styles: {
    markdown: {
      headerPrefix: '##',
      listItemPrefix: '-',
      emphasis: 'bold',
      codeStyle: 'backticks',
    },
    html: {
      colorScheme: 'light',
      fontSize: 'medium',
      fontFamily: 'Arial, sans-serif',
      customCss: `
        .changelog-container {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .commit-type {
          color: #2c5aa0;
          font-weight: 600;
        }
        .breaking-change {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 8px;
          border-radius: 4px;
          margin: 4px 0;
        }
        .commit-hash {
          color: #6c757d;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
      `,
    },
  },
}

// Theme registry
const themes: Record<SupportedTheme, ThemeConfig> = {
  default: defaultTheme,
  minimal: minimalTheme,
  github: githubTheme,
  gitmoji: gitmojiTheme,
  unicode: unicodeTheme,
  simple: simpleTheme,
  colorful: colorfulTheme,
  corporate: corporateTheme,
}

/**
 * Get theme configuration by name
 */
export function getTheme(theme: SupportedTheme = 'default'): ThemeConfig {
  return themes[theme] || themes.default
}

/**
 * Get emoji for a specific commit type from the current theme
 */
export function getThemeEmoji(commitType: string, theme: SupportedTheme = 'default'): string {
  const themeConfig = getTheme(theme)
  const emojiKey = commitType as keyof typeof themeConfig.emojis
  return themeConfig.emojis[emojiKey] || themeConfig.emojis.misc
}

/**
 * Get all available themes with their names and descriptions
 */
export function getAvailableThemes(): Record<SupportedTheme, { name: string, description: string }> {
  const result: Record<SupportedTheme, { name: string, description: string }> = {} as any

  for (const [key, theme] of Object.entries(themes)) {
    result[key as SupportedTheme] = {
      name: theme.name,
      description: theme.description,
    }
  }

  return result
}

/**
 * Get theme-specific styling for markdown output
 */
export function getMarkdownStyles(theme: SupportedTheme = 'default'): NonNullable<ThemeConfig['styles']>['markdown'] {
  const themeConfig = getTheme(theme)
  return themeConfig.styles?.markdown || {
    headerPrefix: '##',
    listItemPrefix: '-',
    emphasis: 'bold',
    codeStyle: 'backticks',
  }
}

/**
 * Get theme-specific styling for HTML output
 */
export function getHtmlStyles(theme: SupportedTheme = 'default'): NonNullable<ThemeConfig['styles']>['html'] {
  const themeConfig = getTheme(theme)
  return themeConfig.styles?.html || {
    colorScheme: 'light',
    fontSize: 'medium',
    fontFamily: 'sans-serif',
  }
}

/**
 * Check if theme uses emojis
 */
export function themeHasEmojis(theme: SupportedTheme = 'default'): boolean {
  const themeConfig = getTheme(theme)
  return Object.values(themeConfig.emojis).some(emoji => emoji.length > 0)
}

export { themes }
