#!/usr/bin/env node

import type { LogsmithOptions, RepositoryStats } from '../src/types'
import process from 'node:process'
import { CAC } from 'cac'
import { version } from '../package.json'
import { generateChangelog } from '../src/changelog'
import { loadLogsmithConfig } from '../src/config'
import { getLabel } from '../src/i18n'
import { getAvailableThemes } from '../src/themes'
import { analyzeCommits, colors, logError, logInfo } from '../src/utils'

const cli = new CAC('logsmith')

cli
  .command('[...args]', 'Generate changelog')
  .option('--from <ref>', 'Start commit reference (default: latest git tag)')
  .option('--to <ref>', 'End commit reference (default: HEAD)')
  .option('--dir <dir>', 'Path to git repository (default: current directory)')
  .option('--output [file]', 'Changelog file name (default: CHANGELOG.md). Use --no-output to write to console only')
  .option('--format <format>', 'Output format: markdown, json, html (default: markdown)')
  .option('--language <lang>', 'Language for changelog: en, es, fr, de, zh, ja, ko, ru, pt, it (default: en)')
  .option('--theme <theme>', 'Theme for styling: default, minimal, github, gitmoji, unicode, simple, colorful, corporate (default: default)')
  .option('--no-output', 'Write to console only')
  .option('--clean', 'Determine if the working directory is clean and exit if not')
  .option('--exclude-authors <authors>', 'Skip contributors (comma-separated)')
  .option('--include-authors <authors>', 'Include only specific contributors (comma-separated)')
  .option('--hide-author-email', 'Do not include author email in changelog')
  .option('--exclude-types <types>', 'Exclude commit types (comma-separated)')
  .option('--include-types <types>', 'Include only specific commit types (comma-separated)')
  .option('--exclude-scopes <scopes>', 'Exclude commit scopes (comma-separated)')
  .option('--include-scopes <scopes>', 'Include only specific commit scopes (comma-separated)')
  .option('--min-commits <number>', 'Minimum commits required to include a section', { type: [Number] })
  .option('--max-commits <number>', 'Maximum commits per section (0 = unlimited)', { type: [Number] })
  .option('--no-dates', 'Hide dates from changelog')
  .option('--no-breaking-group', 'Don\'t group breaking changes separately')
  .option('--include-body', 'Include commit body in changelog entries')
  .option('--no-linkify', 'Don\'t linkify issues and PRs')
  .option('--max-length <number>', 'Maximum description length (0 = unlimited)', { type: [Number] })
  .option('--no-markdown-lint', 'Disable markdown linting and auto-fixing')
  .option('--verbose', 'Enable verbose logging')
  .example('logsmith')
  .example('logsmith --from v1.0.0 --to HEAD')
  .example('logsmith --output CHANGELOG.md')
  .example('logsmith --format json --output changelog.json')
  .example('logsmith --format html --output changelog.html')
  .example('logsmith --no-output')
  .example('logsmith --exclude-authors "dependabot[bot],github-actions[bot]"')
  .example('logsmith --exclude-types "chore,ci" --include-types "feat,fix"')
  .example('logsmith --min-commits 2 --max-commits 10')
  .example('logsmith --theme github --language en')
  .example('logsmith --theme minimal --format html')
  .example('logsmith --theme gitmoji --output CHANGELOG.md')
  .action(async (args: string[], options: any) => {
    try {
      // Validate format option
      const validFormats = ['markdown', 'json', 'html']
      const format = options.format || 'markdown'
      if (!validFormats.includes(format)) {
        logError(`Invalid format: ${format}. Valid formats are: ${validFormats.join(', ')}`)
      }

      // Validate theme option
      const validThemes = ['default', 'minimal', 'github', 'gitmoji', 'unicode', 'simple', 'colorful', 'corporate']
      const theme = options.theme || 'default'
      if (!validThemes.includes(theme)) {
        logError(`Invalid theme: ${theme}. Valid themes are: ${validThemes.join(', ')}`)
      }

      // Auto-detect output file extension based on format if not specified
      let outputFile = options.output
      let actualFormat = format
      if (outputFile && typeof outputFile === 'string' && !options.format) {
        // Auto-detect format from file extension
        if (outputFile.endsWith('.json')) {
          actualFormat = 'json'
        }
        else if (outputFile.endsWith('.html') || outputFile.endsWith('.htm')) {
          actualFormat = 'html'
        }
      }
      else if (!outputFile) {
        // Auto-generate output filename based on format
        const extensions = { json: 'json', html: 'html', markdown: 'md' }
        outputFile = `CHANGELOG.${extensions[format as keyof typeof extensions]}`
        actualFormat = format
      }

      // Parse options
      const cliOptions: LogsmithOptions = {
        from: options.from,
        to: options.to || 'HEAD',
        dir: options.dir || process.cwd(),
        output: outputFile !== undefined ? outputFile : 'CHANGELOG.md',
        format: actualFormat as any,
        language: options.language || 'en',
        theme: theme as any,
        clean: options.clean || false,
        excludeAuthors: options.excludeAuthors ? options.excludeAuthors.split(',').map((s: string) => s.trim()) : [],
        includeAuthors: options.includeAuthors ? options.includeAuthors.split(',').map((s: string) => s.trim()) : [],
        hideAuthorEmail: options.hideAuthorEmail || false,
        excludeCommitTypes: options.excludeTypes ? options.excludeTypes.split(',').map((s: string) => s.trim()) : [],
        includeCommitTypes: options.includeTypes ? options.includeTypes.split(',').map((s: string) => s.trim()) : [],
        excludeScopes: options.excludeScopes ? options.excludeScopes.split(',').map((s: string) => s.trim()) : [],
        includeScopes: options.includeScopes ? options.includeScopes.split(',').map((s: string) => s.trim()) : [],
        minCommitsForSection: options.minCommits || 1,
        maxCommitsPerSection: options.maxCommits || 0,
        includeDates: options.dates !== false,
        groupBreakingChanges: options.breakingGroup !== false,
        includeCommitBody: options.includeBody || false,
        linkifyIssues: options.linkify !== false,
        linkifyPRs: options.linkify !== false,
        maxDescriptionLength: options.maxLength || 0,
        markdownLint: options.markdownLint !== false,
        verbose: options.verbose || false,
      }

      // Handle --no-output
      if (options.noOutput) {
        cliOptions.output = false
      }

      // Load configuration and merge with CLI options
      const config = await loadLogsmithConfig(cliOptions)

      if (config.verbose) {
        logInfo('Loaded configuration')
        logInfo(`Working directory: ${config.dir}`)
        logInfo(`Output format: ${config.format}`)
      }

      // Execute the main function
      const result = await generateChangelog(config)

      // Output to console if no file output
      if (config.output === false) {
        console.log(result.content)
      }

      if (config.verbose) {
        if (result.outputPath) {
          logInfo(`Changelog written to ${result.outputPath}`)
        }
        logInfo('✨ Done!')
      }
    }
    catch (error) {
      logError(`Failed to generate changelog: ${error}`)
    }
  })

cli
  .command('stats', 'Show repository statistics and trends')
  .option('--from <ref>', 'Start commit reference (default: latest git tag)')
  .option('--to <ref>', 'End commit reference (default: HEAD)')
  .option('--dir <dir>', 'Path to git repository (default: current directory)')
  .option('--language <lang>', 'Language for output: en, es, fr, de, zh, ja, ko, ru, pt, it (default: en)')
  .option('--json', 'Output in JSON format')
  .option('--verbose', 'Enable verbose logging')
  .example('logsmith stats')
  .example('logsmith stats --from v1.0.0 --to HEAD')
  .example('logsmith stats --json')
  .action(async (options: any) => {
    try {
      // Parse options
      const cliOptions: LogsmithOptions = {
        from: options.from,
        to: options.to || 'HEAD',
        dir: options.dir || process.cwd(),
        language: options.language || 'en',
        verbose: options.verbose || false,
      }

      // Load configuration and merge with CLI options
      const config = await loadLogsmithConfig(cliOptions)

      if (config.verbose) {
        logInfo('Analyzing repository statistics...')
        logInfo(`Working directory: ${config.dir}`)
        logInfo(`Range: ${config.from || 'first commit'} → ${config.to}`)
      }

      // Analyze commits
      const stats = analyzeCommits(config)

      if (options.json) {
        console.log(JSON.stringify(stats, null, 2))
      }
      else {
        displayStats(stats, config.language)
      }

      if (config.verbose) {
        logInfo('✨ Analysis complete!')
      }
    }
    catch (error) {
      logError(`Failed to analyze repository: ${error}`)
    }
  })

cli
  .command('themes', 'List available themes')
  .action(() => {
    const themes = getAvailableThemes()
    console.log('\n🎨 Available Themes:\n')

    for (const [key, theme] of Object.entries(themes)) {
      console.log(`  ${colors.cyan}${key.padEnd(12)}${colors.reset} - ${theme.name}: ${theme.description}`)
    }

    console.log(`\n${colors.gray}Use --theme <name> to apply a theme${colors.reset}`)
  })

cli
  .command('version', 'Show the version of logsmith')
  .action(() => {
    console.log(version)
  })

cli.version(version)
cli.help()

// Parse CLI arguments
cli.parse()

// If no command was provided and no arguments, show help
if (process.argv.length === 2) {
  cli.outputHelp()
}

/**
 * Display formatted repository statistics
 */
function displayStats(stats: RepositoryStats, language: string = 'en'): void {
  const { colors: c } = { colors }

  console.log(`\n${c.bold}📊 ${getLabel('repositoryStats', language as any)}${c.reset}`)
  console.log(`${c.gray}─────────────────────────${c.reset}`)

  // Basic metrics
  console.log(`${c.cyan}${getLabel('range', language as any)}:${c.reset} ${stats.from || 'first commit'} → ${stats.to}`)
  console.log(`${c.cyan}${getLabel('totalCommits', language as any)}:${c.reset} ${stats.totalCommits}`)
  console.log(`${c.cyan}${getLabel('contributors', language as any)}:${c.reset} ${stats.contributors}`)
  console.log(`${c.cyan}${getLabel('breakingChangesCount', language as any)}:${c.reset} ${stats.breakingChanges}`)

  // Commit frequency trends
  const freq = stats.trends.commitFrequency
  console.log(`\n${c.bold}📈 ${getLabel('commitFrequency', language as any)}${c.reset}`)
  console.log(`${c.gray}───────────────────${c.reset}`)
  console.log(`${c.cyan}${getLabel('totalDays', language as any)}:${c.reset} ${freq.totalDays}`)
  console.log(`${c.cyan}${getLabel('averagePerDay', language as any)}:${c.reset} ${freq.averagePerDay}`)
  if (freq.peakDay.commits > 0) {
    console.log(`${c.cyan}${getLabel('peakDay', language as any)}:${c.reset} ${freq.peakDay.date} (${freq.peakDay.commits} ${getLabel('commits', language as any)})`)
  }

  // Show recent daily activity (last 7 days with commits)
  const recentDays = Object.entries(freq.daily)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7)

  if (recentDays.length > 0) {
    console.log(`${c.cyan}${getLabel('recentActivity', language as any)}:${c.reset}`)
    for (const [date, commits] of recentDays) {
      const bar = '█'.repeat(Math.min(commits, 20))
      console.log(`  ${date}: ${bar} ${commits}`)
    }
  }

  // Contributor insights
  const contrib = stats.trends.contributorGrowth
  console.log(`\n${c.bold}👥 ${getLabel('contributors', language as any)}${c.reset}`)
  console.log(`${c.gray}──────────────${c.reset}`)
  console.log(`${c.cyan}${getLabel('mostActive', language as any)}:${c.reset} ${contrib.mostActiveContributor.name} (${contrib.mostActiveContributor.commits} ${getLabel('commits', language as any)})`)
  console.log(`${c.cyan}${getLabel('newContributors', language as any)}:${c.reset} ${contrib.newContributors.length}`)

  // Show top 5 contributors
  const topContributors = Object.entries(contrib.contributorCommits)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  if (topContributors.length > 0) {
    console.log(`${c.cyan}${getLabel('topContributors', language as any)}:${c.reset}`)
    for (const [name, commits] of topContributors) {
      const shortName = name.split(' <')[0] // Remove email
      const percentage = ((commits / stats.totalCommits) * 100).toFixed(1)
      console.log(`  ${shortName}: ${commits} ${getLabel('commits', language as any)} (${percentage}%)`)
    }
  }

  // Commit type distribution
  const types = stats.trends.typeDistribution
  console.log(`\n${c.bold}📋 Commit Types${c.reset}`)
  console.log(`${c.gray}──────────────${c.reset}`)
  console.log(`${c.cyan}${getLabel('mostCommon', language as any)}:${c.reset} ${types.mostCommonType.type} (${types.mostCommonType.percentage}%)`)
  if (types.leastCommonType.type) {
    console.log(`${c.cyan}${getLabel('leastCommon', language as any)}:${c.reset} ${types.leastCommonType.type} (${types.leastCommonType.percentage}%)`)
  }

  // Show all type distribution
  const sortedTypes = Object.entries(types.percentages)
    .sort(([, a], [, b]) => b - a)

  console.log(`${c.cyan}${getLabel('distribution', language as any)}:${c.reset}`)
  for (const [type, percentage] of sortedTypes) {
    const count = stats.commitTypes[type] || 0
    const bar = '▓'.repeat(Math.min(Math.round(percentage / 2), 20))
    console.log(`  ${type.padEnd(10)}: ${bar} ${percentage}% (${count})`)
  }

  console.log() // Empty line at end
}
