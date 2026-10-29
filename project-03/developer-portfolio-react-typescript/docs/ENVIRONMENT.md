# Environment Variables Guide

## Overview
All environment variables are managed using Vite standard `import.meta.env` and prefixed with `VITE_`.

## Variable Definitions

| Variable Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_APP_TITLE` | `string` | `"Ramprasad Portfolio"` | Application browser title |
| `VITE_APP_ENV` | `string` | `"development"` | Current execution environment (`development`, `production`, `test`) |
| `VITE_API_BASE_URL` | `string` | `"http://localhost:8080"` | Base URL for Spring Boot REST API |
| `VITE_ENABLE_ANALYTICS` | `boolean` | `false` | Enable or disable visitor analytics tracking |
| `VITE_ENABLE_PWA` | `boolean` | `true` | Enable or disable Progressive Web App caching |

## Secret Protection Policy
Never put private tokens, database credentials, or secret keys in `VITE_` variables. All `VITE_` variables are bundled directly into frontend JavaScript static assets.
