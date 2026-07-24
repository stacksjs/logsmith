import type { BunpressConfig } from 'bunpress'

const config: BunpressConfig = {
  name: 'logsmith',
  description: 'Forge beautiful changelog automatically',
  url: 'https://logsmith.sh',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'keywords', content: 'changelog, git, release, conventional-commits, typescript' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Docs', link: '/intro' },
      { text: 'GitHub', link: 'https://github.com/stacksjs/logsmith' },
    ],

    sidebar: [
      {
        text: 'Get Started',
        items: [
          { text: 'Introduction', link: '/intro' },
          { text: 'Installation', link: '/install' },
          { text: 'Usage', link: '/usage' },
          { text: 'Configuration', link: '/config' },
        ],
      },
      {
        text: 'Features',
        items: [
          { text: 'Changelog Generation', link: '/features/changelog-generation' },
          { text: 'Commit Parsing', link: '/features/commit-parsing' },
          { text: 'Version Detection', link: '/features/version-detection' },
          { text: 'Multiple Formats', link: '/features/multiple-formats' },
          { text: 'Theming', link: '/features/theming' },
          { text: 'Repository Insights', link: '/features/repository-insights' },
        ],
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Configuration', link: '/advanced/configuration' },
          { text: 'Custom Templates', link: '/advanced/custom-templates' },
          { text: 'Performance', link: '/advanced/performance' },
          { text: 'CI/CD Integration', link: '/advanced/ci-cd-integration' },
          { text: 'Automation', link: '/advanced/automation' },
          { text: 'Cross-platform', link: '/advanced/cross-platform' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/stacksjs/logsmith' },
    ],
  },
}

export default config
