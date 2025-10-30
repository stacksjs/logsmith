import type { LogsmithOptions } from '@stacksjs/logsmith'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import * as core from '@actions/core'
import * as github from '@actions/github'
import { generateChangelog, loadLogsmithConfig } from '@stacksjs/logsmith'

async function run(): Promise<void> {
  try {
    // Get inputs
    const from = core.getInput('from')
    const to = core.getInput('to') || 'HEAD'
    const output = core.getInput('output') || 'CHANGELOG.md'
    const format = core.getInput('format') || 'markdown'
    const language = core.getInput('language') || 'en'
    const theme = core.getInput('theme') || 'github'
    const clean = core.getBooleanInput('clean')
    const excludeAuthors = core.getInput('exclude-authors')
    const includeAuthors = core.getInput('include-authors')
    const hideAuthorEmail = core.getBooleanInput('hide-author-email')
    const excludeTypes = core.getInput('exclude-types')
    const includeTypes = core.getInput('include-types')
    const excludeScopes = core.getInput('exclude-scopes')
    const includeScopes = core.getInput('include-scopes')
    const minCommits = Number.parseInt(core.getInput('min-commits') || '1', 10)
    const maxCommits = Number.parseInt(core.getInput('max-commits') || '50', 10)
    const includeDates = core.getBooleanInput('include-dates')
    const groupBreakingChanges = core.getBooleanInput('group-breaking-changes')
    const includeBody = core.getBooleanInput('include-body')
    const linkify = core.getBooleanInput('linkify')
    const maxLength = Number.parseInt(core.getInput('max-length') || '0', 10)
    const markdownLint = core.getBooleanInput('markdown-lint')
    const verbose = core.getBooleanInput('verbose')
    const githubToken = core.getInput('github-token')

    // Parse comma-separated values
    const parseList = (input: string): string[] => {
      return input ? input.split(',').map(s => s.trim()).filter(Boolean) : []
    }

    // Build configuration
    const options: LogsmithOptions = {
      from: from || undefined,
      to,
      dir: process.cwd(),
      output,
      format: format as any,
      language: language as any,
      theme: theme as any,
      clean,
      excludeAuthors: parseList(excludeAuthors),
      includeAuthors: parseList(includeAuthors),
      hideAuthorEmail,
      excludeCommitTypes: parseList(excludeTypes),
      includeCommitTypes: parseList(includeTypes),
      excludeScopes: parseList(excludeScopes),
      includeScopes: parseList(includeScopes),
      minCommitsForSection: minCommits,
      maxCommitsPerSection: maxCommits,
      includeDates,
      groupBreakingChanges,
      includeCommitBody: includeBody,
      linkifyIssues: linkify,
      linkifyPRs: linkify,
      maxDescriptionLength: maxLength,
      markdownLint,
      verbose,
    }

    // Add GitHub configuration if token is provided
    if (githubToken) {
      options.github = {
        token: githubToken,
        repo: github.context.repo ? `${github.context.repo.owner}/${github.context.repo.repo}` : undefined,
      }
    }

    // Load configuration and generate changelog
    if (verbose) {
      core.info('Loading configuration...')
    }

    const config = await loadLogsmithConfig(options)

    if (verbose) {
      core.info(`Generating changelog from ${config.from || 'first commit'} to ${config.to}...`)
      core.info(`Output: ${config.output}`)
      core.info(`Format: ${config.format}`)
      core.info(`Theme: ${config.theme}`)
    }

    // Generate the changelog
    const result = await generateChangelog(config)

    if (verbose) {
      core.info(`Generated ${result.content.length} characters of changelog content`)
    }

    // Set outputs
    core.setOutput('changelog', result.content)
    core.setOutput('format', result.format)

    if (result.outputPath) {
      core.setOutput('file', result.outputPath)
      core.info(`Changelog written to ${result.outputPath}`)

      // Read the file to verify it was written
      try {
        const fileContent = readFileSync(result.outputPath, 'utf-8')
        if (verbose) {
          core.info(`Verified file contents (${fileContent.length} bytes)`)
        }
      }
      catch (error) {
        core.warning(`Could not verify file was written: ${error}`)
      }
    }

    core.info('Changelog generated successfully!')
  }
  catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
    else {
      core.setFailed(String(error))
    }
  }
}

run()
