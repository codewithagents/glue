import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import remarkGfm from 'remark-gfm'

// starlight-package-managers is a component library (not a Starlight plugin).
// Import PackageManagers directly in .mdx files when needed:
//   import { PackageManagers } from 'starlight-package-managers'

export default defineConfig({
  site: 'https://glue.codewithagents.de',
  base: '/',
  // Explicitly enable GFM so markdown tables render in .mdx files
  // (Astro 6 + Starlight 0.39 do not apply it to MDX by default).
  markdown: {
    remarkPlugins: [remarkGfm],
  },
  integrations: [
    starlight({
      title: 'Glue',
      description:
        'Generate types, a fetch client, React Query hooks, and Zod schemas from your OpenAPI spec, then map API errors straight to form fields.',
      logo: {
        src: './src/assets/logo-cairn.png',
        alt: 'Glue by CodeWithAgents',
      },
      favicon: '/favicon.svg',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/codewithagents/glue',
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
      ],
    }),
  ],
})
