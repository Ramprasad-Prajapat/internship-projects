# GamePulse Live — Deployment & CI/CD Guide

## 1. Automated CI/CD Workflows (`.github/workflows`)

### `ci.yml` — Continuous Integration Pipeline
Triggers on pull requests and pushes to `main` or `master`:
1. **Secret Scanning**: Runs Gitleaks scanner to ensure no API keys, tokens, or private credentials are in source.
2. **Backend Pipeline**: Sets up JDK 21, runs `./apache-maven-3.9.12/bin/mvn.cmd clean test`, and packages the backend artifact `gamepulse-backend-0.1.0-SNAPSHOT.jar`.
3. **Frontend Pipeline**: Installs Node 20 dependencies, executes ESLint code quality checks, and compiles the production Vite distribution bundle.

### `cd.yml` — Continuous Deployment Pipeline
Triggers automatically on release tags:
1. Builds production backend JAR and Docker image.
2. Deploys containerized app to staging/production server.
3. Performs automated post-deployment health check against `/api/readiness`.

---

## 2. Manual Production Deployment

### Step 1 — Build Production Artifacts
```bash
# Backend JAR build
cd backend
./apache-maven-3.9.12/bin/mvn.cmd clean package -DskipTests=false

# Frontend bundle build
cd ../frontend
npm run build
```

### Step 2 — Environment Variables
| Variable | Default Value | Description |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` | Active Spring profile |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/gamepulse` | Production database connection string |
| `SPRING_DATASOURCE_USERNAME` | `gamepulse` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | `<SECRET>` | Database password |
| `JWT_SECRET` | `<STRONG_256BIT_SECRET>` | HMAC-SHA256 signing key |

### Step 3 — Launching Production Service
```bash
java -jar -Dspring.profiles.active=prod backend/target/gamepulse-backend-0.1.0-SNAPSHOT.jar
```
