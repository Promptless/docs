# Doc Detective UI Tests

This directory contains Doc Detective test specifications for validating Promptless documentation against the actual product UI.

## Purpose

- Validate that UI procedures in docs match the actual product
- Auto-capture screenshots to detect when UI has changed
- Ensure documentation stays in sync with product updates

## Prerequisites

1. **Test Account**: Create a dedicated test account for Doc Detective (avoid using real user credentials)

2. **Environment Variables**: Copy `.env.example` to `.env` and fill in credentials:
   ```bash
   cp .env.example .env
   ```

3. **GitHub Secrets** (for CI): Add these to your repo secrets:
   - `DOC_DETECTIVE_EMAIL`
   - `DOC_DETECTIVE_PASSWORD`

## Running Tests Locally

Run all tests:
```bash
npm run test:docs
```

Run a specific test spec:
```bash
npm run test:docs:spec tests/specs/getting-started.spec.json
```

## Test Structure

```
tests/
  specs/                           # Test specifications
    getting-started.spec.json      # Tests for getting-started.mdx
    slack-interactions.spec.json   # Tests for slack-interactions.mdx
  README.md                        # This file

screenshots/                       # Captured UI screenshots
test-results/                      # Test execution results
```

## Writing Tests

Test specs follow the Doc Detective JSON format. Each test contains:

1. **Login steps**: Authenticate before testing protected UI
2. **Navigation**: Go to specific pages
3. **Validation**: Find expected elements
4. **Screenshots**: Capture UI state

Example test step:
```json
{
  "action": "find",
  "selector": "text=Connect Slack",
  "timeout": 10000
}
```

Common actions:
- `loadVariables`: Load environment variables from .env
- `goTo`: Navigate to a URL
- `find`: Verify an element exists
- `click`: Click an element
- `type`: Enter text
- `screenshot`: Capture the current page
- `wait`: Wait for a duration

## Screenshot Handling

Screenshots are captured with:
- `overwrite: "byVariation"`: Only overwrites if changed beyond tolerance
- `variationTolerance: 5`: 5% tolerance for minor UI changes

Screenshots are stored in `/screenshots/` and tracked in git to detect UI drift.

## CI/CD

Tests run automatically:
- On PRs that modify `fern/docs/**`
- Weekly on Monday at 9am UTC
- Manually via workflow dispatch

Results are uploaded as artifacts.

## Troubleshooting

**Tests failing on selectors**: The UI may have changed. Update selectors in the spec file to match current UI elements. Prefer `data-testid` attributes when available.

**Screenshots differing**: Review the new screenshots. If the UI change is intentional, commit the updated screenshots.

**Authentication failures**: Verify test credentials in `.env` are correct and the test account is active.
