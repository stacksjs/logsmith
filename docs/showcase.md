# Showcase

Discover how teams use logsmith to generate clear, consistent changelogs and release notes across different workflows.

## Community Projects

Have a project using logsmith? Open a pull request to add it here with a short description and link. Include a snippet of your `logsmith.config.ts` or CLI usage so others can learn from your setup.

Examples of what to share:

- Your default theme choice and why it works for your audience
- Filters you apply (authors, commit types, scopes)
- How you integrate logsmith in CI/CD

## Usage Patterns

### Minimal setup for small libraries

This setup focuses on clear Markdown output for GitHub releases.

```typescript
// logsmith.config.ts
import { defineConfig } from 'logsmith'

export default defineConfig({
  output: 'CHANGELOG.md',
  theme: 'github',
  excludeAuthors: ['dependabot[bot]'],
  minCommitsForSection: 1,
})
```

### Multi-format for product teams

Generate `CHANGELOG.md` for docs, `changelog.json` for automation, and `changelog.html` for internal wiki.

```bash
logsmith --output CHANGELOG.md --theme github
logsmith --format json --output changelog.json
logsmith --format html --theme colorful --output changelog.html
```

### CI workflow snippet

```yaml
name: Changelog
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
      - run: bun add -g logsmith
      - run: logsmith --output CHANGELOG.md --theme github
```

## Submit your project

Create a pull request with:

- Project name and URL
- Short description of how logsmith helps
- A configuration snippet or CLI commands you rely on

We’ll review and add it to this page.
