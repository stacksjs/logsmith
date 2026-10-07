#!/usr/bin/env bun
/**
 * Write the changelog entry for the release that just happened.
 *
 * bumpx is told `--no-changelog` because the copy of logsmith it bundles is old
 * enough that `generateChangelog()` handed its raw options straight to
 * `groupCommits()` instead of merging the defaults in first. That died on
 * `config.excludeCommitTypes.length`, its fallback shelled out to the unrelated
 * npm `logsmith` package, which has no bin, and v0.2.13 shipped with no entry
 * and empty release notes.
 *
 * This drives ./logsmith rather than calling the library, so a release writes
 * exactly what `bun run changelog:generate` writes — the CLI passes a theme of
 * its own that the library default does not match, and a release is no place to
 * discover that.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const root = resolve(import.meta.dir, '..')
const changelog = resolve(root, 'CHANGELOG.md')
const entryStart = /^\[Compare changes\]/m

function git(...args: string[]): string {
  return execFileSync('git', args, { cwd: root, encoding: 'utf-8' }).trim()
}

function run(command: string, ...args: string[]): void {
  execFileSync(command, args, { cwd: root, encoding: 'utf-8', stdio: 'inherit' })
}

function read(): string {
  return readFileSync(changelog, 'utf-8')
}

/** The newest entry: everything above the compare link of the one before it. */
function newestEntry(text: string): string {
  const rest = text.slice(text.search(entryStart) + 1)
  const next = rest.search(entryStart)
  return (next === -1 ? text : text.slice(0, next + 1)).trim()
}

const { version } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'))
const tag = `v${version}`

// The tag is what the entry is generated against, so a release that never got
// as far as tagging is a bug worth stopping for rather than guessing around.
try {
  git('rev-parse', '--verify', `refs/tags/${tag}`)
}
catch {
  console.error(`✖ No ${tag} tag found — release it first, then run this.`)
  process.exit(1)
}

// Only tracked changes matter: the commit below stages CHANGELOG.md by name, so
// untracked scratch files are none of our business.
const dirty = git('status', '--porcelain', '--untracked-files=no')
if (dirty) {
  console.error('✖ Tracked files have uncommitted changes; commit or stash first.')
  console.error(dirty)
  process.exit(1)
}

// Generating always prepends, so running twice would stack a second copy of the
// same entry. Ask the file first.
if (read().includes(`...${tag})`)) {
  console.error(`✓ CHANGELOG.md already covers ${tag}; leaving it alone.`)
}
else {
  console.error(`📝 Generating the ${tag} changelog entry...`)
  run('./logsmith', '--to', tag, '--output', 'CHANGELOG.md')

  if (!git('status', '--porcelain', '--', 'CHANGELOG.md')) {
    console.error(`! ${tag} produced no changelog entry; nothing to commit.`)
  }
  else {
    run('git', 'add', 'CHANGELOG.md')
    run('git', 'commit', '-m', `chore: changelog for ${tag}`)
    run('git', 'push', 'origin', 'HEAD')
    console.error(`✓ Committed and pushed the ${tag} changelog entry.`)
  }
}

// Release notes are a nicety, so a missing `gh` or an already-written body is
// reported and shrugged off rather than failing the release.
try {
  const body = execFileSync('gh', ['release', 'view', tag, '--json', 'body', '-q', '.body'], {
    cwd: root,
    encoding: 'utf-8',
  })

  if (body.trim()) {
    console.error(`✓ ${tag} already has release notes; leaving them alone.`)
  }
  else {
    execFileSync('gh', ['release', 'edit', tag, '--notes-file', '-'], {
      cwd: root,
      encoding: 'utf-8',
      input: newestEntry(read()),
    })
    console.error(`✓ Filled in the ${tag} release notes.`)
  }
}
catch (error) {
  console.error(`! Could not set the ${tag} release notes: ${error instanceof Error ? error.message : error}`)
  console.error(`  Set them by hand with: gh release edit ${tag} --notes-file CHANGELOG.md`)
}
