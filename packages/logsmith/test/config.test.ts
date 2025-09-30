import type { LogsmithConfig, LogsmithOptions } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { defaultConfig, defineConfig, loadLogsmithConfig } from '../src/config'

describe('config', () => {
  describe('defaultConfig', () => {
    it('should have all required properties', () => {
      expect(defaultConfig.verbose).toBe(false)
      expect(defaultConfig.output).toBe('CHANGELOG.md')
      expect(defaultConfig.format).toBe('markdown')
      expect(defaultConfig.language).toBe('en')
      expect(defaultConfig.theme).toBe('github') // Updated from 'default' to 'github'
      expect(defaultConfig.to).toBe('HEAD')
      expect(defaultConfig.clean).toBe(false)
      expect(defaultConfig.groupBreakingChanges).toBe(true)
      expect(defaultConfig.includeDates).toBe(true)
      expect(defaultConfig.linkifyIssues).toBe(true)
      expect(defaultConfig.linkifyPRs).toBe(true)
    })

    it('should have expected arrays for filter options', () => {
      expect(Array.isArray(defaultConfig.excludeAuthors)).toBe(true)
      expect(defaultConfig.excludeAuthors).toHaveLength(2) // Updated: now includes bot exclusions
      expect(defaultConfig.excludeAuthors).toContain('dependabot[bot]')
      expect(defaultConfig.excludeAuthors).toContain('github-actions[bot]')
      expect(Array.isArray(defaultConfig.includeAuthors)).toBe(true)
      expect(defaultConfig.includeAuthors).toHaveLength(0)
      expect(Array.isArray(defaultConfig.excludeCommitTypes)).toBe(true)
      expect(defaultConfig.excludeCommitTypes).toHaveLength(0)
      expect(Array.isArray(defaultConfig.includeCommitTypes)).toBe(true)
      expect(defaultConfig.includeCommitTypes).toHaveLength(0)
    })

    it('should properly handle author exclusion configuration', () => {
      // Test that the default config has the correct bot exclusions
      expect(defaultConfig.excludeAuthors).toContain('dependabot[bot]')
      expect(defaultConfig.excludeAuthors).toContain('github-actions[bot]')

      // Test that the config can be overridden
      const customConfig: LogsmithConfig = {
        ...defaultConfig,
        excludeAuthors: ['custom-bot', 'another-bot'],
      }

      expect(customConfig.excludeAuthors).toContain('custom-bot')
      expect(customConfig.excludeAuthors).toContain('another-bot')
      expect(customConfig.excludeAuthors).not.toContain('dependabot[bot]')
      expect(customConfig.excludeAuthors).not.toContain('github-actions[bot]')
    })

    it('should preserve default excludeAuthors when overrides contain undefined values', async () => {
      // Test that undefined values in overrides don't override defaults
      const overridesWithUndefined: LogsmithOptions = {
        verbose: true,
        excludeAuthors: undefined, // This should NOT override the default
        output: 'CUSTOM.md',
      }

      const config = await loadLogsmithConfig(overridesWithUndefined)

      // Should preserve default excludeAuthors
      expect(config.excludeAuthors).toContain('dependabot[bot]')
      expect(config.excludeAuthors).toContain('github-actions[bot]')
      expect(config.excludeAuthors).toHaveLength(2)

      // Other overrides should still work
      expect(config.verbose).toBe(true)
      expect(config.output).toBe('CUSTOM.md')
    })

    it('should properly override excludeAuthors when explicitly provided', async () => {
      // Test that explicit values properly override defaults
      const overridesWithExplicitAuthors: LogsmithOptions = {
        verbose: true,
        excludeAuthors: ['explicit-bot', 'another-explicit-bot'],
        output: 'CUSTOM.md',
      }

      const config = await loadLogsmithConfig(overridesWithExplicitAuthors)

      // Should use the explicit excludeAuthors
      expect(config.excludeAuthors).toContain('explicit-bot')
      expect(config.excludeAuthors).toContain('another-explicit-bot')
      expect(config.excludeAuthors).toHaveLength(2)
      expect(config.excludeAuthors).not.toContain('dependabot[bot]')
      expect(config.excludeAuthors).not.toContain('github-actions[bot]')

      // Other overrides should still work
      expect(config.verbose).toBe(true)
      expect(config.output).toBe('CUSTOM.md')
    })

    it('should have proper template formats', () => {
      expect(defaultConfig.templates.commitFormat).toContain('{{description}}')
      expect(defaultConfig.templates.groupFormat).toContain('{{title}}')
      expect(defaultConfig.templates.breakingChangeFormat).toContain('{{description}}')
      expect(typeof defaultConfig.templates.typeFormat).toBe('object')
      expect(defaultConfig.templates.typeFormat.feat).toBeDefined()
      expect(defaultConfig.templates.typeFormat.fix).toBeDefined()
    })

    it('should have sensible numeric defaults', () => {
      expect(defaultConfig.minCommitsForSection).toBe(1)
      expect(defaultConfig.maxCommitsPerSection).toBe(50) // Updated from 0 (unlimited) to 50
      expect(defaultConfig.maxDescriptionLength).toBe(0) // unlimited
    })
  })

  describe('loadLogsmithConfig', () => {
    it('should return default config when no overrides provided', async () => {
      const config = await loadLogsmithConfig()
      // Note: verbose might be overridden by loaded config, so we check other properties
      expect(config.output).toBe(defaultConfig.output)
      expect(config.format).toBe(defaultConfig.format)
      expect(config.language).toBe(defaultConfig.language)
    })

    it('should merge overrides with default config', async () => {
      const overrides: LogsmithOptions = {
        verbose: true,
        output: 'CUSTOM.md',
        format: 'json',
        language: 'es',
        excludeAuthors: ['bot'],
      }

      const config = await loadLogsmithConfig(overrides)
      expect(config.verbose).toBe(true)
      expect(config.output).toBe('CUSTOM.md')
      expect(config.format).toBe('json')
      expect(config.language).toBe('es')
      expect(config.excludeAuthors).toEqual(['bot'])

      // Unchanged defaults should remain
      expect(config.theme).toBe(defaultConfig.theme)
      expect(config.to).toBe(defaultConfig.to)
    })

    it('should handle partial overrides correctly', async () => {
      const overrides: LogsmithOptions = {
        verbose: true,
      }

      const config = await loadLogsmithConfig(overrides)
      expect(config.verbose).toBe(true)

      // All other values should be defaults
      expect(config.output).toBe(defaultConfig.output)
      expect(config.format).toBe(defaultConfig.format)
      expect(config.language).toBe(defaultConfig.language)
    })

    it('should handle empty overrides object', async () => {
      const config = await loadLogsmithConfig({})
      // Check key properties, ignoring verbose which might be overridden
      expect(config.output).toBe(defaultConfig.output)
      expect(config.format).toBe(defaultConfig.format)
      expect(config.language).toBe(defaultConfig.language)
      expect(config.theme).toBe(defaultConfig.theme)
    })

    it('should handle complex nested overrides', async () => {
      const overrides: LogsmithOptions = {
        github: {
          repo: 'test/repo',
          token: 'test-token',
        },
        templates: {
          ...defaultConfig.templates,
          commitFormat: 'custom format',
          typeFormat: {
            ...defaultConfig.templates.typeFormat,
            feat: 'Custom Features',
          },
        },
      }

      const config = await loadLogsmithConfig(overrides)
      expect(config.github?.repo).toBe('test/repo')
      expect(config.github?.token).toBe('test-token')
      expect(config.templates.commitFormat).toBe('custom format')
      expect(config.templates.typeFormat.feat).toBe('Custom Features')

      // Other type formats should remain from defaults
      expect(config.templates.typeFormat.fix).toBe(defaultConfig.templates.typeFormat.fix)
    })
  })

  describe('defineConfig', () => {
    it('should return the same config object', () => {
      const testConfig: LogsmithConfig = {
        ...defaultConfig,
        verbose: true,
        output: 'test.md',
      }

      const result = defineConfig(testConfig)
      expect(result).toBe(testConfig)
      expect(result.verbose).toBe(true)
      expect(result.output).toBe('test.md')
    })

    it('should work with custom configuration', () => {
      const customConfig: LogsmithConfig = {
        ...defaultConfig,
        format: 'html',
        theme: 'github',
        language: 'fr',
        excludeAuthors: ['dependabot'],
        templates: {
          ...defaultConfig.templates,
          commitFormat: 'custom {{description}}',
        },
      }

      const result = defineConfig(customConfig)
      expect(result.format).toBe('html')
      expect(result.theme).toBe('github')
      expect(result.language).toBe('fr')
      expect(result.excludeAuthors).toEqual(['dependabot'])
      expect(result.templates.commitFormat).toBe('custom {{description}}')
    })
  })
})
