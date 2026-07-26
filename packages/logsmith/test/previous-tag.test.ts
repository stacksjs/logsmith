import { describe, expect, it } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { getCommits, getPreviousTag } from '../src/utils'

/**
 * Build a repo shaped like a real release history: a commit, a release tag,
 * more commits, another release tag.
 */
function makeRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'logsmith-previous-tag-'))

  execFileSync('git', ['init'], { cwd: dir })
  execFileSync('git', ['config', 'user.name', 'Test'], { cwd: dir })
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: dir })

  const commit = (message: string, content: string) => {
    writeFileSync(join(dir, 'file.txt'), content)
    execFileSync('git', ['add', 'file.txt'], { cwd: dir })
    execFileSync('git', ['commit', '-m', message], { cwd: dir })
  }

  commit('feat: first feature', 'one\n')
  execFileSync('git', ['tag', 'v1.0.0'], { cwd: dir })

  commit('fix: a bug', 'two\n')
  commit('fix: another bug', 'three\n')
  execFileSync('git', ['tag', 'v1.0.1'], { cwd: dir })

  return dir
}

describe('getPreviousTag', () => {
  it('steps back a tag when the target ref is itself tagged', () => {
    const dir = makeRepo()

    try {
      // This is the release-CI case: the workflow checks out the tag it is
      // releasing, so the nearest tag to the target IS the target.
      expect(getPreviousTag('v1.0.1', dir)).toBe('v1.0.0')
    }
    finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('yields a non-empty commit range for the tag being released', () => {
    const dir = makeRepo()

    try {
      const from = getPreviousTag('v1.0.1', dir)
      const commits = getCommits(from, 'v1.0.1', dir)

      // Previously `from` resolved to v1.0.1 itself, making this range empty
      // and producing no release notes at all.
      expect(commits).toHaveLength(2)
      expect(commits.map(c => c.description)).toEqual(['another bug', 'a bug'])
    }
    finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('returns undefined on the first release so the whole history is walked', () => {
    const dir = makeRepo()

    try {
      expect(getPreviousTag('v1.0.0', dir)).toBeUndefined()
      expect(getCommits(undefined, 'v1.0.0', dir)).toHaveLength(1)
    }
    finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('keeps the nearest tag when the target ref is not itself tagged', () => {
    const dir = makeRepo()

    try {
      writeFileSync(join(dir, 'file.txt'), 'four\n')
      execFileSync('git', ['add', 'file.txt'], { cwd: dir })
      execFileSync('git', ['commit', '-m', 'chore: post-release work'], { cwd: dir })

      // HEAD has moved past v1.0.1, so v1.0.1 is the correct starting point
      // and must not be stepped over.
      expect(getPreviousTag('HEAD', dir)).toBe('v1.0.1')
      expect(getCommits(getPreviousTag('HEAD', dir), 'HEAD', dir)).toHaveLength(1)
    }
    finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('walks the full history when earlier tags were never fetched', () => {
    // The release-CI shape: the checkout leaves only the tag being released
    // reachable, so `git describe --tags --abbrev=0 <tag>^` finds nothing.
    // Resolving to the tag at HEAD here produced an empty range and no notes
    // at all -- undefined is what lets the whole history be walked instead.
    const dir = mkdtempSync(join(tmpdir(), 'logsmith-single-tag-'))

    try {
      execFileSync('git', ['init'], { cwd: dir })
      execFileSync('git', ['config', 'user.name', 'Test'], { cwd: dir })
      execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: dir })

      for (const n of ['one', 'two', 'three']) {
        writeFileSync(join(dir, 'file.txt'), `${n}\n`)
        execFileSync('git', ['add', 'file.txt'], { cwd: dir })
        execFileSync('git', ['commit', '-m', `fix: change ${n}`], { cwd: dir })
      }

      // Only the released tag exists — no earlier tag to step back to.
      execFileSync('git', ['tag', 'v1.0.1'], { cwd: dir })

      expect(getPreviousTag('v1.0.1', dir)).toBeUndefined()
      expect(getCommits(getPreviousTag('v1.0.1', dir), 'v1.0.1', dir)).toHaveLength(3)
    }
    finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('returns undefined in a repository with no tags', () => {
    const dir = mkdtempSync(join(tmpdir(), 'logsmith-no-tags-'))

    try {
      execFileSync('git', ['init'], { cwd: dir })
      execFileSync('git', ['config', 'user.name', 'Test'], { cwd: dir })
      execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: dir })
      writeFileSync(join(dir, 'file.txt'), 'one\n')
      execFileSync('git', ['add', 'file.txt'], { cwd: dir })
      execFileSync('git', ['commit', '-m', 'feat: initial'], { cwd: dir })

      expect(getPreviousTag('HEAD', dir)).toBeUndefined()
    }
    finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
