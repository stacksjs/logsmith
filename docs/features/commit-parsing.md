# Commit Parsing

Logsmith uses intelligent commit parsing to extract structured information from your Git commit messages. Understanding how parsing works helps you write better commits and customize changelog generation.

## Conventional Commits

Logsmith follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Examples

```bash
# Simple commit
feat: add user authentication

# With scope
fix(auth): resolve token expiration bug

# With body
docs: update API documentation

This commit updates the API documentation to reflect
recent changes to the authentication endpoints.

# Breaking change
feat!: remove deprecated endpoints

BREAKING CHANGE: The v1 API endpoints have been removed.
Please migrate to v2 endpoints.
```

## Parsed Information

Logsmith extracts the following from each commit:

### CommitInfo Structure

```typescript
interface CommitInfo {
  // Git metadata
  hash: string           // Short commit hash
  message: string        // Full commit message
  date: string           // ISO date string
  author: {
    name: string
    email: string
  }

  // Parsed conventional commit
  type?: string          // feat, fix, docs, etc.
  scope?: string         // Optional scope in parentheses
  description: string    // Commit description
  body?: string          // Optional commit body
  breaking?: boolean     // Breaking change indicator
  references?: GitReference[]  // Issue/PR references
}
```

## Commit Types

Logsmith recognizes standard conventional commit types:

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New features | `feat: add dark mode` |
| `fix` | Bug fixes | `fix: resolve login issue` |
| `docs` | Documentation | `docs: update README` |
| `style` | Code style changes | `style: format with prettier` |
| `refactor` | Code refactoring | `refactor: simplify auth logic` |
| `perf` | Performance improvements | `perf: optimize image loading` |
| `test` | Test additions/changes | `test: add unit tests` |
| `build` | Build system changes | `build: update dependencies` |
| `ci` | CI configuration | `ci: add GitHub Actions` |
| `chore` | Maintenance tasks | `chore: update gitignore` |
| `revert` | Revert commits | `revert: undo feature X` |

### Custom Type Mapping

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  templates: {
    typeFormat: {
      feat: 'New Features',
      fix: 'Bug Fixes',
      docs: 'Documentation',
      // Add custom types
      security: 'Security Updates',
      deps: 'Dependency Updates',
    },
  },
})
```

## Scope Parsing

Scopes provide additional context about what part of the codebase changed:

```bash
# With scope
feat(auth): add OAuth2 support
fix(ui/button): resolve hover state
docs(api/users): update endpoint docs
```

### Scope Filtering

```bash
# Include only specific scopes
logsmith --include-scopes "core,api"

# Exclude certain scopes
logsmith --exclude-scopes "test,internal,deps"
```

## Breaking Change Detection

Logsmith detects breaking changes through multiple methods:

### Method 1: Exclamation Mark

```bash
feat!: remove deprecated API
fix(auth)!: change token format
```

### Method 2: Footer

```bash
feat: update user model

BREAKING CHANGE: The user model now requires an email field.
```

### Method 3: Multiple Footers

```bash
feat: redesign authentication system

BREAKING CHANGE: JWT tokens now use RS256 algorithm.
BREAKING-CHANGE: Session cookies have been removed.
```

### Breaking Change Configuration

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  groupBreakingChanges: true, // Group in separate section
  templates: {
    breakingChangeFormat: '- **BREAKING**: {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
  },
})
```

## Reference Parsing

Logsmith automatically detects issue and PR references:

### Supported Formats

```bash
# Issue references
fix: resolve bug #123
fix: resolve bug (closes #123)
fix: resolve bug, fixes #123

# PR references
feat: add feature (PR #456)
feat: add feature (#456)

# Multiple references
fix: resolve issues #123, #124, fixes #125
```

### Reference Structure

```typescript
interface GitReference {
  type: 'issue' | 'pr'
  id: string
  url?: string  // Generated from repo URL
}
```

### Configuring Link Generation

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  linkifyIssues: true,  // Auto-link #123 to issues
  linkifyPRs: true,     // Auto-link PR references
  repo: 'https://github.com/user/repo',
})
```

## Body Parsing

Commit bodies provide additional context:

```bash
feat(auth): implement OAuth2 authentication

This commit adds OAuth2 support with the following providers:
- Google
- GitHub
- Microsoft

The implementation follows OAuth2.0 RFC 6749.

Closes #123
Related to #456
```

### Including Bodies

```bash
# Include commit bodies in changelog
logsmith --include-body
```

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  includeCommitBody: true,
})
```

## Non-Conventional Commits

Commits not following conventional format are handled gracefully:

```bash
# Non-conventional commit
Update README file

# Logsmith treats as:
# type: undefined
# description: "Update README file"
```

### Filtering Non-Conventional

```bash
# Only include conventional commits
logsmith --include-types "feat,fix,docs,style,refactor,perf,test,build,ci,chore,revert"
```

## Parsing Edge Cases

### Multi-line Descriptions

```bash
# First line is the description
feat: add authentication system with
      multi-factor support

# Only "add authentication system with" is parsed as description
```

### Special Characters

```bash
# Escaped characters work
feat: add "quotes" and 'apostrophes'

# Colons in description
fix: resolve issue: login fails
```

### Scopes with Special Characters

```bash
# Slashes for nested scopes
feat(ui/components/button): add loading state

# Hyphens
fix(user-service): resolve timeout
```

## Commit Validation

Logsmith provides warnings for malformed commits:

```bash
# Run with verbose to see parsing issues
logsmith --verbose
```

Output:
```
Parsing commit abc123...
Warning: Commit abc123 does not follow conventional commit format
Parsing commit def456...
Parsed: feat(auth): add OAuth2 support
```

## Programmatic Parsing

Access parsed commit information directly:

```typescript
import { analyzeCommits, loadLogsmithConfig } from 'logsmith'

const config = await loadLogsmithConfig()
const commits = await analyzeCommits(config)

for (const commit of commits) {
  console.log(`Type: ${commit.type}`)
  console.log(`Scope: ${commit.scope || 'none'}`)
  console.log(`Description: ${commit.description}`)
  console.log(`Breaking: ${commit.breaking}`)
  console.log(`References: ${commit.references?.map(r => r.id).join(', ')}`)
  console.log('---')
}
```

## Best Practices

### Writing Good Commits

1. **Use Imperative Mood**: "Add feature" not "Added feature"
2. **Keep Subject Short**: Under 72 characters
3. **Use Scopes Consistently**: Establish team conventions
4. **Mark Breaking Changes**: Always use `!` or `BREAKING CHANGE:`
5. **Reference Issues**: Link to related issues/PRs

### Commit Message Examples

```bash
# Good
feat(auth): add two-factor authentication support

# Good with body
fix(api): resolve rate limiting bug

The rate limiter was not properly resetting after the window expired.
This fix ensures the counter resets correctly.

Fixes #234

# Good breaking change
feat(api)!: change response format to JSON:API spec

BREAKING CHANGE: All API responses now follow JSON:API specification.
Clients must update their parsers accordingly.
```

## Next Steps

- Learn about [Version Detection](/features/version-detection) for automatic versioning
- Explore [Multiple Formats](/features/multiple-formats) for output options
- Review [Theming](/features/theming) for customizing appearance
