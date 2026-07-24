# Performance

This guide covers performance optimization techniques for logsmith, including strategies for large repositories, efficient filtering, and caching.

## Performance Characteristics

Logsmith is built for performance:

- **Bun-Powered**: Leverages Bun's speed for optimal execution
- **Efficient Git Parsing**: Minimal git operations
- **Streaming Processing**: Handles large commit histories
- **Smart Caching**: Reuses computed results where possible

## Optimizing Large Repositories

### Limit Commit Range

The most effective optimization for large repos:

```bash
# Instead of full history
logsmith --output CHANGELOG.md

# Limit to recent commits
logsmith --from "3 months ago" --output CHANGELOG.md

# Specific version range
logsmith --from v1.0.0 --to v2.0.0 --output CHANGELOG.md
```

### Filter Early

Apply filters to reduce processing:

```typescript
export default defineConfig({
  // Filter at source
  excludeAuthors: ['dependabot[bot]', 'renovate[bot]'],
  excludeCommitTypes: ['chore', 'ci'],

  // Limit results
  maxCommitsPerSection: 50,
})
```

### Use Specific Scopes

For monorepos, focus on relevant packages:

```bash
# Only core package commits
logsmith --include-scopes "core" --output CHANGELOG.md
```

## Reducing Git Operations

### Shallow Clone in CI

```yaml
# GitHub Actions
- uses: actions/checkout@v4
  with:
    fetch-depth: 100  # Only recent history
```

### Local Caching

```bash
# Ensure local refs are up to date
git fetch --tags

# Then run logsmith
logsmith --output CHANGELOG.md
```

## Memory Optimization

### Disable Verbose Logging

```typescript
export default defineConfig({
  verbose: false, // Reduce memory usage
})
```

### Limit Commit Bodies

```typescript
export default defineConfig({
  includeCommitBody: false, // Don't load full commit messages
  maxDescriptionLength: 100, // Truncate long descriptions
})
```

### Process in Batches

For very large repositories:

```typescript
import { generateChangelog } from 'logsmith'

async function generateInBatches() {
  const versions = ['v1.0.0', 'v2.0.0', 'v3.0.0', 'HEAD']

  for (let i = 0; i < versions.length - 1; i++) {
    await generateChangelog({
      from: versions[i],
      to: versions[i + 1],
      output: `changelog-${versions[i + 1]}.md`,
    })
  }
}
```

## Benchmarking

### Measure Generation Time

```bash
# Time the generation
time logsmith --output CHANGELOG.md

# With verbose for details
time logsmith --verbose --output CHANGELOG.md 2>&1 | tail -20
```

### Compare Configurations

```typescript
import { generateChangelog } from 'logsmith'

async function benchmark(name: string, config: any) {
  const start = Date.now()

  await generateChangelog(config)

  const duration = Date.now() - start
  console.log(`${name}: ${duration}ms`)
}

// Compare configurations
await benchmark('Full history', { output: 'test1.md' })
await benchmark('Last month', { from: '1 month ago', output: 'test2.md' })
await benchmark('Filtered', { excludeCommitTypes: ['chore', 'ci'], output: 'test3.md' })
```

## Caching Strategies

### CI/CD Caching

```yaml
# GitHub Actions
- name: Cache logsmith
  uses: actions/cache@v3
  with:
    path: ~/.bun/install/cache
    key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lockb') }}
```

### Generated Output Caching

```yaml
- name: Cache changelog
  uses: actions/cache@v3
  with:
    path: CHANGELOG.md
    key: changelog-${{ github.sha }}
    restore-keys: |
      changelog-
```

### Incremental Generation

Only regenerate when needed:

```bash
#!/bin/bash
# Check if changelog needs update
LAST_TAG=$(git describe --tags --abbrev=0)
CHANGELOG_HASH=$(git log -1 --format=%H -- CHANGELOG.md 2>/dev/null)
LATEST_COMMIT=$(git log -1 --format=%H)

if [ "$CHANGELOG_HASH" != "$LATEST_COMMIT" ]; then
  logsmith --from "$LAST_TAG" --output CHANGELOG.md
fi
```

## Parallel Processing

### Multiple Format Generation

```typescript
import { generateChangelog } from 'logsmith'

async function generateAllFormats() {
  const baseConfig = {
    from: 'v1.0.0',
    theme: 'github',
  }

  // Generate all formats in parallel
  await Promise.all([
    generateChangelog({ ...baseConfig, format: 'markdown', output: 'CHANGELOG.md' }),
    generateChangelog({ ...baseConfig, format: 'json', output: 'changelog.json' }),
    generateChangelog({ ...baseConfig, format: 'html', output: 'changelog.html' }),
  ])
}
```

### Monorepo Parallel Generation

```typescript
import { generateChangelog } from 'logsmith'

async function generateMonorepoChangelogs() {
  const packages = ['core', 'api', 'cli', 'utils']

  await Promise.all(
    packages.map(pkg =>
      generateChangelog({
        dir: `packages/${pkg}`,
        includeScopes: [pkg],
        output: `packages/${pkg}/CHANGELOG.md`,
      })
    )
  )
}
```

## Profile-Based Configuration

### Fast Profile

```typescript
// logsmith.config.fast.ts
export default defineConfig({
  from: '1 month ago',
  verbose: false,
  includeCommitBody: false,
  maxCommitsPerSection: 20,
  excludeAuthors: ['dependabot[bot]', 'renovate[bot]'],
  excludeCommitTypes: ['chore', 'ci', 'test'],
})
```

### Full Profile

```typescript
// logsmith.config.full.ts
export default defineConfig({
  from: undefined, // Full history
  verbose: true,
  includeCommitBody: true,
  maxCommitsPerSection: 0, // Unlimited
})
```

### Usage

```bash
# Fast generation
logsmith --config logsmith.config.fast.ts --output CHANGELOG.md

# Full generation
logsmith --config logsmith.config.full.ts --output CHANGELOG.md
```

## Monitoring Performance

### Memory Usage

```typescript
// Monitor memory during generation
const used = process.memoryUsage()
console.log({
  heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
  heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
  rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
})
```

### Performance Metrics

```typescript
import { performance } from 'perf_hooks'
import { generateChangelog } from 'logsmith'

async function measurePerformance() {
  const markers: Record<string, number> = {}

  markers.start = performance.now()

  await generateChangelog({
    output: 'CHANGELOG.md',
  })

  markers.end = performance.now()

  console.log({
    totalTime: `${(markers.end - markers.start).toFixed(2)}ms`,
    memory: process.memoryUsage(),
  })
}
```

## Best Practices Summary

### Do

- Limit commit range for large repos
- Filter out unnecessary commits early
- Use shallow clones in CI
- Cache generated outputs
- Disable verbose in production
- Process formats in parallel

### Don't

- Process full history unnecessarily
- Include commit bodies for large repos
- Run verbose logging in production
- Regenerate when not needed
- Load all commits into memory

## Performance Checklist

- [ ] Commit range is limited appropriately
- [ ] Unnecessary authors are filtered
- [ ] Commit types are filtered
- [ ] Verbose logging is disabled in CI
- [ ] Caching is configured
- [ ] Shallow clone is used in CI
- [ ] Memory limits are considered

## Next Steps

- Review [CI/CD Integration](/advanced/ci-cd-integration) for optimized pipelines
- Explore [Configuration](/advanced/configuration) for filtering options
- Check [Custom Templates](/advanced/custom-templates) for output optimization
