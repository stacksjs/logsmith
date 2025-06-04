import type { LogsmithConfig } from './src/types'
import process from 'node:process'
import { defineConfig } from './src/config'

const config: LogsmithConfig = defineConfig({
  verbose: true,
  output: 'CHANGELOG.md',
  format: 'markdown',
  language: 'en',
  theme: 'default',
  from: undefined, // Auto-detect from latest tag
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
  maxCommitsPerSection: 0,
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
  maxDescriptionLength: 0,
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
    breakingChangeFormat: '### ⚠️ BREAKING CHANGES\n\n{{description}}',
    dateFormat: 'YYYY-MM-DD',
  },
})

export default config
