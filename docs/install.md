# Installation

Installing `logsmith` is simple and straightforward. Choose your preferred package manager to get started with the modern changelog generation tool.

## Package Managers

Choose your preferred package manager:

::: code-group

```sh [bun]
# Install globally (recommended)
bun add -g logsmith

# Or install as a development dependency
bun add -d logsmith
```

```sh [npm]
# Install globally
npm install -g logsmith

# Or install as a development dependency
npm install --save-dev logsmith
```

```sh [pnpm]
# Install globally
pnpm add -g logsmith

# Or install as a development dependency
pnpm add -D logsmith
```

```sh [yarn]
# Install globally
yarn global add logsmith

# Or install as a development dependency
yarn add -D logsmith
```

:::

## Quick Start

After installation, you can immediately start generating changelogs:

```sh
# Check current version
logsmith --version

# Generate a changelog and display in console
logsmith

# Generate and save to CHANGELOG.md
logsmith --output CHANGELOG.md

# Generate with a specific theme
logsmith --theme github --output CHANGELOG.md

# View repository statistics
logsmith stats

# List available themes
logsmith themes
```

## From Source

To build and install from source:

```sh
# Clone the repository
git clone https://github.com/stacksjs/logsmith.git
cd logsmith

# Install dependencies
bun install

# Build the project
bun run build

# Link for global usage
bun link
```

## System Requirements

logsmith requires:

- **Bun 1.2+** _(primary runtime - Node.js support coming soon)_
- **Git** _(for repository analysis and commit parsing)_
- A Git repository with conventional commits for best results

## Verification

Verify your installation:

```sh
# Check logsmith version
logsmith --version

# Test changelog generation (dry run to console)
logsmith --no-output

# Test with verbose logging
logsmith --verbose --no-output

# View help
logsmith --help
```

## Platform Support

logsmith works on all major platforms:

- **macOS** _(Intel and Apple Silicon)_
- **Linux** _(Ubuntu, CentOS, Alpine, etc.)_
- **Windows** _(Windows 10/11, WSL)_

## Updating

Keep logsmith up to date:

```sh
# Update global installation
bun update -g logsmith

# Update local installation
bun update logsmith
```

## Uninstalling

Remove logsmith when no longer needed:

```sh
# Remove global installation
bun remove -g logsmith

# Remove local installation
bun remove logsmith
```

## Troubleshooting

### Common Issues

**Command not found:**
```sh
# Check if globally installed packages are in PATH
echo $PATH | grep bun

# Reinstall globally
bun add -g logsmith
```

**Permission errors (macOS/Linux):**
```sh
# Install bun properly with install script
curl -fsSL https://bun.sh/install | bash

# Or use package manager that doesn't require sudo
```

**Git not found:**
```sh
# Install Git
# macOS: xcode-select --install
# Ubuntu: sudo apt install git
# Windows: https://git-scm.com/download/win
```

**No conventional commits found:**
```sh
# Logsmith works best with conventional commits
# Example conventional commit:
git commit -m "feat: add new feature for user authentication"

# Learn more about conventional commits:
# https://www.conventionalcommits.org/
```

### Getting Help

If you encounter issues:

1. Check the [troubleshooting guide](/advanced/cross-platform)
2. Search [existing issues](https://github.com/stacksjs/logsmith/issues)
3. Create a [new issue](https://github.com/stacksjs/logsmith/issues/new)
4. Join our [Discord community](https://discord.gg/stacksjs)

## Next Steps

After installation, you might want to:

- [Configure logsmith](/config) to customize changelog generation
- [Learn about basic usage](/usage) to start creating changelogs
- [Explore theming options](/features/theming) for custom styling
- [Set up repository statistics](/features/repository-insights) for project analytics
