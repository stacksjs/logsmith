import { describe, expect, it } from 'bun:test'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { parseReferences } from '../src/utils'

const CLI = resolve(import.meta.dir, '../bin/cli.ts')

function git(cwd: string, ...args: string[]): void {
  const result = Bun.spawnSync(['git', ...args], { cwd, env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } })
  if (result.exitCode !== 0)
    throw new Error(result.stderr.toString())
}

// craft-native/craft#283: --no-output promises console only, but the parser
// reports it as output === false, which the CLI read as "no output given" and
// prepended the changelog to CHANGELOG.md during a release audit.
describe('--no-output', () => {
  it('prints the changelog and writes no file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'logsmith-no-output-'))
    try {
      git(dir, 'init', '-q')
      git(dir, 'commit', '-q', '--allow-empty', '-m', 'chore: start')
      git(dir, 'tag', 'v0.0.1')
      git(dir, 'commit', '-q', '--allow-empty', '-m', 'feat: add a thing')

      const run = Bun.spawnSync(['bun', CLI, '--from', 'v0.0.1', '--to', 'HEAD', '--no-output'], { cwd: dir })

      expect(existsSync(join(dir, 'CHANGELOG.md'))).toBe(false)
      expect(run.stdout.toString()).toContain('add a thing')
    }
    finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})

describe('parseReferences', () => {
  it('lists an issue named in both subject and body once', () => {
    expect(parseReferences('refactor: tidy (#211)\n\nRefs #211')).toEqual([{ type: 'issue', id: '211' }])
  })
})
