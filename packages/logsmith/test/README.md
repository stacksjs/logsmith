# Logsmith Test Suite

This directory contains comprehensive tests for the Logsmith changelog generation tool.

## Test Structure

### Core Tests

- **`utils.test.ts`** - Utility functions including commit parsing, grouping, and author filtering
- **`config.test.ts`** - Configuration loading and merging
- **`changelog.test.ts`** - Main changelog generation functionality
- **`i18n.test.ts`** - Internationalization and localization
- **`themes.test.ts`** - Theme system and styling
- **`types.test.ts`** - Type definitions and interfaces
- **`cli.test.ts`** - Command-line interface functionality
- **`index.test.ts`** - Module exports and public API

### Integration Tests

- **`markdown-integration.test.ts`** - End-to-end markdown linting and author exclusion integration

### Test Data

- **`test-changelog.md`** - Sample changelog for testing
- **`test-changelog-clean.md`** - Clean formatted changelog for testing

## Key Test Coverage

### Author Exclusion System ✅

The test suite comprehensively covers the author exclusion functionality:

#### Unit Tests (`utils.test.ts`)

- ✅ **Default bot exclusions**: Verifies `dependabot[bot]` and `github-actions[bot]` are excluded by default
- ✅ **Exact name matching**: Tests case-sensitive author name exclusion
- ✅ **Email matching**: Tests exclusion by email address
- ✅ **Case sensitivity**: Verifies that case variations are handled correctly
- ✅ **Configuration respect**: Tests that `excludeAuthors` config setting is properly applied

#### Configuration Tests (`config.test.ts`)

- ✅ **Default preservation**: Verifies default `excludeAuthors` are preserved when overrides contain `undefined`
- ✅ **Explicit overrides**: Tests that explicit CLI values properly override defaults
- ✅ **Undefined handling**: Ensures `undefined` CLI options don't override default bot exclusions

#### Integration Tests (`markdown-integration.test.ts`)

- ✅ **End-to-end exclusion**: Tests that bot authors are excluded from generated changelogs
- ✅ **Custom exclusions**: Verifies custom `excludeAuthors` configurations work correctly
- ✅ **Config validation**: Ensures default configuration has correct bot exclusions

### Markdown Linting Integration ✅

Comprehensive testing of markdown linting functionality:

- ✅ **File output with linting**: Tests linting when writing to files
- ✅ **Console output with linting**: Tests linting for console-only output
- ✅ **Existing file merging**: Tests linting when updating existing changelogs
- ✅ **Format-specific behavior**: Verifies linting only applies to markdown format
- ✅ **Configuration respect**: Tests `markdownLint` enable/disable settings
- ✅ **Error handling**: Tests graceful fallback when linting fails

### Configuration Management ✅

Robust testing of configuration loading and merging:

- ✅ **Default config**: Verifies all required properties and sensible defaults
- ✅ **Override merging**: Tests proper precedence (overrides > loaded > defaults)
- ✅ **Undefined filtering**: Ensures `undefined` values don't override defaults
- ✅ **Complex configurations**: Tests nested configuration structures

## Running Tests

### All Tests

```bash
bun test
```

### Specific Test Categories

```bash
# Author exclusion tests
bun test test/utils.test.ts --grep "getContributors"
bun test test/config.test.ts --grep "excludeAuthors"

# Markdown linting tests
bun test test/markdown-integration.test.ts

# Configuration tests
bun test test/config.test.ts
```

### Test Results

- **Total Tests**: 168 tests across 9 files
- **Coverage**: 100% pass rate
- **Key Areas**: Author exclusion, markdown linting, configuration management

## Bug Fixes Documented

### Author Exclusion CLI Bug (Fixed ✅)

**Problem**: When running CLI commands without `--exclude-authors`, the default bot exclusions (`dependabot[bot]`, `github-actions[bot]`) were being overridden with an empty array.

**Root Cause**: CLI was setting `excludeAuthors: []` when no CLI option was provided, overriding the default configuration.

**Solution**:

1. Changed CLI to set `excludeAuthors: undefined` when not specified
2. Updated `loadLogsmithConfig` to filter out `undefined` values before merging
3. Ensured default bot exclusions are preserved unless explicitly overridden

**Files Modified**:

- `bin/cli.ts` - Fixed CLI option parsing
- `src/config.ts` - Added undefined value filtering in config merging

**Test Coverage**: Comprehensive tests verify the fix works correctly across all scenarios.

## Test Data Files

### `test-changelog.md`

Contains a realistic changelog with various commit types and formatting to test:

- Markdown generation
- Author handling
- Commit grouping
- Formatting consistency

### `test-changelog-clean.md`

Provides a clean, properly formatted changelog for testing:

- Linting functionality
- Format validation
- Output consistency

## Contributing

When adding new tests:

1. **Follow naming conventions**: Use descriptive test names that explain the expected behavior
2. **Test edge cases**: Include tests for error conditions and boundary cases
3. **Update this README**: Document new test coverage and any bug fixes
4. **Maintain coverage**: Ensure new functionality has corresponding tests

## Test Environment

- **Runtime**: Bun.js test runner
- **Framework**: Built-in Bun test assertions
- **Coverage**: Comprehensive unit and integration testing
- **Mocking**: Minimal mocking, tests real functionality where possible
