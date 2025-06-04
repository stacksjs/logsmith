# Configuration

Logsmith supports flexible configuration through TypeScript configuration files, allowing you to customize every aspect of changelog generation to match your project's needs.

## Configuration Files

Logsmith will automatically look for configuration files in your project root:

- `logsmith.config.ts` _(recommended)_
- `logsmith.config.js`
- `.logsmithrc.ts`
- `.logsmithrc.js`

## Basic Configuration

Create a `logsmith.config.ts` file in your project root:

```typescript
import { defineConfig } from 'logsmith'

export default defineConfig({
  // Basic options
  output: 'CHANGELOG.md',
  format: 'markdown',
  theme: 'github',
  language: 'en',

  // Content filtering
  excludeAuthors: ['dependabot[bot]', 'renovate[bot]'],
  excludeCommitTypes: ['chore', 'ci'],
  minCommitsForSection: 1,

  // Display options
  includeCommitBody: false,
  hideAuthorEmail: true,
  linkifyIssues: true,
})
```

## Core Options

### Basic Settings

```typescript
export default defineConfig({
  // File output
  output: 'CHANGELOG.md', // File path or false for console only
  format: 'markdown', // 'markdown' | 'json' | 'html'
  clean: false, // Overwrite existing changelog

  // Git range
  from: 'v1.0.0', // Start commit/tag (auto-detected if undefined)
  to: 'HEAD', // End commit/tag
  dir: process.cwd(), // Repository directory

  // Localization
  language: 'en', // Language code (en, es, fr, de, etc.)
  theme: 'default', // Theme name

  // Logging
  verbose: false, // Enable detailed logging
})
```

### Content Filtering

```typescript
export default defineConfig({
  // Author filtering
  excludeAuthors: [
    'dependabot[bot]',
    'renovate[bot]',
    'github-actions[bot]'
  ],
  includeAuthors: [], // Empty = all authors
  hideAuthorEmail: true, // Hide email addresses

  // Commit type filtering
  excludeCommitTypes: ['chore', 'ci', 'test'],
  includeCommitTypes: [], // Empty = all types

  // Scope filtering
  excludeScopes: ['test', 'internal'],
  includeScopes: ['core', 'api'],

  // Message filtering
  excludeMessages: [
    'Merge pull request',
    'Merge branch',
    /^chore\(deps\):/ // Regex patterns supported
  ],
})
```

### Section Control

```typescript
export default defineConfig({
  // Section requirements
  minCommitsForSection: 3, // Minimum commits to show section
  maxCommitsPerSection: 50, // Maximum commits per section (0 = unlimited)

  // Breaking changes
  groupBreakingChanges: true, // Group breaking changes separately

  // Content inclusion
  includeCommitBody: false, // Include full commit message body
  includeCommitCount: true, // Show commit count in section headers
  maxDescriptionLength: 100, // Truncate long descriptions (0 = unlimited)
})
```

### Date and Versioning

```typescript
export default defineConfig({
  // Date options
  includeDates: true, // Include dates in changelog
  dateFormat: 'YYYY-MM-DD', // Date format string

  // Version options
  versionPrefix: 'v', // Prefix for version tags

  // Link generation
  linkifyIssues: true, // Auto-link issue references
  linkifyPRs: true, // Auto-link PR references
})
```

## Repository Configuration

Configure repository-specific settings for better link generation:

```typescript
export default defineConfig({
  // Repository URL
  repo: 'https://github.com/username/repo',

  // GitHub-specific settings
  github: {
    repo: 'username/repo', // GitHub repo in owner/name format
    token: process.env.GITHUB_TOKEN, // GitHub API token for enhanced features
  },
})
```

## Templates and Formatting

Customize the appearance of your changelog with templates:

```typescript
export default defineConfig({
  templates: {
    // Individual commit entry format
    commitFormat: '- {{scope}}{{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',

    // Section group header format
    groupFormat: '### {{title}}',

    // Breaking change entry format
    breakingChangeFormat: '- **{{scope}}{{description}}** ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',

    // Date format in headers
    dateFormat: '_{{date}}_',

    // Commit type display names
    typeFormat: {
      feat: '🚀 Features',
      fix: '🐛 Bug Fixes',
      docs: '📚 Documentation',
      style: '💅 Styles',
      refactor: '♻️ Code Refactoring',
      perf: '⚡ Performance Improvements',
      test: '🧪 Tests',
      build: '📦 Build System',
      ci: '🤖 Continuous Integration',
      chore: '🧹 Chores',
      revert: '⏪ Reverts',
    },
  },
})
```

## Complete Example

Here's a comprehensive configuration example:

```typescript
import { defineConfig } from 'logsmith'

export default defineConfig({
  // Core settings
  output: 'CHANGELOG.md',
  format: 'markdown',
  theme: 'github',
  language: 'en',
  verbose: false,

  // Git range (auto-detected if not specified)
  from: undefined,
  to: 'HEAD',
  dir: process.cwd(),

  // Content filtering
  excludeAuthors: [
    'dependabot[bot]',
    'renovate[bot]',
    'github-actions[bot]',
    'semantic-release-bot'
  ],
  excludeCommitTypes: ['chore', 'ci'],
  excludeScopes: ['test', 'internal'],
  excludeMessages: [
    'Merge pull request',
    'Merge branch',
    /^chore\(deps\):/,
    /^ci:/
  ],

  // Section control
  minCommitsForSection: 1,
  maxCommitsPerSection: 0,
  groupBreakingChanges: true,

  // Content options
  includeCommitBody: false,
  includeCommitCount: false,
  hideAuthorEmail: true,
  maxDescriptionLength: 0,

  // Date and versioning
  includeDates: true,
  dateFormat: 'YYYY-MM-DD',
  versionPrefix: 'v',

  // Linking
  linkifyIssues: true,
  linkifyPRs: true,

  // Repository configuration
  repo: 'https://github.com/stacksjs/logsmith',
  github: {
    repo: 'stacksjs/logsmith',
    token: process.env.GITHUB_TOKEN,
  },

  // Custom templates
  templates: {
    commitFormat: '- {{scope}}{{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}})) by {{author}}',
    groupFormat: '### {{title}} ({{count}} changes)',
    breakingChangeFormat: '- ⚠️ **BREAKING**: {{scope}}{{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
    dateFormat: '**{{date}}**',
    typeFormat: {
      feat: '✨ New Features',
      fix: '🐛 Bug Fixes',
      docs: '📖 Documentation',
      style: '🎨 Code Style',
      refactor: '🔧 Code Refactoring',
      perf: '⚡ Performance',
      test: '🧪 Testing',
      build: '📦 Build',
      ci: '🤖 CI/CD',
      chore: '🧹 Maintenance',
      revert: '⏪ Reverts',
    },
  },
})
```

## Environment-Specific Configuration

You can create different configurations for different environments:

```typescript
// logsmith.config.ts
import { defineConfig } from 'logsmith'

const baseConfig = {
  format: 'markdown' as const,
  theme: 'github' as const,
  excludeAuthors: ['dependabot[bot]'],
}

export default defineConfig(
  process.env.NODE_ENV === 'production'
    ? {
        ...baseConfig,
        output: 'CHANGELOG.md',
        verbose: false,
        minCommitsForSection: 2,
      }
    : {
        ...baseConfig,
        output: false, // Console only in development
        verbose: true,
        minCommitsForSection: 1,
      }
)
```

## Multiple Output Formats

Generate multiple formats with different configurations:

```typescript
// scripts/generate-changelogs.ts
import { generateChangelog } from 'logsmith'

const baseConfig = {
  theme: 'github' as const,
  excludeAuthors: ['dependabot[bot]'],
}

// Generate Markdown for GitHub
await generateChangelog({
  ...baseConfig,
  format: 'markdown',
  output: 'CHANGELOG.md',
})

// Generate JSON for API consumption
await generateChangelog({
  ...baseConfig,
  format: 'json',
  output: 'changelog.json',
  includeCommitBody: true,
})

// Generate HTML for documentation
await generateChangelog({
  ...baseConfig,
  format: 'html',
  output: 'docs/changelog.html',
  theme: 'colorful',
})
```

## Monorepo Configuration

For monorepos, you can have package-specific configurations:

```typescript
// packages/core/logsmith.config.ts
import { defineConfig } from 'logsmith'

export default defineConfig({
  output: 'CHANGELOG.md',
  theme: 'minimal',
  includeScopes: ['core'],
  excludeScopes: ['test'],
  templates: {
    groupFormat: '### {{title}} - Core Package',
  },
})
```

```typescript
// packages/api/logsmith.config.ts
import { defineConfig } from 'logsmith'

export default defineConfig({
  output: 'CHANGELOG.md',
  theme: 'github',
  includeScopes: ['api'],
  includeCommitTypes: ['feat', 'fix', 'docs'],
})
```

## Configuration Validation

Logsmith will validate your configuration and provide helpful error messages:

```typescript
// Invalid configuration example
export default defineConfig({
  format: 'invalid', // ❌ Error: Invalid format
  theme: 'nonexistent', // ❌ Error: Unknown theme
  minCommitsForSection: -1, // ❌ Error: Must be positive
})
```

## Loading Configuration Programmatically

```typescript
import { loadLogsmithConfig } from 'logsmith'

// Load with overrides
const config = await loadLogsmithConfig({
  theme: 'minimal',
  verbose: true,
})

console.log(config) // Merged configuration
```

## Next Steps

- [Learn about theming options](/features/theming) to customize appearance
- [Explore repository analytics](/features/repository-insights) for detailed insights
- [Set up automation](/advanced/automation) for CI/CD integration
- [Check out the API reference](/api/reference) for programmatic usage
