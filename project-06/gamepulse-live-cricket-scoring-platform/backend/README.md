# GamePulse Live — Backend (Planned)

> **Status: Not implemented yet.**
> This folder contains only the planned Spring Boot package structure. No Java code,
> `pom.xml`, or `application.properties` has been created at this stage. The current
> development phase is **frontend-first** using mock data + localStorage.

## Planned Stack

| Technology       | Use                     |
| ---------------- | ----------------------- |
| Java 21          | Backend language        |
| Spring Boot 3    | Backend framework       |
| Spring Web       | REST APIs               |
| Spring Security  | Authentication          |
| JWT              | Secure login            |
| Spring Data JPA  | Database operations     |
| Spring WebSocket | Real-time score updates |
| MySQL Driver     | MySQL connection        |
| Swagger/OpenAPI  | API documentation       |

## Planned Package Structure

```text
backend/
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── gamepulse/
        │           ├── controller/   # REST controllers
        │           ├── service/      # Business logic
        │           ├── repository/   # Spring Data JPA repositories
        │           ├── entity/       # JPA entities (DB tables)
        │           ├── dto/          # Request/response DTOs
        │           ├── security/     # JWT + Spring Security config
        │           └── config/       # App configuration (CORS, WebSocket, etc.)
        └── resources/                # application.properties, static, templates
```

## Planned Modules

| Module           | Use                       |
| ---------------- | ------------------------- |
| Auth Module      | Login/register            |
| Match Module     | Match management          |
| Team Module      | Team management           |
| Player Module    | Player management         |
| Stream Module    | YouTube stream management |
| Score Module     | Live score update         |
| Event Module     | Ball-by-ball commentary   |
| Highlight Module | Highlight management      |
| Poll Module      | Fan poll                  |
| WebSocket Module | Real-time updates         |

## Planned Environment Variables

```env
DB_URL=jdbc:mysql://localhost:3306/gamepulse_live
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

## API Reference

The full REST API and WebSocket topic list is documented in
[`../docs/GAMEPULSE_PROJECT_REPORT.md`](../docs/GAMEPULSE_PROJECT_REPORT.md)
(sections 23 & 24).

## Next Step

Backend implementation will begin only after the frontend MVP is complete and explicitly
requested. When that happens, the frontend service layer (`frontend/src/services/`) will be
switched from mock/localStorage mode to real Axios calls against these APIs.
