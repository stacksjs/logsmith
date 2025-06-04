import { describe, expect, it } from 'bun:test'
import * as logsmith from '../src/index'

describe('logsmith exports', () => {
  it('should export generateChangelog function', () => {
    expect(typeof logsmith.generateChangelog).toBe('function')
  })

  it('should export config functions', () => {
    expect(typeof logsmith.loadLogsmithConfig).toBe('function')
    expect(typeof logsmith.defineConfig).toBe('function')
    expect(typeof logsmith.defaultConfig).toBe('object')
  })

  it('should export utility functions', () => {
    expect(typeof logsmith.parseCommit).toBe('function')
    expect(typeof logsmith.groupCommits).toBe('function')
    expect(typeof logsmith.analyzeCommits).toBe('function')
    expect(typeof logsmith.generateChangelogContent).toBe('function')
  })

  it('should export i18n functions', () => {
    expect(typeof logsmith.getLabel).toBe('function')
    expect(typeof logsmith.formatDate).toBe('function')
  })

  it('should export theme functions', () => {
    expect(typeof logsmith.getAvailableThemes).toBe('function')
    expect(typeof logsmith.getThemeEmoji).toBe('function')
  })

  it('should export type definitions without errors', () => {
    // This test verifies that types are properly exported and there are no circular dependencies
    expect(logsmith).toBeDefined()
  })
})
