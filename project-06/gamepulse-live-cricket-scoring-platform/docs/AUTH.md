# GamePulse Live — Authentication & Security Architecture

## 1. Overview
GamePulse Live uses a stateless **JSON Web Token (JWT)** authentication model powered by Spring Security 3.2. Passwords are encrypted using **BCrypt** with strength factor 10.

---

## 2. Role-Based Access Control (RBAC)

The system supports three granular roles:

```text
                  +-------------------+
                  |    ROLE_USER      |  --> Browse matches, view scorecards, vote on polls
                  +---------+---------+
                            |
                            v
                  +-------------------+
                  |   ROLE_SCORER     |  --> Create matches, manage toss, enter XI, score balls
                  +---------+---------+
                            |
                            v
                  +-------------------+
                  |    ROLE_ADMIN     |  --> Full platform control, score corrections, backups
                  +-------------------+
```

---

## 3. JWT Token Flow

1. Client sends POST request to `/api/auth/login` containing `{ "username": "scorer1", "password": "SecretPassword" }`.
2. `AuthController` authenticates credentials using Spring Security's `AuthenticationManager`.
3. Upon success, `JwtTokenProvider` signs a JWT signed with HMAC-SHA256 containing user ID, username, and role claim.
4. Client stores JWT in `localStorage` and includes it in subsequent HTTP requests:
   `Authorization: Bearer <token>`
5. `JwtAuthenticationFilter` intercepts requests, validates signature and expiration, extracts user claims, and sets `UsernamePasswordAuthenticationToken` in `SecurityContextHolder`.

---

## 4. Protected Endpoints Enforcement

Authorization is enforced at two levels:
1. **HTTP Security Filter Chain (`SecurityConfig.java`)**: Configures URL pattern matching for public endpoints vs authenticated routes.
2. **Method-Level Security (`@EnableMethodSecurity`)**: Annotates sensitive controller methods with `@PreAuthorize("hasRole('ADMIN')")` or `@PreAuthorize("hasAnyRole('SCORER', 'ADMIN')")`.
