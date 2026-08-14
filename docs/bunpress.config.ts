import type { BunPressConfig } from 'bunpress'

export default {
  name: 'ts-open-api',
  description: 'Blazingly fast OpenAPI to TypeScript type generator built with Bun',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/reference' },
      { text: 'GitHub', link: 'https://github.com/stacksjs/ts-open-api' }
    ],
    sidebar: {
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Overview', link: '/' },
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Type Generation', link: '/guide/generation' },
            { text: 'CLI Usage', link: '/guide/cli' },
            { text: 'Schema Validation', link: '/features/validation' },
            { text: 'Watch Mode', link: '/features/watch' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Custom Templates', link: '/advanced/templates' },
            { text: 'Type Transformations', link: '/advanced/transformations' },
            { text: 'Schema Extensions', link: '/advanced/extensions' },
            { text: 'CI/CD Integration', link: '/advanced/cicd' }
          ]
        },
        {
          text: 'API Reference',
          items: [
            { text: 'API Reference', link: '/api/reference' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/stacksjs/ts-open-api' },
      { icon: 'discord', link: 'https://discord.gg/stacksjs' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2024-present Stacks.js'
    }
  }
} satisfies BunPressConfig
