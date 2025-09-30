import type { CommitInfo, LogsmithConfig } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { groupCommits } from '../src/utils'

describe('Commit Filtering', () => {
  const mockCommits: CommitInfo[] = [
    {
      hash: 'abc123',
      message: 'feat: add new feature',
      author: { name: 'John Doe', email: 'john@example.com' },
      date: '2024-01-01',
      type: 'feat',
      description: 'add new feature',
    },
    {
      hash: 'def456',
      message: 'fix: resolve bug',
      author: { name: 'Jane Smith', email: 'jane@example.com' },
      date: '2024-01-02',
      type: 'fix',
      description: 'resolve bug',
    },
    {
      hash: 'ghi789',
      message: 'chore: update dependencies',
      author: { name: 'Bob Wilson', email: 'bob@example.com' },
      date: '2024-01-03',
      type: 'chore',
      description: 'update dependencies',
    },
    {
      hash: 'jkl012',
      message: 'chore: wip',
      author: { name: 'Alice Brown', email: 'alice@example.com' },
      date: '2024-01-04',
      type: 'chore',
      description: 'wip',
    },
    {
      hash: 'mno345',
      message: 'docs: update readme',
      author: { name: 'Charlie Davis', email: 'charlie@example.com' },
      date: '2024-01-05',
      type: 'docs',
      description: 'update readme',
    },
  ]

  it('should include all commit types by default', () => {
    const config: LogsmithConfig = {
      ...defaultConfig,
      excludeCommitTypes: [],
      includeCommitTypes: [],
    }

    const sections = groupCommits(mockCommits, config)

    // Should have sections for feat, fix, chore, and docs
    expect(sections.length).toBeGreaterThanOrEqual(4)

    const choreSection = sections.find(s => s.title.includes('Chores'))
    expect(choreSection).toBeDefined()
    expect(choreSection?.commits.length).toBe(2) // Both chore commits including 'wip'

    const wipCommit = choreSection?.commits.find(c => c.description === 'wip')
    expect(wipCommit).toBeDefined()
    expect(wipCommit?.type).toBe('chore')
  })

  it('should not exclude wip commits by default', () => {
    const config: LogsmithConfig = {
      ...defaultConfig,
      excludeCommitTypes: [],
      includeCommitTypes: [],
      excludeMessages: [], // Explicitly empty
    }

    const sections = groupCommits(mockCommits, config)

    const choreSection = sections.find(s => s.title.includes('Chores'))
    expect(choreSection).toBeDefined()

    const wipCommit = choreSection?.commits.find(c => c.description === 'wip')
    expect(wipCommit).toBeDefined()
    expect(wipCommit?.hash).toBe('jkl012')
  })
})
