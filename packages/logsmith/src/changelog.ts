import type { ChangelogResult, GeneratedChangelog, LogsmithConfig } from './types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  generateCompareUrl,
  generateFormattedChangelog,
  getCommits,
  getContributors,
  getLatestTag,
  getRepositoryUrl,
  groupCommits,
  isGitRepository,
  logError,
  logInfo,
  logSuccess,
  logWarning,
} from './utils'

/**
 * Generate changelog from git commits
 */
export async function generateChangelog(config: LogsmithConfig): Promise<ChangelogResult> {
  const { dir, from, to, output, verbose } = config

  if (verbose) {
    logInfo('Starting changelog generation...')
  }

  // Verify git repository
  if (!isGitRepository(dir)) {
    logError(`Directory ${dir} is not a git repository`)
  }

  // Determine from/to references
  const fromRef = from || getLatestTag(dir)
  const toRef = to

  if (verbose && fromRef) {
    logInfo(`Generating changelog from ${fromRef} to ${toRef}`)
  }
  else if (verbose) {
    logInfo(`Generating changelog up to ${toRef} (no previous tags found)`)
  }

  // Get commits
  const commits = getCommits(fromRef, toRef, dir)

  if (commits.length === 0) {
    logWarning('No commits found for changelog generation')
    return {
      content: '',
      outputPath: output && typeof output === 'string' ? resolve(dir, output) : undefined,
      format: config.format,
    }
  }

  if (verbose) {
    logInfo(`Found ${commits.length} commits`)
  }

  // Group commits by type
  const sections = groupCommits(commits, config)

  // Get contributors
  const contributors = getContributors(commits, config)

  // Get repository info for compare URLs
  const repoUrl = getRepositoryUrl(dir)
  let compareUrl: string | undefined

  if (repoUrl && fromRef && toRef) {
    compareUrl = generateCompareUrl(repoUrl, fromRef, toRef)
  }

  // Generate changelog data
  const changelogData: GeneratedChangelog = {
    version: undefined, // No version for changelog-only generation
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    sections,
    contributors,
    compareUrl,
  }

  // Generate changelog content
  const changelogContent = generateFormattedChangelog(changelogData, config)

  // Handle output
  let outputPath: string | undefined

  if (output !== false && typeof output === 'string') {
    outputPath = resolve(dir, output)

    try {
      // Handle different output formats
      if (config.format === 'json' || config.format === 'html') {
        // For JSON and HTML, just write the content directly
        writeFileSync(outputPath, changelogContent)
      }
      else {
        // For markdown, handle merging with existing content
        let existingContent = ''

        // Read existing changelog if it exists
        if (existsSync(outputPath)) {
          existingContent = readFileSync(outputPath, 'utf-8')

          // If we're updating an existing changelog, prepend new content
          const headerRegex = /^# /m
          const match = existingContent.match(headerRegex)

          if (match) {
            // Insert new changelog after the main header
            const insertIndex = existingContent.indexOf('\n', match.index!) + 1
            const updatedContent
              = `${existingContent.slice(0, insertIndex)
              }\n${
                changelogContent
              }\n${
                existingContent.slice(insertIndex)}`
            writeFileSync(outputPath, updatedContent)
          }
          else {
            // No main header found, prepend everything
            writeFileSync(outputPath, `${changelogContent}\n\n${existingContent}`)
          }
        }
        else {
          // Create new changelog with header
          const fullContent = `# Changelog\n\n${changelogContent}`
          writeFileSync(outputPath, fullContent)
        }
      }

      if (verbose) {
        logSuccess(`Changelog written to ${outputPath}`)
      }
    }
    catch (error) {
      logError(`Failed to write changelog: ${error}`)
    }
  }
  else if (output === false && verbose) {
    logInfo('Changelog generated (output to console)')
  }

  return {
    content: changelogContent,
    outputPath,
    format: config.format,
  }
}
