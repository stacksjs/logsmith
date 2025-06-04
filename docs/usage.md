# Basic Usage

This guide covers the essential commands and workflows for using logsmith in your daily development.

## Version Bumping

The core functionality of logsmith is version bumping across your project files.

### Simple Version Bumps

Bump the version in your current directory:

```bash
# Patch version bump (1.0.0 → 1.0.1)
logsmith patch

# Minor version bump (1.0.0 → 1.1.0)
logsmith minor

# Major version bump (1.0.0 → 2.0.0)
logsmith major
```

### Prerelease Versions

Create prerelease versions for testing:

```bash
# Create a prerelease version (1.0.0 → 1.0.1-alpha.0)
logsmith prerelease

# Specify custom prerelease identifier
logsmith prerelease --preid beta  # → 1.0.1-beta.0

# Prerelease bumps
logsmith premajor --preid rc      # → 2.0.0-rc.0
logsmith preminor --preid alpha   # → 1.1.0-alpha.0
logsmith prepatch --preid beta    # → 1.0.1-beta.0
```

### Specific Version

Set an exact version:

```bash
# Set specific version
logsmith 2.1.0

# Set prerelease version
logsmith 2.1.0-beta.3
```

### Interactive Mode

Use interactive mode to choose your version:

```bash
# Interactive version selection
logsmith prompt

# Shows recent commits for context
logsmith prompt --commits
```

## File Operations

### Target Specific Files

By default, logsmith looks for `package.json` in your current directory. You can specify different files:

```bash
# Update specific files
logsmith patch --files package.json,package-lock.json

# Update multiple package.json files
logsmith minor --files packages/*/package.json

# Include non-JSON files (searches for version patterns)
logsmith patch --files VERSION.txt,README.md
```

### Recursive Updates

Update all package.json files in subdirectories:

```bash
# Update all package.json files recursively
logsmith patch --recursive

# Show what would be updated without making changes
logsmith patch --recursive --dry-run
```

### Current Version Override

When working with multiple packages that should share the same version:

```bash
# Set a common starting version for all files
logsmith patch --current-version 1.2.3

# Useful for monorepos with synchronized versions
logsmith minor --current-version 2.0.0 --recursive
```

## Git Integration

### Automatic Git Operations

Commit and tag your version bumps automatically:

```bash
# Create git commit with default message
logsmith patch --commit

# Create git commit and tag
logsmith minor --commit --tag

# Create signed commit and tag
logsmith major --commit --tag --sign

# Push to remote after operations
logsmith patch --commit --tag --push
```

### Custom Commit Messages

Customize your commit and tag messages:

```bash
# Custom commit message (use %s for version)
logsmith patch --commit --message "chore: bump version to %s"

# Custom tag message
logsmith minor --commit --tag --tag-message "Release v%s"
```

### Skip Git Checks

Bypass git status checks when needed:

```bash
# Skip git status check (allows dirty working directory)
logsmith patch --commit --no-git-check

# Skip git hooks
logsmith minor --commit --no-verify
```

## Advanced Options

### Progress Tracking

Monitor the bump process in detail:

```bash
# Show detailed progress
logsmith patch --verbose

# Show recent commits for context
logsmith minor --commits

# Combination of both
logsmith major --verbose --commits
```

### Dry Run

Preview changes without making them:

```bash
# See what would be changed
logsmith patch --dry-run

# Dry run with git operations
logsmith minor --dry-run --commit --tag
```

### Post-Bump Scripts

Run custom commands after version bump:

```bash
# Run npm scripts after bump
logsmith patch --commit --execute "bun run build"

# Multiple commands
logsmith minor --execute "bun run build && bun run test"

# Install dependencies after bump
logsmith patch --install
```

## Common Workflows

### Development Release

Quick patch for bug fixes:

```bash
logsmith patch --commit --tag --push
```

### Feature Release

Release with documentation update:

```bash
logsmith minor --commit --tag --execute "bun run build:docs" --push
```

### Major Release

Comprehensive major version release:

```bash
# Interactive selection with full git workflow
logsmith prompt --commits --commit --tag --sign --push --execute "bun run build"
```

### Prerelease Testing

Create prerelease for testing:

```bash
# Alpha release
logsmith prerelease --preid alpha --commit --tag

# Beta release
logsmith prerelease --preid beta --commit --tag --push
```

### Monorepo Management

Update all packages in a monorepo:

```bash
# Synchronized version across all packages
logsmith patch --recursive --current-version 1.0.0 --commit --tag

# Independent versioning
logsmith patch --recursive --commit
```

## Configuration

### Global Configuration

Set default options in your shell profile:

```bash
# Add to ~/.zshrc or ~/.bashrc
alias bump-patch='logsmith patch --commit --tag'
alias bump-minor='logsmith minor --commit --tag --push'
alias bump-major='logsmith major --prompt --commits --commit --tag --push'
```

### Project Configuration

Create a configuration file in your project. logsmith supports multiple formats:

**TypeScript configuration:**
```typescript
// logsmith.config.ts
export default {
  commit: true,
  tag: true,
  push: false,
  sign: true,
  message: 'chore: release v%s',
  tagMessage: 'Release v%s'
}
```

**JavaScript configuration:**
```javascript
// logsmith.config.js
module.exports = {
  commit: true,
  tag: true,
  push: false,
  sign: true,
  message: 'chore: release v%s',
  tagMessage: 'Release v%s'
}
```

**Package.json configuration:**
```json
{
  "name": "my-project",
  "logsmith": {
    "commit": true,
    "tag": true,
    "push": false,
    "sign": true,
    "message": "chore: release v%s",
    "tagMessage": "Release v%s"
  }
}
```

## Error Handling

### Common Issues

**Dirty working directory:**
```bash
# Allow dirty working directory
logsmith patch --no-git-check

# Or commit changes first
git add . && git commit -m "work in progress"
logsmith patch --commit
```

**No package.json found:**
```bash
# Specify files explicitly
logsmith patch --files ./package.json

# Or check current directory
ls -la package.json
```

**Git authentication issues:**
```bash
# Ensure git credentials are set up
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# For signed commits
git config --global user.signingkey YOUR_KEY_ID
```

### Troubleshooting

Enable verbose mode to see detailed operations:

```bash
# Verbose output shows each step
logsmith patch --verbose

# Check git status manually
git status
git log --oneline -5
```

## Next Steps

- [Configuration Guide](./config.md) - Set up default options and aliases
- [Version Bumping Features](./features/version-bumping.md) - Explore semantic versioning capabilities
- [Git Integration](./features/git-integration.md) - Learn about Git workflow automation
- [Monorepo Support](./features/monorepo-support.md) - Manage multiple packages
- [Advanced Usage](./advanced/cross-platform.md) - Cross-platform considerations
