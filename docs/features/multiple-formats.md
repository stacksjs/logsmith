# Multiple Formats

Logsmith supports generating changelogs in multiple output formats, each optimized for different use cases and audiences.

## Supported Formats

| Format | Extension | Best For |
|--------|-----------|----------|
| Markdown | `.md` | GitHub, GitLab, documentation sites |
| JSON | `.json` | APIs, programmatic consumption |
| HTML | `.html` | Standalone documents, websites |

## Markdown Format

The default and most common format for changelogs.

### Basic Usage

```bash
# Auto-detect from extension
logsmith --output CHANGELOG.md

# Explicit format
logsmith --format markdown --output CHANGELOG.md
```

### Output Example

```markdown
# Changelog

## v2.0.0 (2024-01-20)

### Features

- Add user authentication system ([abc123](https://github.com/user/repo/commit/abc123))
- Implement dark mode toggle ([def456](https://github.com/user/repo/commit/def456))

### Bug Fixes

- Fix login token expiration ([ghi789](https://github.com/user/repo/commit/ghi789))

### Breaking Changes

- Remove deprecated v1 API endpoints ([jkl012](https://github.com/user/repo/commit/jkl012))
```

### Markdown Configuration

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  format: 'markdown',
  output: 'CHANGELOG.md',
  templates: {
    groupFormat: '### {{title}}',
    commitFormat: '- {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
  },
})
```

## JSON Format

Machine-readable format for programmatic use.

### Basic Usage

```bash
# Auto-detect from extension
logsmith --output changelog.json

# Explicit format
logsmith --format json --output changelog.json
```

### Output Example

```json
{
  "version": "v2.0.0",
  "date": "2024-01-20",
  "sections": [
    {
      "title": "Features",
      "commits": [
        {
          "type": "feat",
          "scope": "auth",
          "description": "Add user authentication system",
          "hash": "abc123",
          "author": "john.doe",
          "breaking": false,
          "references": [
            { "type": "issue", "id": "123" }
          ]
        }
      ]
    },
    {
      "title": "Bug Fixes",
      "commits": [
        {
          "type": "fix",
          "description": "Fix login token expiration",
          "hash": "ghi789",
          "author": "jane.smith",
          "breaking": false
        }
      ]
    }
  ],
  "contributors": ["john.doe", "jane.smith"],
  "compareUrl": "https://github.com/user/repo/compare/v1.0.0...v2.0.0"
}
```

### JSON Configuration

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  format: 'json',
  output: 'changelog.json',
  includeCommitBody: true, // Include full commit bodies
})
```

### Processing JSON Output

```typescript
import { readFileSync } from 'fs'

const changelog = JSON.parse(readFileSync('changelog.json', 'utf-8'))

// Extract features
const features = changelog.sections
  .find(s => s.title === 'Features')
  ?.commits || []

console.log(`New features: ${features.length}`)

// Find breaking changes
const breaking = changelog.sections
  .flatMap(s => s.commits)
  .filter(c => c.breaking)

console.log(`Breaking changes: ${breaking.length}`)
```

## HTML Format

Standalone HTML documents with styling.

### Basic Usage

```bash
# Auto-detect from extension
logsmith --output changelog.html

# Explicit format with theme
logsmith --format html --theme colorful --output changelog.html
```

### Output Example

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Changelog</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { color: #333; }
    h2 { color: #555; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
    .commit { margin: 0.5rem 0; }
    .breaking { background: #fff3cd; padding: 0.5rem; border-left: 3px solid #ffc107; }
  </style>
</head>
<body>
  <h1>Changelog</h1>

  <h2>v2.0.0 (2024-01-20)</h2>

  <h3>Features</h3>
  <ul>
    <li class="commit">Add user authentication system
      <a href="https://github.com/user/repo/commit/abc123">abc123</a>
    </li>
  </ul>

  <h3>Breaking Changes</h3>
  <ul>
    <li class="commit breaking">Remove deprecated v1 API endpoints
      <a href="https://github.com/user/repo/commit/jkl012">jkl012</a>
    </li>
  </ul>
</body>
</html>
```

### HTML Configuration

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  format: 'html',
  output: 'changelog.html',
  theme: 'colorful',
})
```

### Custom HTML Styling

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  format: 'html',
  output: 'changelog.html',
  // Custom CSS via theme configuration
  templates: {
    commitFormat: `
      <li class="commit {{type}}">
        <span class="emoji">{{emoji}}</span>
        <span class="description">{{description}}</span>
        <a href="{{repoUrl}}/commit/{{hash}}" class="hash">{{hash}}</a>
      </li>
    `,
  },
})
```

## Multi-Format Generation

Generate multiple formats simultaneously:

### Shell Script

```bash
#!/bin/bash
# generate-all-formats.sh

echo "Generating changelogs in all formats..."

# Markdown for GitHub
logsmith --format markdown --theme github --output CHANGELOG.md

# JSON for API
logsmith --format json --output docs/changelog.json

# HTML for website
logsmith --format html --theme colorful --output docs/changelog.html

echo "All formats generated successfully!"
```

### Programmatic

```typescript
import { generateChangelog } from 'logsmith'

const formats = [
  { format: 'markdown', output: 'CHANGELOG.md', theme: 'github' },
  { format: 'json', output: 'changelog.json' },
  { format: 'html', output: 'docs/changelog.html', theme: 'colorful' },
]

for (const config of formats) {
  await generateChangelog(config)
  console.log(`Generated ${config.output}`)
}
```

## Format-Specific Features

### Markdown Features

- Automatic heading levels
- Link formatting
- Code block support
- GitHub-flavored markdown

### JSON Features

- Full commit metadata
- Reference linking
- Contributor list
- Compare URLs

### HTML Features

- Embedded CSS
- Theme-based styling
- Print-friendly layout
- Self-contained document

## Console Output

View changelog without saving to file:

```bash
# Output to console only
logsmith --no-output

# Pipe to other commands
logsmith --no-output | head -50

# Save and display
logsmith --output CHANGELOG.md && cat CHANGELOG.md
```

## Format Selection Strategy

### For GitHub/GitLab

```typescript
await generateChangelog({
  format: 'markdown',
  theme: 'github',
  linkifyIssues: true,
  linkifyPRs: true,
})
```

### For Documentation Sites

```typescript
await generateChangelog({
  format: 'html',
  theme: 'minimal',
  includeCommitCount: false,
})
```

### For APIs/Automation

```typescript
await generateChangelog({
  format: 'json',
  includeCommitBody: true,
  includeCommitCount: true,
})
```

### For Release Notes

```typescript
await generateChangelog({
  format: 'markdown',
  theme: 'github',
  groupBreakingChanges: true,
  from: 'v1.0.0',
  to: 'v2.0.0',
})
```

## CI/CD Integration

```yaml
# GitHub Actions example
- name: Generate Multiple Formats
  run: |
    logsmith --format markdown --output CHANGELOG.md
    logsmith --format json --output changelog.json
    logsmith --format html --output docs/changelog.html

- name: Upload Artifacts
  uses: actions/upload-artifact@v3
  with:
    name: changelogs
    path: |
      CHANGELOG.md
      changelog.json
      docs/changelog.html
```

## Best Practices

1. **Primary Format**: Use Markdown for the main `CHANGELOG.md`
2. **API Consumption**: Generate JSON for programmatic access
3. **Documentation**: Use HTML for standalone documentation
4. **Consistency**: Keep all formats synchronized
5. **Automation**: Generate all formats in CI/CD

## Next Steps

- Explore [Theming](/features/theming) for customizing appearance
- Learn about [Repository Insights](/features/repository-insights) for analytics
- Review [CI/CD Integration](/advanced/ci-cd-integration) for automation
