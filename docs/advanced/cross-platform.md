# Cross-platform Compatibility

Logsmith is designed to work seamlessly across all major platforms while maintaining consistent behavior and output. This guide covers platform-specific considerations and troubleshooting.

## Platform Support

### Supported Platforms

Logsmith runs on all platforms where Bun is available:

- **macOS** (Intel and Apple Silicon)
- **Linux** (x64, arm64)
- **Windows** (x64, via WSL2 recommended)

### Runtime Requirements

- **Bun 1.2+** (primary runtime)
- **Git** (for repository operations)
- **Node.js** (support coming soon)

## Installation by Platform

### macOS

::: code-group

```bash [Homebrew]
# Install Bun via Homebrew
brew install oven-sh/bun/bun

# Install logsmith
bun add -g logsmith
```

```bash [Direct Install]
# Install Bun directly
curl -fsSL https://bun.sh/install | bash

# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Install logsmith
bun add -g logsmith
```

:::

### Linux

::: code-group

```bash [Ubuntu/Debian]
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Add to PATH (add to ~/.bashrc for persistence)
export PATH="$HOME/.bun/bin:$PATH"

# Install logsmith
bun add -g logsmith
```

```bash [CentOS/RHEL]
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Add to PATH
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Install logsmith
bun add -g logsmith
```

```bash [Alpine Linux]
# Install dependencies first
apk add --no-cache curl bash

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install logsmith
export PATH="$HOME/.bun/bin:$PATH"
bun add -g logsmith
```

:::

### Windows

::: code-group

```powershell [WSL2 (Recommended)]
# Install WSL2 and Ubuntu
wsl --install

# Inside WSL2
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
bun add -g logsmith
```

```powershell [PowerShell]
# Install Bun (requires PowerShell 7+)
irm bun.sh/install.ps1 | iex

# Install logsmith
bun add -g logsmith
```

:::

## Path and Environment Configuration

### macOS/Linux PATH Setup

```bash
# Add to ~/.bashrc, ~/.zshrc, or ~/.profile
export PATH="$HOME/.bun/bin:$PATH"

# Verify installation
which logsmith
logsmith --version
```

### Windows Environment Variables

```powershell
# Add Bun to PATH (PowerShell)
$env:PATH += ";$env:USERPROFILE\.bun\bin"

# Verify
where.exe logsmith
logsmith --version
```

## Platform-Specific Considerations

### File Paths

Logsmith handles cross-platform file paths automatically:

```typescript
import path from 'node:path'
// logsmith.config.ts
import { defineConfig } from 'logsmith'

export default defineConfig({
  // Use path.join for cross-platform paths
  output: path.join('docs', 'CHANGELOG.md'),
  dir: process.cwd(),
})
```

### Line Endings

Logsmith respects Git's line ending configuration:

```bash
# Configure Git line endings (recommended)
git config --global core.autocrlf input    # macOS/Linux
git config --global core.autocrlf true     # Windows
```

### Character Encoding

Logsmith uses UTF-8 encoding by default:

```typescript
// Ensure UTF-8 output
export default defineConfig({
  // All outputs are UTF-8 encoded
  output: 'CHANGELOG.md',
  format: 'markdown',
})
```

## Troubleshooting

### Common Issues

#### Command Not Found

**Problem:** `logsmith: command not found`

**Solutions:**

::: code-group

```bash [macOS/Linux]
# Check if Bun is installed
which bun

# If not installed
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Reinstall logsmith
bun add -g logsmith

# Check PATH
echo $PATH | grep -o "$HOME/.bun/bin"
```

```powershell [Windows]
# Check if Bun is installed
where.exe bun

# If not found, reinstall
irm bun.sh/install.ps1 | iex

# Reinstall logsmith
bun add -g logsmith
```

:::

#### Permission Errors

**Problem:** Permission denied during installation

**Solutions:**

```bash
# macOS/Linux: Don't use sudo with Bun
# Instead, use user installation
curl -fsSL https://bun.sh/install | bash

# If you need system-wide installation
# Use a Node version manager instead
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

#### Git Not Found

**Problem:** `git: command not found`

**Solutions:**

::: code-group

```bash [macOS]
# Install via Xcode Command Line Tools
xcode-select --install

# Or via Homebrew
brew install git
```

```bash [Linux]
# Ubuntu/Debian
sudo apt update && sudo apt install git

# CentOS/RHEL
sudo yum install git
# or
sudo dnf install git

# Alpine
apk add --no-cache git
```

```powershell [Windows]
# Download from https://git-scm.com/download/win
# Or via Chocolatey
choco install git

# Or via Scoop
scoop install git
```

:::

#### Emoji Display Issues

**Problem:** Emojis not displaying correctly

**Solutions:**

```bash
# Check terminal emoji support
echo "🚀 🐛 📚"

# Use unicode theme for better compatibility
logsmith --theme unicode --output CHANGELOG.md

# Or use corporate theme (no emojis)
logsmith --theme corporate --output CHANGELOG.md
```

#### Performance Issues

**Problem:** Slow changelog generation

**Solutions:**

```bash
# Limit commit range
logsmith --from "3 months ago" --to HEAD

# Exclude unnecessary authors
logsmith --exclude-authors "dependabot[bot],renovate[bot]"

# Use minimal verbosity
logsmith --output CHANGELOG.md  # No --verbose flag
```

### Platform-Specific Troubleshooting

#### macOS Issues

**Gatekeeper blocking execution:**
```bash
# If macOS blocks Bun execution
xattr -d com.apple.quarantine ~/.bun/bin/bun

# Or reinstall Bun
curl -fsSL https://bun.sh/install | bash
```

**Apple Silicon compatibility:**
```bash
# Verify architecture
uname -m  # Should show arm64

# Bun automatically uses correct architecture
bun --version
```

#### Linux Issues

**Missing dependencies:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install curl unzip

# CentOS/RHEL
sudo yum install curl unzip
```

**Old Git version:**
```bash
# Check Git version
git --version

# Update if needed (Ubuntu)
sudo add-apt-repository ppa:git-core/ppa
sudo apt update
sudo apt install git
```

#### Windows Issues

**PowerShell execution policy:**
```powershell
# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Verify
Get-ExecutionPolicy -List
```

**WSL2 integration:**
```bash
# Inside WSL2, ensure Git is configured
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Windows Git vs WSL Git can cause issues
# Use WSL Git for WSL repositories
which git  # Should show /usr/bin/git in WSL
```

## Docker Support

### Official Docker Image

```dockerfile
FROM oven/bun:1.2.0-alpine

WORKDIR /app

# Install logsmith
RUN bun add -g logsmith

# Copy repository
COPY . .

# Generate changelog
CMD ["logsmith", "--output", "CHANGELOG.md"]
```

### Multi-platform Build

```bash
# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t your-org/logsmith:latest \
  --push .
```

## CI/CD Platform Compatibility

### GitHub Actions

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, macos-latest, windows-latest]

runs-on: ${{ matrix.os }}

steps:
  - uses: actions/checkout@v4
    with:
      fetch-depth: 0

  - uses: oven-sh/setup-bun@v1

  - name: Install logsmith
    run: bun add -g logsmith

  - name: Generate changelog
    run: logsmith --output CHANGELOG.md
```

### GitLab CI

```yaml
.logsmith_template: &logsmith
  image: oven/bun:1.2.0
  before_script:
    - bun add -g logsmith
  script:
    - logsmith --output CHANGELOG.md

linux:
  <<: *logsmith
  tags: [linux]

macos:
  <<: *logsmith
  tags: [macos]
```

## Best Practices

### Cross-platform Configuration

```typescript
import os from 'node:os'
import path from 'node:path'
// logsmith.config.ts
import { defineConfig } from 'logsmith'

export default defineConfig({
  // Use platform-appropriate settings
  theme: os.platform() === 'win32' ? 'unicode' : 'default',

  // Cross-platform file paths
  output: path.join('docs', 'CHANGELOG.md'),

  // Platform-specific excludes
  excludeAuthors: [
    'dependabot[bot]',
    'renovate[bot]',
    ...(os.platform() === 'win32' ? ['windows-build-bot'] : [])
  ],
})
```

### Environment Detection

```typescript
import os from 'node:os'
// scripts/generate-changelog.ts
import { generateChangelog } from 'logsmith'

const isWindows = os.platform() === 'win32'
const isMacOS = os.platform() === 'darwin'
const isLinux = os.platform() === 'linux'

await generateChangelog({
  theme: isWindows ? 'unicode' : 'github',
  verbose: process.env.CI !== 'true',
  output: 'CHANGELOG.md',
})
```

### Testing Across Platforms

```bash
#!/bin/bash
# scripts/test-platforms.sh

platforms=("ubuntu-latest" "macos-latest" "windows-latest")

for platform in "${platforms[@]}"; do
    echo "Testing on $platform..."

    # Use GitHub Actions or similar to test
    gh workflow run test.yml --ref main -f platform="$platform"
done
```

## Migration and Compatibility

### From Other Tools

When migrating from other changelog tools:

```bash
# Backup existing changelog
cp CHANGELOG.md CHANGELOG.md.backup

# Generate new changelog
logsmith --output CHANGELOG.md

# Compare and merge if needed
diff CHANGELOG.md.backup CHANGELOG.md
```

### Version Compatibility

```json
{
  "engines": {
    "bun": ">=1.2.0"
  },
  "devDependencies": {
    "logsmith": "^1.0.0"
  }
}
```

## Getting Help

### Diagnostic Information

```bash
# Gather system information for support
echo "System Information:"
echo "=================="
echo "OS: $(uname -a)"
echo "Bun: $(bun --version)"
echo "Git: $(git --version)"
echo "Node: $(node --version 2>/dev/null || echo 'Not installed')"
echo "logsmith: $(logsmith --version)"
echo ""
echo "Environment:"
echo "============"
echo "PATH: $PATH"
echo "PWD: $(pwd)"
echo "Git repo: $(git rev-parse --is-inside-work-tree 2>/dev/null || echo 'false')"
```

### Support Channels

1. **GitHub Issues**: [stacksjs/logsmith/issues](https://github.com/stacksjs/logsmith/issues)
2. **Discord**: [Join Stacks Discord](https://discord.gg/stacksjs)
3. **Discussions**: [GitHub Discussions](https://github.com/stacksjs/logsmith/discussions)

## Next Steps

- [Learn about automation](/advanced/automation) for CI/CD integration
- [Explore theming options](/features/theming) for platform-specific styling
- [Check configuration options](/config) for environment-specific settings
- [Review the API reference](/api/reference) for programmatic usage
