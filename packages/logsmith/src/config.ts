import type { LogsmithConfig, LogsmithOptions } from './types'
import process from 'node:process'
import { loadConfig } from 'bunfig'

export const defaultConfig: LogsmithConfig = {
  verbose: false,
  output: 'CHANGELOG.md',
  format: 'markdown',
  language: 'en',
  theme: 'default',
  from: undefined, // Will be determined from git tags
  to: 'HEAD',
  dir: process.cwd(),

  // Changelog options
  clean: false,
  excludeAuthors: [],
  includeAuthors: [],
  excludeEmail: false,
  hideAuthorEmail: false,

  // Enhanced filtering options
  excludeCommitTypes: [],
  includeCommitTypes: [],
  minCommitsForSection: 1,
  maxCommitsPerSection: 0, // 0 = unlimited
  excludeScopes: [],
  includeScopes: [],
  excludeMessages: [],

  // Breaking changes options
  groupBreakingChanges: true,

  // Date and versioning options
  includeDates: true,
  dateFormat: 'YYYY-MM-DD',
  includeCommitCount: false,
  versionPrefix: 'v',

  // Content options
  includeCommitBody: false,
  maxDescriptionLength: 0, // 0 = unlimited
  linkifyIssues: true,
  linkifyPRs: true,

  // Repository configuration
  repo: undefined,
  github: {
    repo: undefined,
    token: undefined,
  },

  // Templates and formatting
  templates: {
    commitFormat: '- {{scope}}{{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
    groupFormat: '### {{title}}',
    breakingChangeFormat: '- **{{scope}}{{description}}** ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
    dateFormat: '_{{date}}_',
    typeFormat: {
      feat: '🚀 Features',
      fix: '🐛 Bug Fixes',
      docs: '📚 Documentation',
      style: '💅 Styles',
      refactor: '♻️ Code Refactoring',
      perf: '⚡ Performance Improvements',
      test: '🧪 Tests',
      build: '📦 Build System',
      ci: '🤖 Continuous Integration',
      chore: '🧹 Chores',
      revert: '⏪ Reverts',
    },
  },
}

// eslint-disable-next-line antfu/no-top-level-await
export const config: LogsmithConfig = await loadConfig({
  name: 'logsmith',
  defaultConfig,
})

/**
 * Load logsmith configuration with overrides
 */
export async function loadLogsmithConfig(overrides: LogsmithOptions = {}): Promise<LogsmithConfig> {
  const loadedConfig = await loadConfig({
    name: 'logsmith',
    defaultConfig,
  })

  // Merge configurations with proper precedence: overrides > loaded > defaults
  const config: LogsmithConfig = {
    ...defaultConfig,
    ...loadedConfig,
    ...overrides,
  }

  return config
}

/**
 * Define configuration helper for TypeScript config files
 */
export function defineConfig(config: LogsmithConfig): LogsmithConfig {
  return config
}
