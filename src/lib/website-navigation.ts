export type WebsitePageId = 'home' | 'demo' | 'pricing' | 'meet';

export interface WebsiteNavItem {
  id: WebsitePageId;
  href: string;
  label: string;
  icon: 'home' | 'video' | 'pricing' | 'meet';
}

interface WebsiteSidebarLink {
  label: string;
  link: string;
  attrs?: Record<string, string>;
}

export const WEBSITE_NAV_ITEMS: WebsiteNavItem[] = [
  { id: 'home', href: '/', label: 'Home', icon: 'home' },
  { id: 'demo', href: '/demo', label: 'Demo', icon: 'video' },
  { id: 'pricing', href: '/pricing', label: 'Pricing', icon: 'pricing' },
  { id: 'meet', href: '/meet', label: 'Meet', icon: 'meet' },
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
