# API Reference

Complete reference documentation for logsmith commands, options, and programmatic API.

## Command Line Interface

### Core Commands

#### Version Bump Commands

```bash
logsmith <release-type> [options]
```

**Release Types:**
- `patch` - Bug fixes (1.0.0 → 1.0.1)
- `minor` - New features (1.0.0 → 1.1.0)
- `major` - Breaking changes (1.0.0 → 2.0.0)
- `prerelease` - Prerelease increment (1.0.0 → 1.0.1-alpha.0)
- `premajor` - Prerelease major (1.0.0 → 2.0.0-alpha.0)
- `preminor` - Prerelease minor (1.0.0 → 1.1.0-alpha.0)
- `prepatch` - Prerelease patch (1.0.0 → 1.0.1-alpha.0)
- `<version>` - Specific version (e.g., "2.1.0")
- `prompt` - Interactive version selection

#### Global Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--files` | `string[]` | `["package.json"]` | Files to update |
| `--current-version` | `string` | Auto-detected | Override current version |
| `--preid` | `string` | `"alpha"` | Prerelease identifier |
| `--commit` | `boolean` | `false` | Create git commit |
| `--tag` | `boolean` | `false` | Create git tag |
| `--push` | `boolean` | `false` | Push to remote |
| `--sign` | `boolean` | `false` | Sign commits and tags |
| `--message` | `string` | `"chore: bump version to %s"` | Commit message template |
| `--tag-message` | `string` | `"v%s"` | Tag message template |
| `--no-git-check` | `boolean` | `false` | Skip git status check |
| `--no-verify` | `boolean` | `false` | Skip git hooks |
| `--recursive` | `boolean` | `false` | Find files recursively |
| `--all` | `boolean` | `false` | Allow uncommitted changes |
| `--install` | `boolean` | `false` | Run npm install after bump |
| `--execute` | `string` | `""` | Command to run after bump |
| `--dry-run` | `boolean` | `false` | Show changes without applying |
| `--verbose` | `boolean` | `false` | Verbose output |
| `--commits` | `boolean` | `false` | Show recent commits |
| `--config` | `string` | `logsmith.config.ts` | Configuration file path |

### Command Examples

#### Basic Usage

```bash
# Patch version bump
logsmith patch

# Minor version bump with commit
logsmith minor --commit

# Major version bump with full git workflow
logsmith major --commit --tag --push
```

#### Advanced Usage

```bash
# Interactive version selection with commit history
logsmith prompt --commits --commit --tag

# Custom files and message
logsmith patch --files "package.json,VERSION.txt" --message "release: v%s"

# Prerelease with custom identifier
logsmith prerelease --preid beta --commit

# Recursive monorepo update
logsmith patch --recursive --commit --message "chore: bump all packages to %s"

# Dry run to preview changes
logsmith minor --recursive --dry-run --verbose
```

#### Git Integration

```bash
# Basic git workflow
logsmith patch --commit --tag --push

# Signed releases
logsmith minor --commit --tag --sign

# Custom commit and tag messages
logsmith patch --commit --tag \
  --message "release: version %s" \
  --tag-message "Release v%s"

# Skip git status check
logsmith patch --commit --no-git-check

# Skip git hooks
logsmith patch --commit --no-verify
```

#### Post-Bump Actions

```bash
# Install dependencies after bump
logsmith patch --commit --install

# Run custom command after bump
logsmith minor --commit --execute "npm run build && npm test"

# Complex post-bump workflow
logsmith major --commit --tag \
  --execute "npm run build && npm run test && npm publish"
```

## Programmatic API

### JavaScript/TypeScript API

#### Installation

```bash
npm install @stacksjs/logsmith
```

#### Basic Usage

```typescript
import { versionBump } from '@stacksjs/logsmith'

// Basic version bump
await versionBump({
  release: 'patch',
  commit: true,
  tag: true
})

// Advanced configuration
await versionBump({
  release: 'minor',
  files: ['package.json', 'package-lock.json'],
  commit: true,
  tag: true,
  push: true,
  message: 'chore: release v%s',
  tagMessage: 'Release v%s',
  execute: 'npm run build'
})
```

#### Types

```typescript
interface VersionBumpOptions {
  // Version configuration
  release: string | ReleaseType
  currentVersion?: string
  preid?: string

  // File configuration
  files?: string[]
  recursive?: boolean

  // Git configuration
  commit?: boolean
  tag?: boolean
  push?: boolean
  sign?: boolean
  message?: string
  tagMessage?: string
  noGitCheck?: boolean
  noVerify?: boolean
  all?: boolean

  // Post-bump actions
  install?: boolean
  execute?: string

  // Output configuration
  verbose?: boolean
  dryRun?: boolean
  printCommits?: boolean

  // Progress callback
  progress?: (event: ProgressEvent) => void
}

type ReleaseType =
  | 'major'
  | 'minor'
  | 'patch'
  | 'premajor'
  | 'preminor'
  | 'prepatch'
  | 'prerelease'

interface ProgressEvent {
  event: ProgressEventType
  updatedFiles: string[]
  skippedFiles: string[]
  newVersion: string
  oldVersion: string
}

enum ProgressEventType {
  FileUpdated = 'file-updated',
  FileSkipped = 'file-skipped',
  GitCommit = 'git-commit',
  GitTag = 'git-tag',
  GitPush = 'git-push'
}
```

#### Progress Tracking

```typescript
import { versionBump, ProgressEventType } from '@stacksjs/logsmith'

await versionBump({
  release: 'patch',
  commit: true,
  verbose: true,
  progress: (event) => {
    switch (event.event) {
      case ProgressEventType.FileUpdated:
        console.log(`Updated: ${event.updatedFiles.join(', ')}`)
        break
      case ProgressEventType.GitCommit:
        console.log(`Committed version ${event.newVersion}`)
        break
      case ProgressEventType.GitTag:
        console.log(`Tagged version ${event.newVersion}`)
        break
    }
  }
})
```

#### Error Handling

```typescript
import { versionBump } from '@stacksjs/logsmith'

try {
  await versionBump({
    release: 'patch',
    commit: true,
    tag: true
  })
  console.log('Version bump successful!')
} catch (error) {
  if (error.message.includes('git status')) {
    console.error('Git working directory is dirty')
  } else if (error.message.includes('No package.json')) {
    console.error('No package.json found')
  } else {
    console.error('Version bump failed:', error.message)
  }
}
```

### Utility Functions

#### Version Utilities

```typescript
import {
  incrementVersion,
  isValidVersion,
  isReleaseType
} from '@stacksjs/logsmith'

// Version increment
const newVersion = incrementVersion('1.0.0', 'patch') // '1.0.1'
const prerelease = incrementVersion('1.0.0', 'prerelease', 'beta') // '1.0.1-beta.0'

// Validation
const isValid = isValidVersion('1.2.3') // true
const isRelease = isReleaseType('patch') // true
```

#### File Operations

```typescript
import {
  findPackageJsonFiles,
  readPackageJson,
  updateVersionInFile
} from '@stacksjs/logsmith'

// Find package.json files
const files = await findPackageJsonFiles('.', true) // recursive

// Read package.json
const pkg = readPackageJson('./package.json')

// Update version in file
const result = updateVersionInFile('./package.json', '1.0.0', '1.0.1')
console.log(result.updated) // true/false
```

#### Git Operations

```typescript
import {
  checkGitStatus,
  createGitCommit,
  createGitTag,
  pushToRemote
} from '@stacksjs/logsmith'

// Check git status
try {
  checkGitStatus()
  console.log('Working directory is clean')
} catch (error) {
  console.log('Working directory has changes')
}

// Create commit
createGitCommit('chore: bump version to 1.0.1')

// Create tag
createGitTag('v1.0.1', true) // signed tag

// Push to remote
pushToRemote(true) // include tags
```

## Configuration API

### Configuration File

```typescript
interface logsmithConfig {
  // Version configuration
  preid?: string
  currentVersion?: string

  // File configuration
  files?: string[]
  recursive?: boolean

  // Git configuration
  commit?: boolean
  tag?: boolean
  push?: boolean
  sign?: boolean
  message?: string
  tagMessage?: string
  noGitCheck?: boolean
  noVerify?: boolean

  // Post-bump actions
  install?: boolean
  execute?: string

  // Output configuration
  verbose?: boolean
  dryRun?: boolean
}
```

### Configuration Access

```typescript
import { config } from '@stacksjs/logsmith'

// Access the loaded configuration
console.log('Current configuration:', config)

// Configuration is automatically loaded from:
// - logsmith.config.ts/js/mjs/cjs
// - .config/logsmith.*
// - config/logsmith.*
// - package.json (logsmith key)

// Use configuration values
const shouldCommit = config.commit
const commitMessage = config.message || 'chore: bump version to %s'
```

## GitHub Action API

### GitHub Actions Integration

logsmith can be easily integrated into GitHub Actions workflows:

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install logsmith
        run: npm install -g logsmith

      - name: Configure git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - name: Bump version and release
        run: logsmith patch --commit --tag --push
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Environment Variables for CI/CD

Configure logsmith behavior using environment variables:

```yaml
env:
  logsmith_COMMIT: true
  logsmith_TAG: true
  logsmith_PUSH: true
  logsmith_MESSAGE: "chore: release v%s [skip ci]"
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Environment Variables

### Configuration via Environment

```bash
# Git options
export logsmith_COMMIT=true
export logsmith_TAG=true
export logsmith_PUSH=false
export logsmith_SIGN=true

# Message templates
export logsmith_MESSAGE="chore: release v%s"
export logsmith_TAG_MESSAGE="Release v%s"

# File options
export logsmith_FILES="package.json,package-lock.json"
export logsmith_RECURSIVE=true

# Output options
export logsmith_VERBOSE=true
export logsmith_DRY_RUN=false
```

### CI/CD Environment Variables

```bash
# GitHub Actions
export GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }}
export GITHUB_ACTOR=${{ github.actor }}
export GITHUB_REPOSITORY=${{ github.repository }}

# GitLab CI
export CI_COMMIT_SHA=$CI_COMMIT_SHA
export CI_COMMIT_REF_NAME=$CI_COMMIT_REF_NAME
export GITLAB_TOKEN=$GITLAB_TOKEN

# General CI
export CI=true
export NODE_ENV=production
```

## Exit Codes

logsmith uses standard exit codes:

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | General error |
| `2` | Invalid arguments |
| `3` | Git error |
| `4` | File operation error |
| `5` | Version validation error |
| `6` | Network error |
| `7` | Permission error |

### Example Error Handling

```bash
#!/bin/bash
logsmith patch --commit --tag --push

case $? in
  0) echo "Release successful" ;;
  1) echo "General error occurred" ;;
  3) echo "Git operation failed" ;;
  4) echo "File operation failed" ;;
  *) echo "Unknown error" ;;
esac
```

## Hooks and Events

### Pre/Post Hooks

```json
{
  "scripts": {
    "prelogsmith": "npm test",
    "postlogsmith": "npm run build",
    "prelogsmith:commit": "npm run lint",
    "postlogsmith:commit": "npm run changelog"
  }
}
```

### Custom Event Handling

```typescript
import { versionBump } from '@stacksjs/logsmith'

await versionBump({
  release: 'patch',
  progress: (event) => {
    // Custom event handling
    console.log(`Event: ${event.event}`)
    console.log(`New version: ${event.newVersion}`)

    // Send to monitoring service
    if (event.event === 'git-tag') {
      sendToMonitoring({
        type: 'release',
        version: event.newVersion
      })
    }
  }
})
```

## Error Types and Handling

### Common Error Scenarios

```typescript
import { versionBump } from '@stacksjs/logsmith'

try {
  await versionBump({ release: 'patch' })
} catch (error) {
  switch (error.code) {
    case 'DIRTY_WORKING_DIRECTORY':
      console.error('Commit your changes first')
      break
    case 'NO_PACKAGE_JSON':
      console.error('No package.json found')
      break
    case 'INVALID_VERSION':
      console.error('Invalid version format')
      break
    case 'GIT_ERROR':
      console.error('Git operation failed:', error.details)
      break
    default:
      console.error('Unexpected error:', error.message)
  }
}
```

### Custom Error Classes

```typescript
class logsmithError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message)
    this.name = 'logsmithError'
  }
}

// Usage in error handling
if (error instanceof logsmithError) {
  console.error(`logsmith error [${error.code}]: ${error.message}`)
  if (error.details) {
    console.error('Details:', error.details)
  }
}
```

## Integration Examples

### Express.js Middleware

```typescript
import express from 'express'
import { versionBump } from '@stacksjs/logsmith'

const app = express()

app.post('/api/release', async (req, res) => {
  try {
    const { releaseType } = req.body

    await versionBump({
      release: releaseType,
      commit: true,
      tag: true,
      push: true
    })

    res.json({ success: true, message: 'Release created' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

### CLI Tool Integration

```typescript
#!/usr/bin/env node
import { program } from 'commander'
import { versionBump } from '@stacksjs/logsmith'

program
  .command('release <type>')
  .description('Create a release')
  .option('-c, --commit', 'Create git commit')
  .option('-t, --tag', 'Create git tag')
  .action(async (type, options) => {
    try {
      await versionBump({
        release: type,
        commit: options.commit,
        tag: options.tag,
        verbose: true
      })
      console.log('Release completed successfully!')
    } catch (error) {
      console.error('Release failed:', error.message)
      process.exit(1)
    }
  })

program.parse()
```

This comprehensive API reference covers all aspects of logsmith usage, from command-line interface to programmatic API and integration patterns.
