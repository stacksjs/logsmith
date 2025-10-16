# Logsmith GitHub Action

Generate beautiful changelogs automatically from conventional commits.

## Usage

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
          fetch-depth: 0 # Required to get full git history

      - uses: stacksjs/logsmith-action@v0.2.0
        with:
          output: 'CHANGELOG.md'
          theme: 'github'

      - name: Commit changelog
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add CHANGELOG.md
          git commit -m "docs: update changelog" || exit 0
          git push
```

## Inputs

### Core Options

| Input | Description | Default |
|-------|-------------|---------|
| `from` | Start commit reference | Latest git tag |
| `to` | End commit reference | `HEAD` |
| `output` | Changelog file name | `CHANGELOG.md` |
| `format` | Output format: `markdown`, `json`, `html` | `markdown` |
| `language` | Language: `en`, `es`, `fr`, `de`, `zh`, `ja`, `ko`, `ru`, `pt`, `it` | `en` |
| `theme` | Theme: `default`, `minimal`, `github`, `gitmoji`, `unicode`, `simple`, `colorful`, `corporate` | `github` |

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
| `verbose` | Enable verbose logging | `false` |

### GitHub Integration

| Input | Description | Default |
|-------|-------------|---------|
| `github-token` | GitHub token for API access | `${{ github.token }}` |

## Outputs

| Output | Description |
|--------|-------------|
| `changelog` | Generated changelog content |
| `file` | Path to the generated changelog file |
| `format` | Format of the generated changelog |

## Examples

### Basic Usage

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
```

### Custom Range

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    from: 'v1.0.0'
    to: 'HEAD'
```

### Exclude Bot Commits

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    exclude-authors: 'dependabot[bot],github-actions[bot]'
```

### Only Features and Fixes

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    include-types: 'feat,fix'
```

### JSON Output

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    format: 'json'
    output: 'changelog.json'
```

### Minimal Theme

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    theme: 'minimal'
```

### Spanish Changelog

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  with:
    language: 'es'
```

### Use Generated Content

```yaml
- uses: stacksjs/logsmith-action@v0.2.0
  id: changelog

- name: Create Release
  uses: actions/create-release@v1
  with:
    tag_name: ${{ github.ref }}
    release_name: Release ${{ github.ref }}
    body: ${{ steps.changelog.outputs.changelog }}
```

## Advanced Workflow

```yaml
name: Release with Changelog
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
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate Changelog
        uses: stacksjs/logsmith-action@v0.2.0
        id: changelog
        with:
          theme: 'github'
          exclude-authors: 'dependabot[bot]'
          include-types: 'feat,fix,perf'
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
          draft: false
          prerelease: false
```

## License

MIT

## Contributing

See the main [Logsmith repository](https://github.com/stacksjs/logsmith) for contribution guidelines.
