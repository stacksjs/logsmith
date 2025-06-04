# Theming

Logsmith provides a powerful theming system that allows you to customize the visual appearance of your changelogs. Choose from 8 built-in themes or create your own custom themes to match your project's style.

## Built-in Themes

### Available Themes

List all available themes:

```bash
# View all themes with descriptions
logsmith themes
```

**Output:**
```
🎨 Available Themes:

  default      - Default: Standard emoji theme with colorful icons
  minimal      - Minimal: Clean theme with minimal symbols
  github       - GitHub: GitHub-inspired theme with familiar styling
  gitmoji      - Gitmoji: Complete gitmoji emoji set for commit types
  unicode      - Unicode: Unicode symbols instead of emojis for better compatibility
  simple       - Simple: Text-only theme without any symbols or emojis
  colorful     - Colorful: Vibrant theme with enhanced visual elements
  corporate    - Corporate: Professional theme suitable for business environments
```

### Theme Comparison

Here's how different themes style the same content:

::: code-group

```markdown [Default Theme]
## 🚀 Features
- Add user authentication system ([abc123](repo/commit/abc123))
- Implement dark mode toggle ([def456](repo/commit/def456))

## 🐛 Bug Fixes
- Fix login token expiration issue ([ghi789](repo/commit/ghi789))
```

```markdown [GitHub Theme]
## ✨ Features
- Add user authentication system ([abc123](repo/commit/abc123))
- Implement dark mode toggle ([def456](repo/commit/def456))

## 🐛 Bug Fixes
- Fix login token expiration issue ([ghi789](repo/commit/ghi789))
```

```markdown [Minimal Theme]
### ✨ Features
* Add user authentication system ([abc123](repo/commit/abc123))
* Implement dark mode toggle ([def456](repo/commit/def456))

### 🔧 Bug Fixes
* Fix login token expiration issue ([ghi789](repo/commit/ghi789))
```

```markdown [Corporate Theme]
## Features
- Add user authentication system ([abc123](repo/commit/abc123))
- Implement dark mode toggle ([def456](repo/commit/def456))

## Bug Fixes
- Fix login token expiration issue ([ghi789](repo/commit/ghi789))
```

:::

## Using Themes

### Command Line

Apply themes directly via CLI:

```bash
# Use GitHub theme
logsmith --theme github --output CHANGELOG.md

# Use minimal theme
logsmith --theme minimal --output CHANGELOG.md

# Use corporate theme (no emojis)
logsmith --theme corporate --output CHANGELOG.md
```

### Configuration File

Set default theme in your config:

```typescript
// logsmith.config.ts
import { defineConfig } from 'logsmith'

export default defineConfig({
  theme: 'github',
  output: 'CHANGELOG.md',
})
```

## Theme Details

### Default Theme

**Best for:** General use, open source projects
**Features:** Colorful emojis, standard formatting

```typescript
const defaultTheme = {
  emojis: {
    feat: '🚀',
    fix: '🐛',
    docs: '📚',
    style: '💅',
    refactor: '♻️',
    perf: '⚡',
    test: '🧪',
    build: '📦',
    ci: '🤖',
    chore: '🧹',
    revert: '⏪',
    breaking: '💥',
  }
}
```

### GitHub Theme

**Best for:** GitHub repositories, familiar styling
**Features:** GitHub-style emojis, clean appearance

```typescript
const githubTheme = {
  emojis: {
    feat: '✨',
    fix: '🐛',
    docs: '📝',
    style: '💄',
    refactor: '♻️',
    perf: '⚡',
    test: '✅',
    build: '👷',
    ci: '💚',
    chore: '🔧',
    revert: '⏪',
    breaking: '💥',
  }
}
```

### Minimal Theme

**Best for:** Clean, understated documentation
**Features:** Simple symbols, reduced visual noise

```typescript
const minimalTheme = {
  emojis: {
    feat: '✨',
    fix: '🔧',
    docs: '📖',
    style: '🎨',
    refactor: '🔄',
    perf: '⚡',
    test: '✅',
    build: '📦',
    ci: '🔄',
    chore: '🔧',
    revert: '↩️',
    breaking: '⚠️',
  }
}
```

### Corporate Theme

**Best for:** Enterprise, professional environments
**Features:** No emojis, business-friendly formatting

```typescript
const corporateTheme = {
  emojis: {
    feat: '',
    fix: '',
    docs: '',
    style: '',
    refactor: '',
    perf: '',
    test: '',
    build: '',
    ci: '',
    chore: '',
    revert: '',
    breaking: '',
  }
}
```

### Gitmoji Theme

**Best for:** Projects using gitmoji conventions
**Features:** Complete gitmoji emoji set

```typescript
const gitmojiTheme = {
  emojis: {
    feat: '✨',
    fix: '🐛',
    docs: '📝',
    style: '🎨',
    refactor: '♻️',
    perf: '⚡️',
    test: '✅',
    build: '👷',
    ci: '💚',
    chore: '🔧',
    revert: '⏪️',
    breaking: '💥',
  }
}
```

### Unicode Theme

**Best for:** Better terminal compatibility, accessibility
**Features:** Unicode symbols instead of emojis

```typescript
const unicodeTheme = {
  emojis: {
    feat: '→',
    fix: '✗',
    docs: '◉',
    style: '◈',
    refactor: '↻',
    perf: '▲',
    test: '✓',
    build: '■',
    ci: '●',
    chore: '○',
    revert: '←',
    breaking: '‼',
  }
}
```

## Custom Themes

### Creating Custom Themes

Define your own theme with custom emojis and styling:

```typescript
// logsmith.config.ts
import { defineConfig } from 'logsmith'

export default defineConfig({
  // Override individual emojis
  templates: {
    typeFormat: {
      feat: '🎉 New Features',
      fix: '🔧 Bug Fixes',
      docs: '📖 Documentation',
      style: '🎨 Code Style',
      refactor: '🔨 Refactoring',
      perf: '🚀 Performance',
      test: '🧪 Testing',
      build: '📦 Build System',
      ci: '🤖 CI/CD',
      chore: '🧹 Maintenance',
      revert: '⏪ Reverts',
    },
  },
})
```

### Advanced Custom Theme

Create a complete custom theme with styling options:

```typescript
// my-theme.ts
import type { ThemeConfig } from 'logsmith'

export const myCustomTheme: ThemeConfig = {
  name: 'My Custom Theme',
  description: 'Custom theme for my project',
  emojis: {
    feat: '🌟',
    fix: '🛠️',
    docs: '📋',
    style: '🎭',
    refactor: '🔄',
    perf: '⚡',
    test: '🔍',
    build: '🏗️',
    ci: '🤖',
    chore: '🧽',
    revert: '↶',
    misc: '📝',
    breaking: '💥',
  },
  styles: {
    markdown: {
      headerPrefix: '###',
      listItemPrefix: '•',
      emphasis: 'bold',
      codeStyle: 'backticks',
    },
    html: {
      colorScheme: 'dark',
      fontSize: 'large',
      fontFamily: 'JetBrains Mono, monospace',
      customCss: `
        .changelog {
          background: #1a1a1a;
          color: #ffffff;
          padding: 2rem;
        }
        .commit-type {
          color: #00d4aa;
          font-weight: bold;
        }
        .breaking-change {
          color: #ff6b6b;
          background: #2a1f1f;
          padding: 0.5rem;
          border-left: 4px solid #ff6b6b;
        }
      `,
    },
  },
}
```

### Using Custom Themes Programmatically

```typescript
import { generateChangelog } from 'logsmith'
import { myCustomTheme } from './my-theme'

// Apply custom theme programmatically
await generateChangelog({
  output: 'CHANGELOG.md',
  templates: {
    typeFormat: myCustomTheme.emojis,
  },
})
```

## Theme Customization

### Format-Specific Themes

Different themes for different output formats:

```typescript
export default defineConfig({
  // Base theme
  theme: 'github',

  // Format-specific overrides
  templates: {
    // Markdown-specific formatting
    commitFormat: '- {{scope}}{{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
    groupFormat: '## {{title}}',

    // Different formatting for HTML
    ...(process.env.FORMAT === 'html' && {
      commitFormat: '<li>{{scope}}{{description}} <a href="{{repoUrl}}/commit/{{hash}}">{{hash}}</a></li>',
      groupFormat: '<h2>{{title}}</h2>',
    }),
  },
})
```

### Conditional Theming

Apply different themes based on environment:

```typescript
export default defineConfig({
  theme: process.env.NODE_ENV === 'production' ? 'corporate' : 'default',

  templates: {
    typeFormat: {
      feat: process.env.CI ? '✨ Features' : '🚀 Features',
      fix: process.env.CI ? '🐛 Bug Fixes' : '🔧 Bug Fixes',
    },
  },
})
```

## Styling Options

### Markdown Styling

Customize markdown output styling:

```typescript
export default defineConfig({
  theme: 'github',
  templates: {
    // Custom header levels
    groupFormat: '### {{title}}', // Use h3 instead of h2

    // Custom list styling
    commitFormat: '* {{scope}}{{description}}', // Use * instead of -

    // Custom breaking change format
    breakingChangeFormat: '⚠️ **BREAKING**: {{scope}}{{description}}',

    // Custom date format
    dateFormat: '**Released: {{date}}**',
  },
})
```

### HTML Styling

Customize HTML output with CSS:

```typescript
export default defineConfig({
  theme: 'colorful',

  // HTML-specific styling (when using format: 'html')
  templates: {
    commitFormat: `
      <div class="commit-entry">
        <span class="commit-type">{{type}}</span>
        <span class="commit-description">{{description}}</span>
        <a href="{{repoUrl}}/commit/{{hash}}" class="commit-hash">{{hash}}</a>
      </div>
    `,
  },
})
```

## Theme Examples

### Blog-style Theme

Perfect for project blogs and updates:

```typescript
export default defineConfig({
  theme: 'minimal',
  templates: {
    groupFormat: '## 📅 {{title}} - {{date}}',
    commitFormat: '- **{{description}}** by @{{author}} ([view commit]({{repoUrl}}/commit/{{hash}}))',
    dateFormat: '_{{date}}_',
    typeFormat: {
      feat: '🎉 New Features',
      fix: '🔧 Bug Fixes',
      docs: '📚 Documentation Updates',
      style: '💅 Style Improvements',
      refactor: '♻️ Code Refactoring',
      perf: '⚡ Performance Improvements',
    },
  },
})
```

### Release Notes Theme

Optimized for release announcements:

```typescript
export default defineConfig({
  theme: 'github',
  templates: {
    groupFormat: '## {{title}} ({{count}} changes)',
    commitFormat: '- {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
    breakingChangeFormat: '- 🚨 **BREAKING CHANGE**: {{description}} ([{{hash}}]({{repoUrl}}/commit/{{hash}}))',
    typeFormat: {
      feat: '✨ What\'s New',
      fix: '🐛 Bug Fixes',
      docs: '📖 Documentation',
      perf: '⚡ Performance',
      breaking: '🚨 Breaking Changes',
    },
  },
})
```

### Developer-focused Theme

Technical details for developer audiences:

```typescript
export default defineConfig({
  theme: 'unicode',
  includeCommitBody: true,
  hideAuthorEmail: false,
  templates: {
    commitFormat: '- `{{type}}{{scope}}`: {{description}} ({{hash}}) by {{author}}',
    groupFormat: '### {{title}}',
    typeFormat: {
      feat: 'FEAT',
      fix: 'FIX',
      docs: 'DOCS',
      style: 'STYLE',
      refactor: 'REFACTOR',
      perf: 'PERF',
      test: 'TEST',
      build: 'BUILD',
      ci: 'CI',
      chore: 'CHORE',
    },
  },
})
```

## Best Practices

### Theme Selection Guidelines

1. **Open Source Projects**: Use `default` or `github` themes for familiarity
2. **Corporate Environments**: Use `corporate` or `minimal` themes for professionalism
3. **Documentation Sites**: Use `minimal` or custom themes for brand consistency
4. **Developer Tools**: Use `unicode` or `gitmoji` themes for technical audiences
5. **Multi-audience Projects**: Create environment-specific themes

### Performance Considerations

- **Emoji Support**: Consider terminal/viewer emoji support
- **File Size**: Corporate themes generate smaller files
- **Accessibility**: Unicode themes are more accessible than emoji themes
- **Parsing Speed**: Simple themes process faster than complex custom themes

### Customization Tips

1. **Start with a base theme** and customize specific elements
2. **Test across different viewers** (GitHub, terminals, browsers)
3. **Consider your audience** when choosing emoji vs. text
4. **Use consistent formatting** across all commit types
5. **Document your custom themes** for team members

## Next Steps

- [Learn about repository analytics](/features/repository-insights) for detailed project insights
- [Explore configuration options](/config) for advanced customization
- [Check out automation setups](/advanced/automation) for CI/CD integration
- [Review the API reference](/api/reference) for programmatic theming
