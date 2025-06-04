# Installation

Installing `logsmith` is simple and straightforward. Choose your preferred package manager to get started with the modern version bumping tool.

## Package Managers

Choose your preferred package manager:

::: code-group

```sh [npm]
# Install globally
npm install -g logsmith

# Or install as a development dependency
npm install --save-dev logsmith
```

```sh [bun]
# Install globally
bun add -g logsmith

# Or install as a development dependency
bun add -d logsmith
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

After installation, you can immediately start using logsmith:

```sh
# Check current version
logsmith --version

# Basic version bump
logsmith patch

# Version bump with git commit
logsmith minor --commit --tag

# Interactive version selection
logsmith prompt
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

- **Node.js 16+** or **Bun 1.0+**
- **Git** (for version control operations)
- A project with a `package.json` file (or other version files)

## Verification

Verify your installation:

```sh
# Check logsmith version
logsmith --version

# Test with dry run
logsmith patch --dry-run

# Check help
logsmith --help
```

## Global vs Local Installation

### Global Installation (Recommended)

Install globally to use logsmith across all your projects:

```sh
npm install -g logsmith
```

Benefits:
- Available in any project directory
- Single installation for all projects
- Easy to update

### Local Installation (Per Project)

Install as a development dependency for project-specific usage:

```sh
npm install --save-dev logsmith
```

Then use with npx or add to package.json scripts:

```sh
# Using npx
npx logsmith patch

# Or add to package.json scripts
{
  "scripts": {
    "release": "logsmith patch --commit --tag --push"
  }
}
```

## Platform Support

logsmith works on all major platforms:

- **macOS** (Intel and Apple Silicon)
- **Linux** (Ubuntu, CentOS, Alpine, etc.)
- **Windows** (Windows 10/11, WSL)

## Updating

Keep logsmith up to date:

```sh
# Update global installation
npm update -g logsmith

# Update local installation
npm update logsmith
```

## Uninstalling

Remove logsmith when no longer needed:

```sh
# Remove global installation
npm uninstall -g logsmith

# Remove local installation
npm uninstall logsmith
```

## Troubleshooting

### Common Issues

**Command not found:**
```sh
# Check if globally installed packages are in PATH
echo $PATH | grep npm

# Reinstall globally
npm install -g logsmith
```

**Permission errors (macOS/Linux):**
```sh
# Use a Node version manager (recommended)
# Or configure npm to use a different directory
npm config set prefix ~/.local
export PATH=~/.local/bin:$PATH
```

**Git not found:**
```sh
# Install Git
# macOS: xcode-select --install
# Ubuntu: sudo apt install git
# Windows: https://git-scm.com/download/win
```

### Getting Help

If you encounter issues:

1. Check the [troubleshooting guide](/advanced/cross-platform)
2. Search [existing issues](https://github.com/stacksjs/logsmith/issues)
3. Create a [new issue](https://github.com/stacksjs/logsmith/issues/new)
4. Join our [Discord community](https://discord.gg/stacksjs)

## Next Steps

After installation, you might want to:

- [Configure logsmith](/config) to customize your setup
- [Learn about basic usage](/usage) to start version bumping
- [Explore Git integration](/features/git-integration) for automated workflows
- [Set up monorepo support](/features/monorepo-support) for multi-package projects
