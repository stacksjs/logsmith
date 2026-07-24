# Advanced Configuration

This guide covers advanced configuration options for logsmith, including environment-specific settings, programmatic configuration, and complex filtering scenarios.

## Configuration Precedence

Configuration is loaded with the following precedence (highest to lowest):

1. CLI arguments
2. Environment variables
3. Configuration file (`logsmith.config.ts`)
4. Default values

## Configuration File Locations

Logsmith searches for configuration files in order:

1. `logsmith.config.ts`
2. `logsmith.config.js`
3. `.logsmithrc.ts`
4. `.logsmithrc.js`

## Complete Configuration Reference

```typescript
// logsmith.config.ts
import { defineConfig } from 'logsmith'

export default defineConfig({
  // ============================================
  // CORE OPTIONS
  // ============================================

  // Enable verbose logging during generation
  verbose: false,

  // Output file path or false for console only
  output: 'CHANGELOG.md',

  // Output format: 'markdown' | 'json' | 'html'
  format: 'markdown',

  // Language for localization
  language: 'en',

  // Theme for styling
  theme: 'github',

  // Git commit range
  from: undefined, // Auto-detected from tags
  to: 'HEAD',

  // Working directory for git operations
  dir: process.cwd(),

  // ============================================
  // CHANGELOG OPTIONS
  // ============================================

  // Overwrite existing changelog
  clean: false,

  // Authors to exclude
  excludeAuthors: ['dependabot[bot]', 'github-actions[bot]'],

  // Authors to include (empty = all)
  includeAuthors: [],

  // Exclude email addresses
  excludeEmail: false,

  // Hide email in output
  hideAuthorEmail: true,

  // ============================================
  // FILTERING OPTIONS
  // ============================================

  // Commit types to exclude
  excludeCommitTypes: [],

  // Commit types to include (empty = all)
  includeCommitTypes: [],

  // Minimum commits to show section
  minCommitsForSection: 1,

  // Maximum commits per section (0 = unlimited)
  maxCommitsPerSection: 50,

  // Scopes to exclude
  excludeScopes: [],

  // Scopes to include (empty = all)
  includeScopes: [],

  // Message patterns to exclude
  excludeMessages: [],

  // ============================================
  // BREAKING CHANGES OPTIONS
  // ============================================

  // Group breaking changes in separate section
  groupBreakingChanges: true,

  // ============================================
  // DATE AND VERSIONING
  // ============================================

  // Include dates in output
  includeDates: true,

  // Date format string
  dateFormat: 'YYYY-MM-DD',

  // Include commit counts
  includeCommitCount: false,

  // Version tag prefix
  versionPrefix: 'v',

  // ============================================
  // CONTENT OPTIONS
  // ============================================

  // Include commit body text
  includeCommitBody: false,

  // Max description length (0 = unlimited)
  maxDescriptionLength: 0,

  // Auto-link issue references
  linkifyIssues: true,

  // Auto-link PR references
  linkifyPRs: true,

  // ============================================
  // REPOSITORY CONFIG
  // ============================================

  // Repository URL
  repo: 'https://github.com/user/repo',

  // GitHub-specific settings
  github: {
    repo: 'user/repo',
    token: process.env.GITHUB_TOKEN,
  },

  // ============================================
  // TEMPLATES
  // ============================================

  templates: {
    // Commit entry format
    commitFormat: '- {{scope}}{{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}})) _(by {{author}})_',

    // Section header format
    groupFormat: '### {{title}}',

    // Breaking change format
    breakingChangeFormat: '- **{{scope}}{{description}}** ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',

    // Date format
    dateFormat: '_{{date}}_',

    // Type display names
    typeFormat: {
      feat: 'Features',
      fix: 'Bug Fixes',
      docs: 'Documentation',
      style: 'Styles',
      refactor: 'Code Refactoring',
      perf: 'Performance Improvements',
      test: 'Tests',
      build: 'Build System',
      ci: 'Continuous Integration',
      chore: 'Chores',
      revert: 'Reverts',
    },
  },

  // ============================================
  // MARKDOWN LINTING
  // ============================================

  // Enable markdown linting
  markdownLint: true,

  // Custom markdownlint rules
  markdownLintRules: {
    MD041: false, // First line heading
    MD013: false, // Line length
  },

  // Path to markdownlint config
  markdownLintConfig: undefined,
})
```

## Environment Variables

Configure logsmith via environment variables:

```bash
# Core settings
LOGSMITH_VERBOSE=true
LOGSMITH_OUTPUT=CHANGELOG.md
LOGSMITH_FORMAT=markdown
LOGSMITH_THEME=github
LOGSMITH_LANGUAGE=en

# Git range
LOGSMITH_FROM=v1.0.0
LOGSMITH_TO=HEAD
LOGSMITH_DIR=/path/to/repo

# Filtering
LOGSMITH_EXCLUDE_AUTHORS=dependabot[bot],renovate[bot]
LOGSMITH_EXCLUDE_TYPES=chore,ci
LOGSMITH_INCLUDE_SCOPES=core,api

# GitHub integration
GITHUB_TOKEN=ghp_xxxxx
GITHUB_REPOSITORY=user/repo
```

### Using Environment Variables

```typescript
// logsmith.config.ts
import { defineConfig } from 'logsmith'

export default defineConfig({
  verbose: process.env.LOGSMITH_VERBOSE === 'true',
  output: process.env.LOGSMITH_OUTPUT || 'CHANGELOG.md',
  theme: (process.env.LOGSMITH_THEME as any) || 'github',
  repo: process.env.GITHUB_REPOSITORY
    ? `https://github.com/${process.env.GITHUB_REPOSITORY}`
    : undefined,
})
```

## Environment-Specific Configuration

### Development vs Production

```typescript
// logsmith.config.ts
import { defineConfig } from 'logsmith'

const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig({
  verbose: isDev,
  theme: isDev ? 'default' : 'corporate',
  minCommitsForSection: isDev ? 1 : 3,
  output: isDev ? false : 'CHANGELOG.md', // Console in dev
})
```

### CI-Specific Configuration

```typescript
// logsmith.config.ts
import { defineConfig } from 'logsmith'

const isCI = process.env.CI === 'true'

export default defineConfig({
  verbose: !isCI,
  theme: isCI ? 'corporate' : 'github',
  markdownLint: isCI,
  excludeAuthors: [
    'dependabot[bot]',
    'renovate[bot]',
    ...(isCI ? ['github-actions[bot]'] : []),
  ],
})
```

## Dynamic Configuration

### Runtime Configuration

```typescript
import { generateChangelog, loadLogsmithConfig } from 'logsmith'

async function generate(options = {}) {
  const baseConfig = await loadLogsmithConfig()

  await generateChangelog({
    ...baseConfig,
    ...options,
    // Override specific settings
    output: options.output || 'CHANGELOG.md',
  })
}

// Usage
await generate({ theme: 'minimal', from: 'v1.0.0' })
```

### Conditional Configuration

```typescript
// logsmith.config.ts
import { defineConfig } from 'logsmith'
import { existsSync } from 'fs'

// Detect monorepo
const isMonorepo = existsSync('./packages')

export default defineConfig({
  dir: isMonorepo ? 'packages/core' : '.',
  includeScopes: isMonorepo ? ['core'] : [],
})
```

## Complex Filtering

### Regex-Based Filtering

```typescript
export default defineConfig({
  excludeMessages: [
    'Merge pull request',
    'Merge branch',
    /^chore\(deps\):/, // Regex: dependency updates
    /^ci:/, // Regex: all CI commits
    /^\[skip ci\]/, // Regex: skip CI commits
  ],
})
```

### Multi-Level Filtering

```typescript
export default defineConfig({
  // First filter: exclude bots
  excludeAuthors: ['dependabot[bot]', 'renovate[bot]'],

  // Second filter: only certain types
  includeCommitTypes: ['feat', 'fix', 'docs', 'perf'],

  // Third filter: exclude test scope
  excludeScopes: ['test', 'internal'],

  // Fourth filter: minimum commits
  minCommitsForSection: 2,

  // Fifth filter: max per section
  maxCommitsPerSection: 20,
})
```

## Monorepo Configuration

### Per-Package Configuration

```typescript
// packages/core/logsmith.config.ts
import { defineConfig } from 'logsmith'

export default defineConfig({
  output: 'CHANGELOG.md',
  includeScopes: ['core'],
  repo: 'https://github.com/org/monorepo',
  templates: {
    groupFormat: '### {{title}} - Core Package',
  },
})
```

### Root Configuration

```typescript
// logsmith.config.ts (root)
import { defineConfig } from 'logsmith'

export default defineConfig({
  output: 'CHANGELOG.md',
  excludeScopes: ['internal', 'scripts'],
  // Include all package scopes
  includeScopes: ['core', 'api', 'cli', 'utils'],
})
```

## Template Customization

### Full Template Override

```typescript
export default defineConfig({
  templates: {
    // Custom commit format with all variables
    commitFormat: `
- {{emoji}} {{scope}}{{description}}
  - Hash: [{{hash}}]({{repoUrl}}/commit/{{hash}})
  - Author: {{author}}
  {{#if breaking}}- **BREAKING CHANGE**{{/if}}
    `.trim(),

    // Custom section headers
    groupFormat: '## {{emoji}} {{title}} ({{count}} changes)',

    // Custom breaking change emphasis
    breakingChangeFormat: '- **BREAKING**: {{description}} _(migration required)_',

    // Custom date display
    dateFormat: '### Released on {{date}}',
  },
})
```

### Type-Specific Templates

```typescript
export default defineConfig({
  templates: {
    typeFormat: {
      feat: 'New Features',
      fix: 'Bug Fixes',
      docs: 'Documentation Updates',
      style: 'Code Style Improvements',
      refactor: 'Code Refactoring',
      perf: 'Performance Enhancements',
      test: 'Test Coverage',
      build: 'Build Configuration',
      ci: 'CI/CD Pipeline',
      chore: 'Maintenance Tasks',
      revert: 'Reverted Changes',
      security: 'Security Patches', // Custom type
    },
  },
})
```

## Validation

### Configuration Validation

```typescript
import { validateConfig, defineConfig } from 'logsmith'

const config = defineConfig({
  format: 'markdown',
  theme: 'github',
})

const errors = validateConfig(config)
if (errors.length > 0) {
  console.error('Configuration errors:', errors)
  process.exit(1)
}
```

### Runtime Validation

```typescript
function validateOptions(options) {
  const errors = []

  if (options.minCommitsForSection < 0) {
    errors.push('minCommitsForSection must be non-negative')
  }

  if (options.maxCommitsPerSection < 0) {
    errors.push('maxCommitsPerSection must be non-negative')
  }

  if (!['markdown', 'json', 'html'].includes(options.format)) {
    errors.push(`Invalid format: ${options.format}`)
  }

  return errors
}
```

## Configuration Patterns

### Factory Pattern

```typescript
import { defineConfig, LogsmithConfig } from 'logsmith'

function createConfig(overrides: Partial<LogsmithConfig> = {}) {
  return defineConfig({
    // Defaults
    theme: 'github',
    excludeAuthors: ['dependabot[bot]'],
    // Overrides
    ...overrides,
  })
}

// Usage
export default createConfig({ theme: 'corporate' })
```

### Preset Pattern

```typescript
// presets.ts
export const githubPreset = {
  theme: 'github',
  linkifyIssues: true,
  linkifyPRs: true,
}

export const corporatePreset = {
  theme: 'corporate',
  hideAuthorEmail: true,
  excludeCommitTypes: ['chore', 'ci', 'test'],
}

// logsmith.config.ts
import { defineConfig } from 'logsmith'
import { githubPreset } from './presets'

export default defineConfig({
  ...githubPreset,
  output: 'CHANGELOG.md',
})
```

## Debugging Configuration

```typescript
// Debug config loading
import { loadLogsmithConfig } from 'logsmith'

async function debugConfig() {
  const config = await loadLogsmithConfig()

  console.log('Loaded configuration:')
  console.log(JSON.stringify(config, null, 2))

  // Check specific values
  console.log('\nKey settings:')
  console.log(`- Theme: ${config.theme}`)
  console.log(`- Format: ${config.format}`)
  console.log(`- Excluded authors: ${config.excludeAuthors.join(', ')}`)
}

debugConfig()
```

## Next Steps

- Learn about [Custom Templates](/advanced/custom-templates) for formatting
- Explore [Performance](/advanced/performance) optimization
- Review [CI/CD Integration](/advanced/ci-cd-integration) for automation
