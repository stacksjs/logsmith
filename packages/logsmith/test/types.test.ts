import type {
  ChangelogEntry,
  ChangelogResult,
  CommitInfo,
  GeneratedChangelog,
  GitReference,
  LogsmithConfig,
  OutputFormat,
  RepositoryStats,
  SupportedLanguage,
  SupportedTheme,
  ThemeConfig,
} from '../src/types'
import { describe, expect, it } from 'bun:test'

describe('types', () => {
  describe('SupportedLanguage', () => {
    it('should include all expected languages', () => {
      const languages: SupportedLanguage[] = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'ru', 'pt', 'it']
      expect(languages).toHaveLength(10)

      // Test that each is a valid SupportedLanguage
      languages.forEach((lang) => {
        expect(typeof lang).toBe('string')
        expect(lang.length).toBeGreaterThan(0)
      })
    })
  })

  describe('SupportedTheme', () => {
    it('should include all expected themes', () => {
      const themes: SupportedTheme[] = ['default', 'minimal', 'github', 'gitmoji', 'unicode', 'simple', 'colorful', 'corporate']
      expect(themes).toHaveLength(8)

      // Test that each is a valid SupportedTheme
      themes.forEach((theme) => {
        expect(typeof theme).toBe('string')
        expect(theme.length).toBeGreaterThan(0)
      })
    })
  })

  describe('ThemeConfig', () => {
    it('should have correct structure', () => {
      const mockTheme: ThemeConfig = {
        name: 'Test Theme',
        description: 'A test theme',
        emojis: {
          feat: '✨',
          fix: '🐛',
          docs: '📚',
          style: '💄',
          refactor: '♻️',
          perf: '⚡',
          test: '🧪',
          build: '📦',
          ci: '🤖',
          chore: '🔧',
          revert: '⏪',
          misc: '📝',
          breaking: '💥',
        },
        styles: {
          markdown: {
            headerPrefix: '##',
            listItemPrefix: '-',
            emphasis: 'bold',
            codeStyle: 'backticks',
          },
          html: {
            colorScheme: 'light',
            fontSize: 'medium',
            fontFamily: 'Arial',
          },
        },
      }

      expect(typeof mockTheme.name).toBe('string')
      expect(typeof mockTheme.description).toBe('string')
      expect(typeof mockTheme.emojis).toBe('object')
      expect(typeof mockTheme.emojis.feat).toBe('string')
      expect(typeof mockTheme.emojis.fix).toBe('string')
    })
  })

  describe('OutputFormat', () => {
    it('should include all expected formats', () => {
      const formats: OutputFormat[] = ['markdown', 'json', 'html']
      expect(formats).toHaveLength(3)

      formats.forEach((format) => {
        expect(typeof format).toBe('string')
        expect(['markdown', 'json', 'html']).toContain(format)
      })
    })
  })

  describe('CommitInfo', () => {
    it('should have correct structure', () => {
      const mockCommit: CommitInfo = {
        hash: 'abc123',
        message: 'feat: add new feature',
        author: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        date: '2024-01-01',
        type: 'feat',
        scope: 'api',
        description: 'add new feature',
        body: 'This adds a new feature',
        breaking: false,
        references: [
          {
            type: 'issue',
            id: '123',
            url: 'https://github.com/owner/repo/issues/123',
          },
        ],
      }

      expect(typeof mockCommit.hash).toBe('string')
      expect(typeof mockCommit.message).toBe('string')
      expect(typeof mockCommit.author.name).toBe('string')
      expect(typeof mockCommit.author.email).toBe('string')
      expect(typeof mockCommit.date).toBe('string')
      expect(typeof mockCommit.description).toBe('string')
      expect(typeof mockCommit.breaking).toBe('boolean')
      expect(Array.isArray(mockCommit.references)).toBe(true)
    })
  })

  describe('GitReference', () => {
    it('should have correct structure for issue reference', () => {
      const issueRef: GitReference = {
        type: 'issue',
        id: '123',
        url: 'https://github.com/owner/repo/issues/123',
      }

      expect(issueRef.type).toBe('issue')
      expect(typeof issueRef.id).toBe('string')
      expect(typeof issueRef.url).toBe('string')
    })

    it('should have correct structure for PR reference', () => {
      const prRef: GitReference = {
        type: 'pr',
        id: '456',
        url: 'https://github.com/owner/repo/pull/456',
      }

      expect(prRef.type).toBe('pr')
      expect(typeof prRef.id).toBe('string')
      expect(typeof prRef.url).toBe('string')
    })
  })

  describe('ChangelogEntry', () => {
    it('should have correct structure', () => {
      const entry: ChangelogEntry = {
        type: 'feat',
        scope: 'api',
        description: 'add new endpoint',
        hash: 'abc123',
        author: 'John Doe',
        breaking: false,
        references: [
          {
            type: 'issue',
            id: '123',
          },
        ],
      }

      expect(typeof entry.type).toBe('string')
      expect(typeof entry.description).toBe('string')
      expect(typeof entry.hash).toBe('string')
      expect(typeof entry.breaking).toBe('boolean')
    })
  })

  describe('GeneratedChangelog', () => {
    it('should have correct structure', () => {
      const changelog: GeneratedChangelog = {
        version: '1.0.0',
        date: '2024-01-01',
        sections: [
          {
            title: 'Features',
            commits: [
              {
                type: 'feat',
                description: 'add new feature',
                hash: 'abc123',
              },
            ],
          },
        ],
        contributors: ['John Doe', 'Jane Smith'],
        compareUrl: 'https://github.com/owner/repo/compare/v0.1.0...v1.0.0',
      }

      expect(typeof changelog.date).toBe('string')
      expect(Array.isArray(changelog.sections)).toBe(true)
      expect(Array.isArray(changelog.contributors)).toBe(true)
      expect(changelog.sections[0].title).toBe('Features')
      expect(changelog.contributors).toHaveLength(2)
    })
  })

  describe('ChangelogResult', () => {
    it('should have correct structure', () => {
      const result: ChangelogResult = {
        content: '# Changelog\n\n## Features\n\n- Add new feature',
        outputPath: '/path/to/CHANGELOG.md',
        format: 'markdown',
      }

      expect(typeof result.content).toBe('string')
      expect(typeof result.outputPath).toBe('string')
      expect(['markdown', 'json', 'html']).toContain(result.format)
    })

    it('should handle undefined outputPath', () => {
      const result: ChangelogResult = {
        content: '{"sections": []}',
        format: 'json',
      }

      expect(typeof result.content).toBe('string')
      expect(result.outputPath).toBeUndefined()
      expect(result.format).toBe('json')
    })
  })

  describe('LogsmithConfig', () => {
    it('should have all required properties with correct types', () => {
      const config: LogsmithConfig = {
        verbose: false,
        output: 'CHANGELOG.md',
        format: 'markdown',
        language: 'en',
        theme: 'default',
        from: 'v1.0.0',
        to: 'HEAD',
        dir: '/path/to/repo',
        clean: false,
        excludeAuthors: ['bot'],
        includeAuthors: [],
        excludeEmail: false,
        hideAuthorEmail: false,
        excludeCommitTypes: ['chore'],
        includeCommitTypes: [],
        minCommitsForSection: 1,
        maxCommitsPerSection: 0,
        excludeScopes: [],
        includeScopes: [],
        excludeMessages: [],
        groupBreakingChanges: true,
        includeDates: true,
        dateFormat: 'YYYY-MM-DD',
        includeCommitCount: false,
        versionPrefix: 'v',
        includeCommitBody: false,
        maxDescriptionLength: 0,
        linkifyIssues: true,
        linkifyPRs: true,
        repo: 'owner/repo',
        github: {
          repo: 'owner/repo',
          token: 'token',
        },
        templates: {
          commitFormat: '- {{description}}',
          groupFormat: '### {{title}}',
          typeFormat: {
            feat: 'Features',
          },
          breakingChangeFormat: '- **{{description}}**',
          dateFormat: '_{{date}}_',
        },
      }

      // Test core properties
      expect(typeof config.verbose).toBe('boolean')
      expect(typeof config.format).toBe('string')
      expect(typeof config.language).toBe('string')
      expect(typeof config.theme).toBe('string')
      expect(typeof config.dir).toBe('string')

      // Test arrays
      expect(Array.isArray(config.excludeAuthors)).toBe(true)
      expect(Array.isArray(config.includeAuthors)).toBe(true)
      expect(Array.isArray(config.excludeCommitTypes)).toBe(true)

      // Test numbers
      expect(typeof config.minCommitsForSection).toBe('number')
      expect(typeof config.maxCommitsPerSection).toBe('number')

      // Test objects
      expect(typeof config.github).toBe('object')
      expect(typeof config.templates).toBe('object')
    })
  })

  describe('RepositoryStats', () => {
    it('should have correct structure', () => {
      const stats: RepositoryStats = {
        from: 'v1.0.0',
        to: 'HEAD',
        totalCommits: 100,
        contributors: 5,
        breakingChanges: 2,
        commitTypes: {
          feat: 30,
          fix: 25,
          docs: 15,
        },
        trends: {
          commitFrequency: {
            daily: { '2024-01-01': 5 },
            weekly: { '2024-W01': 20 },
            monthly: { '2024-01': 50 },
            totalDays: 30,
            averagePerDay: 3.33,
            peakDay: { date: '2024-01-15', commits: 10 },
          },
          contributorGrowth: {
            timeline: { '2024-01-01': ['John Doe'] },
            totalContributors: 5,
            newContributors: ['Jane Smith'],
            mostActiveContributor: { name: 'John Doe', commits: 40 },
            contributorCommits: { 'John Doe': 40, 'Jane Smith': 30 },
          },
          typeDistribution: {
            percentages: { feat: 30, fix: 25, docs: 15 },
            mostCommonType: { type: 'feat', count: 30, percentage: 30 },
            leastCommonType: { type: 'docs', count: 15, percentage: 15 },
          },
        },
      }

      expect(typeof stats.totalCommits).toBe('number')
      expect(typeof stats.contributors).toBe('number')
      expect(typeof stats.breakingChanges).toBe('number')
      expect(typeof stats.commitTypes).toBe('object')
      expect(typeof stats.trends).toBe('object')
      expect(typeof stats.trends.commitFrequency).toBe('object')
      expect(typeof stats.trends.contributorGrowth).toBe('object')
      expect(typeof stats.trends.typeDistribution).toBe('object')
    })
  })
})
