import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import generatedSidebar from './src/lib/generated/sidebar.json' with { type: 'json' };
import redirectsManifest from './migration/redirects.generated.json' with { type: 'json' };

const redirectEntries = (redirectsManifest.redirects || []).map((rule) => [rule.source, rule.destination]);

const redirects = {
  '/home': '/',
  '/docs': '/docs/getting-started/welcome',
  '/site': '/demo',
  '/site/demo': '/demo',
  '/video-demo': '/demo',
  '/use-cases': '/',
  '/faq': '/',
  '/api-reference': '/',
  '/blog/all': '/blog',
  '/changelog/all': '/changelog',
  ...Object.fromEntries(redirectEntries),
};

export default defineConfig({
  site: process.env.SITE_URL || 'https://docs.gopromptless.ai',
  redirects,
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },
  integrations: [
    starlight({
      title: 'Promptless | Documentation',
      description: 'Automated docs that eliminate manual overhead and keep your docs current with your codebase',
      logo: {
        src: './fern/docs/assets/logo.svg',
        dark: './fern/docs/assets/logo_darkbg.svg',
        alt: 'Promptless',
        replacesTitle: true,
      },
      favicon: '/favicon.ico',
      customCss: ['./src/styles/custom.css', './src/styles/site.css'],
      sidebar: generatedSidebar,
      components: {
        Header: './src/components/starlight/Header.astro',
        SiteTitle: './src/components/starlight/SiteTitle.astro',
        PageTitle: './src/components/starlight/PageTitle.astro',
        Footer: './src/components/starlight/Footer.astro',
        ThemeProvider: './src/components/starlight/ThemeProviderLightOnly.astro',
        MobileMenuFooter: './src/components/starlight/MobileMenuFooter.astro',
      },
      titleDelimiter: '|',
      markdown: {
        processedDirs: ['./src/content/blog', './src/content/changelog', './src/content/website'],
      },
      editLink: {
        baseUrl: 'https://github.com/Promptless/docs/tree/main',
      },
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
        '@lib': '/src/lib',
      },
    },
  },
});
