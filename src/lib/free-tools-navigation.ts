export type FreeToolPageId = 'overview' | 'broken_link_report' | 'docs_debt_quiz';

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
  { id: 'docs_debt_quiz', href: '/free-tools/docs-debt-quiz', label: 'Docs Debt Quiz' },
];

export function getFreeToolsSidebarLinks(): FreeToolsSidebarLink[] {
  return FREE_TOOLS_NAV_ITEMS.map((item) => ({
    label: item.label,
    link: item.href,
  }));
}
