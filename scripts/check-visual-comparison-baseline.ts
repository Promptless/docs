import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

const REQUIRED_FILES: readonly string[] = [
  'migration/visual-comparison/README.md',
  'migration/visual-comparison/reference/frances-home-desktop.png',
  'migration/visual-comparison/reference/frances-home-mobile.png',
  'migration/visual-comparison/reference/frances-video-demo-desktop.png',
  'migration/visual-comparison/reference/frances-video-demo-mobile.png',
  'migration/visual-comparison/metrics/frances-layout-primitives.json',
  'migration/visual-comparison/metrics/frances-layout-primitives.md',
  'migration/visual-comparison/checklists/milestone-gates.md',
  'migration/visual-comparison/checklists/no-clobbering.md',
  'migration/visual-comparison/candidate/gate-1-header/docs-welcome-desktop.png',
  'migration/visual-comparison/candidate/gate-1-header/docs-welcome-mobile.png',
  'migration/visual-comparison/candidate/gate-1-header/blog-desktop.png',
  'migration/visual-comparison/candidate/gate-1-header/blog-mobile.png',
  'migration/visual-comparison/candidate/gate-1-header/changelog-desktop.png',
  'migration/visual-comparison/candidate/gate-1-header/changelog-mobile.png',
  'migration/visual-comparison/candidate/gate-2-home/home-desktop.png',
  'migration/visual-comparison/candidate/gate-2-home/home-mobile.png',
  'migration/visual-comparison/candidate/gate-3-demo/demo-desktop.png',
  'migration/visual-comparison/candidate/gate-3-demo/demo-mobile.png',
  'migration/visual-comparison/candidate/gate-4-global/home-desktop.png',
  'migration/visual-comparison/candidate/gate-4-global/home-mobile.png',
  'migration/visual-comparison/candidate/gate-4-global/demo-desktop.png',
  'migration/visual-comparison/candidate/gate-4-global/demo-mobile.png',
  'migration/visual-comparison/candidate/gate-4-global/docs-welcome-desktop.png',
  'migration/visual-comparison/candidate/gate-4-global/docs-welcome-mobile.png',
  'migration/visual-comparison/candidate/gate-4-global/blog-desktop.png',
  'migration/visual-comparison/candidate/gate-4-global/blog-mobile.png',
  'migration/visual-comparison/candidate/gate-4-global/changelog-desktop.png',
  'migration/visual-comparison/candidate/gate-4-global/changelog-mobile.png',
];

const README_SNIPPETS: readonly string[] = [
  'http://127.0.0.1:3002',
  'Fallback when browser tooling is unavailable',
  '/demo',
];

const MILESTONE_SNIPPETS: readonly string[] = [
  'Gate 1: Shared shell/header updates',
  'Gate 2: Homepage port (`/`)',
  'Gate 3: Demo page port (`/demo`)',
  'Gate 4: Global style unification across docs/blog/changelog',
  'Match intent',
  'Divergence',
  'Reason',
];

const NO_CLOBBERING_SNIPPETS: readonly string[] = [
  'unified visual language across `/`, `/demo`, `/docs`, `/blog`, `/changelog`',
  'Pass',
  'Fail',
];

const FORBIDDEN_PLACEHOLDERS: readonly string[] = ['_add candidate path_', '_fill_'];

async function ensureFileExists(relativePath: string): Promise<void> {
  const absolutePath = path.join(ROOT, relativePath);
  await access(absolutePath);
  const fileStats = await stat(absolutePath);
  if (!fileStats.isFile()) {
    throw new Error(`${relativePath} is not a file.`);
  }
  if (fileStats.size === 0) {
    throw new Error(`${relativePath} is empty.`);
  }
}

async function ensureTextContains(relativePath: string, snippets: readonly string[]): Promise<void> {
  const absolutePath = path.join(ROOT, relativePath);
  const contents = await readFile(absolutePath, 'utf8');
  for (const snippet of snippets) {
    if (!contents.includes(snippet)) {
      throw new Error(`${relativePath} is missing required text: "${snippet}"`);
    }
  }
}

async function ensureTextDoesNotContain(relativePath: string, snippets: readonly string[]): Promise<void> {
  const absolutePath = path.join(ROOT, relativePath);
  const contents = await readFile(absolutePath, 'utf8');
  for (const snippet of snippets) {
    if (contents.includes(snippet)) {
      throw new Error(`${relativePath} still contains placeholder text: "${snippet}"`);
    }
  }
}

async function main(): Promise<void> {
  await Promise.all(REQUIRED_FILES.map((relativePath) => ensureFileExists(relativePath)));

  await Promise.all([
    ensureTextContains('migration/visual-comparison/README.md', README_SNIPPETS),
    ensureTextContains('migration/visual-comparison/checklists/milestone-gates.md', MILESTONE_SNIPPETS),
    ensureTextContains('migration/visual-comparison/checklists/no-clobbering.md', NO_CLOBBERING_SNIPPETS),
    ensureTextDoesNotContain('migration/visual-comparison/checklists/milestone-gates.md', FORBIDDEN_PLACEHOLDERS),
    ensureTextDoesNotContain('migration/visual-comparison/checklists/no-clobbering.md', FORBIDDEN_PLACEHOLDERS),
  ]);

  console.log('Visual comparison baseline check passed.');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
