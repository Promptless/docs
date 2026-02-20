export type WebsitePageId = 'home' | 'demo' | 'pricing';

export interface WebsiteNavItem {
  id: WebsitePageId;
  href: string;
  label: string;
  icon: 'home' | 'video' | 'pricing';
}

interface WebsiteSidebarLink {
  label: string;
  link: string;
  attrs?: Record<string, string>;
}

export const WEBSITE_NAV_ITEMS: WebsiteNavItem[] = [
  { id: 'home', href: '/', label: 'Home', icon: 'home' },
  { id: 'demo', href: '/demo', label: 'Demo Video', icon: 'video' },
  { id: 'pricing', href: '/pricing', label: 'Pricing', icon: 'pricing' },
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
