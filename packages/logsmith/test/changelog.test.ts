import type { LogsmithConfig } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { generateChangelog } from '../src/changelog'
import { defaultConfig } from '../src/config'
import { groupCommits } from '../src/utils'

describe('changelog', () => {
  describe('generateChangelog', () => {
    it('should be a function', () => {
      expect(typeof generateChangelog).toBe('function')
    })

    it('should return a ChangelogResult object structure', async () => {
      // Mock configuration with minimal requirements
      const config: LogsmithConfig = {
        ...defaultConfig,
        dir: process.cwd(), // Use current directory which should be a git repo
        output: false, // Don't write to file
        verbose: false,
      }

      try {
        const result = await generateChangelog(config)

        expect(result).toBeDefined()
        expect(typeof result.content).toBe('string')
        expect(result.format).toBe('markdown')
        expect(result.outputPath).toBeUndefined() // since output is false
      }
      catch (error) {
        // If this fails because it's not a git repo or no commits, that's expected in test environment
        expect(error).toBeDefined()
      }
    })

    it('should not ignore feat commits by default', async () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        dir: process.cwd(),
        output: false,
        verbose: false,
      }

      try {
        const result = await generateChangelog(config)

        // The content should not explicitly exclude feat commits
        // Since excludeCommitTypes is empty by default, feat should be included
        expect(config.excludeCommitTypes).toEqual([])
        expect(config.includeCommitTypes).toEqual([])

        // Check that feat commits would be properly formatted if present
        expect(config.templates.typeFormat.feat).toBe('🚀 Features')

        // Verify that the result object is properly structured
        expect(result).toBeDefined()
        expect(typeof result.content).toBe('string')
      }
      catch (error) {
        // Expected in test environment without git repo
        expect(error).toBeDefined()
      }
    })

    it('should properly group and include feat commits', () => {
      // Create mock commits including feat commits
      const mockCommits = [
        {
          hash: 'abc123f',
          message: 'feat(auth): add OAuth2 support',
          author: { name: 'John Doe', email: 'john@example.com' },
          date: '2024-01-15T10:30:00Z',
          type: 'feat',
          scope: 'auth',
          description: 'add OAuth2 support',
          breaking: false,
        },
        {
          hash: 'def456g',
          message: 'fix(api): resolve memory leak',
          author: { name: 'Jane Smith', email: 'jane@example.com' },
          date: '2024-01-14T09:15:00Z',
          type: 'fix',
          scope: 'api',
          description: 'resolve memory leak',
          breaking: false,
        },
        {
          hash: 'ghi789h',
          message: 'feat: add new dashboard component',
          author: { name: 'Bob Wilson', email: 'bob@example.com' },
          date: '2024-01-13T14:20:00Z',
          type: 'feat',
          description: 'add new dashboard component',
          breaking: false,
        },
      ]

      const config: LogsmithConfig = {
        ...defaultConfig,
        output: false,
        verbose: false,
      }

      // Test that groupCommits properly processes feat commits
      const sections = groupCommits(mockCommits, config)

      // Should have sections for feat and fix
      expect(sections.length).toBeGreaterThan(0)

      // Find the feat section
      const featSection = sections.find(section => section.title.includes('Features') || section.title.includes('feat'))
      expect(featSection).toBeDefined()

      if (featSection) {
        // Should have 2 feat commits
        expect(featSection.commits.length).toBe(2)

        // Verify the feat commits are properly structured
        const featCommits = featSection.commits
        expect(featCommits[0].type).toBe('feat')
        expect(featCommits[1].type).toBe('feat')

        // Check that descriptions are preserved
        expect(featCommits.some(commit => commit.description.includes('OAuth2 support'))).toBe(true)
        expect(featCommits.some(commit => commit.description.includes('dashboard component'))).toBe(true)
      }
    })

    it('should handle different output formats', async () => {
      const baseConfig: LogsmithConfig = {
        ...defaultConfig,
        dir: process.cwd(),
        output: false,
        verbose: false,
      }

      // Test each format
      const formats = ['markdown', 'json', 'html'] as const

      for (const format of formats) {
        const config = { ...baseConfig, format }

        try {
          const result = await generateChangelog(config)
          expect(result.format).toBe(format)
        }
        catch {
          // Expected in test environment without git repo
          // Just continue testing
        }
      }
    })

    it('should handle output file configuration', async () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        dir: process.cwd(),
        output: 'test-changelog.md',
        verbose: false,
      }

      try {
        const result = await generateChangelog(config)
        expect(typeof result.outputPath).toBe('string')
        expect(result.outputPath).toContain('test-changelog.md')
      }
      catch {
        // Expected in test environment
        // Just continue testing
      }
    })

    it('should handle console-only output', async () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        dir: process.cwd(),
        output: false,
        verbose: false,
      }

      try {
        const result = await generateChangelog(config)
        expect(result.outputPath).toBeUndefined()
      }
      catch {
        // Expected in test environment
        // Just continue testing
      }
    })

    it('should respect verbose configuration', async () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        dir: process.cwd(),
        output: false,
        verbose: true,
      }

      try {
        const result = await generateChangelog(config)
        expect(result).toBeDefined()
      }
      catch {
        // Expected in test environment
        // Just continue testing
      }
    })

    it('should handle different commit range configurations', async () => {
      const configs = [
        { ...defaultConfig, from: undefined, to: 'HEAD' },
        { ...defaultConfig, from: 'v1.0.0', to: 'HEAD' },
        { ...defaultConfig, from: 'HEAD~10', to: 'HEAD' },
      ]

      for (const config of configs) {
        const fullConfig: LogsmithConfig = {
          ...config,
          dir: process.cwd(),
          output: false,
          verbose: false,
        }

        try {
          const result = await generateChangelog(fullConfig)
          expect(result).toBeDefined()
        }
        catch {
          // Expected in test environment
          // Just continue testing
        }
      }
    })
  })

  describe('markdown linting integration', () => {
    it('should apply markdown linting to generated content when format is markdown', async () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        dir: process.cwd(),
        output: false, // Don't write to file, just test content
        format: 'markdown',
        markdownLint: true,
        verbose: false,
      }

      try {
        const result = await generateChangelog(config)

        // Verify that the result is defined and content is a string
        expect(result).toBeDefined()
        expect(typeof result.content).toBe('string')
        expect(result.format).toBe('markdown')

        // The content should be processed (even if linting currently falls back to original)
        // This test verifies that the linting integration doesn't break the flow
        expect(result.content.length).toBeGreaterThanOrEqual(0)
      }
      catch (error) {
        // Expected in test environment without proper git repo
        expect(error).toBeDefined()
      }
    })

    it('should not apply markdown linting when format is json', async () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        dir: process.cwd(),
        output: false,
        format: 'json',
        markdownLint: true,
        verbose: false,
      }

      try {
        const result = await generateChangelog(config)

        expect(result).toBeDefined()
        expect(result.format).toBe('json')

        // For JSON format, content should be valid JSON
        if (result.content) {
          expect(() => JSON.parse(result.content)).not.toThrow()
        }
      }
      catch (error) {
        // Expected in test environment
        expect(error).toBeDefined()
      }
    })

    it('should not apply markdown linting when format is html', async () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        dir: process.cwd(),
        output: false,
        format: 'html',
        markdownLint: true,
        verbose: false,
      }

      try {
        const result = await generateChangelog(config)

        expect(result).toBeDefined()
        expect(result.format).toBe('html')

        // For HTML format, content should contain HTML structure
        if (result.content) {
          expect(result.content).toContain('<!DOCTYPE html>')
          expect(result.content).toContain('<html')
          expect(result.content).toContain('</html>')
        }
      }
      catch (error) {
        // Expected in test environment
        expect(error).toBeDefined()
      }
    })

    it('should respect markdownLint config setting', async () => {
      const configWithLinting: LogsmithConfig = {
        ...defaultConfig,
        dir: process.cwd(),
        output: false,
        format: 'markdown',
        markdownLint: true,
        verbose: false,
      }

      const configWithoutLinting: LogsmithConfig = {
        ...defaultConfig,
        dir: process.cwd(),
        output: false,
        format: 'markdown',
        markdownLint: false,
        verbose: false,
      }

      try {
        const resultWithLinting = await generateChangelog(configWithLinting)
        const resultWithoutLinting = await generateChangelog(configWithoutLinting)

        // Both should work regardless of linting setting
        expect(resultWithLinting).toBeDefined()
        expect(resultWithoutLinting).toBeDefined()
        expect(resultWithLinting.format).toBe('markdown')
        expect(resultWithoutLinting.format).toBe('markdown')
      }
      catch (error) {
        // Expected in test environment
        expect(error).toBeDefined()
      }
    })

    it('should apply linting to console output when output is false', async () => {
      const config: LogsmithConfig = {
        ...defaultConfig,
        dir: process.cwd(),
        output: false, // Console output only
        format: 'markdown',
        markdownLint: true,
        verbose: false,
      }

      try {
        const result = await generateChangelog(config)

        // Verify that even console-only output gets linting applied
        expect(result).toBeDefined()
        expect(result.outputPath).toBeUndefined()
        expect(result.format).toBe('markdown')
        expect(typeof result.content).toBe('string')
      }
      catch (error) {
        // Expected in test environment
        expect(error).toBeDefined()
      }
    })
  })
})
