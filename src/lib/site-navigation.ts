export type SiteSection = 'docs' | 'blog' | 'changelog';

export interface TopNavItem {
  section: SiteSection;
  href: string;
  label: string;
}

export const TOP_NAV_ITEMS: TopNavItem[] = [
  { section: 'docs', href: '/docs', label: 'Docs' },
  { section: 'blog', href: '/blog', label: 'Blog' },
  { section: 'changelog', href: '/changelog', label: 'Changelog' },
];

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function getActiveSection(pathname: string): SiteSection {
  const normalized = normalizePathname(pathname);
  if (normalized === '/' || normalized.startsWith('/docs')) return 'docs';
  if (normalized.startsWith('/blog')) return 'blog';
  if (normalized.startsWith('/changelog')) return 'changelog';
  return 'docs';
}
