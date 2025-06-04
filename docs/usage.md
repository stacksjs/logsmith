# Basic Usage

This guide covers the essential features and commands of logsmith to help you start generating beautiful changelogs from your conventional commits.

## Prerequisites

Before using logsmith, ensure your repository follows [conventional commit conventions](https://www.conventionalcommits.org/). Logsmith works best with commits formatted like:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Examples:**
```bash
feat: add user authentication system
fix(auth): resolve login token expiration issue
docs: update API documentation
feat!: breaking change to user model
```

## Basic Commands

### Generate Changelog

The simplest way to generate a changelog:

```bash
# Display changelog in console
logsmith

# Save to CHANGELOG.md
logsmith --output CHANGELOG.md

# Generate from specific range
logsmith --from v1.0.0 --to HEAD --output CHANGELOG.md
```

### Output Formats

Logsmith supports multiple output formats:

::: code-group

```bash [Markdown]
# Generate Markdown (default)
logsmith --output CHANGELOG.md

# Explicit format specification
logsmith --format markdown --output CHANGELOG.md
```

```bash [JSON]
# Auto-detect from extension
logsmith --output changelog.json

# Explicit format specification
logsmith --format json --output changelog.json
```

```bash [HTML]
# Auto-detect from extension
logsmith --output changelog.html

# Explicit format specification
logsmith --format html --output changelog.html
```

:::

### Themes

Choose from 8 built-in themes:

```bash
# List available themes
logsmith themes

# Use GitHub theme
logsmith --theme github --output CHANGELOG.md

# Use minimal theme
logsmith --theme minimal --output CHANGELOG.md

# Use corporate theme (no emojis)
logsmith --theme corporate --output CHANGELOG.md
```

## Advanced Usage

### Filtering Options

Control which commits appear in your changelog:

```bash
# Exclude specific commit types
logsmith --exclude-types "chore,ci" --output CHANGELOG.md

# Include only specific types
logsmith --include-types "feat,fix" --output CHANGELOG.md

# Exclude specific authors
logsmith --exclude-authors "dependabot[bot],renovate[bot]" --output CHANGELOG.md

# Include only specific authors
logsmith --include-authors "john.doe,jane.smith" --output CHANGELOG.md

# Exclude specific scopes
logsmith --exclude-scopes "test,docs" --output CHANGELOG.md
```

### Content Control

Customize the content and appearance:

```bash
# Hide author emails
logsmith --hide-author-email --output CHANGELOG.md

# Include commit bodies
logsmith --include-body --output CHANGELOG.md

# Limit description length
logsmith --max-length 100 --output CHANGELOG.md

# Set minimum commits per section
logsmith --min-commits 3 --output CHANGELOG.md

# Limit commits per section
logsmith --max-commits 10 --output CHANGELOG.md

# Hide dates
logsmith --no-dates --output CHANGELOG.md

# Don't group breaking changes
logsmith --no-breaking-group --output CHANGELOG.md

# Disable issue/PR linking
logsmith --no-linkify --output CHANGELOG.md
```

### Language Support

Generate changelogs in different languages:

```bash
# Spanish
logsmith --language es --output CHANGELOG.md

# French
logsmith --language fr --output CHANGELOG.md

# German
logsmith --language de --output CHANGELOG.md

# Japanese
logsmith --language ja --output CHANGELOG.md
```

**Supported languages:** `en`, `es`, `fr`, `de`, `zh`, `ja`, `ko`, `ru`, `pt`, `it`

## Repository Statistics

Get comprehensive insights about your repository:

```bash
# Basic statistics
logsmith stats

# Statistics for specific range
logsmith stats --from v1.0.0 --to HEAD

# JSON output for programmatic use
logsmith stats --json

# Verbose statistics with detailed analysis
logsmith stats --verbose
```

**Statistics include:**
- Total commits and contributors
- Commit frequency (daily/weekly/monthly)
- Breaking changes count
- Commit type distribution
- Contributor growth patterns
- Peak activity periods

## Working with Different Repositories

### Specify Repository Path

```bash
# Generate changelog for different directory
logsmith --dir /path/to/repo --output CHANGELOG.md

# Statistics for different repository
logsmith stats --dir /path/to/other/repo
```

### Monorepo Usage

For monorepos, you can generate changelogs for specific packages:

```bash
# Generate changelog for specific package directory
logsmith --dir packages/core --output packages/core/CHANGELOG.md

# Include only commits affecting specific scopes
logsmith --include-scopes "core,api" --output CHANGELOG.md
```

## Integration Examples

### CI/CD Pipeline

Generate and commit changelog in GitHub Actions:

```yaml
name: Generate Changelog
on:
  push:
    tags: ['v*']

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: oven-sh/setup-bun@v1

      - name: Generate Changelog
        run: |
          bun add -g logsmith
          logsmith --output CHANGELOG.md

      - name: Commit Changelog
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add CHANGELOG.md
          git commit -m "docs: update changelog" || exit 0
          git push
```

### Pre-release Hook

Generate changelog before creating releases:

```bash
#!/bin/bash
# pre-release.sh

echo "Generating changelog..."
logsmith --theme github --output CHANGELOG.md

echo "Changelog generated successfully!"
```

### Multiple Format Generation

Generate multiple formats simultaneously:

```bash
#!/bin/bash
# generate-all-formats.sh

echo "Generating changelogs in all formats..."

# Markdown for GitHub
logsmith --theme github --output CHANGELOG.md

# JSON for API consumption
logsmith --format json --output changelog.json

# HTML for documentation site
logsmith --format html --theme colorful --output docs/changelog.html

echo "All formats generated successfully!"
```

## Troubleshooting

### Common Issues

**No commits found:**
```bash
# Check if you have conventional commits
git log --oneline | grep -E "(feat|fix|docs):"

# Generate with verbose logging to debug
logsmith --verbose --no-output
```

**Empty sections:**
```bash
# Lower minimum commits requirement
logsmith --min-commits 1 --output CHANGELOG.md

# Check commit types in your repository
logsmith stats --json | grep -A 20 "commitTypes"
```

**Missing recent commits:**
```bash
# Ensure you're including HEAD
logsmith --to HEAD --output CHANGELOG.md

# Check the date range
logsmith --from "1 month ago" --to HEAD --output CHANGELOG.md
```

### Best Practices

1. **Use conventional commits** consistently across your project
2. **Set up pre-commit hooks** to enforce commit message format
3. **Generate changelogs regularly** as part of your release process
4. **Choose appropriate themes** for your audience (corporate vs. open source)
5. **Filter out noise** by excluding bot commits and non-essential types
6. **Include breaking changes** prominently for major version releases

## Next Steps

- [Configure logsmith](/config) with a configuration file
- [Explore theming options](/features/theming) for custom styling
- [Set up repository analytics](/features/repository-insights) for detailed insights
- [Learn about automation](/advanced/automation) for CI/CD integration
