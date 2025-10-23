#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

console.log('Building GitHub Action...')

// Build the action using bun
const result = await Bun.build({
  entrypoints: ['./src/index.ts'],
  target: 'node',
  outdir: './dist',
  minify: true,
  sourcemap: 'external',
  splitting: false,
  format: 'esm',
  external: [
    '@actions/core',
    '@actions/github',
  ],
})

if (!result.success) {
  console.error('Build failed!')
  for (const log of result.logs) {
    console.error(log)
  }
  process.exit(1)
}

console.log('✓ Built successfully')

// Create a simple wrapper that ensures the action runs
const indexPath = join(process.cwd(), 'dist', 'index.js')
const content = readFileSync(indexPath, 'utf-8')

// Ensure the module runs immediately
if (!content.includes('run()')) {
  console.error('Warning: run() function call not found in output')
}

console.log(`✓ Generated ${result.outputs.length} output file(s)`)
console.log('✓ GitHub Action build complete!')
