export type SiteSection = 'website' | 'docs' | 'blog' | 'changelog' | 'signin';

export interface TopNavItem {
  section: SiteSection;
  href: string;
  label: string;
  external?: boolean;
}

export const TOP_NAV_ITEMS: TopNavItem[] = [
  { section: 'website', href: '/', label: 'Website' },
  { section: 'docs', href: '/docs', label: 'Docs' },
  { section: 'blog', href: '/blog', label: 'Blog' },
  { section: 'changelog', href: '/changelog', label: 'Changelog' },
  {
    section: 'signin',
    href: 'https://app.gopromptless.ai',
    label: 'Sign in',
    external: true,
  },
];

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function getActiveSection(pathname: string): SiteSection {
  const normalized = normalizePathname(pathname);
  if (
    normalized === '/' ||
    normalized === '/home' ||
    normalized === '/demo' ||
    normalized === '/pricing' ||
    normalized.startsWith('/site')
  ) {
    return 'website';
  }
  if (normalized.startsWith('/docs')) return 'docs';
  if (normalized.startsWith('/blog')) return 'blog';
  if (normalized.startsWith('/changelog')) return 'changelog';
  return 'website';
}
