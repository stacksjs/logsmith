import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { getCommits, groupCommits, parseCommit } from '../src/utils'

describe('debug commit filtering', () => {
  it('should show what happens during commit processing', () => {
    const commits = getCommits('v0.1.0', 'v0.1.8')

    console.warn('\n=== RAW COMMITS ===')
    console.warn('Total commits found:', commits.length)

    commits.slice(0, 5).forEach((commit, i) => {
      console.warn(`${i + 1}. Hash: ${commit.hash}`)
      console.warn(`   Message: ${commit.message}`)
      console.warn(`   Type: ${commit.type}`)
      console.warn(`   Description: ${commit.description}`)
      console.warn(`   Author: ${commit.author.name} <${commit.author.email}>`)
      console.warn('')
    })

    console.warn('\n=== CONFIG ===')
    const config = { ...defaultConfig, from: 'v0.1.0', to: 'v0.1.8' }
    console.warn('excludeCommitTypes:', config.excludeCommitTypes)
    console.warn('includeCommitTypes:', config.includeCommitTypes)
    console.warn('minCommitsForSection:', config.minCommitsForSection)

    console.warn('\n=== GROUPED COMMITS ===')
    const grouped = groupCommits(commits, config)
    console.warn('Sections created:', grouped.length)

    grouped.forEach((section, i) => {
      console.warn(`${i + 1}. Section: ${section.title}`)
      console.warn(`   Commits: ${section.commits.length}`)
      section.commits.slice(0, 3).forEach((commit, j) => {
        console.warn(`   ${j + 1}. ${commit.description} (${commit.hash})`)
      })
      console.warn('')
    })

    expect(commits.length).toBeGreaterThan(0)
  })

  it('should test commit parsing', () => {
    const rawCommit = {
      hash: 'abc123',
      message: 'chore: release v0.1.8',
      author: { name: 'Test User', email: 'test@example.com' },
      date: '2023-01-01',
      body: 'chore: release v0.1.8',
    }

    const parsed = parseCommit(rawCommit)

    console.warn('\n=== PARSED COMMIT ===')
    console.warn('Original message:', rawCommit.message)
    console.warn('Parsed type:', parsed.type)
    console.warn('Parsed description:', parsed.description)
    console.warn('Parsed scope:', parsed.scope)

    expect(parsed.type).toBe('chore')
    expect(parsed.description).toBe('release v0.1.8')
  })
})
