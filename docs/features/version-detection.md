# Version Detection

Logsmith automatically detects version information from your Git repository, making it easy to generate changelogs without manually specifying version ranges.

## How Version Detection Works

Logsmith uses Git tags to identify versions:

1. Scans repository for tags matching version patterns
2. Sorts tags by semantic versioning rules
3. Identifies the latest and previous versions
4. Uses this information to determine commit ranges

## Automatic Detection

### Basic Usage

```bash
# Logsmith automatically finds the latest version
logsmith --output CHANGELOG.md
```

When you run logsmith without specifying `--from`, it automatically:
1. Finds the most recent version tag
2. Uses it as the starting point
3. Generates changelog from that point to `HEAD`

### Version Tag Patterns

Logsmith recognizes common version tag patterns:

```bash
# Standard semver tags
v1.0.0
v1.2.3-beta.1
v2.0.0-rc.1

# Without 'v' prefix
1.0.0
1.2.3

# With custom prefixes (configurable)
release-1.0.0
version-1.0.0
```

### Configuring Version Prefix

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  versionPrefix: 'v', // Default
  // Matches: v1.0.0, v2.1.3, etc.
})
```

```bash
# Custom prefix via CLI
logsmith --version-prefix "release-"
```

## Version Ranges

### Auto-Detected Range

```bash
# Automatically detect range from tags
logsmith --output CHANGELOG.md

# Output shows detected range
# Generating changelog from v1.2.0 to HEAD...
```

### Explicit Range

```bash
# Specify exact version range
logsmith --from v1.0.0 --to v2.0.0

# From tag to HEAD
logsmith --from v1.0.0 --to HEAD

# From specific commit
logsmith --from abc123 --to HEAD
```

### Relative Ranges

```bash
# Time-based ranges
logsmith --from "1 week ago"
logsmith --from "1 month ago"
logsmith --from "2024-01-01"

# Relative to tags
logsmith --from "v1.0.0~10"  # 10 commits before v1.0.0
```

## Semantic Versioning

Logsmith understands semantic versioning (SemVer):

### Version Format

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

### Examples

```bash
1.0.0        # Standard release
1.0.1        # Patch release
1.1.0        # Minor release
2.0.0        # Major release
1.0.0-alpha  # Pre-release
1.0.0-beta.1 # Pre-release with number
1.0.0+build  # Build metadata
```

### Version Sorting

Logsmith correctly sorts versions:

```bash
# Sorted order (newest first)
v2.0.0
v1.10.0   # Correctly after v1.9.0
v1.9.0
v1.2.0
v1.1.0
v1.0.0
v1.0.0-rc.2
v1.0.0-rc.1
v1.0.0-beta
v1.0.0-alpha
```

## Multi-Version Changelog

Generate a changelog covering multiple versions:

```typescript
import { generateChangelog } from 'logsmith'

// Full project history
await generateChangelog({
  from: undefined, // Start from beginning
  to: 'HEAD',
  output: 'CHANGELOG.md',
})
```

### Version Sections

The generated changelog includes version headers:

```markdown
# Changelog

## v2.1.0 (2024-01-20)

### Features
- Add new dashboard ([abc123])

## v2.0.0 (2024-01-15)

### Breaking Changes
- Update API response format ([def456])

### Features
- Complete redesign of auth system ([ghi789])

## v1.5.0 (2024-01-10)

### Bug Fixes
- Fix memory leak ([jkl012])
```

## Release Notes Generation

Generate notes for a specific release:

```typescript
import { generateChangelog } from 'logsmith'

// Get previous tag
const previousTag = 'v1.0.0'
const currentTag = 'v1.1.0'

await generateChangelog({
  from: previousTag,
  to: currentTag,
  output: 'RELEASE_NOTES.md',
  theme: 'github',
})
```

### CI/CD Integration

```bash
#!/bin/bash
# Get current and previous tags
CURRENT_TAG=$(git describe --tags --abbrev=0)
PREVIOUS_TAG=$(git describe --tags --abbrev=0 ${CURRENT_TAG}~1 2>/dev/null || echo "")

if [ -n "$PREVIOUS_TAG" ]; then
  logsmith --from "$PREVIOUS_TAG" --to "$CURRENT_TAG" --output RELEASE_NOTES.md
else
  logsmith --to "$CURRENT_TAG" --output RELEASE_NOTES.md
fi
```

## Tag Management

### Listing Tags

```bash
# View all version tags
git tag -l "v*" --sort=-version:refname

# View recent tags
git tag -l "v*" --sort=-version:refname | head -5
```

### Creating Tags

```bash
# Create annotated tag (recommended)
git tag -a v1.0.0 -m "Release v1.0.0"

# Push tag
git push origin v1.0.0

# Push all tags
git push origin --tags
```

## Date Inclusion

Include dates in version headers:

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  includeDates: true,
  dateFormat: 'YYYY-MM-DD',
  output: 'CHANGELOG.md',
})
```

Output:
```markdown
## v1.2.0 (2024-01-20)
```

### Custom Date Format

```typescript
await generateChangelog({
  dateFormat: 'MMMM d, yyyy', // January 20, 2024
})
```

## Version in Templates

Use version information in templates:

```typescript
import { generateChangelog } from 'logsmith'

await generateChangelog({
  templates: {
    groupFormat: '## {{version}} - {{date}}',
    dateFormat: '**Released: {{date}}**',
  },
})
```

## Programmatic Version Access

Access version information directly:

```typescript
import { getVersionInfo, loadLogsmithConfig } from 'logsmith'

async function displayVersionInfo() {
  const config = await loadLogsmithConfig()
  const info = await getVersionInfo(config)

  console.log(`Current version: ${info.current}`)
  console.log(`Previous version: ${info.previous}`)
  console.log(`All versions: ${info.all.join(', ')}`)
}
```

## Version-Based Filtering

Filter commits by version characteristics:

```typescript
import { generateChangelog } from 'logsmith'

// Only include commits between stable releases
await generateChangelog({
  from: 'v1.0.0',
  to: 'v2.0.0',
  // Excludes pre-release tags
})
```

## Monorepo Versions

Handle versions in monorepos:

```bash
# Package-specific tags
@package/core@1.0.0
@package/api@2.1.0

# Generate per-package changelog
logsmith --dir packages/core \
  --version-prefix "@package/core@" \
  --output packages/core/CHANGELOG.md
```

## Version Detection Best Practices

1. **Use Annotated Tags**: More metadata and better sorting
2. **Follow SemVer**: Consistent versioning for proper sorting
3. **Tag on Release**: Create tags when releasing, not before
4. **Include Version Prefix**: Use `v` prefix for clarity
5. **Document Breaking Changes**: Clear version boundaries

## Troubleshooting

### No Tags Found

```bash
# Check if tags exist
git tag -l

# Fetch tags from remote
git fetch --tags

# Run with verbose to debug
logsmith --verbose
```

### Wrong Version Order

```bash
# Verify tag dates
git tag -l --format='%(refname:short) %(creatordate:iso)'

# Check for non-semver tags
git tag -l | grep -v '^v[0-9]'
```

### Version Not Detected

```typescript
// Explicitly specify version
await generateChangelog({
  from: 'v1.0.0',
  to: 'HEAD',
})
```

## Next Steps

- Learn about [Multiple Formats](/features/multiple-formats) for output options
- Explore [Theming](/features/theming) for customizing appearance
- Review [CI/CD Integration](/advanced/ci-cd-integration) for automation
