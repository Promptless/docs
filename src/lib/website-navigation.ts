export type WebsitePageId = 'home' | 'demo' | 'pricing' | 'meet' | 'wtd-portland-2026';

export interface WebsiteNavItem {
  id: WebsitePageId;
  href: string;
  label: string;
  icon: 'overview' | 'video' | 'pricing' | 'meet' | 'calendar';
}

interface WebsiteSidebarLink {
  label: string;
  link: string;
  attrs?: Record<string, string>;
}

export const WEBSITE_NAV_ITEMS: WebsiteNavItem[] = [
  { id: 'home', href: '/', label: 'Overview', icon: 'overview' },
  { id: 'demo', href: '/demo', label: 'Demo', icon: 'video' },
  { id: 'pricing', href: '/pricing', label: 'Pricing', icon: 'pricing' },
  { id: 'meet', href: '/meet', label: 'Meet', icon: 'meet' },
  { id: 'wtd-portland-2026', href: '/wtd-portland-2026', label: 'WTD 2026', icon: 'calendar' },
];

export function getWebsiteSidebarLinks(): WebsiteSidebarLink[] {
  return WEBSITE_NAV_ITEMS.map((item) => ({
    label: item.label,
    link: item.href,
    attrs: {
      'data-website-sidebar': 'true',
      'data-site-icon': item.icon,
    },
  }));
}
