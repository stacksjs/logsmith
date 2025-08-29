import { describe, expect, it } from 'bun:test'
import { execGit, getCommits, getLatestTag } from '../src/utils'

describe('commit range functionality', () => {
  it('should find commits between two tags', () => {
    // Test with actual tags that exist in the repository
    const commits = getCommits('v0.1.0', 'v0.1.8')

    console.warn('Found commits:', commits.length)
    console.warn('First few commits:', commits.slice(0, 3).map(c => ({ hash: c.hash, message: c.message })))

    expect(commits.length).toBeGreaterThan(0)
  })

  it('should handle non-existent tags gracefully', () => {
    const commits = getCommits('v0.0.0', 'v0.1.8')

    console.warn('Commits with non-existent from tag:', commits.length)

    // Should return empty array when from tag doesn't exist
    expect(commits).toEqual([])
  })

  it('should get latest tag correctly', () => {
    const latestTag = getLatestTag()

    console.warn('Latest tag:', latestTag)

    expect(latestTag).toBeDefined()
    expect(latestTag).toMatch(/^v\d+\.\d+\.\d+$/)
  })

  it('should execute git commands correctly', () => {
    // Test the raw git command that getCommits uses
    try {
      const output = execGit('log v0.1.0..v0.1.8 --pretty=tformat:"%H|%s|%an|%ae|%ad|%B" --date=iso')

      console.warn('Raw git output length:', output.length)
      console.warn('First line:', output.split('\n')[0])

      expect(output.length).toBeGreaterThan(0)
      expect(output).toContain('|')
    }
    catch (error) {
      console.error('Git command failed:', error)
      throw error
    }
  })

  it('should parse commit format correctly', () => {
    // Test parsing of a single commit line
    const testLine = 'abc123|feat: add new feature|John Doe|john@example.com|2023-01-01 12:00:00 +0000|feat: add new feature\n\nThis is the body'
    const parts = testLine.split('|')

    expect(parts.length).toBeGreaterThanOrEqual(5)
    expect(parts[0]).toBe('abc123') // hash
    expect(parts[1]).toBe('feat: add new feature') // message
    expect(parts[2]).toBe('John Doe') // author name
    expect(parts[3]).toBe('john@example.com') // author email
    expect(parts[4]).toBe('2023-01-01 12:00:00 +0000') // date
  })
})
