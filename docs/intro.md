<p align="center"><img src="https://github.com/stacksjs/logsmith/blob/main/.github/art/cover.jpg?raw=true" alt="Social Card of logsmith"></p>

# Introduction

**Logsmith** is a powerful, modern changelog generation tool that automatically creates beautiful changelogs from your conventional commits. With comprehensive Git integration, multiple output formats, and extensive customization options, logsmith makes it effortless to maintain professional project documentation.

## What is logsmith?

Logsmith forges beautiful changelogs automatically by analyzing your Git commit history and transforming conventional commits into well-organized, professional-looking documentation. Whether you're working on open source projects, enterprise applications, or personal repositories, logsmith streamlines the changelog creation process while maintaining consistency and clarity.

### Core Capabilities

- **🚀 Automatic Generation**: Transforms conventional commits into structured changelogs instantly
- **🎨 Beautiful Formatting**: Multiple themes and output formats (Markdown, JSON, HTML)
- **📊 Repository Analytics**: Comprehensive statistics and trend analysis
- **🌍 Internationalization**: Support for 10+ languages including English, Spanish, French, German, and more
- **⚙️ Highly Configurable**: TypeScript configuration files with extensive customization options
- **🔧 CLI & API**: Both command-line interface and programmatic API for all use cases

## Key Features

### Intelligent Commit Analysis
Logsmith parses conventional commits to automatically categorize changes into sections like features, bug fixes, documentation updates, and breaking changes. It understands commit scopes, references, and can detect breaking changes from commit messages.

### Multiple Output Formats
Generate changelogs in your preferred format:
- **Markdown** - Perfect for GitHub, GitLab, and documentation sites
- **JSON** - Ideal for programmatic consumption and integrations
- **HTML** - Beautiful standalone documents with custom styling

### Rich Theming System
Choose from 8 built-in themes or create custom ones:
- **Default** - Colorful emojis and modern styling
- **GitHub** - Familiar GitHub-style formatting
- **Minimal** - Clean, understated appearance
- **Gitmoji** - Complete gitmoji emoji set
- **Corporate** - Professional, business-friendly formatting
- **Unicode** - Symbol-based theme for better compatibility
- **Simple** - Text-only without emojis or symbols
- **Colorful** - Vibrant theme with enhanced visual elements

### Advanced Filtering & Organization
Fine-tune your changelogs with powerful filtering options:
- Include/exclude specific commit types, authors, or scopes
- Set minimum/maximum commit counts per section
- Filter by commit message patterns
- Group breaking changes separately
- Control description length and formatting

### Repository Insights
Get detailed statistics about your repository:
- Commit frequency analysis with daily, weekly, and monthly trends
- Contributor growth patterns and activity metrics
- Commit type distribution and usage patterns
- Breaking change tracking and impact analysis

## Getting Started

Install logsmith and generate your first changelog in minutes:

```bash
# Install globally with bun
bun add -g logsmith

# Generate a changelog
logsmith

# Save to file
logsmith --output CHANGELOG.md

# Use a specific theme
logsmith --theme github --output CHANGELOG.md

# Get repository statistics
logsmith stats
```

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/logsmith/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

"Software that is free, but hopes for a postcard." We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## Credits

- [`conventional-changelog`](https://github.com/conventional-changelog/conventional-changelog) - for conventional commit parsing inspiration
- [`gitmoji`](https://gitmoji.dev/) - for emoji commit conventions
- [Chris Breuer](https://github.com/chrisbbreuer)
- [All Contributors](https://github.com/stacksjs/logsmith/graphs/contributors)

## License

The MIT License (MIT). Please see [LICENSE](https://github.com/stacksjs/logsmith/tree/main/LICENSE.md) for more information.

Made with 💙

<!-- Badges -->

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/rpx/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/rpx -->
