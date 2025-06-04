# Repository Insights

Logsmith provides comprehensive repository analytics that go beyond simple changelog generation. Get detailed insights into your project's development patterns, contributor activity, and commit trends.

## Overview

The `logsmith stats` command analyzes your Git repository and provides detailed statistics including:

- **Commit frequency analysis** with daily, weekly, and monthly trends
- **Contributor growth patterns** and activity metrics
- **Commit type distribution** and usage patterns
- **Breaking change tracking** and impact analysis
- **Peak activity periods** and development cycles

## Basic Usage

### Generate Statistics

```bash
# Basic repository statistics
logsmith stats

# Statistics for specific range
logsmith stats --from v1.0.0 --to HEAD

# Statistics for last 3 months
logsmith stats --from "3 months ago" --to HEAD

# JSON output for programmatic use
logsmith stats --json

# Verbose output with detailed analysis
logsmith stats --verbose
```

### Different Repository

```bash
# Analyze different repository
logsmith stats --dir /path/to/repo

# Remote repository analysis
cd /tmp && git clone https://github.com/user/repo.git
logsmith stats --dir repo
```

## Statistics Output

### Console Output

When run without `--json`, logsmith stats provides a formatted overview:

```
📊 Repository Statistics
─────────────────────────

Range: v1.0.0 → HEAD
Total Commits: 234
Contributors: 12
Breaking Changes: 3

📈 Commit Frequency
───────────────────
Total Days: 89
Average Per Day: 2.6
Peak Day: 2024-01-15 (12 commits)

👥 Contributors
───────────────
Most Active: john.doe (45 commits)
New Contributors: 3
Total Contributors: 12

📊 Commit Types
───────────────
feat: 89 commits (38.0%)
fix: 67 commits (28.6%)
docs: 34 commits (14.5%)
chore: 28 commits (12.0%)
refactor: 16 commits (6.8%)

🔥 Recent Activity (Last 7 Days)
───────────────────────────────
2024-01-20: ████████ 8 commits
2024-01-19: ██████ 6 commits
2024-01-18: ████ 4 commits
2024-01-17: ██ 2 commits
2024-01-16: ██████████ 10 commits
```

### JSON Output

Use `--json` for programmatic consumption:

```bash
logsmith stats --json > stats.json
```

```json
{
  "from": "v1.0.0",
  "to": "HEAD",
  "totalCommits": 234,
  "contributors": 12,
  "breakingChanges": 3,
  "commitTypes": {
    "feat": 89,
    "fix": 67,
    "docs": 34,
    "chore": 28,
    "refactor": 16
  },
  "trends": {
    "commitFrequency": {
      "daily": {
        "2024-01-15": 12,
        "2024-01-16": 10,
        "2024-01-17": 2,
        "2024-01-18": 4,
        "2024-01-19": 6,
        "2024-01-20": 8
      },
      "weekly": {
        "2024-W03": 42,
        "2024-W04": 38
      },
      "monthly": {
        "2024-01": 234
      },
      "totalDays": 89,
      "averagePerDay": 2.6,
      "peakDay": {
        "date": "2024-01-15",
        "commits": 12
      }
    },
    "contributorGrowth": {
      "timeline": {
        "2024-01-10": ["alice.smith"],
        "2024-01-15": ["bob.jones"],
        "2024-01-18": ["charlie.brown"]
      },
      "totalContributors": 12,
      "newContributors": ["alice.smith", "bob.jones", "charlie.brown"],
      "mostActiveContributor": {
        "name": "john.doe",
        "commits": 45
      },
      "contributorCommits": {
        "john.doe": 45,
        "jane.smith": 38,
        "alice.smith": 23
      }
    },
    "typeDistribution": {
      "percentages": {
        "feat": 38.0,
        "fix": 28.6,
        "docs": 14.5,
        "chore": 12.0,
        "refactor": 6.8
      },
      "mostCommonType": {
        "type": "feat",
        "count": 89,
        "percentage": 38.0
      },
      "leastCommonType": {
        "type": "refactor",
        "count": 16,
        "percentage": 6.8
      }
    }
  }
}
```

## Detailed Analytics

### Commit Frequency Analysis

Track development patterns over time:

```bash
# Focus on recent activity
logsmith stats --from "1 month ago" --verbose
```

**Provides:**
- Daily commit counts with visual charts
- Weekly and monthly aggregations
- Peak activity identification
- Development cycle patterns
- Workday vs. weekend activity

### Contributor Growth

Monitor team growth and participation:

```bash
# Analyze contributor patterns
logsmith stats --from "6 months ago" --json | jq '.trends.contributorGrowth'
```

**Includes:**
- New contributor timeline
- Most active contributors
- Contribution distribution
- Team growth rate
- Commit count per contributor

### Commit Type Distribution

Understand development focus areas:

```bash
# See commit type breakdown
logsmith stats --json | jq '.trends.typeDistribution'
```

**Shows:**
- Percentage breakdown by type
- Most/least common commit types
- Development focus trends
- Quality indicators (test/docs ratio)

## Advanced Usage

### Custom Time Ranges

```bash
# Last quarter
logsmith stats --from "3 months ago"

# Specific release cycle
logsmith stats --from v2.0.0 --to v2.1.0

# This year
logsmith stats --from "Jan 1, 2024"

# Between specific dates
logsmith stats --from "2024-01-01" --to "2024-02-01"
```

### Filtering Analysis

```bash
# Exclude bot commits from stats
logsmith stats --exclude-authors "dependabot[bot],renovate[bot]"

# Focus on specific commit types
logsmith stats --include-types "feat,fix"

# Analyze specific scopes
logsmith stats --include-scopes "core,api"
```

### Multi-Repository Analysis

Compare multiple repositories:

```bash
#!/bin/bash
# analyze-repos.sh

repos=("repo1" "repo2" "repo3")
for repo in "${repos[@]}"; do
  echo "Analyzing $repo..."
  logsmith stats --dir "$repo" --json > "stats-$repo.json"
done

# Combine results
jq -s 'map({name: input_filename, stats: .})' stats-*.json > combined-stats.json
```

## Programmatic Usage

### Using the API

```typescript
import { analyzeCommits, loadLogsmithConfig } from 'logsmith'

async function getRepositoryInsights() {
  const config = await loadLogsmithConfig({
    from: '3 months ago',
    to: 'HEAD',
    excludeAuthors: ['dependabot[bot]']
  })

  const stats = analyzeCommits(config)

  return {
    overview: {
      totalCommits: stats.totalCommits,
      contributors: stats.contributors,
      breakingChanges: stats.breakingChanges,
      timeRange: `${stats.from} → ${stats.to}`
    },
    activity: {
      averagePerDay: stats.trends.commitFrequency.averagePerDay,
      peakDay: stats.trends.commitFrequency.peakDay,
      mostActiveContributor: stats.trends.contributorGrowth.mostActiveContributor
    },
    distribution: {
      mostCommonType: stats.trends.typeDistribution.mostCommonType,
      leastCommonType: stats.trends.typeDistribution.leastCommonType
    }
  }
}
```

### Building Dashboards

```typescript
import { analyzeCommits } from 'logsmith'

async function buildProjectDashboard() {
  const periods = ['1 week ago', '1 month ago', '3 months ago', '1 year ago']
  const insights = {}

  for (const period of periods) {
    const config = await loadLogsmithConfig({
      from: period,
      to: 'HEAD'
    })

    insights[period] = analyzeCommits(config)
  }

  return insights
}
```

## Visualization Examples

### Commit Activity Chart

```typescript
// Generate data for visualization libraries
import { analyzeCommits } from 'logsmith'

async function getCommitActivityData() {
  const stats = analyzeCommits(await loadLogsmithConfig())
  const daily = stats.trends.commitFrequency.daily

  return Object.entries(daily).map(([date, commits]) => ({
    date: new Date(date),
    commits,
    weekday: new Date(date).getDay()
  }))
}
```

### Contributor Growth Chart

```typescript
async function getContributorGrowthData() {
  const stats = analyzeCommits(await loadLogsmithConfig())
  const timeline = stats.trends.contributorGrowth.timeline

  let cumulativeCount = 0
  return Object.entries(timeline).map(([date, newContributors]) => {
    cumulativeCount += newContributors.length
    return {
      date: new Date(date),
      newContributors: newContributors.length,
      totalContributors: cumulativeCount
    }
  })
}
```

## Reporting and Integration

### Generate Reports

```bash
#!/bin/bash
# generate-report.sh

echo "# Repository Report - $(date)" > report.md
echo "" >> report.md

echo "## Overview" >> report.md
logsmith stats --from "1 month ago" | head -10 >> report.md

echo "" >> report.md
echo "## Detailed Statistics" >> report.md
logsmith stats --from "1 month ago" >> report.md

echo "" >> report.md
echo "## JSON Data" >> report.md
echo '```json' >> report.md
logsmith stats --from "1 month ago" --json >> report.md
echo '```' >> report.md
```

### CI/CD Integration

```yaml
# .github/workflows/stats.yml
name: Repository Statistics

on:
  schedule:
    - cron: '0 0 * * 1' # Weekly on Monday
  workflow_dispatch:

jobs:
  stats:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: oven-sh/setup-bun@v1

      - name: Generate Statistics
        run: |
          bun add -g logsmith
          logsmith stats --json > stats.json
          logsmith stats > stats.txt

      - name: Upload Statistics
        uses: actions/upload-artifact@v3
        with:
          name: repository-stats
          path: |
            stats.json
            stats.txt

      - name: Comment PR with Stats
        if: github.event_name == 'pull_request'
        run: |
          echo "## 📊 Repository Statistics" >> comment.md
          echo '```' >> comment.md
          logsmith stats --from "1 month ago" >> comment.md
          echo '```' >> comment.md
          gh pr comment ${{ github.event.number }} --body-file comment.md
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Slack Integration

```typescript
// scripts/slack-stats.ts
import { analyzeCommits, loadLogsmithConfig } from 'logsmith'

async function sendStatsToSlack() {
  const config = await loadLogsmithConfig({
    from: '1 week ago',
    to: 'HEAD'
  })

  const stats = analyzeCommits(config)

  const message = {
    text: '📊 Weekly Repository Statistics',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Repository Activity Summary*\n• Total Commits: ${stats.totalCommits}\n• Contributors: ${stats.contributors}\n• Average per day: ${stats.trends.commitFrequency.averagePerDay.toFixed(1)}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Most Active Contributor:* ${stats.trends.contributorGrowth.mostActiveContributor.name} (${stats.trends.contributorGrowth.mostActiveContributor.commits} commits)`
        }
      }
    ]
  }

  // Send to Slack webhook
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  })
}
```

## Insights and Patterns

### Development Health Indicators

Monitor these key metrics for project health:

1. **Consistent Activity**: Regular commits indicate steady development
2. **Contributor Growth**: New contributors suggest project health
3. **Balanced Commit Types**: Good mix of features, fixes, and maintenance
4. **Breaking Change Frequency**: Monitor API stability
5. **Documentation Ratio**: Track docs vs. code commits

### Identifying Trends

```typescript
async function analyzeHealthTrends() {
  const periods = [
    { name: 'Last Week', from: '1 week ago' },
    { name: 'Last Month', from: '1 month ago' },
    { name: 'Last Quarter', from: '3 months ago' }
  ]

  const trends = {}

  for (const period of periods) {
    const config = await loadLogsmithConfig({ from: period.from })
    const stats = analyzeCommits(config)

    trends[period.name] = {
      avgCommitsPerDay: stats.trends.commitFrequency.averagePerDay,
      contributorCount: stats.contributors,
      featureRatio: (stats.commitTypes.feat || 0) / stats.totalCommits,
      docsRatio: (stats.commitTypes.docs || 0) / stats.totalCommits,
      breakingChangeRate: stats.breakingChanges / stats.totalCommits
    }
  }

  return trends
}
```

## Best Practices

### Regular Analysis

1. **Weekly Reviews**: Monitor recent activity and contributor engagement
2. **Monthly Reports**: Track longer-term trends and project health
3. **Release Analysis**: Compare activity between releases
4. **Quarter Planning**: Use insights for roadmap planning

### Team Insights

1. **Onboarding Success**: Track new contributor first commits
2. **Workload Distribution**: Ensure balanced contribution
3. **Expertise Areas**: Identify specialists by commit types/scopes
4. **Mentorship Opportunities**: Connect experienced with new contributors

### Project Management

1. **Development Velocity**: Track commits per sprint/milestone
2. **Quality Metrics**: Monitor fix-to-feature ratios
3. **Technical Debt**: Track refactor and chore commit trends
4. **Documentation Health**: Ensure docs keep pace with features

## Next Steps

- [Learn about theming options](/features/theming) for customizing appearance
- [Explore automation setups](/advanced/automation) for CI/CD integration
- [Check configuration options](/config) for advanced filtering
- [Review the API reference](/api/reference) for programmatic usage
