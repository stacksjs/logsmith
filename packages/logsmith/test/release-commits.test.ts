import type { CommitInfo } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { groupCommits, isReleaseCommit } from '../src/utils'

function commit(message: string, hash: string): CommitInfo {
  const match = /^(\w+)(?:\(([^)]*)\))?!?:\s*(.*)$/.exec(message)
  return {
    hash,
    message,
    author: { name: 'Ada', email: 'ada@example.com' },
    date: '2026-01-01',
    type: match?.[1],
    scope: match?.[2],
    description: match?.[3] || message,
  } as CommitInfo
}

describe('release commits', () => {
  it('recognises the commits that only mark a release', () => {
    for (const subject of [
      'chore: release v0.2.33',
      'chore(release): v1.0.0-build.19',
      'chore(release): 2.0.0',
      'chore: changelog for v0.2.14',
      'chore: bump version to 1.4.0',
      'release: v3.1.0-beta.2',
      'v1.2.3',
      'Release 1.2.3',
      'chore: release v0.2.33\n\nbody text',
    ]) expect(isReleaseCommit(subject)).toBe(true)
  })

  it('keeps changes that merely mention a version', () => {
    for (const subject of [
      'fix: support 1.2.3 lockfiles',
      'fix(release): let bumpx make the release',
      'feat: release notes in two languages',
      'chore: update bun to 1.4.4 on CI',
      'chore(release): keep email addresses out of v1.0.0 notes',
      'fix(training): pin HQ platform kit 1.0.4135 for a running-only home',
    ]) expect(isReleaseCommit(subject)).toBe(false)
  })

  it('leaves a release out of its own changelog by default', () => {
    const commits = [commit('chore(release): v1.0.0-build.20', 'aaa1111'), commit('fix: steadier sign-in', 'bbb2222'), commit('chore: tidy scripts', 'ccc3333')]
    const hashes = groupCommits(commits, defaultConfig).flatMap(section => section.commits.map(entry => entry.hash))
    expect(hashes).toContain('bbb2222')
    expect(hashes).toContain('ccc3333')
    expect(hashes).not.toContain('aaa1111')
  })

  it('filters it for a caller that passes a partial config, and lists it when asked to', () => {
    const commits = [commit('chore: release v2.0.0', 'aaa1111'), commit('fix: steadier sign-in', 'bbb2222')]
    const { excludeReleaseCommits: _unset, ...partial } = defaultConfig
    const filtered = groupCommits(commits, partial as typeof defaultConfig).flatMap(section => section.commits.map(entry => entry.hash))
    expect(filtered).toEqual(['bbb2222'])
    const listed = groupCommits(commits, { ...defaultConfig, excludeReleaseCommits: false }).flatMap(section => section.commits.map(entry => entry.hash))
    expect(listed).toContain('aaa1111')
  })
})
