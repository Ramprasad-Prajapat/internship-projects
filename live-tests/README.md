# Live Deployment Test Suite

Automated Playwright smoke, interaction, and API tests for live internship projects deployed to cloud infrastructure.

## Structure
- `playwright.config.ts`: Configuration (Chromium, fake media streams, camera & mic permissions, retries, reporters)
- `urls.json`: Map of project URLs (production and local)
- `global-setup.ts`: Service warm-up for Render free-tier backends before test runs
- `helpers/testHelpers.ts`: URL resolver, error listeners, warm-up helpers
- `tests/*.spec.ts`: Dedicated test spec for each deployable project

## Running Tests

### 1. Prerequisites
Install dependencies and Playwright Chromium:
```bash
npm ci
npx playwright install chromium
```

### 2. Run Against Production Deployment
```bash
npm run test:live
```

### 3. Run Only Smoke Tests
```bash
npm run test:smoke
```

### 4. Run Only API Tests
```bash
npm run test:api
```

### 5. Run Against Local Servers
```bash
$env:TARGET = "local"
npm run test:live
```
