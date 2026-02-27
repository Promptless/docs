export type SiteSection = 'website' | 'docs' | 'blog' | 'changelog' | 'free_tools' | 'signin';
export type TopNavIcon = 'website' | 'docs' | 'blog' | 'changelog' | 'free_tools';

interface TopNavBaseItem {
  section: SiteSection;
  label: string;
  icon?: TopNavIcon;
}

export interface TopNavLinkItem extends TopNavBaseItem {
  href: string;
  external?: boolean;
}

export type TopNavItem = TopNavLinkItem;

export const TOP_NAV_ITEMS: TopNavItem[] = [
  { section: 'website', href: '/', label: 'Home', icon: 'website' },
  { section: 'docs', href: '/docs', label: 'Docs', icon: 'docs' },
  { section: 'blog', href: '/blog', label: 'Blog', icon: 'blog' },
  { section: 'changelog', href: '/changelog', label: 'Changelog', icon: 'changelog' },
  { section: 'free_tools', href: '/free-tools', label: 'Free tools', icon: 'free_tools' },
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
    normalized === '/meet' ||
    normalized.startsWith('/site')
  ) {
    return 'website';
  }
  if (normalized.startsWith('/docs')) return 'docs';
  if (normalized.startsWith('/blog')) return 'blog';
  if (normalized.startsWith('/changelog')) return 'changelog';
  if (normalized.startsWith('/free-tools')) return 'free_tools';
  return 'website';
}
