# Deployment Guide

## Overview
This application is ready for production deployment across Vercel, Netlify, GitHub Pages, or Docker containers.

## 1. Deploying to Vercel
1. Push repository to GitHub/GitLab.
2. Import project into Vercel.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable: `VITE_API_BASE_URL`

## 2. Deploying to Netlify
1. Build Command: `npm run build`
2. Publish Directory: `dist`
3. Include standard `_redirects` file for SPA routing:
   `/*  /index.html  200`

## 3. Deploying via Docker
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
