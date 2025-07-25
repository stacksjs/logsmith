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
      expect(defaultConfig.theme).toBe('default')
      expect(defaultConfig.to).toBe('HEAD')
      expect(defaultConfig.clean).toBe(false)
      expect(defaultConfig.groupBreakingChanges).toBe(true)
      expect(defaultConfig.includeDates).toBe(true)
      expect(defaultConfig.linkifyIssues).toBe(true)
      expect(defaultConfig.linkifyPRs).toBe(true)
    })

    it('should have empty arrays for filter options', () => {
      expect(Array.isArray(defaultConfig.excludeAuthors)).toBe(true)
      expect(defaultConfig.excludeAuthors).toHaveLength(0)
      expect(Array.isArray(defaultConfig.includeAuthors)).toBe(true)
      expect(defaultConfig.includeAuthors).toHaveLength(0)
      expect(Array.isArray(defaultConfig.excludeCommitTypes)).toBe(true)
      expect(defaultConfig.excludeCommitTypes).toHaveLength(0)
      expect(Array.isArray(defaultConfig.includeCommitTypes)).toBe(true)
      expect(defaultConfig.includeCommitTypes).toHaveLength(0)
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
      expect(defaultConfig.maxCommitsPerSection).toBe(0) // unlimited
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
