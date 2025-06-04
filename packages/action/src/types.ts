/**
 * Input parameters for the Logsmith Changelog GitHub Action
 */
export interface ActionInputs {
  // GitHub settings
  githubToken: string

  // Changelog generation options
  outputPath: string
  format: 'markdown' | 'json' | 'html'
  theme: string
  includeUnreleased: boolean

  // Filtering options
  fromTag?: string
  toTag?: string
  commitTypes?: string
  scopes?: string
  authors?: string

  // Release creation options
  createRelease: boolean
  releaseTag?: string
  releaseTitle?: string
  releaseDraft: boolean
  releasePrerelease: boolean
  releaseGenerateNotes: boolean

  // Commit options
  commitChangelog: boolean
  commitMessage: string
  commitAuthorName?: string
  commitAuthorEmail?: string

  // General options
  configPath?: string
  workingDirectory: string
  verbose: boolean
  timeout: number
}

/**
 * Result from changelog generation
 */
export interface ChangelogResult {
  success: boolean
  generationTime: number
  outputPath?: string
  content?: string
  format?: string
  theme?: string
  error?: string
}

/**
 * Result from GitHub release creation
 */
export interface ReleaseResult {
  success: boolean
  creationTime: number
  url?: string
  id?: number
  tag?: string
  title?: string
  draft?: boolean
  prerelease?: boolean
  error?: string
}

/**
 * Result from committing changelog
 */
export interface CommitResult {
  success: boolean
  commitTime: number
  sha?: string
  message?: string
  error?: string
}

/**
 * Overall action execution summary
 */
export interface ActionSummary {
  changelogGenerated: boolean
  releaseCreated: boolean
  changelogCommitted: boolean
  totalTime: number
  changelogResult: ChangelogResult | null
  releaseResult: ReleaseResult | null
  commitResult: CommitResult | null
}

/**
 * Action outputs that will be set
 */
export interface ActionOutputs {
  /**
   * Generated changelog content
   */
  changelogContent: string

  /**
   * Path to the generated changelog file
   */
  changelogPath: string

  /**
   * ID of the created GitHub release
   */
  releaseId: string

  /**
   * URL of the created GitHub release
   */
  releaseUrl: string

  /**
   * Upload URL for the created GitHub release
   */
  releaseUploadUrl: string

  /**
   * SHA of the commit if changelog was committed
   */
  commitSha: string
}

/**
 * GitHub release data structure
 */
export interface GitHubRelease {
  /**
   * Release tag name
   */
  tag_name: string

  /**
   * Release name/title
   */
  name: string

  /**
   * Release body/description
   */
  body: string

  /**
   * Whether this is a draft release
   */
  draft: boolean

  /**
   * Whether this is a prerelease
   */
  prerelease: boolean

  /**
   * Target commitish for the release
   */
  target_commitish?: string
}

/**
 * Error types specific to the changelog action
 */
export enum ActionErrorType {
  LOGSMITH_INSTALLATION_FAILED = 'LOGSMITH_INSTALLATION_FAILED',
  LOGSMITH_NOT_AVAILABLE = 'LOGSMITH_NOT_AVAILABLE',
  CHANGELOG_GENERATION_FAILED = 'CHANGELOG_GENERATION_FAILED',
  RELEASE_CREATION_FAILED = 'RELEASE_CREATION_FAILED',
  COMMIT_FAILED = 'COMMIT_FAILED',
  CONFIG_PARSING_FAILED = 'CONFIG_PARSING_FAILED',
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_TOKEN = 'INVALID_TOKEN',
  MISSING_TAG = 'MISSING_TAG',
  GIT_OPERATION_FAILED = 'GIT_OPERATION_FAILED',
  FILE_OPERATION_FAILED = 'FILE_OPERATION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_EXCEEDED = 'TIMEOUT_EXCEEDED',
  UNSUPPORTED_PLATFORM = 'UNSUPPORTED_PLATFORM',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
}

/**
 * Custom error class for action-specific errors
 */
export class ActionError extends Error {
  constructor(
    message: string,
    public type: ActionErrorType,
    public details: Record<string, any> | undefined = undefined,
  ) {
    super(message)
    this.name = 'ActionError'
  }
}
