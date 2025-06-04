import type { ActionInputs, ActionSummary, ChangelogResult, CommitResult, ReleaseResult } from './types'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as process from 'node:process'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import { ActionError, ActionErrorType } from './types'

export * from './types'

const DEFAULT_TIMEOUT = 600 // 10 minutes

/**
 * Main function to run the GitHub Action
 */
export async function run(): Promise<void> {
  const startTime = Date.now()
  const summary: ActionSummary = {
    changelogGenerated: false,
    releaseCreated: false,
    changelogCommitted: false,
    totalTime: 0,
    changelogResult: null,
    releaseResult: null,
    commitResult: null,
  }

  try {
    // Get and validate inputs
    const inputs = getActionInputs()
    core.info('Starting Logsmith Changelog Action')

    if (inputs.verbose) {
      core.info(`Inputs: ${JSON.stringify(sanitizeInputs(inputs), null, 2)}`)
      core.info(`Context: ${JSON.stringify(github.context, null, 2)}`)
    }

    // Set working directory if specified
    if (inputs.workingDirectory && inputs.workingDirectory !== '.') {
      process.chdir(inputs.workingDirectory)
      core.info(`Changed working directory to: ${inputs.workingDirectory}`)
    }

    // Ensure Logsmith is available
    await ensureLogsmithAvailable()

    // Generate changelog
    const changelogResult = await generateChangelog(inputs)
    summary.changelogResult = changelogResult
    summary.changelogGenerated = changelogResult.success

    if (!changelogResult.success) {
      throw new ActionError(
        `Changelog generation failed: ${changelogResult.error}`,
        ActionErrorType.CHANGELOG_GENERATION_FAILED,
        { error: changelogResult.error },
      )
    }

    core.info(`Changelog generated successfully: ${changelogResult.outputPath}`)

    // Commit changelog if requested
    if (inputs.commitChangelog && changelogResult.outputPath) {
      const commitResult = await commitChangelog(inputs, changelogResult.outputPath)
      summary.commitResult = commitResult
      summary.changelogCommitted = commitResult.success

      if (commitResult.success) {
        core.info(`Changelog committed: ${commitResult.sha}`)
      }
      else {
        core.warning(`Failed to commit changelog: ${commitResult.error}`)
      }
    }

    // Create GitHub release if requested
    if (inputs.createRelease && inputs.githubToken) {
      const releaseResult = await createGitHubRelease(inputs, changelogResult)
      summary.releaseResult = releaseResult
      summary.releaseCreated = releaseResult.success

      if (releaseResult.success) {
        core.info(`GitHub release created: ${releaseResult.url}`)
      }
      else {
        core.warning(`Failed to create GitHub release: ${releaseResult.error}`)
      }
    }

    // Calculate total time
    summary.totalTime = Date.now() - startTime

    // Set outputs
    setActionOutputs(summary)

    // Log summary
    logActionSummary(summary)

    core.info(`Logsmith changelog action completed successfully in ${summary.totalTime}ms`)
  }
  catch (error) {
    summary.totalTime = Date.now() - startTime
    handleActionError(error, summary)
  }
}

/**
 * Get and validate action inputs
 */
function getActionInputs(): ActionInputs {
  const inputs: ActionInputs = {
    // GitHub settings
    githubToken: core.getInput('github-token', { required: false }),

    // Changelog generation options
    outputPath: core.getInput('output-path', { required: false }) || 'CHANGELOG.md',
    format: core.getInput('format', { required: false }) as 'markdown' | 'json' | 'html' || 'markdown',
    theme: core.getInput('theme', { required: false }) || 'default',
    includeUnreleased: core.getBooleanInput('include-unreleased', { required: false }) ?? true,

    // Filtering options
    fromTag: core.getInput('from-tag', { required: false }),
    toTag: core.getInput('to-tag', { required: false }),
    commitTypes: core.getInput('commit-types', { required: false }),
    scopes: core.getInput('scopes', { required: false }),
    authors: core.getInput('authors', { required: false }),

    // Release creation options
    createRelease: core.getBooleanInput('create-release', { required: false }) ?? false,
    releaseTag: core.getInput('release-tag', { required: false }),
    releaseTitle: core.getInput('release-title', { required: false }),
    releaseDraft: core.getBooleanInput('release-draft', { required: false }) ?? false,
    releasePrerelease: core.getBooleanInput('release-prerelease', { required: false }) ?? false,
    releaseGenerateNotes: core.getBooleanInput('release-generate-notes', { required: false }) ?? true,

    // Commit options
    commitChangelog: core.getBooleanInput('commit-changelog', { required: false }) ?? false,
    commitMessage: core.getInput('commit-message', { required: false }) || 'chore: update changelog',
    commitAuthorName: core.getInput('commit-author-name', { required: false }),
    commitAuthorEmail: core.getInput('commit-author-email', { required: false }),

    // General options
    configPath: core.getInput('config-path', { required: false }),
    workingDirectory: core.getInput('working-directory', { required: false }) || '.',
    verbose: core.getBooleanInput('verbose', { required: false }) ?? false,
    timeout: Number.parseInt(core.getInput('timeout', { required: false }) || String(DEFAULT_TIMEOUT)),
  }

  // Validate inputs
  if (inputs.timeout <= 0 || inputs.timeout > 3600) {
    throw new ActionError(
      `Invalid timeout: ${inputs.timeout}. Must be between 1 and 3600 seconds.`,
      ActionErrorType.CONFIG_PARSING_FAILED,
      { timeout: inputs.timeout },
    )
  }

  if (inputs.createRelease && !inputs.githubToken) {
    throw new ActionError(
      'GitHub token is required when create-release is enabled',
      ActionErrorType.INVALID_INPUT,
      { createRelease: inputs.createRelease, githubToken: !!inputs.githubToken },
    )
  }

  if (!['markdown', 'json', 'html'].includes(inputs.format)) {
    throw new ActionError(
      `Invalid format: ${inputs.format}. Must be one of: markdown, json, html`,
      ActionErrorType.INVALID_INPUT,
      { format: inputs.format },
    )
  }

  return inputs
}

/**
 * Sanitize inputs for logging (remove sensitive data)
 */
function sanitizeInputs(inputs: ActionInputs): Partial<ActionInputs> {
  const sanitized = { ...inputs }
  if (sanitized.githubToken) {
    sanitized.githubToken = '***'
  }
  return sanitized
}

/**
 * Ensure Logsmith is available in the environment
 */
async function ensureLogsmithAvailable(): Promise<void> {
  try {
    core.info('Checking for Logsmith availability...')
    const { exitCode } = await exec.getExecOutput('logsmith', ['--version'], { ignoreReturnCode: true })

    if (exitCode === 0) {
      core.info('Logsmith is available')
      return
    }

    // If logsmith is not available, try to install it
    core.info('Logsmith not found, attempting to install...')

    // Check if bun is available
    const { exitCode: bunCheck } = await exec.getExecOutput('bun', ['--version'], { ignoreReturnCode: true })

    if (bunCheck !== 0) {
      throw new ActionError(
        'Neither Logsmith nor Bun is available. Please ensure Logsmith is installed or use the setup-bun action first.',
        ActionErrorType.LOGSMITH_NOT_AVAILABLE,
      )
    }

    // Install logsmith globally with bun
    await exec.exec('bun', ['install', '-g', 'logsmith'])

    // Verify installation
    const { exitCode: verifyCode } = await exec.getExecOutput('logsmith', ['--version'], { ignoreReturnCode: true })

    if (verifyCode !== 0) {
      throw new ActionError(
        'Failed to install Logsmith',
        ActionErrorType.LOGSMITH_INSTALLATION_FAILED,
      )
    }

    core.info('Logsmith installed successfully')
  }
  catch (error) {
    if (error instanceof ActionError) {
      throw error
    }
    throw new ActionError(
      `Failed to ensure Logsmith availability: ${error}`,
      ActionErrorType.LOGSMITH_NOT_AVAILABLE,
      { error: error instanceof Error ? error.message : String(error) },
    )
  }
}

/**
 * Generate changelog using Logsmith
 */
async function generateChangelog(inputs: ActionInputs): Promise<ChangelogResult> {
  const startTime = Date.now()
  core.info('Generating changelog...')

  try {
    const args = ['generate']

    // Add output path
    if (inputs.outputPath) {
      args.push('--output', inputs.outputPath)
    }

    // Add format
    if (inputs.format && inputs.format !== 'markdown') {
      args.push('--format', inputs.format)
    }

    // Add theme
    if (inputs.theme && inputs.theme !== 'default') {
      args.push('--theme', inputs.theme)
    }

    // Add tag range
    if (inputs.fromTag) {
      args.push('--from', inputs.fromTag)
    }
    if (inputs.toTag) {
      args.push('--to', inputs.toTag)
    }

    // Add filtering options
    if (inputs.commitTypes) {
      args.push('--types', inputs.commitTypes)
    }
    if (inputs.scopes) {
      args.push('--scopes', inputs.scopes)
    }
    if (inputs.authors) {
      args.push('--authors', inputs.authors)
    }

    // Add unreleased flag
    if (inputs.includeUnreleased) {
      args.push('--unreleased')
    }

    // Add config path if specified
    if (inputs.configPath) {
      args.push('--config', inputs.configPath)
    }

    // Add verbose flag
    if (inputs.verbose) {
      args.push('--verbose')
    }

    const options = {
      timeout: inputs.timeout * 1000, // Convert to milliseconds
    }

    const { exitCode, stderr } = await exec.getExecOutput('logsmith', args, {
      ...options,
      ignoreReturnCode: true,
    })

    if (exitCode !== 0) {
      return {
        success: false,
        generationTime: Date.now() - startTime,
        error: stderr || 'Unknown error during changelog generation',
      }
    }

    // Read the generated changelog content
    let content = ''
    if (inputs.outputPath && await fileExists(inputs.outputPath)) {
      content = await fs.readFile(inputs.outputPath, 'utf-8')
    }

    core.info(`Changelog generated successfully in ${Date.now() - startTime}ms`)

    return {
      success: true,
      generationTime: Date.now() - startTime,
      outputPath: inputs.outputPath,
      content,
      format: inputs.format,
      theme: inputs.theme,
    }
  }
  catch (error) {
    return {
      success: false,
      generationTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Commit changelog to repository
 */
async function commitChangelog(inputs: ActionInputs, changelogPath: string): Promise<CommitResult> {
  const startTime = Date.now()
  core.info('Committing changelog...')

  try {
    // Configure git user if specified
    if (inputs.commitAuthorName) {
      await exec.exec('git', ['config', 'user.name', inputs.commitAuthorName])
    }
    if (inputs.commitAuthorEmail) {
      await exec.exec('git', ['config', 'user.email', inputs.commitAuthorEmail])
    }

    // Add the changelog file
    await exec.exec('git', ['add', changelogPath])

    // Check if there are changes to commit
    const { exitCode: statusCode } = await exec.getExecOutput('git', ['diff', '--staged', '--quiet'], {
      ignoreReturnCode: true,
    })

    if (statusCode === 0) {
      core.info('No changes to commit')
      return {
        success: true,
        commitTime: Date.now() - startTime,
        sha: '',
        message: 'No changes to commit',
      }
    }

    // Commit the changes
    await exec.exec('git', ['commit', '-m', inputs.commitMessage])

    // Get the commit SHA
    const { stdout } = await exec.getExecOutput('git', ['rev-parse', 'HEAD'])
    const sha = stdout.trim()

    core.info(`Changelog committed successfully: ${sha}`)

    return {
      success: true,
      commitTime: Date.now() - startTime,
      sha,
      message: inputs.commitMessage,
    }
  }
  catch (error) {
    return {
      success: false,
      commitTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Create GitHub release
 */
async function createGitHubRelease(inputs: ActionInputs, changelogResult: ChangelogResult): Promise<ReleaseResult> {
  const startTime = Date.now()
  core.info('Creating GitHub release...')

  try {
    if (!inputs.githubToken) {
      throw new Error('GitHub token is required for release creation')
    }

    const octokit = github.getOctokit(inputs.githubToken)
    const { owner, repo } = github.context.repo

    // Determine release tag
    let tag = inputs.releaseTag
    if (!tag) {
      // Try to get the latest tag
      try {
        const { stdout } = await exec.getExecOutput('git', ['describe', '--tags', '--abbrev=0'])
        tag = stdout.trim()
      }
      catch {
        throw new Error('No release tag specified and unable to determine latest tag')
      }
    }

    // Prepare release body
    let body = ''
    if (changelogResult.content && inputs.format === 'markdown') {
      // Extract relevant section from changelog for this release
      body = extractReleaseNotes(changelogResult.content, tag)
    }

    const releaseData = {
      owner,
      repo,
      tag_name: tag,
      name: inputs.releaseTitle || tag,
      body,
      draft: inputs.releaseDraft,
      prerelease: inputs.releasePrerelease,
      generate_release_notes: inputs.releaseGenerateNotes && !body,
    }

    const { data: release } = await octokit.rest.repos.createRelease(releaseData)

    core.info(`GitHub release created successfully: ${release.html_url}`)

    return {
      success: true,
      creationTime: Date.now() - startTime,
      url: release.html_url,
      id: release.id,
      tag,
      title: release.name || tag,
      draft: release.draft,
      prerelease: release.prerelease,
    }
  }
  catch (error) {
    return {
      success: false,
      creationTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Extract release notes for a specific tag from changelog content
 */
function extractReleaseNotes(changelogContent: string, tag: string): string {
  const lines = changelogContent.split('\n')
  const releaseLines: string[] = []
  let foundRelease = false
  let nextReleaseFound = false

  for (const line of lines) {
    // Look for release headers (## [version] or ## version)
    if (line.match(/^##\s+\[?v?[\d.]+\]?/)) {
      if (foundRelease) {
        // Found the next release, stop collecting
        nextReleaseFound = true
        break
      }
      // Check if this is our target release
      if (line.includes(tag.replace(/^v/, ''))) {
        foundRelease = true
        continue // Skip the header itself
      }
    }

    if (foundRelease && !nextReleaseFound) {
      releaseLines.push(line)
    }
  }

  return releaseLines.join('\n').trim()
}

/**
 * Check if a file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  }
  catch {
    return false
  }
}

/**
 * Set action outputs
 */
function setActionOutputs(summary: ActionSummary): void {
  core.setOutput('success', String(summary.changelogGenerated))
  core.setOutput('changelog-generated', String(summary.changelogGenerated))
  core.setOutput('release-created', String(summary.releaseCreated))
  core.setOutput('changelog-committed', String(summary.changelogCommitted))

  if (summary.changelogResult?.success) {
    core.setOutput('changelog-path', summary.changelogResult.outputPath || '')
    core.setOutput('changelog-content', summary.changelogResult.content || '')
  }

  if (summary.releaseResult?.success) {
    core.setOutput('release-url', summary.releaseResult.url || '')
    core.setOutput('release-id', String(summary.releaseResult.id || ''))
    core.setOutput('release-tag', summary.releaseResult.tag || '')
  }

  if (summary.commitResult?.success) {
    core.setOutput('commit-sha', summary.commitResult.sha || '')
  }

  core.setOutput('summary', JSON.stringify(summary))
}

/**
 * Log action summary
 */
function logActionSummary(summary: ActionSummary): void {
  core.info('='.repeat(50))
  core.info('Logsmith Changelog Action Summary')
  core.info('='.repeat(50))
  core.info(`Changelog generated: ${summary.changelogGenerated}`)
  core.info(`Release created: ${summary.releaseCreated}`)
  core.info(`Changelog committed: ${summary.changelogCommitted}`)
  core.info(`Total time: ${summary.totalTime}ms`)

  if (summary.changelogResult?.success) {
    core.info(`Changelog path: ${summary.changelogResult.outputPath}`)
    core.info(`Generation time: ${summary.changelogResult.generationTime}ms`)
  }

  if (summary.releaseResult?.success) {
    core.info(`Release URL: ${summary.releaseResult.url}`)
    core.info(`Release tag: ${summary.releaseResult.tag}`)
  }

  if (summary.commitResult?.success && summary.commitResult.sha) {
    core.info(`Commit SHA: ${summary.commitResult.sha}`)
  }

  core.info('='.repeat(50))
}

/**
 * Handle action errors
 */
function handleActionError(error: unknown, summary: ActionSummary): void {
  const errorMessage = error instanceof Error ? error.message : String(error)

  if (error instanceof ActionError) {
    core.error(`Action failed: ${error.message}`)
    core.error(`Error type: ${error.type}`)
    if (error.details) {
      core.error(`Details: ${JSON.stringify(error.details, null, 2)}`)
    }
  }
  else {
    core.error(`Unexpected error: ${errorMessage}`)
  }

  // Set failure outputs
  core.setOutput('success', 'false')
  core.setOutput('summary', JSON.stringify(summary))

  core.setFailed(errorMessage)
}

// Run the action if this is the main module
if (require.main === module) {
  run().catch((error) => {
    core.setFailed(error instanceof Error ? error.message : String(error))
  })
}
