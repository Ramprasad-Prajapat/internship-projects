# Spring Boot 3 + MySQL Backend Integration Guide

## Overview
This document details how to connect this React frontend to a Spring Boot backend API. No frontend layout or component redesign is required.

## API Contracts & Transport
The frontend includes pre-built REST API transport layer in `src/api/` and `src/services/apiService.ts`.

### Expected Spring Boot REST Endpoints

1. **Projects Endpoint**: `/api/v1/projects`
   - `GET /api/v1/projects?page=0&size=10&sort=createdAt,desc`
   - `POST /api/v1/projects` (Admin)
   - `PUT /api/v1/projects/{id}` (Admin)
   - `DELETE /api/v1/projects/{id}` (Admin)

2. **Experience Endpoint**: `/api/v1/experiences`
3. **Education Endpoint**: `/api/v1/education`
4. **Skills Endpoint**: `/api/v1/skills`
5. **Certifications Endpoint**: `/api/v1/certifications`
6. **Contact Messages Endpoint**: `/api/v1/contact`
   - `POST /api/v1/contact` (Public visitor contact message)

7. **Authentication Endpoint**: `/api/v1/auth`
   - `POST /api/v1/auth/login` -> returns `{ accessToken, refreshToken }`
   - `POST /api/v1/auth/refresh` -> returns new `{ accessToken }`

## Standardized JSON Response Structure

Spring Boot controllers should return:

```json
{
  "status": 200,
  "message": "Success",
  "data": { ... },
  "meta": {
    "page": 0,
    "size": 10,
    "total": 100,
    "pages": 10
  }
}
```

## JWT Security Flow
- The request interceptor in `src/api/interceptors.ts` automatically attaches `Authorization: Bearer <token>` from `tokenManager`.
- If HTTP status `401` is received, the interceptor automatically attempts to call the refresh token endpoint and retries the request seamlessly.
