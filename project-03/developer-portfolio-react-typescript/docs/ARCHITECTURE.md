# Frontend Architecture Guide

## Overview
This enterprise portfolio application is engineered using **React 18**, **TypeScript (Strict Mode)**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

The frontend is fully decoupled from data sources and designed for zero-redesign integration with a future **Spring Boot 3 + Java 21 + MySQL** REST backend.

## Folder Architecture

```text
src/
├── animations/        # Shared Framer Motion animation variants
├── api/               # Axios instance, request/response interceptors
├── assets/            # Static media and SVGs
├── components/        # Standardized UI components (common, about, showcase)
├── constants/         # Single source of truth data (portfolio.ts)
├── contexts/          # React context providers & type definitions
├── hooks/             # Custom React hooks (useTheme, useLoading, useNotification, etc.)
├── layouts/           # Page wrapper layouts (MainLayout)
├── lib/               # Utility abstractions (tokenManager)
├── pages/             # Dynamic and lazy-loaded page views
├── services/          # Reusable ApiService CRUD classes
├── styles/            # Global styles and design system variables
├── types/             # TypeScript interfaces and API contract models
└── utils/             # Helper functions (cn, sanitize)
```

## Key Architectural Principles
1. **Separation of Concerns**: UI rendering is separated from state management and API transport.
2. **Decoupled API Transport Layer**: Generic `ApiService<T>` handles REST calls, pagination, sorting, and error parsing without UI coupling.
3. **Accessibility**: Fully WCAG AA compliant with keyboard focus rings, skip-to-content, aria labels, and reduced-motion support.
4. **Theme System**: Persisted dark/light/system theme provider with zero flash on page load.
5. **SEO & PWA**: Dynamic metadata head management, JSON-LD Person schema, service worker caching, and manifest declaration.
