#!/bin/bash
#
# check-internal-links.sh
# 
# Validates internal documentation links to prevent broken links.
# Uses scripts/valid-urls.txt as the source of truth for valid URL paths.
#
# Usage:
#   ./scripts/check-internal-links.sh          # Check all internal links
#   ./scripts/check-internal-links.sh --update # Update valid-urls.txt from docs.yml
#
# Exit codes:
#   0 - All links valid (or update successful)
#   1 - Broken links found (or update failed)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALID_URLS_FILE="$SCRIPT_DIR/valid-urls.txt"
DOCS_DIR="fern/docs"

# Colors for output (disabled in CI for cleaner logs)
if [[ "${CI:-}" == "true" ]] || [[ ! -t 1 ]]; then
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    NC=''
else
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m'
fi

# Update the valid URLs file by parsing docs.yml
update_valid_urls() {
    echo "📝 Updating valid-urls.txt from docs.yml..."
    
    if ! python3 -c "import yaml" 2>/dev/null; then
        echo -e "${RED}Error: Python 3 with PyYAML is required${NC}"
        echo "Install with: pip install pyyaml"
        return 1
    fi
    
    python3 << 'PYTHON_EOF' > "$VALID_URLS_FILE"
import yaml
import re

def slugify(text):
    """Convert text to URL-friendly slug matching Fern's behavior."""
    result = []
    for char in text:
        if char.isupper():
            if result and result[-1] != '-':
                result.append('-')
            result.append(char.lower())
        elif char.isalnum():
            result.append(char.lower())
        elif char in ' _-':
            if result and result[-1] != '-':
                result.append('-')
    return ''.join(result).strip('-')

def get_slug_from_path(path, explicit_slug=None):
    """Get URL slug from file path or explicit slug."""
    if explicit_slug:
        return explicit_slug
    path = re.sub(r'^\./docs/', '', path)
    path = re.sub(r'\.(mdx?|yml|yaml)$', '', path)
    filename = path.split('/')[-1]
    if filename == 'index':
        return None
    return slugify(filename)

def extract_urls(items, tab, section_slug='', urls=None):
    """Recursively extract URLs from navigation."""
    if urls is None:
        urls = set()
    
    for item in items:
        if not isinstance(item, dict):
            continue
        
        current_section = section_slug
        
        # Section handling
        if 'section' in item:
            current_section = slugify(item['section'])
            if 'path' in item:
                urls.add(f"/{tab}/{current_section}")
        
        # Page handling
        if 'page' in item and 'path' in item:
            slug = get_slug_from_path(item['path'], item.get('slug'))
            if slug:
                if current_section:
                    urls.add(f"/{tab}/{current_section}/{slug}")
                else:
                    urls.add(f"/{tab}/{slug}")
        
        # Recurse into contents
        if 'contents' in item:
            extract_urls(item['contents'], tab, current_section, urls)
    
    return urls

with open('fern/docs.yml', 'r') as f:
    config = yaml.safe_load(f)

all_urls = set(['/docs', '/blog', '/changelog', '/self-hosting'])

if 'navigation' in config:
    for nav in config['navigation']:
        if isinstance(nav, dict) and 'tab' in nav and 'layout' in nav:
            extract_urls(nav['layout'], nav['tab'], '', all_urls)

# Print header
print("# Valid internal URL paths for docs.gopromptless.ai")
print("# Generated from fern/docs.yml")
print("# Regenerate with: ./scripts/check-internal-links.sh --update")
print("#")
for url in sorted(all_urls):
    print(url)
PYTHON_EOF
    
    local count
    count=$(grep -v '^#' "$VALID_URLS_FILE" | grep -c . || echo "0")
    echo -e "${GREEN}✓ Updated valid-urls.txt with ${count} URLs${NC}"
}

# Extract internal links from a file
extract_links() {
    local file="$1"
    
    # Extract markdown links: [text](/path)
    grep -oE '\]\([^)]+\)' "$file" 2>/dev/null | \
        grep -oE '\(/[^)#" ]+' | \
        sed 's/^(//' | \
        grep -E '^/(docs|blog|changelog|self-hosting)' || true
    
    # Extract href attributes: href="/path"
    grep -oE 'href="[^"]*"' "$file" 2>/dev/null | \
        grep -oE '"/[^"#]+' | \
        sed 's/^"//' | \
        grep -E '^/(docs|blog|changelog|self-hosting)' || true
}

# Check all internal links
check_links() {
    echo "🔍 Checking internal documentation links..."
    echo ""
    
    if [[ ! -f "$VALID_URLS_FILE" ]]; then
        echo -e "${YELLOW}Warning: valid-urls.txt not found. Generating...${NC}"
        update_valid_urls
        echo ""
    fi
    
    local valid_urls
    valid_urls=$(grep -v '^#' "$VALID_URLS_FILE" | grep . || true)
    
    local url_count
    url_count=$(echo "$valid_urls" | wc -l | tr -d ' ')
    echo -e "${BLUE}Loaded ${url_count} valid URL paths${NC}"
    echo ""
    
    local error_count=0
    local checked_count=0
    
    while IFS= read -r -d '' file; do
        local links
        links=$(extract_links "$file")
        
        if [[ -n "$links" ]]; then
            while IFS= read -r link; do
                [[ -z "$link" ]] && continue
                link="${link%/}"
                ((checked_count++))
                
                if ! echo "$valid_urls" | grep -qxF "$link"; then
                    echo -e "${RED}✗${NC} Broken link in ${YELLOW}${file}${NC}"
                    echo "  → ${link}"
                    echo ""
                    ((error_count++))
                fi
            done <<< "$links"
        fi
    done < <(find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -print0)
    
    echo "----------------------------------------"
    echo "Checked ${checked_count} internal link(s)"
    echo ""
    
    if [[ $error_count -eq 0 ]]; then
        echo -e "${GREEN}✓ All internal links are valid!${NC}"
        return 0
    else
        echo -e "${RED}✗ Found ${error_count} broken link(s)${NC}"
        echo ""
        echo "To fix broken links:"
        echo "  1. Verify the URL exists in fern/docs.yml"
        echo "  2. Check for 'slug:' overrides in docs.yml"
        echo "  3. If docs.yml changed, run: ./scripts/check-internal-links.sh --update"
        return 1
    fi
}

# Main
case "${1:-}" in
    --update|-u)
        update_valid_urls
        ;;
    --help|-h)
        echo "Usage: $0 [--update]"
        echo ""
        echo "Options:"
        echo "  --update, -u    Regenerate valid-urls.txt from docs.yml"
        echo "  --help, -h      Show this help message"
        echo ""
        echo "Without options, checks all internal links against valid-urls.txt"
        ;;
    *)
        check_links
        ;;
esac
