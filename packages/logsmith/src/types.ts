/**
 * Supported languages for internationalization.
 * Controls the language used for commit type labels, section headers, and other text in the changelog.
 *
 * @example
 * ```typescript
 * // Use Spanish localization
 * const config = {
 *   language: 'es' as SupportedLanguage
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Dynamic language selection
 * const userLang = process.env.LANG?.slice(0, 2) as SupportedLanguage || 'en'
 * ```
 *
 * @since 1.0.0
 * @see {@link I18nMessages} for the structure of localized text
 */
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'ru' | 'pt' | 'it'

/**
 * Available theme options for styling the changelog output.
 * Each theme provides different emoji sets and styling preferences.
 *
 * - `default`: Standard emoji theme with colorful icons
 * - `minimal`: Clean theme with minimal symbols
 * - `github`: GitHub-inspired theme with familiar styling
 * - `gitmoji`: Complete gitmoji emoji set for commit types
 * - `unicode`: Unicode symbols instead of emojis for better compatibility
 * - `simple`: Text-only theme without any symbols or emojis
 * - `colorful`: Vibrant theme with enhanced visual elements
 * - `corporate`: Professional theme suitable for business environments
 *
 * @example
 * ```typescript
 * // Use GitHub-style theme
 * const config = {
 *   theme: 'github' as SupportedTheme
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Corporate-friendly theme without emojis
 * const config = {
 *   theme: 'corporate' as SupportedTheme
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link ThemeConfig} for theme configuration structure
 */
export type SupportedTheme = 'default' | 'minimal' | 'github' | 'gitmoji' | 'unicode' | 'simple' | 'colorful' | 'corporate'

/**
 * Configuration for a changelog theme.
 * Defines the visual appearance and styling options for different output formats.
 *
 * Themes control both the emoji/symbol choices and the styling of the output.
 * You can create custom themes by implementing this interface.
 *
 * @example
 * ```typescript
 * const customTheme: ThemeConfig = {
 *   name: 'Custom Theme',
 *   description: 'My company-specific theme',
 *   emojis: {
 *     feat: '🎉',
 *     fix: '🔧',
 *     docs: '📖',
 *     // ... other commit types
 *   },
 *   styles: {
 *     markdown: {
 *       headerPrefix: '###',
 *       listItemPrefix: '*',
 *       emphasis: 'bold'
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Theme with custom HTML styling
 * const htmlTheme: ThemeConfig = {
 *   name: 'Dark Theme',
 *   description: 'Dark mode compatible theme',
 *   emojis: { feat: '🎉', fix: '🔧' },
 *   styles: {
 *     html: {
 *       colorScheme: 'dark',
 *       customCss: '.changelog { background: #1a1a1a; color: #fff; }'
 *     }
 *   }
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link SupportedTheme} for built-in theme options
 */
export interface ThemeConfig {
  /** Human-readable name of the theme */
  name: string
  /** Description of the theme's appearance and use case */
  description: string
  /** Emoji or symbol mappings for each commit type */
  emojis: {
    /** New features */
    feat: string
    /** Bug fixes */
    fix: string
    /** Documentation changes */
    docs: string
    /** Code style changes (formatting, etc.) */
    style: string
    /** Code refactoring without functional changes */
    refactor: string
    /** Performance improvements */
    perf: string
    /** Test additions or modifications */
    test: string
    /** Build system or dependency changes */
    build: string
    /** CI/CD configuration changes */
    ci: string
    /** Maintenance tasks and miscellaneous changes */
    chore: string
    /** Revert previous commits */
    revert: string
    /** Miscellaneous changes that don't fit other categories */
    misc: string
    /** Breaking changes indicator */
    breaking: string
  }
  /** Optional styling configuration for different output formats */
  styles?: {
    /** Markdown-specific styling options */
    markdown?: {
      /** Prefix for section headers (e.g., "##", "###") */
      headerPrefix?: string
      /** Prefix for list items (e.g., "-", "*", "•") */
      listItemPrefix?: string
      /** Text emphasis style for important elements */
      emphasis?: 'bold' | 'italic' | 'none'
      /** Code formatting style */
      codeStyle?: 'backticks' | 'fenced' | 'none'
    }
    /** HTML-specific styling options */
    html?: {
      /** Color scheme preference */
      colorScheme?: 'light' | 'dark' | 'auto'
      /** Font size for the output */
      fontSize?: 'small' | 'medium' | 'large'
      /** Font family specification */
      fontFamily?: string
      /** Custom CSS to inject into HTML output */
      customCss?: string
    }
  }
}

/**
 * Internationalization messages for different languages.
 * Contains all translatable text used in changelog generation.
 *
 * This interface defines the structure for localized text that appears in
 * generated changelogs. Each supported language provides its own implementation
 * of this interface.
 *
 * @example
 * ```typescript
 * const customMessages: I18nMessages = {
 *   commitTypes: {
 *     feat: 'New Features',
 *     fix: 'Bug Fixes',
 *     docs: 'Documentation Updates'
 *   },
 *   labels: {
 *     changelog: 'Change Log',
 *     contributors: 'Contributors',
 *     // ... other labels
 *   },
 *   dateFormats: {
 *     full: 'MMMM d, yyyy',
 *     short: 'yyyy-MM-dd'
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using with getTranslations helper
 * import { getTranslations } from './i18n'
 * const messages = getTranslations('es') // Spanish translations
 * console.log(messages.commitTypes.feat) // "🚀 Características"
 * ```
 *
 * @since 1.0.0
 * @see {@link SupportedLanguage} for available language codes
 * @see {@link getTranslations} for accessing translations
 */
export interface I18nMessages {
  /** Localized names for commit types */
  commitTypes: Record<string, string>
  /** Localized labels for various changelog sections and elements */
  labels: {
    /** Main changelog title */
    changelog: string
    /** Contributors section header */
    contributors: string
    /** Breaking changes section header */
    breakingChanges: string
    /** Compare changes link text */
    compareChanges: string
    /** "commits" text for commit counts */
    commits: string
    /** "sections" text for section counts */
    sections: string
    /** "Most active" contributor label */
    mostActive: string
    /** "New contributors" section label */
    newContributors: string
    /** "Top contributors" section label */
    topContributors: string
    /** Repository statistics section header */
    repositoryStats: string
    /** Commit frequency statistics label */
    commitFrequency: string
    /** Total days with commits label */
    totalDays: string
    /** Average commits per day label */
    averagePerDay: string
    /** Peak activity day label */
    peakDay: string
    /** Recent activity section label */
    recentActivity: string
    /** Date range label */
    range: string
    /** Total commits count label */
    totalCommits: string
    /** Breaking changes count label */
    breakingChangesCount: string
    /** Most common commit type label */
    mostCommon: string
    /** Least common commit type label */
    leastCommon: string
    /** Commit type distribution label */
    distribution: string
    /** "by" attribution text */
    by: string
  }
  /** Date formatting templates for different contexts */
  dateFormats: {
    /** Full date format (e.g., "January 1, 2024") */
    full: string
    /** Short date format (e.g., "2024-01-01") */
    short: string
  }
}

/**
 * Main configuration interface for Logsmith changelog generation.
 * Controls all aspects of changelog creation, filtering, formatting, and output.
 *
 * This is the primary configuration object that controls how changelogs are generated.
 * It includes options for filtering commits, customizing output format, handling
 * internationalization, and configuring repository integration.
 *
 * @example
 * ```typescript
 * const config: LogsmithConfig = {
 *   verbose: true,
 *   output: 'CHANGELOG.md',
 *   format: 'markdown',
 *   language: 'en',
 *   theme: 'github',
 *   from: 'v1.0.0',
 *   to: 'HEAD',
 *   dir: process.cwd(),
 *   clean: false,
 *   excludeAuthors: ['dependabot'],
 *   includeCommitTypes: ['feat', 'fix', 'docs'],
 *   linkifyIssues: true,
 *   templates: {
 *     commitFormat: '- {{scope}}{{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))'
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Minimal configuration for quick setup
 * const minimalConfig: LogsmithConfig = {
 *   output: 'CHANGELOG.md',
 *   format: 'markdown',
 *   language: 'en',
 *   theme: 'default'
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Configuration for filtering and customization
 * const filteredConfig: LogsmithConfig = {
 *   excludeCommitTypes: ['chore', 'ci'],
 *   excludeScopes: ['deps'],
 *   maxCommitsPerSection: 50,
 *   maxDescriptionLength: 100,
 *   includeCommitBody: false,
 *   groupBreakingChanges: true
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link LogsmithOptions} for partial configuration options
 * @see {@link defineConfig} for configuration helper function
 */
export interface LogsmithConfig {
  // Core options
  /** Enable verbose logging during changelog generation */
  verbose: boolean
  /** Output file path or false to disable file output */
  output: string | false
  /** Output format for the changelog */
  format: OutputFormat
  /** Language for internationalization */
  language: SupportedLanguage
  /** Theme for styling and visual appearance */
  theme: SupportedTheme
  /** Starting commit/tag/branch for changelog range (auto-detected if undefined) */
  from?: string
  /** Ending commit/tag/branch for changelog range */
  to: string
  /** Working directory for git operations */
  dir: string

  // Changelog options
  /** Whether to clean/overwrite existing changelog content */
  clean: boolean
  /** Author names to exclude from the changelog */
  excludeAuthors: string[]
  /** Author names to include (empty = all authors) */
  includeAuthors: string[]
  /** Whether to exclude author email addresses */
  excludeEmail: boolean
  /** Whether to hide author email addresses in output */
  hideAuthorEmail: boolean

  // Enhanced filtering options
  /** Commit types to exclude from the changelog */
  excludeCommitTypes: string[]
  /** Commit types to include (empty = all types) */
  includeCommitTypes: string[]
  /** Minimum number of commits required to show a section */
  minCommitsForSection: number
  /** Maximum number of commits to show per section (0 = unlimited) */
  maxCommitsPerSection: number
  /** Commit scopes to exclude from the changelog */
  excludeScopes: string[]
  /** Commit scopes to include (empty = all scopes) */
  includeScopes: string[]
  /** Commit message patterns to exclude (strings or regex patterns) */
  excludeMessages: string[]

  // Breaking changes options
  /** Whether to group breaking changes in a separate section */
  groupBreakingChanges: boolean

  // Date and versioning options
  /** Whether to include dates in the changelog */
  includeDates: boolean
  /** Date format string (using date-fns format) */
  dateFormat: string
  /** Whether to include commit counts in section headers */
  includeCommitCount: boolean
  /** Prefix for version tags (e.g., "v" for "v1.0.0") */
  versionPrefix: string

  // Content options
  /** Whether to include commit body text in the changelog */
  includeCommitBody: boolean
  /** Maximum length for commit descriptions (0 = unlimited) */
  maxDescriptionLength: number
  /** Whether to automatically link issue references */
  linkifyIssues: boolean
  /** Whether to automatically link pull request references */
  linkifyPRs: boolean

  // Repository configuration
  /** Repository URL for generating links */
  repo?: string
  /** GitHub-specific configuration */
  github: {
    /** GitHub repository in "owner/repo" format */
    repo?: string
    /** GitHub API token for enhanced features */
    token?: string
  }

  // Templates and formatting
  /** Template strings for formatting different elements */
  templates: {
    /** Template for individual commit entries */
    commitFormat: string
    /** Template for section group headers */
    groupFormat: string
    /** Mapping of commit types to display names */
    typeFormat: Record<string, string>
    /** Template for breaking change entries */
    breakingChangeFormat: string
    /** Template for date formatting in headers */
    dateFormat: string
  }

  // Markdown linting options
  /** Whether to enable markdown linting and auto-fixing */
  markdownLint: boolean
  /** Custom markdownlint rules configuration */
  markdownLintRules?: Record<string, any>
  /** Path to markdownlint configuration file */
  markdownLintConfig?: string
}

/**
 * Partial configuration options for Logsmith.
 * Used for overrides and partial configuration updates.
 *
 * This type allows you to specify only the configuration options you want to override,
 * making it perfect for runtime configuration changes or partial updates.
 *
 * @example
 * ```typescript
 * // Override specific options
 * const overrides: LogsmithOptions = {
 *   verbose: true,
 *   theme: 'github',
 *   excludeCommitTypes: ['chore']
 * }
 *
 * const config = await loadLogsmithConfig(overrides)
 * ```
 *
 * @example
 * ```typescript
 * // CLI argument overrides
 * const cliOverrides: LogsmithOptions = {
 *   output: process.env.OUTPUT_FILE || 'CHANGELOG.md',
 *   from: process.env.FROM_TAG,
 *   verbose: process.env.VERBOSE === 'true'
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Environment-specific configuration
 * const prodConfig: LogsmithOptions = {
 *   clean: true,
 *   excludeAuthors: ['dependabot', 'renovate'],
 *   linkifyIssues: true
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link LogsmithConfig} for the complete configuration interface
 * @see {@link loadLogsmithConfig} for loading configuration with overrides
 */
export type LogsmithOptions = Partial<LogsmithConfig>

/**
 * Information about a single Git commit.
 * Contains parsed commit data used for changelog generation.
 *
 * This interface represents a Git commit that has been parsed and structured
 * for changelog generation. It includes both raw Git data and parsed conventional
 * commit information.
 *
 * @example
 * ```typescript
 * const commit: CommitInfo = {
 *   hash: 'abc123f',
 *   message: 'feat(auth): add OAuth2 support',
 *   author: {
 *     name: 'John Doe',
 *     email: 'john@example.com'
 *   },
 *   date: '2024-01-15T10:30:00Z',
 *   type: 'feat',
 *   scope: 'auth',
 *   description: 'add OAuth2 support',
 *   body: 'Implements OAuth2 authentication flow with Google and GitHub providers.',
 *   breaking: false,
 *   references: [
 *     { type: 'issue', id: '123', url: 'https://github.com/org/repo/issues/123' }
 *   ]
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Breaking change commit
 * const breakingCommit: CommitInfo = {
 *   hash: 'def456g',
 *   message: 'feat!: remove deprecated API endpoints',
 *   type: 'feat',
 *   description: 'remove deprecated API endpoints',
 *   breaking: true,
 *   // ... other properties
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link ChangelogEntry} for processed changelog entries
 * @see {@link GitReference} for issue/PR references
 */
export interface CommitInfo {
  /** Short commit hash */
  hash: string
  /** Full commit message */
  message: string
  /** Commit author information */
  author: {
    /** Author's name */
    name: string
    /** Author's email address */
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

/**
 * Reference to an external resource (issue or pull request).
 * Used for automatic linking in changelog entries.
 *
 * This interface represents references found in commit messages that link to
 * external resources like GitHub issues or pull requests. The changelog generator
 * can automatically detect and link these references.
 *
 * @example
 * ```typescript
 * // Issue reference
 * const issueRef: GitReference = {
 *   type: 'issue',
 *   id: '123',
 *   url: 'https://github.com/owner/repo/issues/123'
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Pull request reference
 * const prRef: GitReference = {
 *   type: 'pr',
 *   id: '456',
 *   url: 'https://github.com/owner/repo/pull/456'
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Commit with multiple references
 * const commit: CommitInfo = {
 *   message: 'fix(auth): resolve login issue, closes #123, fixes #124',
 *   references: [
 *     { type: 'issue', id: '123', url: 'https://github.com/org/repo/issues/123' },
 *     { type: 'issue', id: '124', url: 'https://github.com/org/repo/issues/124' }
 *   ]
 *   // ... other properties
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link CommitInfo} for commit information structure
 * @see {@link ChangelogEntry} for processed changelog entries
 */
export interface GitReference {
  /** Type of reference */
  type: 'issue' | 'pr'
  /** Reference ID (issue number, PR number, etc.) */
  id: string
  /** Full URL to the reference (if available) */
  url?: string
}

/**
 * A single entry in the changelog.
 * Represents a processed commit ready for output formatting.
 *
 * This interface represents a commit that has been processed and formatted for
 * inclusion in the changelog. It's the final form of a commit entry before being
 * rendered in the chosen output format.
 *
 * @example
 * ```typescript
 * const entry: ChangelogEntry = {
 *   type: 'feat',
 *   scope: 'auth',
 *   description: 'add OAuth2 support for GitHub and Google',
 *   hash: 'abc123f',
 *   author: 'John Doe',
 *   breaking: false,
 *   references: [
 *     { type: 'issue', id: '123', url: 'https://github.com/org/repo/issues/123' }
 *   ]
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Breaking change entry
 * const breakingEntry: ChangelogEntry = {
 *   type: 'feat',
 *   description: 'remove deprecated v1 API endpoints',
 *   hash: 'def456g',
 *   breaking: true
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link CommitInfo} for raw commit information
 * @see {@link ChangelogSection} for grouped changelog entries
 */
export interface ChangelogEntry {
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

/**
 * A section grouping related changelog entries.
 * Organizes commits by type or other criteria.
 */
export interface ChangelogSection {
  /** Section title (e.g., "🚀 Features", "🐛 Bug Fixes") */
  title: string
  /** List of commits in this section */
  commits: ChangelogEntry[]
}

/**
 * Complete generated changelog data.
 * Contains all information needed to render the final changelog.
 *
 * This interface represents the complete, structured changelog data that's ready
 * for rendering in any output format. It includes organized sections, contributor
 * information, and metadata.
 *
 * @example
 * ```typescript
 * const changelog: GeneratedChangelog = {
 *   version: 'v2.1.0',
 *   date: '2024-01-15',
 *   sections: [
 *     {
 *       title: '🚀 Features',
 *       commits: [
 *         {
 *           type: 'feat',
 *           scope: 'auth',
 *           description: 'add OAuth2 support',
 *           hash: 'abc123f'
 *         }
 *       ]
 *     },
 *     {
 *       title: '🐛 Bug Fixes',
 *       commits: [
 *         {
 *           type: 'fix',
 *           description: 'resolve memory leak in parser',
 *           hash: 'def456g'
 *         }
 *       ]
 *     }
 *   ],
 *   contributors: ['John Doe', 'Jane Smith', 'Bob Wilson'],
 *   compareUrl: 'https://github.com/org/repo/compare/v2.0.0...v2.1.0'
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Minimal changelog without version
 * const simpleChangelog: GeneratedChangelog = {
 *   date: '2024-01-15',
 *   sections: [
 *     { title: '✨ Changes', commits: [] }
 *   ],
 *   contributors: ['Alice']
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link ChangelogSection} for section structure
 * @see {@link ChangelogResult} for rendered output
 */
export interface GeneratedChangelog {
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

/**
 * Supported output formats for changelog generation.
 *
 * - `markdown`: Standard Markdown format (.md) - most common for changelogs
 * - `json`: Machine-readable JSON format for programmatic consumption
 * - `html`: Styled HTML format for web display
 *
 * @example
 * ```typescript
 * // Generate Markdown changelog
 * const config = { format: 'markdown' as OutputFormat }
 * ```
 *
 * @example
 * ```typescript
 * // Generate JSON for API consumption
 * const config = { format: 'json' as OutputFormat }
 * ```
 *
 * @example
 * ```typescript
 * // Generate HTML for web display
 * const config = {
 *   format: 'html' as OutputFormat,
 *   theme: 'github' // HTML styling theme
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link ChangelogResult} for the generated output structure
 */
export type OutputFormat = 'markdown' | 'json' | 'html'

/**
 * Result of changelog generation.
 * Contains the formatted content and metadata.
 */
export interface ChangelogResult {
  /** Generated changelog content in the specified format */
  content: string
  /** Path where the changelog was written (if applicable) */
  outputPath?: string
  /** Format of the generated content */
  format: OutputFormat
}

/**
 * Statistical information about a repository.
 * Provides insights into commit patterns and contributor activity.
 *
 * This interface contains comprehensive analytics about a repository's commit history,
 * including contributor metrics, commit frequency analysis, and type distribution.
 * Useful for generating repository insights and trend analysis.
 *
 * @example
 * ```typescript
 * const stats: RepositoryStats = {
 *   from: 'v1.0.0',
 *   to: 'HEAD',
 *   totalCommits: 150,
 *   contributors: 8,
 *   breakingChanges: 3,
 *   commitTypes: {
 *     feat: 45,
 *     fix: 38,
 *     docs: 25,
 *     chore: 42
 *   },
 *   trends: {
 *     commitFrequency: {
 *       daily: { '2024-01-01': 5, '2024-01-02': 3 },
 *       averagePerDay: 2.1,
 *       peakDay: { date: '2024-01-15', commits: 12 }
 *     },
 *     contributorGrowth: {
 *       totalContributors: 8,
 *       newContributors: ['alice', 'bob'],
 *       mostActiveContributor: { name: 'john', commits: 45 }
 *     },
 *     typeDistribution: {
 *       mostCommonType: { type: 'feat', count: 45, percentage: 30 }
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Generate stats for a specific date range
 * const monthlyStats = await generateStats({
 *   from: '2024-01-01',
 *   to: '2024-01-31'
 * })
 * console.log(`${monthlyStats.totalCommits} commits this month`)
 * ```
 *
 * @since 1.0.0
 * @see {@link CommitFrequency} for frequency analysis details
 * @see {@link ContributorGrowth} for contributor metrics
 * @see {@link TypeDistribution} for commit type analysis
 */
export interface RepositoryStats {
  /** Starting point for statistics (optional) */
  from?: string
  /** Ending point for statistics */
  to: string
  /** Total number of commits in the range */
  totalCommits: number
  /** Number of unique contributors */
  contributors: number
  /** Number of breaking changes */
  breakingChanges: number
  /** Distribution of commits by type */
  commitTypes: Record<string, number>
  /** Detailed trend analysis */
  trends: {
    /** Commit frequency over time */
    commitFrequency: CommitFrequency
    /** Contributor growth patterns */
    contributorGrowth: ContributorGrowth
    /** Commit type distribution analysis */
    typeDistribution: TypeDistribution
  }
}

/**
 * Analysis of commit frequency patterns over time.
 * Provides insights into development activity rhythms.
 *
 * This interface analyzes when commits occur over time, helping identify
 * development patterns, peak activity periods, and overall project velocity.
 *
 * @example
 * ```typescript
 * const frequency: CommitFrequency = {
 *   daily: {
 *     '2024-01-01': 5,
 *     '2024-01-02': 3,
 *     '2024-01-03': 8
 *   },
 *   weekly: {
 *     '2024-W01': 25,
 *     '2024-W02': 31
 *   },
 *   monthly: {
 *     '2024-01': 120,
 *     '2024-02': 98
 *   },
 *   totalDays: 45,
 *   averagePerDay: 2.7,
 *   peakDay: {
 *     date: '2024-01-15',
 *     commits: 12
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Analyze development velocity
 * if (frequency.averagePerDay > 3) {
 *   console.log('High activity project')
 * }
 *
 * console.log(`Peak activity: ${frequency.peakDay.commits} commits on ${frequency.peakDay.date}`)
 * ```
 *
 * @since 1.0.0
 * @see {@link RepositoryStats} for complete repository analytics
 */
export interface CommitFrequency {
  /** Daily commit counts (date -> count) */
  daily: Record<string, number>
  /** Weekly commit counts (week -> count) */
  weekly: Record<string, number>
  /** Monthly commit counts (month -> count) */
  monthly: Record<string, number>
  /** Total number of days with commits */
  totalDays: number
  /** Average commits per day across the period */
  averagePerDay: number
  /** Day with the highest commit activity */
  peakDay: { date: string, commits: number }
}

/**
 * Analysis of contributor growth and activity patterns.
 * Tracks how the contributor base evolves over time.
 *
 * This interface provides insights into how a project's contributor base
 * grows and changes over time, including identifying new contributors,
 * most active contributors, and overall community health metrics.
 *
 * @example
 * ```typescript
 * const growth: ContributorGrowth = {
 *   timeline: {
 *     '2024-01-01': ['alice'],
 *     '2024-01-15': ['bob', 'charlie'],
 *     '2024-02-01': ['diana']
 *   },
 *   totalContributors: 12,
 *   newContributors: ['bob', 'charlie', 'diana'],
 *   mostActiveContributor: {
 *     name: 'alice',
 *     commits: 45
 *   },
 *   contributorCommits: {
 *     'alice': 45,
 *     'bob': 23,
 *     'charlie': 18,
 *     'diana': 8
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Analyze community growth
 * const growthRate = growth.newContributors.length / growth.totalContributors
 * console.log(`${(growthRate * 100).toFixed(1)}% new contributors this period`)
 *
 * // Find top contributors
 * const topContributors = Object.entries(growth.contributorCommits)
 *   .sort(([,a], [,b]) => b - a)
 *   .slice(0, 5)
 * ```
 *
 * @since 1.0.0
 * @see {@link RepositoryStats} for complete repository analytics
 */
export interface ContributorGrowth {
  /** Timeline of new contributors by date */
  timeline: Record<string, string[]> // date -> new contributors
  /** Total number of unique contributors */
  totalContributors: number
  /** List of new contributors in this period */
  newContributors: string[]
  /** Most active contributor information */
  mostActiveContributor: { name: string, commits: number }
  /** Commit counts by contributor */
  contributorCommits: Record<string, number>
}

/**
 * Analysis of commit type distribution and patterns.
 * Shows which types of changes are most common.
 *
 * This interface analyzes the distribution of different commit types in a repository,
 * helping understand what kinds of changes are most frequent and project development
 * patterns.
 *
 * @example
 * ```typescript
 * const distribution: TypeDistribution = {
 *   percentages: {
 *     feat: 35.5,
 *     fix: 28.2,
 *     docs: 15.3,
 *     chore: 12.8,
 *     test: 8.2
 *   },
 *   mostCommonType: {
 *     type: 'feat',
 *     count: 142,
 *     percentage: 35.5
 *   },
 *   leastCommonType: {
 *     type: 'test',
 *     count: 33,
 *     percentage: 8.2
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Analyze development patterns
 * if (distribution.mostCommonType.type === 'feat') {
 *   console.log('Feature-driven development')
 * } else if (distribution.mostCommonType.type === 'fix') {
 *   console.log('Maintenance-focused development')
 * }
 *
 * // Check test coverage commitment
 * const testPercentage = distribution.percentages.test || 0
 * if (testPercentage < 10) {
 *   console.log('Consider writing more tests')
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link RepositoryStats} for complete repository analytics
 */
export interface TypeDistribution {
  /** Percentage breakdown by commit type */
  percentages: Record<string, number>
  /** Most frequently used commit type */
  mostCommonType: { type: string, count: number, percentage: number }
  /** Least frequently used commit type */
  leastCommonType: { type: string, count: number, percentage: number }
}
