<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# logsmith

> A fast, dependency-free version bumping tool similar to bumpp and version-bump-prompt, built for Bun.

## Features

- 🚀 **Zero dependencies** - Built using only Node.js built-ins and Bun tooling
- 📦 **Semver compliant** - Supports all semantic versioning release types
- 🔄 **Monorepo support** - Recursive bumping with `--recursive` flag
- 🎯 **Git integration** - Automatic commit, tag, and push
- ⚡ **Fast execution** - Compiled binary for instant startup
- 🛠 **Highly configurable** - Config file and CLI options
- 🎨 **Interactive prompts** - Choose version increment interactively
- 🔧 **Custom commands** - Execute scripts before git operations

## Installation

```bash
# Install globally
bun install -g @stacksjs/logsmith

# Or use with bunx
bunx @stacksjs/logsmith patch
```

## Usage

### Basic Usage

```bash
# Bump patch version (1.0.0 → 1.0.1)
logsmith patch

# Bump minor version (1.0.0 → 1.1.0)
logsmith minor

# Bump major version (1.0.0 → 2.0.0)
logsmith major

# Bump to specific version
logsmith 1.2.3

# Interactive version selection
logsmith prompt
```

### Prerelease Versions

```bash
# Bump to prerelease
logsmith prepatch --preid beta  # 1.0.0 → 1.0.1-beta.0
logsmith preminor --preid alpha # 1.0.0 → 1.1.0-alpha.0
logsmith premajor --preid rc    # 1.0.0 → 2.0.0-rc.0

# Increment prerelease
logsmith prerelease  # 1.0.1-beta.0 → 1.0.1-beta.1
```

### Git Integration

```bash
# Disable git operations
logsmith patch --no-commit --no-tag --no-push

# Custom commit message
logsmith patch --commit "chore: release v{version}"

# Custom tag name
logsmith patch --tag "v{version}"

# Sign commits and tags
logsmith patch --sign

# Skip git hooks
logsmith patch --no-verify
```

### Monorepo Support

```bash
# Bump all package.json files recursively
logsmith patch --recursive

# Bump specific files
logsmith patch package.json packages/*/package.json
```

### Advanced Options

```bash
# Execute custom commands
logsmith patch --execute "bun run build" --execute "bun test"

# Install dependencies after bump
logsmith patch --install

# Skip confirmation prompts
logsmith patch --yes

# CI mode (non-interactive, quiet)
logsmith patch --ci

# Print recent commits
logsmith patch --print-commits

# Skip git status check
logsmith patch --no-git-check
```

## CI/CD Integration

logsmith is designed to work seamlessly in CI/CD environments:

### Quick CI Usage

```bash
# CI mode - automatically non-interactive
logsmith patch --ci

# Or with explicit flags
logsmith patch --yes --quiet

# Auto-detect CI environment
export CI=true
logsmith patch  # Automatically enables CI mode
```

### GitHub Actions Example

```yaml
name: Release
on:
  workflow_dispatch:
    inputs:
      release_type:
        description: Release type
        required: true
        default: patch
        type: choice
        options: [patch, minor, major]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0

      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Configure git
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"

      - name: Version bump and release
        run: bunx logsmith ${{ github.event.inputs.release_type }} --ci
```

For more CI/CD examples and configurations, see [CI.md](./CI.md).

## Configuration

Create a `logsmith.config.ts` file in your project root:

```typescript
import { defineConfig } from '@stacksjs/logsmith'

export default defineConfig({
  // Git options
  commit: true,
  tag: true,
  push: true,
  sign: false,

  // Execution options
  install: false,
  execute: ['bun run build', 'bun run test'],

  // UI options
  confirm: true,
  quiet: false,

  // Advanced options
  recursive: false,
  printCommits: true
})
```

You can also use JSON configuration in `package.json`:

```json
{
  "logsmith": {
    "commit": true,
    "tag": true,
    "push": true,
    "execute": ["bun run build"]
  }
}
```

## CLI Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--preid` | | ID for prerelease | |
| `--all` | | Include all files | `false` |
| `--no-git-check` | | Skip git status check | |
| `--commit [msg]` | `-c` | Create git commit | `true` |
| `--no-commit` | | Skip git commit | |
| `--tag [name]` | `-t` | Create git tag | `true` |
| `--no-tag` | | Skip git tag | |
| `--push` | `-p` | Push to remote | `true` |
| `--no-push` | | Skip git push | |
| `--sign` | | Sign commits and tags | `false` |
| `--install` | | Run npm install | `false` |
| `--execute` | `-x` | Execute command | |
| `--recursive` | `-r` | Bump recursively | `false` |
| `--yes` | `-y` | Skip confirmation | `false` |
| `--quiet` | `-q` | Quiet mode | `false` |
| `--ci` | | CI mode (sets --yes --quiet) | `false` |
| `--no-verify` | | Skip git hooks | `false` |
| `--ignore-scripts` | | Ignore npm scripts | `false` |
| `--current-version` | | Override current version | |
| `--print-commits` | | Show recent commits | `false` |

## Library Usage

You can also use logsmith programmatically:

```typescript
import { versionBump } from '@stacksjs/logsmith'

await versionBump({
  release: 'patch',
  commit: true,
  tag: true,
  push: true,
  progress: ({ event, newVersion }) => {
    console.log(`${event}: ${newVersion}`)
  }
})
```

## Changelog

Please see our [releases](https://github.com/stackjs/logsmith/releases) page for information on changes.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Community

For help or discussion:

- [Discussions on GitHub](https://github.com/stacksjs/logsmith/discussions)
- [Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Credits

- [`version-bump-prompt`](https://github.com/JS-DevTools/version-bump-prompt) - for the initial inspiration
- [Antony Fu](https://github.com/antfu) - for creating [bumpp](https://github.com/antfu-collective/bumpp)
- [Chris Breuer](https://github.com/chrisbbreuer)
- [All Contributors](https://github.com/stacksjs/logsmith/graphs/contributors)

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@stacksjs/logsmith?style=flat-square
[npm-version-href]: https://npmjs.com/package/@stacksjs/logsmith
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/logsmith/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/logsmith/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/logsmith/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/logsmith -->
