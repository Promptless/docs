#!/usr/bin/env python3
"""
Agent Readiness Score
Scans a documentation directory and scores it for AI agent readiness.

Usage:
  python score.py <directory>          # Human-readable table
  python score.py <directory> --json  # JSON output (for programmatic use)

Criteria (25 pts each, 100 total):
  1. Self-contained sections  — avoids forward/backward references
  2. Code coverage            — pages have examples, with inline comments
  3. Error/failure docs       — troubleshooting, error codes, known issues
  4. Structured content       — tables, lists, callouts over pure prose
"""

import sys
import re
import json
import argparse
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Dict, Any


# ─── Patterns ──────────────────────────────────────────────────────────────────

BACKWARD_REF_PATTERNS = [
    r'\bsee above\b',
    r'\bas described above\b',
    r'\bmentioned above\b',
    r'\bas noted above\b',
    r'\bshown above\b',
    r'\bas discussed above\b',
    r'\bthe above\b',
    r'\bfrom above\b',
    r'\bprevious section\b',
    r'\bprevious page\b',
    r'\bin the previous\b',
    r'\brefer(red)? to (the )?previous\b',
    r'\bas mentioned earlier\b',
    r'\bas described earlier\b',
    r'\bas explained earlier\b',
    r'\bsee (the )?previous\b',
    r'\bdescribed (in the )?previous\b',
]

ERROR_HEADING_PATTERN = re.compile(
    r'^#{1,4}\s*(errors?|troubleshoot(ing)?|debug(ging)?|common (errors?|issues?|problems?)|'
    r'known (issues?|bugs?|limitations?)|limitations?|caveats?|failure modes?|gotchas?|'
    r'faq|frequently asked)\b',
    re.IGNORECASE | re.MULTILINE,
)

ERROR_CONTENT_PATTERN = re.compile(
    r'(error code|status code [45]\d\d|`[A-Z][A-Z_]+_ERROR`|\berror:\s|\bexception:\s)',
    re.IGNORECASE,
)

CALLOUT_PATTERNS = [
    re.compile(r'^>\s*\*\*(note|warning|important|caution|tip|info|danger)\b', re.IGNORECASE | re.MULTILINE),
    re.compile(r'<(Note|Warning|Important|Caution|Tip|Info|Callout|Danger)\b'),
    re.compile(r':::(note|warning|important|caution|tip|info|danger)\b', re.IGNORECASE),
]


# ─── MDX stripping ─────────────────────────────────────────────────────────────

def strip_mdx(content: str) -> str:
    """Remove MDX imports and JSX so text patterns work correctly."""
    content = re.sub(r'^import\s+.*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'<\w[\w.]*[^>]*/>', ' ', content)          # self-closing tags
    content = re.sub(r'</?[\w.]+(?:\s[^>]*)?>',  ' ', content)   # open/close tags
    return content


def strip_frontmatter(content: str) -> str:
    """Remove YAML frontmatter."""
    if content.startswith('---'):
        end = content.find('\n---', 3)
        if end != -1:
            return content[end + 4:]
    return content


# ─── Scoring ───────────────────────────────────────────────────────────────────

@dataclass
class PageScore:
    path: str
    self_containedness: int   # /25
    code_coverage: int        # /25
    error_coverage: int       # /25
    structure: int            # /25
    issues: List[str] = field(default_factory=list)

    @property
    def total(self) -> int:
        return self.self_containedness + self.code_coverage + self.error_coverage + self.structure


def score_page(rel_path: Path, content: str) -> PageScore:
    content = strip_frontmatter(content)
    clean = strip_mdx(content)
    lines = clean.split('\n')
    issues: List[str] = []

    # ── 1. Self-containedness (0–25) ──────────────────────────────────────────
    ref_hits = []
    for i, line in enumerate(lines, 1):
        for pattern in BACKWARD_REF_PATTERNS:
            if re.search(pattern, line, re.IGNORECASE):
                snippet = line.strip()[:80]
                ref_hits.append(f"line {i}: \"{snippet}\"")
                break  # one hit per line is enough
    self_score = max(0, 25 - len(ref_hits) * 5)
    if ref_hits:
        issues.append(f"{len(ref_hits)} backward reference(s): " + "; ".join(ref_hits[:3]))

    # ── 2. Code coverage (0–25) ───────────────────────────────────────────────
    code_blocks = re.findall(r'```[\s\S]*?```', content)
    has_code = len(code_blocks) > 0
    has_commented_code = has_code and any(
        re.search(r'(#|//|/\*)\s+\w', block) for block in code_blocks
    )
    code_score = (20 if has_code else 0) + (5 if has_commented_code else 0)
    if not has_code:
        issues.append("no code examples")
    elif not has_commented_code:
        issues.append("code blocks have no inline comments")

    # ── 3. Error/failure coverage (0–25) ─────────────────────────────────────
    has_error_heading = bool(ERROR_HEADING_PATTERN.search(clean))
    has_error_content = bool(ERROR_CONTENT_PATTERN.search(clean))
    if has_error_heading:
        error_score = 25
    elif has_error_content:
        error_score = 12
        issues.append("mentions errors but no dedicated troubleshooting section")
    else:
        error_score = 0
        issues.append("no error or troubleshooting content")

    # ── 4. Structured content (0–25) ─────────────────────────────────────────
    has_table   = bool(re.search(r'^\|.+\|', clean, re.MULTILINE))
    has_list    = bool(re.search(r'^[ \t]*[-*+] \S|^[ \t]*\d+\. \S', clean, re.MULTILINE))
    has_callout = any(p.search(clean) for p in CALLOUT_PATTERNS)
    structure_score = (10 if has_table else 0) + (10 if has_list else 0) + (5 if has_callout else 0)
    if not has_table and not has_list:
        issues.append("mostly prose — consider tables or lists for key info")

    return PageScore(
        path=str(rel_path),
        self_containedness=self_score,
        code_coverage=code_score,
        error_coverage=error_score,
        structure=structure_score,
        issues=issues,
    )


# ─── Directory scan ────────────────────────────────────────────────────────────

def scan_directory(directory: Path) -> List[Path]:
    files = []
    for ext in ('*.md', '*.mdx'):
        files.extend(directory.rglob(ext))
    return sorted(files)


def score_section(directory: Path) -> Dict[str, Any]:
    files = scan_directory(directory)
    if not files:
        return {"error": f"No markdown files found in {directory}"}

    page_scores: List[PageScore] = []
    for f in files:
        try:
            content = f.read_text(encoding='utf-8')
            page_scores.append(score_page(f.relative_to(directory), content))
        except Exception as e:
            pass  # skip unreadable files

    n = len(page_scores)

    def avg(attr: str) -> int:
        return round(sum(getattr(p, attr) for p in page_scores) / n)

    return {
        "directory": str(directory),
        "page_count": n,
        "overall": avg("total"),
        "criteria": {
            "self_containedness": {"score": avg("self_containedness"), "max": 25, "label": "Self-contained sections"},
            "code_coverage":      {"score": avg("code_coverage"),      "max": 25, "label": "Code coverage"},
            "error_coverage":     {"score": avg("error_coverage"),     "max": 25, "label": "Error/failure docs"},
            "structure":          {"score": avg("structure"),          "max": 25, "label": "Structured content"},
        },
        "pages": [
            {"path": p.path, "score": p.total, "issues": p.issues}
            for p in sorted(page_scores, key=lambda p: p.total)
        ],
    }


# ─── Output formatting ─────────────────────────────────────────────────────────

def bar(score: int, max_score: int, width: int = 20) -> str:
    filled = round(score / max_score * width)
    return '█' * filled + '░' * (width - filled)


def print_table(result: Dict[str, Any]) -> None:
    if "error" in result:
        print(f"\nError: {result['error']}")
        return

    overall = result["overall"]
    grade = "Excellent" if overall >= 85 else "Good" if overall >= 70 else "Needs work" if overall >= 50 else "Poor"

    print(f"\n{'═' * 62}")
    print(f"  Agent Readiness Score: {overall}/100  ({grade})")
    print(f"  Directory : {result['directory']}")
    print(f"  Pages     : {result['page_count']}")
    print(f"{'═' * 62}")

    print(f"\n  {'Criterion':<28}  {'Score':>8}   {'Progress'}")
    print(f"  {'-' * 58}")
    for key, c in result["criteria"].items():
        s, m = c["score"], c["max"]
        print(f"  {c['label']:<28}  {s:>3}/{m:<3}   {bar(s, m)}")

    print(f"\n  {'Page':<46}  {'Score':>6}")
    print(f"  {'-' * 56}")
    for p in result["pages"]:
        icon = "✓" if p["score"] >= 80 else ("⚠" if p["score"] >= 50 else "✗")
        name = p["path"]
        if len(name) > 44:
            name = "…" + name[-43:]
        print(f"  {icon} {name:<44}  {p['score']:>4}/100")
        for issue in p["issues"][:2]:
            print(f"      → {issue[:72]}")

    print()


# ─── Entry point ───────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Score documentation for AI agent readiness.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("directory", help="Path to the docs directory to scan")
    parser.add_argument("--json", action="store_true", help="Output JSON instead of a table")
    args = parser.parse_args()

    d = Path(args.directory).expanduser().resolve()
    if not d.exists():
        print(f"Error: '{d}' does not exist.", file=sys.stderr)
        sys.exit(1)
    if not d.is_dir():
        print(f"Error: '{d}' is not a directory.", file=sys.stderr)
        sys.exit(1)

    result = score_section(d)

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print_table(result)


if __name__ == "__main__":
    main()
