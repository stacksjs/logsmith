<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# Logsmith Changelog Action

A GitHub Action that automates changelog generation and GitHub releases using [Logsmith](https://logsmith.sh). This action can generate beautiful changelogs from conventional commits, create GitHub releases, and commit changelog files to your repository.

## Features

- 🔄 **Automatic changelog generation** from conventional commits
- 🎨 **Multiple themes** (default, github, minimal, corporate, gitmoji, unicode, simple, colorful)
- 📄 **Multiple output formats** (Markdown, JSON, HTML)
- 🚀 **GitHub release creation** with generated release notes
- 💾 **Automatic committing** of changelog files
- 🔍 **Smart filtering** by commit types, authors, scopes, and date ranges
- 🌍 **Internationalization support** (10+ languages)
- ⚡ **Fast execution** powered by Bun runtime

## Usage

### Basic Example

```yaml
name: Generate Changelog
on:
  push:
    tags:
      - 'v*'

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Required for changelog generation

      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - uses: stacksjs/logsmith@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          create-release: true
          commit-changelog: true
```

### Advanced Example

```yaml
name: Release Workflow
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.PAT }} # Use PAT for committing

      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - uses: stacksjs/logsmith@v1
        id: changelog
        with:
          # GitHub settings
          github-token: ${{ secrets.GITHUB_TOKEN }}

          # Changelog generation
          output-path: CHANGELOG.md
          format: markdown
          theme: github
          include-unreleased: true

          # Filtering options
          from-tag: v1.0.0
          commit-types: 'feat,fix,perf,refactor'

          # Release creation
          create-release: true
          release-title: 'Release ${{ github.ref_name }}'
          release-draft: false
          release-prerelease: ${{ contains(github.ref_name, 'beta') || contains(github.ref_name, 'alpha') }}

          # Commit options
          commit-changelog: true
          commit-message: 'chore: update changelog for ${{ github.ref_name }}'
          commit-author-name: 'github-actions[bot]'
          commit-author-email: 'github-actions[bot]@users.noreply.github.com'

          # General options
          verbose: true

      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '📋 **Changelog Preview**\n\n```markdown\n${{ steps.changelog.outputs.changelog-content }}\n```'
            })
```

## Inputs

### GitHub Settings

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github-token` | GitHub token for creating releases and committing files | No | `""` |

### Changelog Generation

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `output-path` | Path to the changelog file | No | `CHANGELOG.md` |
| `format` | Output format (`markdown`, `json`, `html`) | No | `markdown` |
| `theme` | Theme for formatting (`default`, `github`, `minimal`, `corporate`, `gitmoji`, `unicode`, `simple`, `colorful`) | No | `default` |
| `include-unreleased` | Include unreleased changes in changelog | No | `true` |

### Filtering Options

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `from-tag` | Starting tag/commit for changelog range | No | `""` |
| `to-tag` | Ending tag/commit for changelog range | No | `""` |
| `commit-types` | Comma-separated list of commit types to include | No | `""` |
| `scopes` | Comma-separated list of scopes to include | No | `""` |
| `authors` | Comma-separated list of authors to include | No | `""` |

### Release Creation

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `create-release` | Whether to create a GitHub release | No | `false` |
| `release-tag` | Tag for the release (auto-detected if not provided) | No | `""` |
| `release-title` | Title for the GitHub release | No | `""` |
| `release-draft` | Create release as draft | No | `false` |
| `release-prerelease` | Mark release as prerelease | No | `false` |
| `release-generate-notes` | Auto-generate release notes if no changelog content | No | `true` |

### Commit Options

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `commit-changelog` | Whether to commit the generated changelog | No | `false` |
| `commit-message` | Commit message for changelog | No | `chore: update changelog` |
| `commit-author-name` | Author name for the commit | No | `""` |
| `commit-author-email` | Author email for the commit | No | `""` |

### General Options

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `config-path` | Path to logsmith config file | No | `""` |
| `working-directory` | Working directory for the action | No | `.` |
| `verbose` | Enable verbose logging | No | `false` |
| `timeout` | Timeout in seconds | No | `600` |

## Outputs

| Output | Description |
|--------|-------------|
| `success` | Whether the action completed successfully |
| `changelog-generated` | Whether changelog was generated |
| `changelog-path` | Path to the generated changelog file |
| `changelog-content` | Generated changelog content |
| `release-created` | Whether GitHub release was created |
| `release-url` | URL of the created GitHub release |
| `release-id` | ID of the created GitHub release |
| `release-tag` | Tag of the created GitHub release |
| `changelog-committed` | Whether changelog was committed |
| `commit-sha` | SHA of the changelog commit |
| `summary` | JSON summary of the action execution |

## Examples

### Generate Changelog Only

```yaml
- uses: stacksjs/logsmith@v1
  with:
    output-path: docs/CHANGELOG.md
    theme: github
    format: markdown
```

### Create Release with Custom Notes

```yaml
- uses: stacksjs/logsmith@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    create-release: true
    release-title: 'Version ${{ github.ref_name }}'
    release-draft: true
    theme: corporate
```

### Filter by Commit Types

```yaml
- uses: stacksjs/logsmith@v1
  with:
    commit-types: 'feat,fix,perf'
    from-tag: v1.0.0
    to-tag: HEAD
    theme: minimal
```

### Commit and Release Workflow

```yaml
- uses: stacksjs/logsmith@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    create-release: true
    commit-changelog: true
    commit-message: 'docs: update changelog for ${{ github.ref_name }}'
    theme: gitmoji
```

## Themes

Logsmith supports multiple built-in themes:

- **default** - Clean, professional formatting
- **github** - GitHub-style formatting with emojis
- **minimal** - Simplified, minimal formatting
- **corporate** - Formal, business-appropriate formatting
- **gitmoji** - Uses gitmoji icons for commit types
- **unicode** - Uses Unicode symbols for visual appeal
- **simple** - Basic, straightforward formatting
- **colorful** - Rich formatting with color indicators

## Configuration File

You can use a `logsmith.config.ts` file for advanced configuration:

```typescript
import { defineConfig } from 'logsmith'

export default defineConfig({
  theme: 'github',
  format: 'markdown',
  output: 'CHANGELOG.md',
  repository: {
    provider: 'github',
    owner: 'stacksjs',
    name: 'logsmith'
  },
  commits: {
    types: {
      feat: 'Features',
      fix: 'Bug Fixes',
      perf: 'Performance Improvements',
      refactor: 'Code Refactoring',
      docs: 'Documentation',
      style: 'Styles',
      test: 'Tests',
      chore: 'Chores'
    }
  }
})
```

## Requirements

- **Bun 1.2+** - Install using [oven-sh/setup-bun](https://github.com/oven-sh/setup-bun)
- **Git repository** with conventional commits
- **GitHub token** (for release creation and committing)

## Troubleshooting

### Common Issues

1. **"Neither Logsmith nor Bun is available"**
   - Ensure you're using `oven-sh/setup-bun` action before this one
   - Make sure Bun version is 1.2 or later

2. **"GitHub token is required when create-release is enabled"**
   - Provide a valid `github-token` input
   - Ensure token has necessary permissions for releases

3. **"No changes to commit"**
   - This is normal if the changelog hasn't changed
   - The action will still succeed

4. **Permission denied errors**
   - Use a Personal Access Token (PAT) instead of `GITHUB_TOKEN` for committing
   - Ensure token has `contents: write` and `pull-requests: write` permissions

### Debug Mode

Enable verbose logging for detailed debugging:

```yaml
- uses: stacksjs/logsmith@v1
  with:
    verbose: true
    # ... other inputs
```

## License

MIT License - see [LICENSE.md](../../LICENSE.md) for details.

## Contributing

Contributions are welcome! Please see our [Contributing Guide](../../.github/CONTRIBUTING.md).

## Support

- 📖 [Documentation](https://logsmith.sh)
- 🐛 [Issues](https://github.com/stacksjs/logsmith/issues)
- 💬 [Discussions](https://github.com/stacksjs/logsmith/discussions)
- 🗨️ [Discord](https://discord.gg/stacksjs)

## Postcardware

"Software that is free, but hopes for a postcard." We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/logsmith-installer?style=flat-square
[npm-version-href]: https://npmjs.com/package/logsmith-installer
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/logsmith-installer/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/logsmith-installer/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/logsmith-installer/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/logsmith-installer -->
