# 🔨 Logsmith

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![MIT License][license-src]][license-href]

Forge beautiful changelogs automatically using conventional commits.

## ✨ Features

- 🚀 **Automatic changelog generation** from conventional commits
- 🎨 **Beautiful formatting** with emojis and proper grouping
- 🔄 **Multiple output formats** - Markdown, JSON, and HTML
- 📊 **Repository statistics** with comprehensive trend analysis
- ⚙️ **Highly configurable** with TypeScript config files
- 🔧 **CLI and programmatic API** for all use cases
- 📝 **Conventional commits** parsing and analysis
- 👥 **Author filtering and management**
- 🔗 **Git repository integration** with compare URLs
- 🌍 **Multi-repository** support

## 🚀 Quick Start

### CLI Usage

Generate a changelog and display in console:

```bash
bunx logsmith
```

Generate a changelog and save to CHANGELOG.md:

```bash
bunx logsmith --output CHANGELOG.md
```

Generate changelog from specific commit range:

```bash
bunx logsmith --from v1.0.0 --to HEAD
```

Generate changelog in different formats:

```bash
# JSON format
bunx logsmith --format json --output changelog.json

# HTML format
bunx logsmith --format html --output changelog.html

# Auto-detect format from file extension
bunx logsmith --output changelog.json  # Automatically uses JSON format
bunx logsmith --output changelog.html  # Automatically uses HTML format
```

### Programmatic Usage

```typescript
import { generateChangelog } from 'logsmith'

// Generate changelog
const result = await generateChangelog({
  dir: process.cwd(),
  from: 'v1.0.0',
  to: 'HEAD',
  output: 'CHANGELOG.md',
  verbose: true,
  // ... other options
})

console.log(result.content) // Changelog content
console.log(result.outputPath) // Path where changelog was written
```

## 📖 CLI Commands

### Main Command

```bash
logsmith [options]
```

**Core Options:**
- `--from <ref>` - Start commit reference (default: latest git tag)
- `--to <ref>` - End commit reference (default: HEAD)
- `--dir <dir>` - Path to git repository (default: current directory)
- `--output <file>` - Changelog file name (default: CHANGELOG.md)
- `--format <format>` - Output format: markdown, json, html (default: markdown)
- `--no-output` - Write to console only
- `--verbose` - Enable verbose logging

**Author Filtering:**
- `--exclude-authors <authors>` - Skip contributors (comma-separated)
- `--include-authors <authors>` - Include only specific contributors (comma-separated)
- `--hide-author-email` - Do not include author email in changelog

**Advanced Filtering:**
- `--exclude-types <types>` - Exclude commit types (comma-separated)
- `--include-types <types>` - Include only specific commit types (comma-separated)
- `--exclude-scopes <scopes>` - Exclude commit scopes (comma-separated)
- `--include-scopes <scopes>` - Include only specific commit scopes (comma-separated)
- `--min-commits <number>` - Minimum commits required to include a section
- `--max-commits <number>` - Maximum commits per section (0 = unlimited)
- `--max-length <number>` - Maximum description length (0 = unlimited)

**Formatting Options:**
- `--no-dates` - Hide dates from changelog
- `--no-breaking-group` - Don't group breaking changes separately
- `--include-body` - Include commit body in changelog entries
- `--no-linkify` - Don't linkify issues and PRs

### Repository Statistics

```bash
logsmith stats [options]
```

Analyze your repository and display comprehensive statistics with trend analysis.

**Options:**
- `--from <ref>` - Start commit reference (default: latest git tag)
- `--to <ref>` - End commit reference (default: HEAD)
- `--dir <dir>` - Path to git repository (default: current directory)
- `--json` - Output in JSON format
- `--verbose` - Enable verbose logging

**Example Output:**
```
📊 Repository Statistics
─────────────────────────
Range: v1.0.0 → HEAD
Total commits: 127
Contributors: 8
Breaking changes: 3

📈 Commit Frequency
───────────────────
Total days with commits: 45
Average commits per day: 2.82
Peak day: 2024-03-15 (12 commits)
Recent activity:
  2024-03-20: ████ 4
  2024-03-19: ██ 2
  2024-03-18: ██████ 6

👥 Contributors
──────────────
Most active: John Doe (42 commits)
New contributors: 3
Top contributors:
  John Doe: 42 commits (33.1%)
  Jane Smith: 28 commits (22.0%)
  Bob Johnson: 19 commits (15.0%)

📋 Commit Types
──────────────
Most common: feat (35.4%)
Least common: revert (0.8%)
Distribution:
  feat      : ███████ 35.4% (45)
  fix       : █████ 24.4% (31)
  docs      : ██ 11.8% (15)
  refactor  : ██ 9.4% (12)
```

## ⚙️ Configuration

Logsmith can be configured using a `logsmith.config.ts` file:

```typescript
import { defineConfig } from 'logsmith'

export default defineConfig({
  output: 'CHANGELOG.md',

  // Changelog options
  hideAuthorEmail: false,
  excludeAuthors: ['dependabot[bot]', 'github-actions[bot]'],

  // Templates and formatting
  templates: {
    commitFormat: '- {{scope}}{{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
    typeFormat: {
      feat: '🚀 Features',
      fix: '🐛 Bug Fixes',
      docs: '📚 Documentation',
      // ... customize as needed
    },
  },

  // Repository configuration
  repo: 'https://github.com/your-org/your-repo',

  verbose: true,
})
```

### Configuration Options

```typescript
interface LogsmithConfig {
  // Core options
  verbose: boolean
  output: string | false
  from?: string
  to: string
  dir: string

  // Changelog options
  clean: boolean
  excludeAuthors: string[]
  includeAuthors: string[]
  excludeEmail: boolean
  hideAuthorEmail: boolean

  // Repository configuration
  repo?: string
  github: {
    repo?: string
    token?: string
  }

  // Templates and formatting
  templates: {
    commitFormat: string
    groupFormat: string
    typeFormat: Record<string, string>
  }
}
```

## 📝 Conventional Commits

Logsmith parses conventional commits and groups them by type:

```
feat: add new authentication system
fix: resolve memory leak in parser
docs: update API documentation
style: fix code formatting
refactor: simplify user service
perf: optimize database queries
test: add integration tests
build: update dependencies
ci: improve GitHub Actions workflow
chore: update development tools
```

### Breaking Changes

Breaking changes are detected and highlighted:

```
feat!: remove deprecated API endpoints
feat: add new feature

BREAKING CHANGE: The old API has been removed
```

## 🔄 Output Formats

Logsmith supports multiple output formats to meet different needs:

### Markdown (Default)

Standard markdown format perfect for GitHub repositories:

```markdown
### 🚀 Features

- **auth**: add OAuth integration ([abc123d](https://github.com/your-org/your-repo/commit/abc123d))
- **api**: implement rate limiting ([def456a](https://github.com/your-org/your-repo/commit/def456a))

### 🐛 Bug Fixes

- **parser**: fix memory leak in token processing ([ghi789b](https://github.com/your-org/your-repo/commit/ghi789b))

### Contributors

- John Doe <john@example.com>
- Jane Smith <jane@example.com>
```

### JSON Format

Structured data format for automation and tooling:

```json
{
  "date": "2024-03-20",
  "sections": [
    {
      "title": "🚀 Features",
      "commits": [
        {
          "type": "feat",
          "scope": "auth",
          "description": "add OAuth integration",
          "hash": "abc123d",
          "author": "John Doe <john@example.com>",
          "breaking": false,
          "references": []
        }
      ]
    }
  ],
  "contributors": ["John Doe <john@example.com>"],
  "stats": {
    "totalCommits": 15,
    "sectionsCount": 3,
    "contributorsCount": 4,
    "breakingChanges": 1
  }
}
```

### HTML Format

Beautiful web-ready format with modern styling:

- Clean, responsive design
- Syntax highlighting for commit hashes
- Interactive links to commits and issues
- Mobile-friendly layout
- Professional typography
- Breaking change indicators

## 🔧 API Reference

### `generateChangelog(config: LogsmithConfig): Promise<ChangelogResult>`

Generate changelog content with optional file output.

**Returns:**
```typescript
interface ChangelogResult {
  content: string // Generated changelog content
  outputPath?: string // Path where changelog was written (if output option used)
}
```

### `defineConfig(config: LogsmithConfig): LogsmithConfig`

TypeScript helper for configuration files.

## 🤝 Integration with Version Bumping

Logsmith focuses solely on changelog generation. For version bumping functionality, use it together with [`@stacksjs/logsmith`](../logsmith):

```bash
# First bump the version
bunx logsmith patch

# Then generate changelog
bunx logsmith --output CHANGELOG.md
```

Or use them together in your build scripts:

```json
{
  "scripts": {
    "release": "logsmith patch && logsmith --output CHANGELOG.md"
  }
}
```

## 📄 License

MIT License © 2024-PRESENT [Chris Breuer](https://github.com/chrisbbreuer)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/logsmith?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/logsmith
[npm-downloads-src]: https://img.shields.io/npm/dm/logsmith?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/logsmith
[license-src]: https://img.shields.io/github/license/stacksjs/logsmith.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/stacksjs/logsmith/blob/main/LICENSE.md
