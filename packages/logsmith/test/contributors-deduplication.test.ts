import { describe, expect, it } from 'bun:test'
import { getContributors } from '../src/utils'
import { defaultConfig } from '../src/config'
import type { CommitInfo } from '../src/types'

describe('contributors deduplication', () => {
  it('should deduplicate contributors by name when they have different emails', () => {
    const commits: CommitInfo[] = [
      {
        hash: 'abc123',
        message: 'feat: add feature',
        author: { name: 'John Doe', email: 'john@example.com' },
        date: '2023-01-01',
        type: 'feat',
        scope: undefined,
        description: 'add feature',
        body: '',
        breaking: false,
        references: [],
      },
      {
        hash: 'def456',
        message: 'fix: fix bug',
        author: { name: 'John Doe', email: 'john.doe@company.com' }, // Different email, same name
        date: '2023-01-02',
        type: 'fix',
        scope: undefined,
        description: 'fix bug',
        body: '',
        breaking: false,
        references: [],
      },
      {
        hash: 'ghi789',
        message: 'chore: update deps',
        author: { name: 'Jane Smith', email: 'jane@example.com' },
        date: '2023-01-03',
        type: 'chore',
        scope: undefined,
        description: 'update deps',
        body: '',
        breaking: false,
        references: [],
      },
    ]

    const contributors = getContributors(commits, defaultConfig)

    expect(contributors).toHaveLength(2)
    expect(contributors).toContain('Jane Smith <jane@example.com>')
    expect(contributors).toContain('John Doe <john@example.com>') // Should use first email encountered
    expect(contributors).not.toContain('John Doe <john.doe@company.com>')
  })

  it('should handle case where hideAuthorEmail is true', () => {
    const commits: CommitInfo[] = [
      {
        hash: 'abc123',
        message: 'feat: add feature',
        author: { name: 'John Doe', email: 'john@example.com' },
        date: '2023-01-01',
        type: 'feat',
        scope: undefined,
        description: 'add feature',
        body: '',
        breaking: false,
        references: [],
      },
      {
        hash: 'def456',
        message: 'fix: fix bug',
        author: { name: 'John Doe', email: 'john.doe@company.com' },
        date: '2023-01-02',
        type: 'fix',
        scope: undefined,
        description: 'fix bug',
        body: '',
        breaking: false,
        references: [],
      },
    ]

    const config = { ...defaultConfig, hideAuthorEmail: true }
    const contributors = getContributors(commits, config)

    expect(contributors).toHaveLength(1)
    expect(contributors).toContain('John Doe')
    expect(contributors[0]).not.toContain('@')
  })

  it('should respect excludeAuthors configuration', () => {
    const commits: CommitInfo[] = [
      {
        hash: 'abc123',
        message: 'feat: add feature',
        author: { name: 'John Doe', email: 'john@example.com' },
        date: '2023-01-01',
        type: 'feat',
        scope: undefined,
        description: 'add feature',
        body: '',
        breaking: false,
        references: [],
      },
      {
        hash: 'def456',
        message: 'fix: fix bug',
        author: { name: 'dependabot[bot]', email: 'dependabot@github.com' },
        date: '2023-01-02',
        type: 'fix',
        scope: undefined,
        description: 'fix bug',
        body: '',
        breaking: false,
        references: [],
      },
    ]

    const config = { ...defaultConfig, excludeAuthors: ['dependabot[bot]'] }
    const contributors = getContributors(commits, config)

    expect(contributors).toHaveLength(1)
    expect(contributors).toContain('John Doe <john@example.com>')
    expect(contributors).not.toContain('dependabot[bot]')
  })

  it('should sort contributors alphabetically', () => {
    const commits: CommitInfo[] = [
      {
        hash: 'abc123',
        message: 'feat: add feature',
        author: { name: 'Zoe Wilson', email: 'zoe@example.com' },
        date: '2023-01-01',
        type: 'feat',
        scope: undefined,
        description: 'add feature',
        body: '',
        breaking: false,
        references: [],
      },
      {
        hash: 'def456',
        message: 'fix: fix bug',
        author: { name: 'Alice Brown', email: 'alice@example.com' },
        date: '2023-01-02',
        type: 'fix',
        scope: undefined,
        description: 'fix bug',
        body: '',
        breaking: false,
        references: [],
      },
    ]

    const contributors = getContributors(commits, defaultConfig)

    expect(contributors).toHaveLength(2)
    expect(contributors[0]).toBe('Alice Brown <alice@example.com>')
    expect(contributors[1]).toBe('Zoe Wilson <zoe@example.com>')
  })
})
