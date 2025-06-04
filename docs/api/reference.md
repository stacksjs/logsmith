# API Reference

Complete reference for the logsmith programmatic API, including all functions, types, and interfaces for building custom changelog generation workflows.

## Core Functions

### `generateChangelog()`

The main function for generating changelogs programmatically.

```typescript
import { generateChangelog } from 'logsmith'

const result = await generateChangelog(options)
```

**Parameters:**
- `options` - [`LogsmithOptions`](#logsmithoptions) - Configuration options for changelog generation

**Returns:** [`Promise<ChangelogResult>`](#changelogresult)

**Example:**
```typescript
import { generateChangelog } from 'logsmith'

const result = await generateChangelog({
  output: 'CHANGELOG.md',
  format: 'markdown',
  theme: 'github',
  from: 'v1.0.0',
  to: 'HEAD',
  excludeAuthors: ['dependabot[bot]']
})

console.log(result.content)    // Generated changelog content
console.log(result.outputPath) // Path where file was written
console.log(result.format)     // Output format used
```

### `loadLogsmithConfig()`

Load and merge configuration from config files and overrides.

```typescript
import { loadLogsmithConfig } from 'logsmith'

const config = await loadLogsmithConfig(overrides)
```

**Parameters:**
- `overrides` - [`LogsmithOptions`](#logsmithoptions) - Optional configuration overrides

**Returns:** [`Promise<LogsmithConfig>`](#logsmithconfig)

**Example:**
```typescript
// Load default config
const config = await loadLogsmithConfig()

// Load with overrides
const configWithOverrides = await loadLogsmithConfig({
  theme: 'minimal',
  verbose: true
})
```

### `defineConfig()`

Helper function for creating type-safe configuration objects.

```typescript
import { defineConfig } from 'logsmith'

export default defineConfig(config)
```

**Parameters:**
- `config` - [`LogsmithConfig`](#logsmithconfig) - Configuration object

**Returns:** [`LogsmithConfig`](#logsmithconfig)

**Example:**
```typescript
// logsmith.config.ts
import { defineConfig } from 'logsmith'

export default defineConfig({
  output: 'CHANGELOG.md',
  theme: 'github',
  excludeAuthors: ['bot']
})
```

## Configuration Types

### `LogsmithOptions`

Partial configuration options for changelog generation. All properties are optional.

```typescript
type LogsmithOptions = Partial<LogsmithConfig>
```

### `LogsmithConfig`

Complete configuration interface with all available options.

```typescript
interface LogsmithConfig {
  // Core options
  verbose: boolean
  output: string | false
  format: OutputFormat
  language: SupportedLanguage
  theme: SupportedTheme
  from?: string
  to: string
  dir: string

  // Changelog options
  clean: boolean
  excludeAuthors: string[]
  includeAuthors: string[]
  excludeEmail: boolean
  hideAuthorEmail: boolean

  // Enhanced filtering options
  excludeCommitTypes: string[]
  includeCommitTypes: string[]
  minCommitsForSection: number
  maxCommitsPerSection: number
  excludeScopes: string[]
  includeScopes: string[]
  excludeMessages: string[]

  // Breaking changes options
  groupBreakingChanges: boolean

  // Date and versioning options
  includeDates: boolean
  dateFormat: string
  includeCommitCount: boolean
  versionPrefix: string

  // Content options
  includeCommitBody: boolean
  maxDescriptionLength: number
  linkifyIssues: boolean
  linkifyPRs: boolean

  // Repository configuration
  repo?: string
  github: {
    repo?: string
    token?: string
  }

  // Templates and formatting
  templates: {
    commitFormat: string
    groupFormat: string
    typeFormat: Record<string, string>
    breakingChangeFormat: string
    dateFormat: string
  }
}
```

### `ChangelogResult`

Result object returned by `generateChangelog()`.

```typescript
interface ChangelogResult {
  /** Generated changelog content in the specified format */
  content: string
  /** Path where the changelog was written (if applicable) */
  outputPath?: string
  /** Format of the generated content */
  format: OutputFormat
}
```

**Example:**
```typescript
const result = await generateChangelog({ output: 'CHANGELOG.md' })

// Access the result properties
console.log(result.content)     // "# Changelog\n\n## v1.2.0..."
console.log(result.outputPath)  // "CHANGELOG.md"
console.log(result.format)      // "markdown"
```

## Data Types

### `OutputFormat`

Supported output formats for changelogs.

```typescript
type OutputFormat = 'markdown' | 'json' | 'html'
```

### `SupportedLanguage`

Supported languages for internationalization.

```typescript
type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'ru' | 'pt' | 'it'
```

### `SupportedTheme`

Available built-in themes.

```typescript
type SupportedTheme = 'default' | 'minimal' | 'github' | 'gitmoji' | 'unicode' | 'simple' | 'colorful' | 'corporate'
```

### `CommitInfo`

Information about a parsed commit.

```typescript
interface CommitInfo {
  /** Short commit hash */
  hash: string
  /** Full commit message */
  message: string
  /** Commit author information */
  author: {
    name: string
    email: string
  }
  /** Commit date in ISO format */
  date: string
  /** Parsed commit type (feat, fix, etc.) */
  type?: string
  /** Parsed commit scope */
  scope?: string
  /** Parsed commit description */
  description: string
  /** Commit body text */
  body?: string
  /** Whether this commit contains breaking changes */
  breaking?: boolean
  /** References to issues or PRs found in the commit */
  references?: GitReference[]
}
```

### `ChangelogEntry`

Individual entry in a changelog section.

```typescript
interface ChangelogEntry {
  /** Commit type (feat, fix, etc.) */
  type: string
  /** Commit scope (optional) */
  scope?: string
  /** Commit description */
  description: string
  /** Short commit hash */
  hash: string
  /** Author name (optional) */
  author?: string
  /** Whether this entry represents a breaking change */
  breaking?: boolean
  /** References to issues or PRs */
  references?: GitReference[]
}
```

### `ChangelogSection`

Section of grouped commits in a changelog.

```typescript
interface ChangelogSection {
  /** Section title (e.g., "🚀 Features", "🐛 Bug Fixes") */
  title: string
  /** List of commits in this section */
  commits: ChangelogEntry[]
}
```

### `GeneratedChangelog`

Structured representation of a generated changelog.

```typescript
interface GeneratedChangelog {
  /** Version string (optional) */
  version?: string
  /** Changelog generation date */
  date: string
  /** Organized sections of changelog entries */
  sections: ChangelogSection[]
  /** List of contributors for this changelog */
  contributors: string[]
  /** URL for comparing changes (optional) */
  compareUrl?: string
}
```

## Theme API

### `getTheme()`

Get theme configuration by name.

```typescript
import { getTheme } from 'logsmith'

const theme = getTheme('github')
```

**Parameters:**
- `theme` - `SupportedTheme` - Theme name (default: 'default')

**Returns:** `ThemeConfig`

### `getAvailableThemes()`

Get list of all available themes.

```typescript
import { getAvailableThemes } from 'logsmith'

const themes = getAvailableThemes()
```

**Returns:** `Record<SupportedTheme, { name: string, description: string }>`

**Example:**
```typescript
const themes = getAvailableThemes()

Object.entries(themes).forEach(([key, theme]) => {
  console.log(`${key}: ${theme.name} - ${theme.description}`)
})

// Output:
// default: Default - Standard emoji theme with colorful icons
// minimal: Minimal - Clean theme with minimal symbols
// github: GitHub - GitHub-inspired theme with familiar styling
// ...
```

### `ThemeConfig`

Configuration interface for themes.

```typescript
interface ThemeConfig {
  name: string
  description: string
  emojis: {
    feat: string
    fix: string
    docs: string
    style: string
    refactor: string
    perf: string
    test: string
    build: string
    ci: string
    chore: string
    revert: string
    misc: string
    breaking: string
  }
  styles?: {
    markdown?: {
      headerPrefix?: string
      listItemPrefix?: string
      emphasis?: 'bold' | 'italic' | 'none'
      codeStyle?: 'backticks' | 'fenced' | 'none'
    }
    html?: {
      colorScheme?: 'light' | 'dark' | 'auto'
      fontSize?: 'small' | 'medium' | 'large'
      fontFamily?: string
      customCss?: string
    }
  }
}
```

## Statistics API

### `analyzeCommits()`

Analyze repository commits and generate statistics.

```typescript
import { analyzeCommits } from 'logsmith'

const stats = analyzeCommits(config)
```

**Parameters:**
- `config` - [`LogsmithConfig`](#logsmithconfig) - Configuration for analysis

**Returns:** [`RepositoryStats`](#repositorystats)

### `RepositoryStats`

Repository statistics and trend analysis.

```typescript
interface RepositoryStats {
  from?: string
  to: string
  totalCommits: number
  contributors: number
  breakingChanges: number
  commitTypes: Record<string, number>
  trends: {
    commitFrequency: CommitFrequency
    contributorGrowth: ContributorGrowth
    typeDistribution: TypeDistribution
  }
}
```

### `CommitFrequency`

Commit frequency analysis over time.

```typescript
interface CommitFrequency {
  daily: Record<string, number>
  weekly: Record<string, number>
  monthly: Record<string, number>
  totalDays: number
  averagePerDay: number
  peakDay: { date: string, commits: number }
}
```

## Utility Functions

### `getLabel()`

Get localized label for internationalization.

```typescript
import { getLabel } from 'logsmith'

const label = getLabel('changelog', 'es') // Returns Spanish translation
```

### Git Reference Types

### `GitReference`

Reference to external resources (issues, PRs) found in commits.

```typescript
interface GitReference {
  /** Type of reference */
  type: 'issue' | 'pr'
  /** Reference ID (issue number, PR number, etc.) */
  id: string
  /** Full URL to the reference (if available) */
  url?: string
}
```

## Error Handling

All async functions may throw errors. Wrap calls in try-catch blocks:

```typescript
import { generateChangelog } from 'logsmith'

try {
  const result = await generateChangelog({
    output: 'CHANGELOG.md',
    format: 'markdown'
  })
  console.log('Changelog generated successfully!')
} catch (error) {
  console.error('Failed to generate changelog:', error.message)
}
```

## TypeScript Usage

For full type safety, import types from logsmith:

```typescript
import type {
  LogsmithConfig,
  LogsmithOptions,
  ChangelogResult,
  SupportedTheme,
  SupportedLanguage,
  OutputFormat
} from 'logsmith'

// Type-safe configuration
const config: LogsmithOptions = {
  theme: 'github', // ✅ Type-checked
  format: 'markdown', // ✅ Type-checked
  // format: 'invalid' // ❌ TypeScript error
}
```

## Examples

### Custom Changelog Generator

```typescript
import { generateChangelog, getAvailableThemes } from 'logsmith'

async function generateCustomChangelog() {
  // List available themes
  const themes = getAvailableThemes()
  console.log('Available themes:', Object.keys(themes))

  // Generate changelog with custom options
  const result = await generateChangelog({
    output: 'RELEASES.md',
    format: 'markdown',
    theme: 'github',
    from: 'v1.0.0',
    excludeCommitTypes: ['chore', 'ci'],
    includeCommitBody: true,
    maxDescriptionLength: 100,
    templates: {
      commitFormat: '- {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}})) by @{{author}}',
      groupFormat: '## {{title}}'
    }
  })

  console.log(`Changelog written to: ${result.outputPath}`)
  return result
}
```

### Multi-format Generation

```typescript
import { generateChangelog } from 'logsmith'

async function generateAllFormats() {
  const baseConfig = {
    from: 'v1.0.0',
    excludeAuthors: ['dependabot[bot]']
  }

  // Generate all formats
  const formats = ['markdown', 'json', 'html'] as const

  for (const format of formats) {
    await generateChangelog({
      ...baseConfig,
      format,
      output: `changelog.${format === 'markdown' ? 'md' : format}`
    })
  }
}
```

### Repository Analysis

```typescript
import { loadLogsmithConfig, analyzeCommits } from 'logsmith'

async function analyzeRepository() {
  const config = await loadLogsmithConfig({
    from: '3 months ago',
    to: 'HEAD'
  })

  const stats = analyzeCommits(config)

  console.log(`Total commits: ${stats.totalCommits}`)
  console.log(`Contributors: ${stats.contributors}`)
  console.log(`Breaking changes: ${stats.breakingChanges}`)
  console.log(`Average commits per day: ${stats.trends.commitFrequency.averagePerDay}`)

  return stats
}
```

