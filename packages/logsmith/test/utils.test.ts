import type { CommitInfo, GeneratedChangelog, LogsmithConfig } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import {
  analyzeCommits,
  colors,
  generateFormattedChangelog,
  getContributors,
  groupCommits,
  parseCommit,
  parseReferences,
  symbols,
} from '../src/utils'

describe('utils', () => {
  describe('parseCommit', () => {
    it('should parse conventional commit format', () => {
      const rawCommit = {
        hash: 'abcd1234567890',
        message: 'feat(api): add user authentication',
        author: { name: 'John Doe', email: 'john@example.com' },
        date: '2024-01-01T10:00:00Z',
        body: 'This adds JWT-based authentication',
      }

      const result = parseCommit(rawCommit)

      expect(result.hash).toBe('abcd123') // short hash
      expect(result.type).toBe('feat')
      expect(result.scope).toBe('api')
      expect(result.description).toBe('add user authentication')
      expect(result.author.name).toBe('John Doe')
      expect(result.author.email).toBe('john@example.com')
      expect(result.breaking).toBe(false)
    })

    it('should parse commit without scope', () => {
      const rawCommit = {
        hash: 'abcd1234567890',
        message: 'fix: resolve memory leak',
        author: { name: 'Jane Doe', email: 'jane@example.com' },
        date: '2024-01-01T10:00:00Z',
      }

      const result = parseCommit(rawCommit)

      expect(result.type).toBe('fix')
      expect(result.scope).toBeUndefined()
      expect(result.description).toBe('resolve memory leak')
    })

    it('should detect breaking changes', () => {
      const rawCommit = {
        hash: 'abcd1234567890',
        message: 'feat!: remove deprecated API',
        author: { name: 'John Doe', email: 'john@example.com' },
        date: '2024-01-01T10:00:00Z',
        body: 'BREAKING CHANGE: The old API is no longer supported',
      }

      const result = parseCommit(rawCommit)

      expect(result.breaking).toBe(true)
    })

    it('should handle non-conventional commits', () => {
      const rawCommit = {
        hash: 'abcd1234567890',
        message: 'Update README',
        author: { name: 'John Doe', email: 'john@example.com' },
        date: '2024-01-01T10:00:00Z',
      }

      const result = parseCommit(rawCommit)

      expect(result.type).toBe('misc')
      expect(result.description).toBe('Update README')
      expect(result.scope).toBeUndefined()
    })

    it('should parse references from commit message', () => {
      const rawCommit = {
        hash: 'abcd1234567890',
        message: 'fix: resolve issue fixes #123',
        author: { name: 'John Doe', email: 'john@example.com' },
        date: '2024-01-01T10:00:00Z',
        body: 'This also closes #456',
      }

      const result = parseCommit(rawCommit)

      expect(result.references).toBeDefined()
      expect(result.references).toHaveLength(2)
      expect(result.references?.[0]).toEqual({ type: 'issue', id: '123' })
      expect(result.references?.[1]).toEqual({ type: 'issue', id: '456' })
    })
  })

  describe('parseReferences', () => {
    it('should parse issue references', () => {
      const text = 'fixes #123 and resolves #456'
      const references = parseReferences(text)

      expect(references).toHaveLength(2)
      expect(references[0]).toEqual({ type: 'issue', id: '123' })
      expect(references[1]).toEqual({ type: 'issue', id: '456' })
    })

    it('should parse simple hash references', () => {
      const text = 'See #789 for details'
      const references = parseReferences(text)

      expect(references).toHaveLength(1)
      expect(references[0]).toEqual({ type: 'issue', id: '789' })
    })

    it('should handle text without references', () => {
      const text = 'Just a normal commit message'
      const references = parseReferences(text)

      expect(references).toHaveLength(0)
    })

    it('should parse multiple reference types', () => {
      const text = 'fixes #123, closes #456, refs #789'
      const references = parseReferences(text)

      expect(references).toHaveLength(3)
      expect(references.every(ref => ref.type === 'issue')).toBe(true)
    })
  })

  describe('groupCommits', () => {
    const mockCommits: CommitInfo[] = [
      {
        hash: 'abc123',
        message: 'feat: add new feature',
        author: { name: 'John', email: 'john@example.com' },
        date: '2024-01-01',
        type: 'feat',
        description: 'add new feature',
      },
      {
        hash: 'def456',
        message: 'fix: resolve bug',
        author: { name: 'Jane', email: 'jane@example.com' },
        date: '2024-01-01',
        type: 'fix',
        description: 'resolve bug',
      },
      {
        hash: 'ghi789',
        message: 'feat: another feature',
        author: { name: 'Bob', email: 'bob@example.com' },
        date: '2024-01-01',
        type: 'feat',
        description: 'another feature',
      },
    ]

    it('should group commits by type', () => {
      const config = { ...defaultConfig }
      const sections = groupCommits(mockCommits, config)

      expect(sections).toHaveLength(2) // feat and fix sections

      const featSection = sections.find(s => s.title.includes('Features'))
      const fixSection = sections.find(s => s.title.includes('Bug Fixes'))

      expect(featSection).toBeDefined()
      expect(featSection?.commits).toHaveLength(2)
      expect(fixSection).toBeDefined()
      expect(fixSection?.commits).toHaveLength(1)
    })

    it('should respect minCommitsForSection config', () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        minCommitsForSection: 2,
      }
      const sections = groupCommits(mockCommits, config)

      // Only feat section should appear (2 commits), fix section should be excluded (1 commit)
      expect(sections).toHaveLength(1)
      expect(sections[0].title).toContain('Features')
    })

    it('should respect maxCommitsPerSection config', () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        maxCommitsPerSection: 1,
      }
      const sections = groupCommits(mockCommits, config)

      const featSection = sections.find(s => s.title.includes('Features'))
      expect(featSection?.commits).toHaveLength(1) // limited to 1
    })

    it('should exclude commit types when configured', () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        excludeCommitTypes: ['fix'],
      }
      const sections = groupCommits(mockCommits, config)

      expect(sections).toHaveLength(1)
      expect(sections[0].title).toContain('Features')
    })

    it('should include only specified commit types when configured', () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        includeCommitTypes: ['fix'],
      }
      const sections = groupCommits(mockCommits, config)

      expect(sections).toHaveLength(1)
      expect(sections[0].title).toContain('Bug Fixes')
    })
  })

  describe('getContributors', () => {
    const mockCommits: CommitInfo[] = [
      {
        hash: 'abc123',
        message: 'feat: add feature',
        author: { name: 'John Doe', email: 'john@example.com' },
        date: '2024-01-01',
        type: 'feat',
        description: 'add feature',
      },
      {
        hash: 'def456',
        message: 'fix: resolve bug',
        author: { name: 'Jane Smith', email: 'jane@example.com' },
        date: '2024-01-01',
        type: 'fix',
        description: 'resolve bug',
      },
      {
        hash: 'ghi789',
        message: 'docs: update readme',
        author: { name: 'John Doe', email: 'john@example.com' },
        date: '2024-01-01',
        type: 'docs',
        description: 'update readme',
      },
    ]

    it('should return unique contributors', () => {
      const config = { ...defaultConfig }
      const contributors = getContributors(mockCommits, config)

      expect(contributors).toHaveLength(2)
      expect(contributors).toContain('John Doe <john@example.com>')
      expect(contributors).toContain('Jane Smith <jane@example.com>')
    })

    it('should exclude authors when configured', () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        excludeAuthors: ['John Doe'],
      }
      const contributors = getContributors(mockCommits, config)

      expect(contributors).toHaveLength(1)
      expect(contributors).toContain('Jane Smith <jane@example.com>')
    })

    it('should include only specified authors when configured', () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        includeAuthors: ['Jane Smith'],
      }
      const contributors = getContributors(mockCommits, config)

      expect(contributors).toHaveLength(1)
      expect(contributors).toContain('Jane Smith <jane@example.com>')
    })

    it('should hide email when configured', () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        hideAuthorEmail: true,
      }
      const contributors = getContributors(mockCommits, config)

      expect(contributors).toHaveLength(2)
      expect(contributors).toContain('John Doe')
      expect(contributors).toContain('Jane Smith')
    })
  })

  describe('analyzeCommits', () => {
    it('should return repository statistics', () => {
      // This test would require mocking execGit calls
      // For now, test the structure
      expect(typeof analyzeCommits).toBe('function')
    })
  })

  describe('generateFormattedChangelog', () => {
    const mockChangelog: GeneratedChangelog = {
      date: '2024-01-01',
      sections: [
        {
          title: '🚀 Features',
          commits: [
            {
              type: 'feat',
              description: 'add new feature',
              hash: 'abc123',
              author: 'John Doe',
            },
          ],
        },
        {
          title: '🐛 Bug Fixes',
          commits: [
            {
              type: 'fix',
              description: 'resolve bug',
              hash: 'def456',
              author: 'Jane Smith',
            },
          ],
        },
      ],
      contributors: ['John Doe', 'Jane Smith'],
    }

    it('should generate markdown changelog', () => {
      const config = { ...defaultConfig, format: 'markdown' as const }
      const result = generateFormattedChangelog(mockChangelog, config)

      expect(typeof result).toBe('string')
      expect(result).toContain('Features')
      expect(result).toContain('Bug Fixes')
      expect(result).toContain('add new feature')
      expect(result).toContain('resolve bug')
    })

    it('should generate JSON changelog', () => {
      const config = { ...defaultConfig, format: 'json' as const }
      const result = generateFormattedChangelog(mockChangelog, config)

      expect(typeof result).toBe('string')
      const parsed = JSON.parse(result)
      expect(parsed.sections).toBeDefined()
      expect(parsed.contributors).toBeDefined()
    })

    it('should generate HTML changelog', () => {
      const config = { ...defaultConfig, format: 'html' as const }
      const result = generateFormattedChangelog(mockChangelog, config)

      expect(typeof result).toBe('string')
      expect(result).toContain('<!DOCTYPE html>')
      expect(result).toContain('<body>')
      expect(result).toContain('Features')
      expect(result).toContain('Bug Fixes')
    })
  })

  describe('colors and symbols', () => {
    it('should export color constants', () => {
      expect(typeof colors.reset).toBe('string')
      expect(typeof colors.red).toBe('string')
      expect(typeof colors.green).toBe('string')
      expect(colors.reset).toContain('\x1B')
    })

    it('should export symbol constants', () => {
      expect(typeof symbols.success).toBe('string')
      expect(typeof symbols.error).toBe('string')
      expect(typeof symbols.warning).toBe('string')
      expect(typeof symbols.info).toBe('string')
    })
  })
})
