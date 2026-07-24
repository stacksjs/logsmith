# CI/CD Integration

Integrate logsmith into your CI/CD pipelines for automated changelog generation, release notes, and repository analytics.

## Overview

Logsmith excels in automated environments:

- **Headless Operation**: No user interaction required
- **Consistent Output**: Same results across environments
- **Multiple Formats**: Generate for different consumers
- **Proper Exit Codes**: Integrates with CI systems

## GitHub Actions

### Basic Changelog Generation

```yaml
# .github/workflows/changelog.yml
name: Generate Changelog

on:
  push:
    tags: ['v*']

jobs:
  changelog:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: oven-sh/setup-bun@v1

      - name: Install logsmith
        run: bun add -g logsmith

      - name: Generate Changelog
        run: logsmith --theme github --output CHANGELOG.md

      - name: Commit Changes
        run: |
          git config user.name "GitHub Action"
          git config user.email "action@github.com"
          git add CHANGELOG.md
          git commit -m "docs: update changelog" || exit 0
          git push
```

### Release Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags: ['v*']

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: oven-sh/setup-bun@v1

      - name: Install logsmith
        run: bun add -g logsmith

      - name: Extract Version
        id: version
        run: echo "VERSION=${GITHUB_REF#refs/tags/}" >> $GITHUB_OUTPUT

      - name: Generate Release Notes
        run: |
          PREV_TAG=$(git describe --tags --abbrev=0 HEAD~1 2>/dev/null || echo "")
          if [ -n "$PREV_TAG" ]; then
            logsmith --from "$PREV_TAG" --to "${{ steps.version.outputs.VERSION }}" \
              --theme github --output RELEASE_NOTES.md
          else
            logsmith --to "${{ steps.version.outputs.VERSION }}" \
              --theme github --output RELEASE_NOTES.md
          fi

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          body_path: RELEASE_NOTES.md
          generate_release_notes: false
```

### PR Preview

```yaml
# .github/workflows/pr-changelog.yml
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
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: oven-sh/setup-bun@v1

      - name: Install logsmith
        run: bun add -g logsmith

      - name: Generate Preview
        run: |
          logsmith --from ${{ github.event.pull_request.base.sha }} \
            --to ${{ github.event.pull_request.head.sha }} \
            --theme github --no-output > preview.md || echo "No conventional commits" > preview.md

      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const preview = fs.readFileSync('preview.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Changelog Preview\n\n${preview}`
            });
```

## GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - generate
  - release

generate-changelog:
  stage: generate
  image: oven/bun:latest
  script:
    - bun add -g logsmith
    - logsmith --theme github --output CHANGELOG.md
  artifacts:
    paths:
      - CHANGELOG.md
  only:
    - tags

release-notes:
  stage: release
  image: oven/bun:latest
  script:
    - bun add -g logsmith
    - |
      if [ -n "$CI_COMMIT_TAG" ]; then
        PREV_TAG=$(git describe --tags --abbrev=0 $CI_COMMIT_TAG~1 2>/dev/null || echo "")
        if [ -n "$PREV_TAG" ]; then
          logsmith --from "$PREV_TAG" --to "$CI_COMMIT_TAG" --output RELEASE_NOTES.md
        else
          logsmith --to "$CI_COMMIT_TAG" --output RELEASE_NOTES.md
        fi
      fi
  artifacts:
    paths:
      - RELEASE_NOTES.md
  only:
    - tags
```

## Jenkins

```groovy
// Jenkinsfile
pipeline {
    agent any

    stages {
        stage('Setup') {
            steps {
                sh '''
                    curl -fsSL https://bun.sh/install | bash
                    export PATH="$HOME/.bun/bin:$PATH"
                    bun add -g logsmith
                '''
            }
        }

        stage('Generate Changelog') {
            when {
                tag 'v*'
            }
            steps {
                sh '''
                    export PATH="$HOME/.bun/bin:$PATH"
                    logsmith --theme corporate --output CHANGELOG.md
                '''
                archiveArtifacts artifacts: 'CHANGELOG.md'
            }
        }

        stage('Release Notes') {
            when {
                tag 'v*'
            }
            steps {
                sh '''
                    export PATH="$HOME/.bun/bin:$PATH"
                    PREV_TAG=$(git describe --tags --abbrev=0 ${TAG_NAME}~1 2>/dev/null || echo "")
                    if [ -n "$PREV_TAG" ]; then
                        logsmith --from "$PREV_TAG" --to "${TAG_NAME}" --output RELEASE_NOTES.md
                    fi
                '''
                archiveArtifacts artifacts: 'RELEASE_NOTES.md'
            }
        }
    }
}
```

## CircleCI

```yaml
# .circleci/config.yml
version: 2.1

orbs:
  bun: oven/bun@1

jobs:
  changelog:
    executor: bun/default
    steps:
      - checkout
      - run:
          name: Fetch all history
          command: git fetch --unshallow || true
      - run:
          name: Install logsmith
          command: bun add -g logsmith
      - run:
          name: Generate Changelog
          command: logsmith --theme github --output CHANGELOG.md
      - store_artifacts:
          path: CHANGELOG.md

workflows:
  release:
    jobs:
      - changelog:
          filters:
            tags:
              only: /^v.*/
```

## Docker Integration

### Dockerfile

```dockerfile
FROM oven/bun:latest

WORKDIR /app

RUN bun add -g logsmith

COPY . .

CMD ["logsmith", "--output", "CHANGELOG.md"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  changelog:
    build: .
    volumes:
      - .:/app
      - ./output:/output
    command: logsmith --output /output/CHANGELOG.md --theme github
```

## Custom Scripts

### Release Script

```bash
#!/bin/bash
# scripts/release.sh
set -e

VERSION_TAG="$1"
if [ -z "$VERSION_TAG" ]; then
  echo "Usage: $0 <version-tag>"
  exit 1
fi

echo "Generating release for $VERSION_TAG"

# Install if needed
command -v logsmith >/dev/null 2>&1 || bun add -g logsmith

# Get previous tag
PREV_TAG=$(git describe --tags --abbrev=0 "$VERSION_TAG"~1 2>/dev/null || echo "")

# Generate changelog
logsmith --theme github --output CHANGELOG.md

# Generate release notes
if [ -n "$PREV_TAG" ]; then
  logsmith --from "$PREV_TAG" --to "$VERSION_TAG" --output RELEASE_NOTES.md
else
  logsmith --to "$VERSION_TAG" --output RELEASE_NOTES.md
fi

# Commit changelog
git add CHANGELOG.md
git commit -m "docs: update changelog for $VERSION_TAG" || true

echo "Release preparation complete!"
```

### Weekly Report Script

```bash
#!/bin/bash
# scripts/weekly-report.sh

DATE=$(date +%Y-%m-%d)

logsmith stats --from "1 week ago" > "reports/weekly-$DATE.txt"
logsmith stats --from "1 week ago" --json > "reports/weekly-$DATE.json"

echo "Weekly report generated for $DATE"
```

## Environment Configuration

### CI-Specific Config

```typescript
// logsmith.config.ts
import { defineConfig } from 'logsmith'

const isCI = process.env.CI === 'true'

export default defineConfig({
  verbose: !isCI,
  theme: isCI ? 'corporate' : 'github',
  excludeAuthors: [
    'dependabot[bot]',
    'renovate[bot]',
    'github-actions[bot]',
  ],
  repo: process.env.GITHUB_REPOSITORY
    ? `https://github.com/${process.env.GITHUB_REPOSITORY}`
    : undefined,
})
```

### Environment Variables

```yaml
# In CI configuration
env:
  LOGSMITH_THEME: github
  LOGSMITH_EXCLUDE_AUTHORS: "dependabot[bot],renovate[bot]"
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Best Practices

### Always Fetch Full History

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Required for full commit history
```

### Handle Missing Tags

```bash
# Safe tag handling
PREV_TAG=$(git describe --tags --abbrev=0 HEAD~1 2>/dev/null || echo "")
if [ -n "$PREV_TAG" ]; then
  logsmith --from "$PREV_TAG" --output CHANGELOG.md
else
  logsmith --output CHANGELOG.md
fi
```

### Cache Dependencies

```yaml
- name: Cache Bun dependencies
  uses: actions/cache@v3
  with:
    path: ~/.bun/install/cache
    key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lockb') }}
```

### Use Exit Codes

```bash
# logsmith returns proper exit codes
logsmith --output CHANGELOG.md || {
  echo "Changelog generation failed"
  exit 1
}
```

## Troubleshooting

### No Commits Found

```yaml
- name: Debug Git History
  run: |
    git log --oneline -20
    git tag -l
```

### Permission Issues

```yaml
permissions:
  contents: write
  pull-requests: write
```

### Git Configuration

```yaml
- name: Configure Git
  run: |
    git config user.name "GitHub Action"
    git config user.email "action@github.com"
```

## Next Steps

- Review [Automation](/advanced/automation) for comprehensive workflows
- Explore [Performance](/advanced/performance) optimization
- Check [Configuration](/advanced/configuration) for CI settings
