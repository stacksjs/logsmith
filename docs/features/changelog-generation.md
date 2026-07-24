# Changelog Generation

Logsmith's core feature is automatic changelog generation from your Git commit history. It transforms conventional commits into beautifully formatted, organized changelogs.

## How It Works

Logsmith analyzes your Git repository's commit history, parses conventional commit messages, and generates structured changelogs organized by commit type, scope, and version.

```
Git Commits → Parse → Categorize → Format → Output
```

## Basic Generation

### Command Line

Generate a changelog with a single command:

```bash
# Display changelog in console
logsmith

# Save to file
logsmith --output CHANGELOG.md

# Generate with specific theme
logsmith --theme github --output CHANGELOG.md
```

### Programmatic Usage

```typescript
import { generateChangelog } from 'logsmith'

const result = await generateChangelog({
  output: 'CHANGELOG.md',
  format: 'markdown',
  theme: 'github',
})

console.log(`Changelog written to: ${result.outputPath}`)
```

## Commit Range Selection

Control which commits are included in your changelog:

```bash
# All commits from a specific tag to HEAD
logsmith --from v1.0.0 --to HEAD

# Commits between two tags
logsmith --from v1.0.0 --to v2.0.0

# Last month's commits
logsmith --from "1 month ago"

# Specific date range
logsmith --from "2024-01-01" --to "2024-02-01"
```

### Automatic Version Detection

Logsmith automatically detects the latest version tag:

```typescript
import { generateChangelog } from 'logsmith'

// Logsmith finds the most recent tag automatically
await generateChangelog({
  from: undefined, // Auto-detected from tags
  to: 'HEAD',
  output: 'CHANGELOG.md',
})
```

## Changelog Structure

Generated changelogs follow a consistent structure:

```markdown
# Changelog

## v2.1.0 (2024-01-20)

### Features
- Add user authentication system ([abc123](repo/commit/abc123))
- Implement dark mode toggle ([def456](repo/commit/def456))

### Bug Fixes
- Fix login token expiration ([ghi789](repo/commit/ghi789))
- Resolve memory leak in parser ([jkl012](repo/commit/jkl012))

### Documentation
- Update API documentation ([mno345](repo/commit/mno345))

### Breaking Changes
- Remove deprecated v1 API endpoints ([pqr678](repo/commit/pqr678))
```

## Section Organization

Commits are organized into sections based on their type:

| Type | Section Header |
|------|----------------|
| `feat` | Features |
| `fix` | Bug Fixes |
| `docs` | Documentation |
| `style` | Styles |
| `refactor` | Code Refactoring |
| `perf` | Performance Improvements |
| `test` | Tests |
| `build` | Build System |
| `ci` | Continuous Integration |
| `chore` | Maintenance |
| `revert` | Reverts |

### Breaking Changes Section

Breaking changes are automatically grouped:

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  groupBreakingChanges: true, // Default: true
  output: 'CHANGELOG.md',
})
```

Breaking changes are identified by:
- `!` after the type (e.g., `feat!: remove old API`)
- `BREAKING CHANGE:` in the commit body
- `BREAKING-CHANGE:` in the commit footer

## Filtering Commits

### By Commit Type

```bash
# Include only features and fixes
logsmith --include-types "feat,fix"

# Exclude maintenance commits
logsmith --exclude-types "chore,ci"
```

### By Author

```bash
# Exclude bot commits
logsmith --exclude-authors "dependabot[bot],renovate[bot]"

# Include only specific authors
logsmith --include-authors "john.doe,jane.smith"
```

### By Scope

```bash
# Include only core changes
logsmith --include-scopes "core,api"

# Exclude test-related changes
logsmith --exclude-scopes "test,internal"
```

### By Message Pattern

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  excludeMessages: [
    'Merge pull request',
    'Merge branch',
    /^chore\(deps\):/, // Regex patterns
  ],
})
```

## Content Control

### Commit Details

```bash
# Include commit bodies
logsmith --include-body

# Hide author emails
logsmith --hide-author-email

# Limit description length
logsmith --max-length 100
```

### Section Limits

```bash
# Minimum commits to show a section
logsmith --min-commits 3

# Maximum commits per section
logsmith --max-commits 10
```

### Link Generation

```bash
# Disable automatic issue linking
logsmith --no-linkify

# Changelog links to issues/PRs automatically
# #123 → [#123](repo/issues/123)
# PR #456 → [#456](repo/pull/456)
```

## Clean vs Append Mode

### Clean Mode

Overwrites the entire changelog:

```bash
logsmith --clean --output CHANGELOG.md
```

### Append Mode

Adds new entries while preserving existing content:

```bash
# Default behavior - preserves existing content
logsmith --output CHANGELOG.md
```

## Multiple Directories

Generate changelogs for different repositories:

```bash
# Different repository
logsmith --dir /path/to/other/repo --output CHANGELOG.md

# Monorepo package
logsmith --dir packages/core --output packages/core/CHANGELOG.md
```

## Output Customization

### Custom Templates

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  templates: {
    commitFormat: '- {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}})) by @{{author}}',
    groupFormat: '## {{title}} ({{count}} changes)',
    breakingChangeFormat: '- **BREAKING**: {{description}}',
  },
})
```

### Custom Type Labels

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  templates: {
    typeFormat: {
      feat: 'New Features',
      fix: 'Bug Fixes',
      docs: 'Documentation Updates',
      perf: 'Performance Improvements',
    },
  },
})
```

## Examples

### Release Changelog

```typescript
import { generateChangelog } from 'logsmith'

// Generate changelog for a specific release
await generateChangelog({
  from: 'v1.0.0',
  to: 'v1.1.0',
  theme: 'github',
  output: 'RELEASE_NOTES.md',
  excludeAuthors: ['dependabot[bot]'],
  groupBreakingChanges: true,
})
```

### Weekly Report

```typescript
import { generateChangelog } from 'logsmith'

// Generate weekly development summary
await generateChangelog({
  from: '1 week ago',
  to: 'HEAD',
  theme: 'minimal',
  output: 'WEEKLY_REPORT.md',
  includeCommitCount: true,
})
```

### Package Changelog

```typescript
import { generateChangelog } from 'logsmith'

// Generate changelog for a specific package
await generateChangelog({
  dir: 'packages/core',
  includeScopes: ['core'],
  output: 'packages/core/CHANGELOG.md',
  theme: 'minimal',
})
```

## Best Practices

1. **Use Conventional Commits**: Ensure all commits follow the conventional commit format
2. **Tag Releases**: Use semantic versioning tags for automatic version detection
3. **Filter Bot Commits**: Exclude automated commits from changelogs
4. **Group Breaking Changes**: Highlight breaking changes prominently
5. **Keep Descriptions Concise**: Limit description length for readability
6. **Link Issues and PRs**: Enable automatic linking for traceability

## Next Steps

- Learn about [Commit Parsing](/features/commit-parsing) for understanding how commits are analyzed
- Explore [Multiple Formats](/features/multiple-formats) for different output options
- Review [Custom Templates](/advanced/custom-templates) for advanced customization
