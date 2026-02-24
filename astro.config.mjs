import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

import generatedSidebar from './src/lib/generated/sidebar.json' with { type: 'json' };
import redirectsManifest from './migration/redirects.generated.json' with { type: 'json' };

const redirectEntries = (redirectsManifest.redirects || []).map((rule) => [rule.source, rule.destination]);

const redirects = {
  '/home': '/',
  '/docs': '/docs/getting-started/welcome',
  '/page': '/',
  '/wtd': '/',
  '/hn': '/',
  '/site': '/demo',
  '/site/demo': '/demo',
  '/video-demo': '/demo',
  '/blog/customer-stories-vellum': '/blog/customer-stories/vellum',
  '/use-cases': '/',
  '/faq': '/',
  '/api-reference': '/',
  '/blog/all': '/blog',
  '/changelog/all': '/changelog',
  ...Object.fromEntries(redirectEntries),
};

export default defineConfig({
  site: process.env.SITE_URL || 'https://promptless.ai',
  redirects,
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },
  integrations: [
    react(),
    starlight({
      title: 'Promptless | Automatic updates for your customer-facing docs',
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
      head: [
        {
          tag: 'script',
          attrs: { src: 'https://www.googletagmanager.com/gtag/js?id=G-NHEW11ZR9F', async: true },
        },
        {
          tag: 'script',
          content: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-NHEW11ZR9F');`,
        },
        {
          tag: 'script',
          content: `!function(key){if(window.reb2b)return;window.reb2b={loaded:true};var s=document.createElement("script");s.async=true;s.src="https://b2bjsstore.s3.us-west-2.amazonaws.com/b/"+key+"/"+key+".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s,document.getElementsByTagName("script")[0]);}("4N210HEGE36Z");`,
        },
      ],
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
