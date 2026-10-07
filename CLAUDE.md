# Claude Code Guidelines

## About

Logsmith is an automatic changelog generator that parses conventional commits and produces beautifully formatted output in Markdown, JSON, or HTML. It supports configurable commit type grouping with emojis, author filtering, breaking change detection, repository statistics with trend analysis, and a GitHub Action for CI integration. Available as both a CLI (`logsmith`) and a library (`generateChangelog()`).

## Linting

- Use **pickier** for linting — never use eslint directly
- Run `bunx --bun pickier .` to lint, `bunx --bun pickier . --fix` to auto-fix
- When fixing unused variable warnings, prefer `// eslint-disable-next-line` comments over prefixing with `_`

## Frontend

- Use **stx** for templating — never write vanilla JS (`var`, `document.*`, `window.*`) in stx templates
- Use **crosswind** as the default CSS framework which enables standard Tailwind-like utility classes
- stx `<script>` tags should only contain stx-compatible code (signals, composables, directives)

## Dependencies

- **buddy-bot** handles dependency updates — not renovatebot
- **better-dx** provides shared dev tooling as peer dependencies — do not install its peers (e.g., `typescript`, `pickier`, `bun-plugin-dtsx`) separately if `better-dx` is already in `package.json`
- If `better-dx` is in `package.json`, ensure `bunfig.toml` includes `linker = "hoisted"`

## Releases

- Release with `bun run release:patch` (or `bun run release`), which runs **@stacksjs/bumpx** with `--no-changelog` and then `scripts/post-release.ts`
- The changelog and the GitHub release notes are written by that script, not by bumpx — bumpx bundles an older logsmith whose `generateChangelog()` crashed on a partial config
- Run `bun run post-release` on its own to fill in a changelog entry or release notes that are missing; it is idempotent

## Commits

- Use conventional commit messages (e.g., `fix:`, `feat:`, `chore:`)
