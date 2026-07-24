# Custom Templates

Logsmith provides a powerful templating system that allows you to customize every aspect of your changelog output. This guide covers template syntax, available variables, and advanced customization techniques.

## Template Overview

Templates control how different elements appear in your changelog:

- **commitFormat**: Individual commit entries
- **groupFormat**: Section headers
- **breakingChangeFormat**: Breaking change entries
- **dateFormat**: Date display
- **typeFormat**: Commit type labels

## Basic Template Syntax

Templates use mustache-style `{{variable}}` placeholders:

```typescript
export default defineConfig({
  templates: {
    commitFormat: '- {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
  },
})
```

## Available Variables

### Commit Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{type}}` | Commit type | `feat`, `fix` |
| `{{scope}}` | Commit scope with formatting | `(auth): ` |
| `{{description}}` | Commit description | `add login feature` |
| `{{hash}}` | Short commit hash | `abc123f` |
| `{{author}}` | Author name | `John Doe` |
| `{{email}}` | Author email | `john@example.com` |
| `{{date}}` | Commit date | `2024-01-20` |
| `{{body}}` | Commit body | Full body text |
| `{{breaking}}` | Breaking change flag | `true`/`false` |
| `{{repoUrl}}` | Repository URL | `https://github.com/user/repo` |

### Section Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{title}}` | Section title | `Features` |
| `{{emoji}}` | Type emoji | `rocket` |
| `{{count}}` | Commit count | `5` |
| `{{version}}` | Version string | `v2.0.0` |

## Commit Format Templates

### Basic Format

```typescript
export default defineConfig({
  templates: {
    commitFormat: '- {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
  },
})
```

Output:
```markdown
- Add user authentication ([abc123](https://github.com/user/repo/commit/abc123))
```

### With Scope

```typescript
export default defineConfig({
  templates: {
    commitFormat: '- {{scope}}{{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
  },
})
```

Output:
```markdown
- (auth): Add user authentication ([abc123](https://github.com/user/repo/commit/abc123))
```

### With Author

```typescript
export default defineConfig({
  templates: {
    commitFormat: '- {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}})) by @{{author}}',
  },
})
```

Output:
```markdown
- Add user authentication ([abc123](https://github.com/user/repo/commit/abc123)) by @johndoe
```

### Full Details

```typescript
export default defineConfig({
  templates: {
    commitFormat: `
- **{{type}}{{scope}}**: {{description}}
  - Commit: [{{hash}}]({{repoUrl}}/commit/{{hash}})
  - Author: {{author}}
  - Date: {{date}}
    `.trim(),
  },
})
```

## Group Format Templates

### Basic Section Header

```typescript
export default defineConfig({
  templates: {
    groupFormat: '### {{title}}',
  },
})
```

### With Emoji

```typescript
export default defineConfig({
  templates: {
    groupFormat: '### {{emoji}} {{title}}',
  },
})
```

### With Count

```typescript
export default defineConfig({
  templates: {
    groupFormat: '### {{title}} ({{count}} changes)',
  },
})
```

### Version Header

```typescript
export default defineConfig({
  templates: {
    groupFormat: '## {{version}} - {{title}}',
  },
})
```

## Breaking Change Templates

### Standard Format

```typescript
export default defineConfig({
  templates: {
    breakingChangeFormat: '- **BREAKING**: {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
  },
})
```

### Warning Style

```typescript
export default defineConfig({
  templates: {
    breakingChangeFormat: `
> **Warning**
> {{description}}
>
> Commit: [{{hash}}]({{repoUrl}}/commit/{{hash}})
    `.trim(),
  },
})
```

### With Migration Note

```typescript
export default defineConfig({
  templates: {
    breakingChangeFormat: '- {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}})) - _Migration required_',
  },
})
```

## Date Format Templates

### Standard Date

```typescript
export default defineConfig({
  templates: {
    dateFormat: '_{{date}}_',
  },
})
```

### Bold Date

```typescript
export default defineConfig({
  templates: {
    dateFormat: '**Released: {{date}}**',
  },
})
```

### Full Header

```typescript
export default defineConfig({
  templates: {
    dateFormat: '### Release Date: {{date}}',
  },
})
```

## Type Format Configuration

### Custom Labels

```typescript
export default defineConfig({
  templates: {
    typeFormat: {
      feat: 'New Features',
      fix: 'Bug Fixes',
      docs: 'Documentation',
      style: 'Code Style',
      refactor: 'Refactoring',
      perf: 'Performance',
      test: 'Testing',
      build: 'Build System',
      ci: 'CI/CD',
      chore: 'Maintenance',
      revert: 'Reverts',
    },
  },
})
```

### With Emojis

```typescript
export default defineConfig({
  templates: {
    typeFormat: {
      feat: 'New Features',
      fix: 'Bug Fixes',
      docs: 'Documentation',
      style: 'Code Style',
      refactor: 'Refactoring',
      perf: 'Performance',
      test: 'Testing',
      build: 'Build System',
      ci: 'CI/CD',
      chore: 'Maintenance',
      revert: 'Reverts',
    },
  },
})
```

### Corporate Style

```typescript
export default defineConfig({
  templates: {
    typeFormat: {
      feat: 'FEATURES',
      fix: 'BUG FIXES',
      docs: 'DOCUMENTATION',
      perf: 'PERFORMANCE',
      breaking: 'BREAKING CHANGES',
    },
  },
})
```

## Advanced Templating

### Conditional Content

While logsmith doesn't support full conditional logic in templates, you can use configuration to achieve similar results:

```typescript
export default defineConfig({
  includeCommitBody: process.env.DETAILED === 'true',
  templates: {
    commitFormat: process.env.DETAILED === 'true'
      ? '- {{description}}\n  {{body}}'
      : '- {{description}}',
  },
})
```

### Multi-Line Templates

```typescript
export default defineConfig({
  templates: {
    commitFormat: `
- **{{description}}**
  - Hash: \`{{hash}}\`
  - Author: {{author}}
  - [View commit]({{repoUrl}}/commit/{{hash}})
    `.trim(),
  },
})
```

### HTML Templates

For HTML format output:

```typescript
export default defineConfig({
  format: 'html',
  templates: {
    commitFormat: `
<li class="commit {{type}}">
  <span class="description">{{description}}</span>
  <a href="{{repoUrl}}/commit/{{hash}}" class="hash">{{hash}}</a>
  <span class="author">by {{author}}</span>
</li>
    `.trim(),
    groupFormat: `
<section class="changelog-section">
  <h3 class="section-title">{{title}}</h3>
  <ul class="commit-list">
    `.trim(),
  },
})
```

## Template Presets

### GitHub Style

```typescript
const githubTemplates = {
  commitFormat: '- {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
  groupFormat: '### {{title}}',
  breakingChangeFormat: '- **Breaking**: {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
  typeFormat: {
    feat: 'Features',
    fix: 'Bug Fixes',
    docs: 'Documentation',
    perf: 'Performance Improvements',
  },
}
```

### Keep a Changelog Style

```typescript
const keepAChangelogTemplates = {
  commitFormat: '- {{description}}',
  groupFormat: '### {{title}}',
  typeFormat: {
    feat: 'Added',
    fix: 'Fixed',
    docs: 'Changed',
    refactor: 'Changed',
    perf: 'Changed',
    revert: 'Removed',
  },
}
```

### Angular Style

```typescript
const angularTemplates = {
  commitFormat: '* {{scope}}{{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
  groupFormat: '### {{title}}',
  breakingChangeFormat: '* **BREAKING CHANGE:** {{description}}',
  typeFormat: {
    feat: 'Features',
    fix: 'Bug Fixes',
    docs: 'Documentation',
    style: 'Styles',
    refactor: 'Code Refactoring',
    perf: 'Performance Improvements',
    test: 'Tests',
    build: 'Build System',
    ci: 'Continuous Integration',
  },
}
```

## Escaping Special Characters

Handle special characters in templates:

```typescript
export default defineConfig({
  templates: {
    // Escape markdown characters
    commitFormat: '- {{description}} \\([{{hash}}]({{repoUrl}}/commit/{{hash}})\\)',

    // Use code formatting
    groupFormat: '### `{{title}}`',
  },
})
```

## Testing Templates

Preview template output before generating:

```bash
# Dry run to console
logsmith --no-output --verbose

# Preview with specific template
logsmith --no-output | head -50
```

## Best Practices

1. **Keep It Simple**: Start with basic templates, add complexity as needed
2. **Be Consistent**: Use the same style across all templates
3. **Test Thoroughly**: Preview output before committing configuration
4. **Consider Audience**: Technical vs. non-technical readers
5. **Include Links**: Always link to commits for traceability
6. **Handle Edge Cases**: Account for missing scopes, empty bodies

## Next Steps

- Explore [Performance](/advanced/performance) optimization
- Review [CI/CD Integration](/advanced/ci-cd-integration) for automation
- Check [Theming](/features/theming) for visual customization
