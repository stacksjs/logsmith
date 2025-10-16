# GitHub Action

Automate changelog generation in your GitHub workflows with the official Logsmith action.

## Quick Start

Add the Logsmith action to your workflow:

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
          fetch-depth: 0 # Required for full git history

      - uses: stacksjs/logsmith-action@v0.2.0
        with:
          output: 'CHANGELOG.md'
          theme: 'github'
```

## Installation

The action is published at [`stacksjs/logsmith-action`](https://github.com/stacksjs/logsmith/tree/main/packages/action) and can be used directly in your workflows.

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
```

::: tip
Always use `fetch-depth: 0` when checking out your repository to ensure the full Git history is available for changelog generation.
:::

## Configuration

### Core Options

| Input | Description | Default |
|-------|-------------|---------|
| `from` | Start commit reference | Latest git tag |
| `to` | End commit reference | `HEAD` |
| `output` | Changelog file name | `CHANGELOG.md` |
| `format` | Output format: `markdown`, `json`, `html` | `markdown` |
| `language` | Language: `en`, `es`, `fr`, `de`, `zh`, `ja`, `ko`, `ru`, `pt`, `it` | `en` |
| `theme` | Theme: `default`, `minimal`, `github`, `gitmoji`, `unicode`, `simple`, `colorful`, `corporate` | `github` |
| `verbose` | Enable verbose logging | `false` |

### Filtering Options

| Input | Description | Default |
|-------|-------------|---------|
| `exclude-authors` | Skip contributors (comma-separated) | - |
| `include-authors` | Include only specific contributors (comma-separated) | - |
| `exclude-types` | Exclude commit types (comma-separated) | - |
| `include-types` | Include only specific commit types (comma-separated) | - |
| `exclude-scopes` | Exclude commit scopes (comma-separated) | - |
| `include-scopes` | Include only specific commit scopes (comma-separated) | - |
| `min-commits` | Minimum commits required to include a section | `1` |
| `max-commits` | Maximum commits per section (0 = unlimited) | `50` |

### Content Options

| Input | Description | Default |
|-------|-------------|---------|
| `clean` | Overwrite existing changelog content | `false` |
| `hide-author-email` | Do not include author email in changelog | `false` |
| `include-dates` | Include dates in changelog | `true` |
| `group-breaking-changes` | Group breaking changes separately | `true` |
| `include-body` | Include commit body in changelog entries | `false` |
| `linkify` | Linkify issues and PRs | `true` |
| `max-length` | Maximum description length (0 = unlimited) | `0` |
| `markdown-lint` | Enable markdown linting and auto-fixing | `true` |

### GitHub Integration

| Input | Description | Default |
|-------|-------------|---------|
| `github-token` | GitHub token for API access | `${{ github.token }}` |

## Outputs

The action provides the following outputs that can be used in subsequent steps:

| Output | Description |
|--------|-------------|
| `changelog` | Generated changelog content |
| `file` | Path to the generated changelog file |
| `format` | Format of the generated changelog |

## Usage Examples

### Basic Usage

Generate a changelog with default settings:

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
```

### Custom Range

Generate a changelog for a specific commit range:

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    from: 'v1.0.0'
    to: 'HEAD'
    theme: 'github'
```

### Exclude Bot Commits

Filter out automated commits from bots:

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    exclude-authors: 'dependabot[bot],github-actions[bot],renovate[bot]'
    theme: 'github'
```

### Only Features and Fixes

Generate a changelog with only specific commit types:

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    include-types: 'feat,fix'
    theme: 'minimal'
```

### JSON Output

Generate a JSON changelog for programmatic use:

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    format: 'json'
    output: 'changelog.json'
```

### Use Generated Content

Use the changelog content in subsequent steps:

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  id: changelog
  with:
    theme: 'github'

- name: Create Release
  uses: actions/create-release@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: ${{ github.ref }}
    release_name: Release ${{ github.ref }}
    body: ${{ steps.changelog.outputs.changelog }}
```

### Multiple Languages

Generate changelogs in different languages:

```yaml
- name: Generate English Changelog
  uses: stacksjs/logsmith-action@v0.2.0
  with:
    language: 'en'
    output: 'CHANGELOG.md'

- name: Generate Spanish Changelog
  uses: stacksjs/logsmith-action@v0.2.0
  with:
    language: 'es'
    output: 'CHANGELOG.es.md'
```

## Complete Workflows

### Release Workflow

A complete workflow for generating changelogs and creating releases:

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate Changelog
        uses: stacksjs/logsmith-action@v0.2.0
        id: changelog
        with:
          theme: 'github'
          exclude-authors: 'dependabot[bot]'
          verbose: true

      - name: Commit Changelog
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add CHANGELOG.md
          git commit -m "docs: update changelog for ${{ github.ref_name }}" || exit 0
          git push

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref_name }}
          release_name: Release ${{ github.ref_name }}
          body: ${{ steps.changelog.outputs.changelog }}
```

### PR Preview

Generate changelog previews on pull requests:

```yaml
name: PR Changelog Preview
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  preview:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate Preview
        uses: stacksjs/logsmith-action@v0.2.0
        id: changelog
        with:
          from: ${{ github.event.pull_request.base.sha }}
          to: ${{ github.event.pull_request.head.sha }}
          theme: 'github'

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            const body = `## 📋 Changelog Preview

            ${context.payload.pull_request.body}

            ### Changes
            ${{ steps.changelog.outputs.changelog }}

            <sub>Generated by Logsmith</sub>`;

            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: body
            });
```

### Scheduled Changelog Updates

Update changelog weekly:

```yaml
name: Weekly Changelog Update
on:
  schedule:
    - cron: '0 0 * * 1' # Every Monday
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate Changelog
        uses: stacksjs/logsmith-action@v0.2.0
        with:
          theme: 'github'
          exclude-authors: 'dependabot[bot],renovate[bot]'

      - name: Commit and Push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add CHANGELOG.md
          git diff --staged --quiet || git commit -m "docs: update changelog [skip ci]"
          git push
```

### Multi-Format Generation

Generate changelog in multiple formats:

```yaml
name: Generate Changelogs
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
          fetch-depth: 0

      - name: Generate Markdown
        uses: stacksjs/logsmith-action@v0.2.0
        with:
          format: 'markdown'
          output: 'CHANGELOG.md'
          theme: 'github'

      - name: Generate JSON
        uses: stacksjs/logsmith-action@v0.2.0
        with:
          format: 'json'
          output: 'changelog.json'

      - name: Generate HTML
        uses: stacksjs/logsmith-action@v0.2.0
        with:
          format: 'html'
          output: 'changelog.html'
          theme: 'colorful'

      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: changelogs
          path: |
            CHANGELOG.md
            changelog.json
            changelog.html
```

## Best Practices

### 1. Always Fetch Full History

Ensure you fetch the complete Git history to generate accurate changelogs:

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # This is crucial!
```

### 2. Use Appropriate Permissions

Grant only the necessary permissions to your workflow:

```yaml
jobs:
  changelog:
    permissions:
      contents: write  # For committing changes
      pull-requests: write  # For PR comments (if needed)
```

### 3. Filter Bot Commits

Exclude automated commits for cleaner changelogs:

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    exclude-authors: 'dependabot[bot],renovate[bot],github-actions[bot]'
```

### 4. Use Output in Releases

Leverage the changelog output for release notes:

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  id: changelog

- uses: actions/create-release@v1
  with:
    body: ${{ steps.changelog.outputs.changelog }}
```

### 5. Enable Verbose Mode for Debugging

When troubleshooting, enable verbose logging:

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    verbose: true
```

## Troubleshooting

### No Commits Found

**Problem:** Action reports "No commits found"

**Solution:**
- Ensure `fetch-depth: 0` is set in checkout step
- Verify the repository has conventional commits
- Check the `from` and `to` references are valid

### Permission Denied

**Problem:** Cannot commit changelog changes

**Solution:**
- Add `contents: write` permission to the job
- Verify the GitHub token has proper access
- Check branch protection rules

### Missing Tags

**Problem:** Cannot determine version from tags

**Solution:**
- Ensure tags are fetched with `fetch-depth: 0`
- Specify `from` and `to` parameters explicitly
- Use annotated tags: `git tag -a v1.0.0 -m "Release v1.0.0"`

## Migration from CLI

If you're currently using Logsmith CLI in GitHub Actions, migrating to the action is straightforward:

**Before:**
```yaml
- run: |
    bun add -g logsmith
    logsmith --theme github --output CHANGELOG.md
```

**After:**
```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    theme: 'github'
    output: 'CHANGELOG.md'
```

## Next Steps

- [Learn about automation best practices](/advanced/automation)
- [Explore theming options](/features/theming)
- [Check the API reference](/api/reference)
- [View the source code](https://github.com/stacksjs/logsmith/tree/main/packages/action)
