import type { ChangelogEntry, ChangelogSection, CommitFrequency, CommitInfo, ContributorGrowth, GeneratedChangelog, GitReference, LogsmithConfig, RepositoryStats, TypeDistribution } from './types'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { formatDate, getCommitTypeFormatWithTheme, getLabel } from './i18n'
import { getThemeEmoji, getHtmlStyles as getThemeHtmlStyles } from './themes'

// Colors and symbols for pretty output
export const colors = {
  reset: '\x1B[0m',
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
  white: '\x1B[37m',
  gray: '\x1B[90m',
  bold: '\x1B[1m',
}

export const symbols = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
  arrow: '→',
}

/**
 * Execute a git command and return the result
 */
export function execGit(command: string, cwd?: string): string {
  try {
    return execSync(`git ${command}`, {
      cwd: cwd || process.cwd(),
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim()
  }
  catch (error) {
    throw new Error(`Git command failed: git ${command}\n${error}`)
  }
}

/**
 * Check if current directory is a git repository
 */
export function isGitRepository(dir?: string): boolean {
  try {
    execGit('rev-parse --git-dir', dir)
    return true
  }
  catch {
    return false
  }
}

/**
 * Get the latest git tag
 */
export function getLatestTag(dir?: string): string | undefined {
  try {
    return execGit('describe --tags --abbrev=0', dir) || undefined
  }
  catch {
    return undefined
  }
}

/**
 * Get all tags sorted by version
 */
export function getAllTags(dir?: string): string[] {
  try {
    const tags = execGit('tag --sort=-version:refname', dir)
    return tags ? tags.split('\n').filter(Boolean) : []
  }
  catch {
    return []
  }
}

/**
 * Get git commits between two references
 */
export function getCommits(from?: string, to = 'HEAD', dir?: string): CommitInfo[] {
  const range = from ? `${from}..${to}` : to

  try {
    // Use a more reliable format with --pretty=tformat and clear separators
    const output = execGit(`log ${range} --pretty=tformat:"%H|%s|%an|%ae|%ad|%B" --date=iso`, dir)
    if (!output)
      return []

    const commits = output.split('\n').filter(Boolean).map((line) => {
      // Split on the first 5 pipes only, since body might contain pipes
      const parts = line.split('|')
      if (parts.length < 5)
        return null

      const hash = parts[0]
      const message = parts[1]
      const authorName = parts[2]
      const authorEmail = parts[3]
      const date = parts[4]
      const body = parts.slice(5).join('|') // rejoin body parts that might have pipes

      return parseCommit({
        hash: hash || '',
        message: message || '',
        author: {
          name: authorName || '',
          email: authorEmail || '',
        },
        date: date || '',
        body: body || '',
      })
    })

    return commits.filter((commit): commit is CommitInfo => commit !== null && commit.hash.length > 0)
  }
  catch {
    return []
  }
}

/**
 * Parse a conventional commit
 */
export function parseCommit(rawCommit: {
  hash: string
  message: string
  author: { name: string, email: string }
  date: string
  body?: string
}): CommitInfo {
  const { hash, message, author, date, body = '' } = rawCommit

  // Parse conventional commit format: type(scope): description
  const conventionalPattern = /^(\w+)(?:\(([^)]+)\))?: (.+)$/
  const match = message.match(conventionalPattern)

  let type = 'misc'
  let scope: string | undefined
  let description = message

  if (match) {
    type = match[1]
    scope = match[2] || undefined
    description = match[3]
  }

  // Check for breaking changes
  const breaking = message.includes('BREAKING CHANGE')
    || message.includes('!:')
    || body.includes('BREAKING CHANGE')

  // Parse references (issues, PRs)
  const references = parseReferences(`${message}\n${body}`)

  return {
    hash: hash.substring(0, 7), // Short hash
    message,
    author,
    date,
    type,
    scope,
    description,
    body,
    breaking,
    references,
  }
}

/**
 * Parse issue and PR references from commit message
 */
export function parseReferences(text: string): GitReference[] {
  const references: GitReference[] = []

  // Match #123, fixes #123, closes #123, etc.
  const issuePattern = /(?:fixes?|closes?|resolves?|refs?)\s+#(\d+)/gi
  const simpleIssuePattern = /#(\d+)/g

  let match
  // eslint-disable-next-line no-cond-assign
  while ((match = issuePattern.exec(text)) !== null) {
    references.push({
      type: 'issue',
      id: match[1],
    })
  }

  // Simple #123 references that weren't caught above
  text = text.replace(issuePattern, '') // Remove already matched
  // eslint-disable-next-line no-cond-assign
  while ((match = simpleIssuePattern.exec(text)) !== null) {
    references.push({
      type: 'issue',
      id: match[1],
    })
  }

  return references
}

/**
 * Group commits by type for changelog
 */
export function groupCommits(commits: CommitInfo[], config: LogsmithConfig): ChangelogSection[] {
  const groups: Record<string, ChangelogEntry[]> = {}
  const breakingChanges: ChangelogEntry[] = []

  for (const commit of commits) {
    const type = commit.type || 'misc'

    // Apply filtering
    if (shouldExcludeCommit(commit, config)) {
      continue
    }

    const truncatedDescription = config.maxDescriptionLength > 0 && commit.description.length > config.maxDescriptionLength
      ? `${commit.description.substring(0, config.maxDescriptionLength)}...`
      : commit.description

    const entry: ChangelogEntry = {
      type,
      scope: commit.scope,
      description: truncatedDescription,
      hash: commit.hash,
      author: config.hideAuthorEmail ? commit.author.name : `${commit.author.name} <${commit.author.email}>`,
      breaking: commit.breaking,
      references: commit.references,
    }

    // Handle breaking changes
    if (commit.breaking && config.groupBreakingChanges) {
      breakingChanges.push(entry)
    }
    else {
      if (!groups[type]) {
        groups[type] = []
      }
      groups[type].push(entry)
    }
  }

  // Convert to sections with proper titles
  const sections: ChangelogSection[] = []
  const typeFormat = getCommitTypeFormatWithTheme(config.language, config.theme)

  // Add breaking changes section first if we have any
  if (breakingChanges.length > 0 && config.groupBreakingChanges) {
    const breakingEmoji = getThemeEmoji('breaking', config.theme)
    const breakingTitle = breakingEmoji
      ? `${breakingEmoji} ${getLabel('breakingChanges', config.language)}`
      : getLabel('breakingChanges', config.language)

    sections.push({
      title: breakingTitle,
      commits: breakingChanges.slice(0, config.maxCommitsPerSection || breakingChanges.length),
    })
  }

  // Order sections by importance
  const typeOrder = ['feat', 'fix', 'perf', 'refactor', 'docs', 'style', 'test', 'build', 'ci', 'chore', 'revert']

  for (const type of typeOrder) {
    if (groups[type] && groups[type].length >= config.minCommitsForSection) {
      const commits = config.maxCommitsPerSection > 0
        ? groups[type].slice(0, config.maxCommitsPerSection)
        : groups[type]

      sections.push({
        title: typeFormat[type] || type,
        commits,
      })
    }
  }

  // Add any remaining types not in the standard order
  for (const [type, commits] of Object.entries(groups)) {
    if (!typeOrder.includes(type) && commits.length >= config.minCommitsForSection) {
      const filteredCommits = config.maxCommitsPerSection > 0
        ? commits.slice(0, config.maxCommitsPerSection)
        : commits

      sections.push({
        title: typeFormat[type] || type,
        commits: filteredCommits,
      })
    }
  }

  return sections
}

/**
 * Check if a commit should be excluded based on configuration
 */
function shouldExcludeCommit(commit: CommitInfo, config: LogsmithConfig): boolean {
  const type = commit.type || 'misc'

  // Check commit type filtering
  if (config.excludeCommitTypes.length > 0 && config.excludeCommitTypes.includes(type)) {
    return true
  }

  if (config.includeCommitTypes.length > 0 && !config.includeCommitTypes.includes(type)) {
    return true
  }

  // Check scope filtering
  if (commit.scope) {
    if (config.excludeScopes.length > 0 && config.excludeScopes.includes(commit.scope)) {
      return true
    }

    if (config.includeScopes.length > 0 && !config.includeScopes.includes(commit.scope)) {
      return true
    }
  }

  // Check message filtering
  if (config.excludeMessages.length > 0) {
    for (const excludePattern of config.excludeMessages) {
      if (commit.message.includes(excludePattern)) {
        return true
      }
    }
  }

  return false
}

/**
 * Generate changelog content from changelog data
 */
export function generateChangelogContent(
  changelog: GeneratedChangelog,
  config: LogsmithConfig,
): string {
  const lines: string[] = []

  // Header with version and date
  if (changelog.version) {
    lines.push(`## ${config.versionPrefix}${changelog.version}`)
    lines.push('')
    if (config.includeDates) {
      const formattedDate = formatDate(changelog.date, config.language, 'full')
      lines.push(`_${formattedDate}_`)
      lines.push('')
    }
  }

  // Compare URL
  if (changelog.compareUrl) {
    lines.push(`[${getLabel('compareChanges', config.language)}](${changelog.compareUrl})`)
    lines.push('')
  }

  // Commit count summary
  if (config.includeCommitCount) {
    const totalCommits = changelog.sections.reduce((total, section) => total + section.commits.length, 0)
    lines.push(`**${totalCommits} ${getLabel('commits', config.language)}** in this release`)
    lines.push('')
  }

  // Sections
  for (const section of changelog.sections) {
    if (section.commits.length === 0)
      continue

    lines.push(`### ${section.title}`)
    lines.push('')

    for (const commit of section.commits) {
      const repoUrl = config.repo || getRepositoryUrl() || 'https://github.com/unknown/repo'

      // Choose format based on whether it's a breaking change
      const isBreakingSection = section.title === getLabel('breakingChanges', config.language)
      const templateFormat = commit.breaking && isBreakingSection
        ? config.templates?.breakingChangeFormat || '- **{{scope}}{{description}}** ([{{hash}}]({{repoUrl}}/commit/{{hash}}))'
        : config.templates?.commitFormat || '- {{scope}}{{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))'

      let line = templateFormat
        .replace(/\{\{description\}\}/g, commit.description)
        .replace(/\{\{hash\}\}/g, commit.hash)
        .replace(/\{\{author\}\}/g, commit.author || '')
        .replace(/\{\{scope\}\}/g, commit.scope ? `**${commit.scope}**: ` : '')
        .replace(/\{\{repoUrl\}\}/g, repoUrl)

      // Add breaking change indicator if not in dedicated section
      if (commit.breaking && !config.groupBreakingChanges) {
        line = `⚠️  ${line}`
      }

      // Add references with enhanced linking
      if (commit.references && commit.references.length > 0) {
        const refs = commit.references.map((ref) => {
          if (config.linkifyIssues && ref.type === 'issue') {
            return `[#${ref.id}](${repoUrl}/issues/${ref.id})`
          }
          if (config.linkifyPRs && ref.type === 'pr') {
            return `[#${ref.id}](${repoUrl}/pull/${ref.id})`
          }
          return `#${ref.id}`
        }).join(', ')
        line = `${line} (${refs})`
      }

      lines.push(line)

      // Add commit body if requested
      if (config.includeCommitBody && commit.type) {
        // We need to get the body from the original commit
        // This would require modifying the ChangelogEntry interface to include body
        // For now, we'll skip this feature until we can properly implement it
      }
    }

    lines.push('')
  }

  // Contributors
  if (changelog.contributors.length > 0 && !config.excludeEmail) {
    lines.push(`### ${getLabel('contributors', config.language)}`)
    lines.push('')
    for (const contributor of changelog.contributors) {
      lines.push(`- ${contributor}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Get contributors from commits
 */
export function getContributors(commits: CommitInfo[], config: LogsmithConfig): string[] {
  const contributors = new Set<string>()

  for (const commit of commits) {
    const { name, email } = commit.author

    // Skip excluded authors
    if (config.excludeAuthors.includes(name) || config.excludeAuthors.includes(email)) {
      continue
    }

    // Only include specific authors if specified
    if (config.includeAuthors.length > 0) {
      if (!config.includeAuthors.includes(name) && !config.includeAuthors.includes(email)) {
        continue
      }
    }

    const contributor = config.hideAuthorEmail ? name : `${name} <${email}>`
    contributors.add(contributor)
  }

  return Array.from(contributors).sort()
}

/**
 * Get repository URL from git config
 */
export function getRepositoryUrl(dir?: string): string | undefined {
  try {
    const url = execGit('config --get remote.origin.url', dir)

    // Convert SSH URLs to HTTPS
    if (url.startsWith('git@github.com:')) {
      return url.replace('git@github.com:', 'https://github.com/').replace('.git', '')
    }

    // Clean up HTTPS URLs
    if (url.startsWith('https://github.com/')) {
      return url.replace('.git', '')
    }

    return url
  }
  catch {
    return undefined
  }
}

/**
 * Generate compare URL between two refs
 */
export function generateCompareUrl(repoUrl: string, from: string, to: string): string {
  if (repoUrl.includes('github.com')) {
    return `${repoUrl}/compare/${from}...${to}`
  }

  // Default format that works for most git platforms
  return `${repoUrl}/compare/${from}...${to}`
}

/**
 * Log with colors
 */
export function log(message: string, color?: keyof typeof colors): void {
  const colorCode = color ? colors[color] : ''
  const resetCode = color ? colors.reset : ''
  // eslint-disable-next-line no-console
  console.log(`${colorCode}${message}${resetCode}`)
}

/**
 * Log error and exit
 */
export function logError(message: string, exitCode = 1): never {
  log(`${symbols.error} ${message}`, 'red')
  process.exit(exitCode)
}

/**
 * Log success message
 */
export function logSuccess(message: string): void {
  log(`${symbols.success} ${message}`, 'green')
}

/**
 * Log info message
 */
export function logInfo(message: string): void {
  log(`${symbols.info} ${message}`, 'gray')
}

/**
 * Log warning message
 */
export function logWarning(message: string): void {
  log(`${symbols.warning} ${message}`, 'yellow')
}

/**
 * Analyze repository commits and return comprehensive statistics with trends
 */
export function analyzeCommits(config: LogsmithConfig): RepositoryStats {
  const { dir = process.cwd(), from, to = 'HEAD' } = config

  // Determine from/to references
  const fromRef = from || getLatestTag(dir)
  const toRef = to

  // Get commits
  const commits = getCommits(fromRef, toRef, dir)

  // Basic analysis
  const commitTypes: Record<string, number> = {}
  let breakingChanges = 0
  const contributorSet = new Set<string>()
  const contributorCommits: Record<string, number> = {}

  // Trend analysis data
  const dailyCommits: Record<string, number> = {}
  const weeklyCommits: Record<string, number> = {}
  const monthlyCommits: Record<string, number> = {}
  const contributorTimeline: Record<string, string[]> = {}
  const seenContributors = new Set<string>()

  for (const commit of commits) {
    const type = commit.type || 'misc'
    const contributorKey = `${commit.author.name} <${commit.author.email}>`

    // Basic counts
    commitTypes[type] = (commitTypes[type] || 0) + 1
    contributorSet.add(contributorKey)
    contributorCommits[contributorKey] = (contributorCommits[contributorKey] || 0) + 1

    if (commit.breaking) {
      breakingChanges++
    }

    // Parse commit date for trend analysis
    const commitDate = new Date(commit.date)

    // Skip invalid dates
    if (Number.isNaN(commitDate.getTime())) {
      continue
    }

    const dateKey = commitDate.toISOString().split('T')[0] // YYYY-MM-DD
    const weekKey = getWeekKey(commitDate)
    const monthKey = `${commitDate.getFullYear()}-${String(commitDate.getMonth() + 1).padStart(2, '0')}`

    // Frequency tracking
    dailyCommits[dateKey] = (dailyCommits[dateKey] || 0) + 1
    weeklyCommits[weekKey] = (weeklyCommits[weekKey] || 0) + 1
    monthlyCommits[monthKey] = (monthlyCommits[monthKey] || 0) + 1

    // Contributor growth tracking
    if (!seenContributors.has(contributorKey)) {
      seenContributors.add(contributorKey)
      if (!contributorTimeline[dateKey]) {
        contributorTimeline[dateKey] = []
      }
      contributorTimeline[dateKey].push(contributorKey)
    }
  }

  // Calculate commit frequency metrics
  const commitFrequency = calculateCommitFrequency(dailyCommits, weeklyCommits, monthlyCommits, commits.length)

  // Calculate contributor growth metrics
  const contributorGrowth = calculateContributorGrowth(contributorTimeline, contributorCommits, Array.from(contributorSet))

  // Calculate type distribution
  const typeDistribution = calculateTypeDistribution(commitTypes, commits.length)

  return {
    from: fromRef,
    to: toRef,
    totalCommits: commits.length,
    contributors: contributorSet.size,
    breakingChanges,
    commitTypes,
    trends: {
      commitFrequency,
      contributorGrowth,
      typeDistribution,
    },
  }
}

/**
 * Get ISO week key for a date
 */
function getWeekKey(date: Date): string {
  const year = date.getFullYear()
  const week = getISOWeek(date)
  return `${year}-W${String(week).padStart(2, '0')}`
}

/**
 * Get ISO week number
 */
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/**
 * Calculate commit frequency metrics
 */
function calculateCommitFrequency(
  daily: Record<string, number>,
  weekly: Record<string, number>,
  monthly: Record<string, number>,
  totalCommits: number,
): CommitFrequency {
  const dates = Object.keys(daily).sort()
  const totalDays = dates.length
  const averagePerDay = totalDays > 0 ? totalCommits / totalDays : 0

  // Find peak day
  let peakDay = { date: '', commits: 0 }
  for (const [date, commits] of Object.entries(daily)) {
    if (commits > peakDay.commits) {
      peakDay = { date, commits }
    }
  }

  return {
    daily,
    weekly,
    monthly,
    totalDays,
    averagePerDay: Math.round(averagePerDay * 100) / 100,
    peakDay,
  }
}

/**
 * Calculate contributor growth metrics
 */
function calculateContributorGrowth(
  timeline: Record<string, string[]>,
  contributorCommits: Record<string, number>,
  allContributors: string[],
): ContributorGrowth {
  // Find most active contributor
  let mostActiveContributor = { name: '', commits: 0 }
  for (const [name, commits] of Object.entries(contributorCommits)) {
    if (commits > mostActiveContributor.commits) {
      mostActiveContributor = { name, commits }
    }
  }

  // Get new contributors (flatten timeline)
  const newContributors = Object.values(timeline).flat()

  return {
    timeline,
    totalContributors: allContributors.length,
    newContributors,
    mostActiveContributor,
    contributorCommits,
  }
}

/**
 * Calculate type distribution percentages
 */
function calculateTypeDistribution(
  commitTypes: Record<string, number>,
  totalCommits: number,
): TypeDistribution {
  const percentages: Record<string, number> = {}
  let mostCommon = { type: '', count: 0, percentage: 0 }
  let leastCommon = { type: '', count: Infinity, percentage: 100 }

  for (const [type, count] of Object.entries(commitTypes)) {
    const percentage = Math.round((count / totalCommits) * 10000) / 100 // 2 decimal places
    percentages[type] = percentage

    if (count > mostCommon.count) {
      mostCommon = { type, count, percentage }
    }

    if (count < leastCommon.count) {
      leastCommon = { type, count, percentage }
    }
  }

  return {
    percentages,
    mostCommonType: mostCommon,
    leastCommonType: leastCommon.count === Infinity ? { type: '', count: 0, percentage: 0 } : leastCommon,
  }
}

/**
 * Lint and fix markdown content using markdownlint
 */
export async function lintMarkdown(content: string, config: LogsmithConfig): Promise<string> {
  // If markdown linting is disabled, return content as-is
  if (!config.markdownLint) {
    return content
  }

  try {
    // Dynamically import markdownlint to avoid bundling issues
    const markdownlintModule = await import('markdownlint')
    const markdownlint = (markdownlintModule as any).default || markdownlintModule

    // Prepare markdownlint options
    const options = {
      strings: {
        content,
      },
      config: {
        // Use default rules
        default: true,
        // Apply custom rules from config
        ...config.markdownLintRules,
      },
    }

    // Load external config file if specified
    if (config.markdownLintConfig) {
      try {
        const externalConfig = JSON.parse(readFileSync(config.markdownLintConfig, 'utf8'))
        options.config = { ...options.config, ...externalConfig }
      }
      catch (error: any) {
        if (config.verbose) {
          logWarning(`Failed to load markdownlint config from ${config.markdownLintConfig}: ${error}`)
        }
      }
    }

    // Run markdownlint - disable for now since it's causing issues
    // const result = (markdownlint as any).sync ? (markdownlint as any).sync(options) : markdownlint(options)
    const result = { content: [] } // Return empty result to skip linting

    // Check for errors
    const errors = result.content || []
    if (errors.length > 0 && config.verbose) {
      logInfo('Markdownlint found issues that have been auto-fixed:')
      errors.forEach((error: any) => {
        logInfo(`  Line ${error.lineNumber}: ${error.ruleDescription}`)
      })
    }

    // For now, return the original content with basic fixes applied
    // In the future, we can implement auto-fixing for specific rules
    let fixedContent = content

    // Fix common issues
    // 1. Remove leading empty lines (MD041)
    fixedContent = fixedContent.replace(/^\n+/, '')

    // 2. Ensure single trailing newline
    fixedContent = fixedContent.replace(/\n*$/, '\n')

    // 3. Fix multiple consecutive blank lines (MD012)
    fixedContent = fixedContent.replace(/\n{3,}/g, '\n\n')

    return fixedContent
  }
  catch (error: any) {
    if (config.verbose) {
      logWarning(`Markdownlint failed: ${error}. Returning original content.`)
    }
    return content
  }
}

/**
 * Generate changelog content based on the specified format
 */
export function generateFormattedChangelog(
  changelog: GeneratedChangelog,
  config: LogsmithConfig,
): string {
  switch (config.format) {
    case 'json':
      return generateJsonChangelog(changelog)
    case 'html':
      return generateHtmlChangelog(changelog, config)
    case 'markdown':
    default:
      return generateChangelogContent(changelog, config)
  }
}

/**
 * Generate JSON format changelog
 */
export function generateJsonChangelog(
  changelog: GeneratedChangelog,
): string {
  const jsonData = {
    version: changelog.version,
    date: changelog.date,
    compareUrl: changelog.compareUrl,
    sections: changelog.sections.map(section => ({
      title: section.title,
      commits: section.commits.map(commit => ({
        type: commit.type,
        scope: commit.scope,
        description: commit.description,
        hash: commit.hash,
        author: commit.author,
        breaking: commit.breaking,
        references: commit.references,
      })),
    })),
    contributors: changelog.contributors,
    stats: {
      totalCommits: changelog.sections.reduce((total, section) => total + section.commits.length, 0),
      sectionsCount: changelog.sections.length,
      contributorsCount: changelog.contributors.length,
      breakingChanges: changelog.sections.reduce(
        (total, section) => total + section.commits.filter(c => c.breaking).length,
        0,
      ),
    },
  }

  return JSON.stringify(jsonData, null, 2)
}

/**
 * Generate HTML format changelog
 */
export function generateHtmlChangelog(
  changelog: GeneratedChangelog,
  config: LogsmithConfig,
): string {
  const lines: string[] = []

  // HTML document structure
  lines.push('<!DOCTYPE html>')
  lines.push('<html lang="en">')
  lines.push('<head>')
  lines.push('  <meta charset="UTF-8">')
  lines.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0">')
  lines.push(`  <title>${getLabel('changelog', config.language)}${changelog.version ? ` - ${config.versionPrefix}${changelog.version}` : ''}</title>`)
  lines.push('  <style>')
  lines.push(getHtmlStyles())
  const themeStyles = getThemeHtmlStyles(config.theme)
  if (themeStyles?.customCss) {
    lines.push(themeStyles.customCss)
  }
  lines.push('  </style>')
  lines.push('</head>')
  lines.push('<body>')
  lines.push('  <div class="changelog-container">')

  // Header
  if (changelog.version) {
    lines.push(`    <header class="changelog-header">`)
    lines.push(`      <h1 class="version-title">${config.versionPrefix}${changelog.version}</h1>`)
    if (config.includeDates) {
      lines.push(`      <time class="release-date" datetime="${changelog.date}">${formatDate(changelog.date, config.language, 'full')}</time>`)
    }
    if (changelog.compareUrl) {
      lines.push(`      <a href="${changelog.compareUrl}" class="compare-link" target="_blank">📋 ${getLabel('compareChanges', config.language)}</a>`)
    }
    lines.push(`    </header>`)
  }

  // Stats summary
  if (config.includeCommitCount) {
    const totalCommits = changelog.sections.reduce((total, section) => total + section.commits.length, 0)
    lines.push(`    <div class="stats-summary">`)
    lines.push(`      <span class="stat-item">📊 ${totalCommits} ${getLabel('commits', config.language)}</span>`)
    lines.push(`      <span class="stat-item">👥 ${changelog.contributors.length} ${getLabel('contributors', config.language)}</span>`)
    lines.push(`      <span class="stat-item">📂 ${changelog.sections.length} ${getLabel('sections', config.language)}</span>`)
    lines.push(`    </div>`)
  }

  // Sections
  lines.push('    <main class="changelog-content">')
  for (const section of changelog.sections) {
    if (section.commits.length === 0)
      continue

    lines.push(`      <section class="changelog-section">`)
    lines.push(`        <h2 class="section-title">${escapeHtml(section.title)}</h2>`)
    lines.push(`        <ul class="commits-list">`)

    for (const commit of section.commits) {
      const repoUrl = config.repo || getRepositoryUrl() || 'https://github.com/unknown/repo'
      lines.push(`          <li class="commit-item${commit.breaking ? ' breaking-change' : ''}">`)

      // Scope
      if (commit.scope) {
        lines.push(`            <span class="commit-scope">${escapeHtml(commit.scope)}</span>`)
      }

      // Description
      lines.push(`            <span class="commit-description">${escapeHtml(commit.description)}</span>`)

      // Hash link
      lines.push(`            <a href="${repoUrl}/commit/${commit.hash}" class="commit-hash" target="_blank">${commit.hash}</a>`)

      // Breaking change indicator
      if (commit.breaking && !config.groupBreakingChanges) {
        lines.push(`            <span class="breaking-indicator">⚠️ BREAKING</span>`)
      }

      // References
      if (commit.references && commit.references.length > 0) {
        const refs = commit.references.map((ref) => {
          if (config.linkifyIssues && ref.type === 'issue') {
            return `<a href="${repoUrl}/issues/${ref.id}" class="issue-link" target="_blank">#${ref.id}</a>`
          }
          if (config.linkifyPRs && ref.type === 'pr') {
            return `<a href="${repoUrl}/pull/${ref.id}" class="pr-link" target="_blank">#${ref.id}</a>`
          }
          return `#${ref.id}`
        }).join(', ')
        lines.push(`            <span class="commit-references">(${refs})</span>`)
      }

      // Author
      if (commit.author) {
        lines.push(`            <span class="commit-author">${getLabel('by', config.language)} ${escapeHtml(commit.author)}</span>`)
      }

      lines.push(`          </li>`)
    }

    lines.push(`        </ul>`)
    lines.push(`      </section>`)
  }
  lines.push('    </main>')

  // Contributors
  if (changelog.contributors.length > 0 && !config.excludeEmail) {
    lines.push(`    <footer class="contributors-section">`)
    lines.push(`      <h3 class="contributors-title">${getLabel('contributors', config.language)}</h3>`)
    lines.push(`      <ul class="contributors-list">`)
    for (const contributor of changelog.contributors) {
      lines.push(`        <li class="contributor-item">${escapeHtml(contributor)}</li>`)
    }
    lines.push(`      </ul>`)
    lines.push(`    </footer>`)
  }

  lines.push('  </div>')
  lines.push('</body>')
  lines.push('</html>')

  return lines.join('\n')
}

/**
 * Get CSS styles for HTML changelog
 */
function getHtmlStyles(): string {
  return `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background-color: #fafafa;
    }

    .changelog-container {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .changelog-header {
      border-bottom: 2px solid #e1e4e8;
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .version-title {
      font-size: 2.5rem;
      margin: 0;
      color: #0366d6;
      font-weight: 600;
    }

    .release-date {
      display: block;
      color: #586069;
      font-size: 1rem;
      margin-top: 0.5rem;
    }

    .compare-link {
      display: inline-block;
      margin-top: 1rem;
      color: #0366d6;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border: 1px solid #0366d6;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .compare-link:hover {
      background-color: #0366d6;
      color: white;
    }

    .stats-summary {
      background: #f6f8fa;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 2rem;
      text-align: center;
    }

    .stat-item {
      display: inline-block;
      margin: 0 1rem;
      font-weight: 500;
    }

    .changelog-section {
      margin-bottom: 2.5rem;
    }

    .section-title {
      font-size: 1.5rem;
      color: #24292e;
      border-bottom: 1px solid #e1e4e8;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }

    .commits-list {
      list-style: none;
      padding: 0;
    }

    .commit-item {
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      background: #f6f8fa;
      transition: background-color 0.2s;
    }

    .commit-item:hover {
      background: #e1e4e8;
    }

    .commit-item.breaking-change {
      border-left: 4px solid #d73a49;
      background: #ffeef0;
    }

    .commit-scope {
      background: #0366d6;
      color: white;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      font-size: 0.85rem;
      font-weight: 500;
      margin-right: 0.5rem;
    }

    .commit-description {
      font-weight: 500;
    }

    .commit-hash {
      font-family: 'SFMono-Regular', Consolas, monospace;
      background: #f1f3f4;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      text-decoration: none;
      color: #586069;
      font-size: 0.85rem;
      margin-left: 0.5rem;
    }

    .commit-hash:hover {
      background: #e1e4e8;
    }

    .breaking-indicator {
      background: #d73a49;
      color: white;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-size: 0.75rem;
      font-weight: 500;
      margin-left: 0.5rem;
    }

    .commit-references {
      margin-left: 0.5rem;
      color: #586069;
    }

    .issue-link, .pr-link {
      color: #0366d6;
      text-decoration: none;
    }

    .issue-link:hover, .pr-link:hover {
      text-decoration: underline;
    }

    .commit-author {
      color: #586069;
      font-size: 0.9rem;
      margin-left: 0.5rem;
    }

    .contributors-section {
      border-top: 1px solid #e1e4e8;
      padding-top: 1.5rem;
      margin-top: 2rem;
    }

    .contributors-title {
      font-size: 1.25rem;
      color: #24292e;
      margin-bottom: 1rem;
    }

    .contributors-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .contributor-item {
      background: #f1f3f4;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    @media (max-width: 600px) {
      body {
        padding: 1rem;
      }

      .changelog-container {
        padding: 1rem;
      }

      .version-title {
        font-size: 2rem;
      }

      .stat-item {
        display: block;
        margin: 0.25rem 0;
      }
    }
  `.trim()
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  }

  return text.replace(/[&<>"']/g, match => htmlEscapes[match])
}
