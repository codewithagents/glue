import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import remarkGfm from 'remark-gfm'

// starlight-package-managers is a component library (not a Starlight plugin).
// Import PackageManagers directly in .mdx files when needed:
//   import { PackageManagers } from 'starlight-package-managers'

export default defineConfig({
  site: 'https://openapi.codewithagents.de',
  base: '/',
  // Explicitly enable GFM so markdown tables render in .mdx files
  // (Astro 6 + Starlight 0.39 do not apply it to MDX by default).
  markdown: {
    remarkPlugins: [remarkGfm],
  },
  integrations: [
    starlight({
      title: 'CodeWithAgents OpenAPI',
      description:
        'Generate types, a fetch client, React Query hooks, and Zod schemas from your OpenAPI spec, then map API errors straight to form fields.',
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:type', content: 'website' },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:title',
            content: 'CodeWithAgents OpenAPI: typed and validated OpenAPI tooling for TypeScript',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:description',
            content:
              'Generate types, a fetch client, React Query hooks, and Zod schemas from your OpenAPI spec, then map API errors straight to form fields.',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://openapi.codewithagents.de/og-image.png',
          },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:title',
            content: 'CodeWithAgents OpenAPI: typed and validated OpenAPI tooling for TypeScript',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:description',
            content:
              'Generate types, a fetch client, React Query hooks, and Zod schemas from your OpenAPI spec, then map API errors straight to form fields.',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: 'https://openapi.codewithagents.de/og-image.png',
          },
        },
      ],
      logo: {
        src: './src/assets/logo-cairn.svg',
        alt: 'CodeWithAgents OpenAPI',
      },
      favicon: '/favicon.svg',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/codewithagents/openapi-ts',
        },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        Footer: './src/components/Footer.astro',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started' },
            { label: 'Quickstart', slug: 'getting-started/quickstart' },
            { label: 'Migrating from hey-api or orval', slug: 'migrating' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Types & fetch client', slug: 'openapi-gen' },
            { label: 'React Query hooks', slug: 'openapi-react-query' },
            { label: 'Server interface', slug: 'openapi-server' },
            { label: 'Form error mapping', slug: 'api-errors' },
          ],
        },
        {
          label: 'Full-stack tutorial',
          slug: 'tutorial/full-stack',
        },
        {
          label: 'Compatibility',
          slug: 'compatibility',
        },
        {
          label: 'Roadmap',
          slug: 'roadmap',
        },
      ],
    }),
  ],
})
