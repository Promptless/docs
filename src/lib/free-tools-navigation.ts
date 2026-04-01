export type FreeToolPageId = 'overview' | 'broken_link_report' | 'support_agent_audit';

export interface FreeToolNavItem {
  id: FreeToolPageId;
  href: string;
  label: string;
}

interface FreeToolsSidebarLink {
  label: string;
  link: string;
}

export const FREE_TOOLS_NAV_ITEMS: FreeToolNavItem[] = [
  { id: 'overview', href: '/free-tools', label: 'Overview' },
  { id: 'broken_link_report', href: '/free-tools/broken-link-report', label: 'Broken Link Report' },
  { id: 'support_agent_audit', href: '/free-tools/support-agent-audit', label: 'Support Agent Audit' },
];

export function getFreeToolsSidebarLinks(): FreeToolsSidebarLink[] {
  return FREE_TOOLS_NAV_ITEMS.map((item) => ({
    label: item.label,
    link: item.href,
  }));
}
