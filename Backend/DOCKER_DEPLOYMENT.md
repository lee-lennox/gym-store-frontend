# Docker Deployment Guide - Unified Configuration

## Overview

This Spring Boot application uses a **single configuration file** with environment variable overrides. There are NO profile-specific configuration files. All sensitive values are injected via environment variables, with safe defaults for local development.

## Configuration Philosophy

- **ONE `application.properties`** file for all environments
- **NO hardcoded secrets** - all sensitive values use environment variables
- **Safe defaults** for local development (works out of the box)
- **Environment variables override defaults** in Docker/production

## Configuration File

```
Backend/src/main/resources/
└── application.properties    # Single configuration file for all environments
```

### How It Works

```properties
# Example from application.properties:
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://localhost:5432/gymstore}
```

- If `DATABASE_URL` env var is set → uses that value
- If `DATABASE_URL` is NOT set → uses `jdbc:postgresql://localhost:5432/gymstore`

## Docker Deployment

### Build the Docker Image

```bash
# From project root
docker build -t gymstore-backend:latest ./Backend
```

### Run with Docker (Environment Variables)

```bash
docker run -d \
  --name gymstore-backend \
  -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/gymstore \
  -e DATABASE_USERNAME=postgres \
  -e DATABASE_PASSWORD=your_secure_password \
  -e JWT_SECRET=$(openssl rand -base64 64) \
  -e SPRING_MAIL_USERNAME=your-email@gmail.com \
  -e SPRING_MAIL_PASSWORD=your-app-specific-password \
  -e FRONTEND_URL=http://localhost:5173,https://lennoxgymstore1.netlify.app \
  -v $(pwd)/Backend/uploads:/app/uploads \
  gymstore-backend:latest
```

### Run with Environment File (Recommended)

```bash
# 1. Copy .env.example to .env
cp Backend/.env.example Backend/.env

# 2. Edit Backend/.env with your values
# (Use your favorite editor)

# 3. Run with env file
docker run -d \
  --name gymstore-backend \
  -p 8080:8080 \
  --env-file Backend/.env \
  -v $(pwd)/Backend/uploads:/app/uploads \
  gymstore-backend:latest
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Prod | `jdbc:postgresql://localhost:5432/gymstore` | PostgreSQL URL (Neon: `postgresql://user:pass@host/db?sslmode=require`) |
| `DATABASE_USERNAME` | No | `postgres` | Database username (optional if embedded in URL) |
| `DATABASE_PASSWORD` | No | `postgres` | Database password (optional if embedded in URL) |
| `DATABASE_SSL_MODE` | No | `require` | SSL mode for cloud databases |
| `JWT_SECRET` | Prod | Dev secret | JWT signing key (min 32 chars) |
| `SPRING_MAIL_USERNAME` | Prod | `dev@gmail.com` | SMTP email address |
| `SPRING_MAIL_PASSWORD` | Prod | `dev-password` | SMTP password |
| `SPRING_MAIL_HOST` | No | `smtp.gmail.com` | SMTP host |
| `SPRING_MAIL_PORT` | No | `587` | SMTP port |
| `FRONTEND_URL` | Prod | `http://localhost:5173,http://localhost:3000` | CORS allowed origins |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | No | `update` | Hibernate DDL mode |
| `SPRING_JPA_SHOW_SQL` | No | `false` | Show SQL queries |
| `HIBERNATE_FORMAT_SQL` | No | `false` | Format SQL output |
| `LOG_LEVEL` | No | `INFO` | Root log level |
| `LOG_LEVEL_APP` | No | `INFO` | App log level |
| `LOG_LEVEL_SPRING` | No | `INFO` | Spring log level |
| `LOG_LEVEL_SECURITY` | No | `INFO` | Security log level |
| `LOG_LEVEL_HIBERNATE` | No | `INFO` | Hibernate log level |

See `.env.example` for detailed documentation and examples.

## Local Development

### Option 1: Run Directly (No Setup Required)

```bash
cd Backend
mvn spring-boot:run
```

The application will use default values (localhost PostgreSQL, dev JWT secret).

### Option 2: Run with IDE

Just run `Main.java` - no special configuration needed.

### Option 3: Override Specific Values

```bash
# Set specific environment variables
export DATABASE_URL=jdbc:postgresql://custom-host:5432/customdb
export DATABASE_USERNAME=myuser
export DATABASE_PASSWORD=mypassword

mvn spring-boot:run
```

### Option 4: Docker for Local Testing

```bash
docker run -d \
  --name gymstore-backend-local \
  -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/gymstore \
  -e DATABASE_USERNAME=postgres \
  -e DATABASE_PASSWORD=postgres \
  -e JWT_SECRET=DevSecretKeyForJWTTokenGenerationMustBeAtLeast256BitsLongForHS256Algorithm \
  -e FRONTEND_URL=http://localhost:5173,http://localhost:3000 \
  gymstore-backend:latest
```

## Production Checklist

- [ ] **Generate strong JWT secret**: `openssl rand -base64 64`
- [ ] **Use production database** (not localhost)
- [ ] **Set DATABASE_PASSWORD** to a strong password
- [ ] **Configure production email** (Gmail App Password or SMTP service)
- [ ] **Set FRONTEND_URL** to your production domain(s)
- [ ] **Set SPRING_JPA_HIBERNATE_DDL_AUTO** to `validate` or `none`
- [ ] **Mount uploads volume** for persistent file storage
- [ ] **Set appropriate LOG_LEVEL** (INFO or WARN)

## Render Deployment

### Environment Variables for Render

Set these in your Render dashboard under **Environment**:

```
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:npg_PKVT7HnXNp1v@ep-lively-sunset-aidoqo6z-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
DATABASE_USERNAME=neondb_owner
DATABASE_PASSWORD=npg_PKVT7HnXNp1v
DATABASE_SSL_MODE=require

# JWT (generate a strong secret)
JWT_SECRET=<run: openssl rand -base64 64>

# Email
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-specific-password

# Frontend
FRONTEND_URL=https://lennoxgymstore1.netlify.app
```

### Build Command
```
./mvnw clean package -DskipTests
```

### Start Command
```
java -Dserver.port=$PORT -jar target/ecommerce-gym-backend-1.0-SNAPSHOT.jar
```

### Important Notes for Render

1. **Port**: Render sets the `$PORT` environment variable automatically. The application will use port 8080 by default, but Render overrides this.

2. **File Uploads**: For persistent file storage on Render, you need to use a mounted disk or external storage (S3, etc.). The default `uploads/products` directory will be ephemeral.

3. **Database**: The application is configured to work with Neon PostgreSQL. Make sure your Neon database allows connections from Render's IP addresses.

4. **SSL**: The `DATABASE_SSL_MODE=require` is mandatory for Neon PostgreSQL connections.

## Troubleshooting

### Application fails to start - Missing environment variables

If you see "Could not resolve placeholder" errors, ensure all required environment variables are provided. In production, you MUST override:
- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `SPRING_MAIL_USERNAME`
- `SPRING_MAIL_PASSWORD`
- `FRONTEND_URL`

### Database connection refused (Docker)

If your database runs on your host machine, use `host.docker.internal`:
```
DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/gymstore
```

### Email not sending

- For Gmail: Use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password
- Ensure SMTP settings are correct
- Check `SPRING_MAIL_USERNAME` and `SPRING_MAIL_PASSWORD` are set

### CORS errors

Ensure `FRONTEND_URL` includes all your frontend domains:
```
FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com
```

### Different behavior between local and Docker

Check which environment variables are set:
```bash
# In Docker container
docker exec gymstore-backend env | grep -E "DATABASE|JWT|MAIL|FRONTEND|LOG_"
```

## Security Notes

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Never hardcode secrets** in `application.properties`
3. **Use strong JWT secrets** - minimum 256 bits (32 characters)
4. **Use App Passwords** for Gmail, not regular passwords
5. **Rotate secrets regularly** in production
6. **Use HTTPS** for all production database connections
7. **Restrict database access** to only the application's IP

## Migration from Profile-Based Configuration

If you were previously using `application-dev.properties` and `application-prod.properties`:

1. **Delete** `application-dev.properties` and `application-prod.properties`
2. **Update** `application.properties` to use environment variables (already done)
3. **Remove** `--spring.profiles.active=prod` from Docker commands
4. **Set** environment variables via `.env` file or `-e` flags

The application now works the same way in all environments - the only difference is which environment variables you set.