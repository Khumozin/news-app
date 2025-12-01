# Security Setup

## 🔒 Secret Management

This project uses Gitleaks to prevent committing secrets to the repository.

### Configuration Files

1. **`public/config.json`** (Committed)
   - Contains placeholder values only
   - Used as a template for CI/production
   - Gitleaks will **block commits** if this contains real secrets

2. **`public/config.local.json`** (Git-ignored)
   - Contains real API keys for local development
   - Never committed to git
   - Create this file locally with your real secrets

### Setup for Local Development

1. Create `public/config.local.json` with your real API key:
   ```json
   {
     "APP_API_URL": "https://newsapi.org/v2/everything",
     "APP_API_KEY": "your-real-api-key-here"
   }
   ```

2. The app will automatically load `config.local.json` if it exists, otherwise falls back to `config.json`

### CI/Production Setup

In CI/production environments, set environment variables:
- `APP_API_URL`
- `APP_API_KEY`

The Docker entrypoint script will automatically generate `config.json` from these environment variables.

### Pre-commit Checks

The pre-commit hook runs:
1. **Gitleaks** - Blocks commits with secrets
2. **Lint-staged** - Formats and lints code
3. **Tests** - Runs unit tests
4. **E2E Tests** - Runs Cypress tests

### Allowed Placeholder Values

Only these placeholder values are allowed in committed files:
- `PLACEHOLDER_API_KEY`
- `YOUR_API_KEY_HERE`
- `INSERT_API_KEY`

Any real API keys will be blocked by Gitleaks.

## Installing Gitleaks

```bash
# macOS
brew install gitleaks

# Or download from https://github.com/gitleaks/gitleaks/releases
```

## Testing the Setup

Try committing a file with a real API key - it should be blocked:
```bash
echo '{"API_KEY": ""}' > test.json
git add test.json
git commit -m "test"  # This will be blocked by Gitleaks
```
