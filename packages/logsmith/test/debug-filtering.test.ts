import { describe, expect, it } from 'bun:test'
import { getCommits, groupCommits, parseCommit } from '../src/utils'
import { defaultConfig } from '../src/config'

describe('debug commit filtering', () => {
  it('should show what happens during commit processing', () => {
    const commits = getCommits('v0.1.0', 'v0.1.8')
    
    console.log('\n=== RAW COMMITS ===')
    console.log('Total commits found:', commits.length)
    
    commits.slice(0, 5).forEach((commit, i) => {
      console.log(`${i + 1}. Hash: ${commit.hash}`)
      console.log(`   Message: ${commit.message}`)
      console.log(`   Type: ${commit.type}`)
      console.log(`   Description: ${commit.description}`)
      console.log(`   Author: ${commit.author.name} <${commit.author.email}>`)
      console.log('')
    })

    console.log('\n=== CONFIG ===')
    const config = { ...defaultConfig, from: 'v0.1.0', to: 'v0.1.8' }
    console.log('excludeCommitTypes:', config.excludeCommitTypes)
    console.log('includeCommitTypes:', config.includeCommitTypes)
    console.log('minCommitsForSection:', config.minCommitsForSection)
    
    console.log('\n=== GROUPED COMMITS ===')
    const grouped = groupCommits(commits, config)
    console.log('Sections created:', grouped.length)
    
    grouped.forEach((section, i) => {
      console.log(`${i + 1}. Section: ${section.title}`)
      console.log(`   Commits: ${section.commits.length}`)
      section.commits.slice(0, 3).forEach((commit, j) => {
        console.log(`   ${j + 1}. ${commit.description} (${commit.hash})`)
      })
      console.log('')
    })

    expect(commits.length).toBeGreaterThan(0)
  })

  it('should test commit parsing', () => {
    const rawCommit = {
      hash: 'abc123',
      message: 'chore: release v0.1.8',
      author: { name: 'Test User', email: 'test@example.com' },
      date: '2023-01-01',
      body: 'chore: release v0.1.8'
    }

    const parsed = parseCommit(rawCommit)
    
    console.log('\n=== PARSED COMMIT ===')
    console.log('Original message:', rawCommit.message)
    console.log('Parsed type:', parsed.type)
    console.log('Parsed description:', parsed.description)
    console.log('Parsed scope:', parsed.scope)
    
    expect(parsed.type).toBe('chore')
    expect(parsed.description).toBe('release v0.1.8')
  })
})
