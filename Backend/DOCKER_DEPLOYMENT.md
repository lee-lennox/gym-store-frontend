# Docker Deployment Guide - Profile-Based Configuration

## Overview

This Spring Boot application uses **Spring Profiles** to manage configuration across different environments:
- **dev** - Local development with debug settings
- **prod** - Production with environment variables only (no hardcoded secrets)

## Configuration Files

```
Backend/src/main/resources/
├── application.properties          # Base configuration (shared settings)
├── application-dev.properties      # Development profile
└── application-prod.properties     # Production profile
```

### File Responsibilities

| File | Purpose | Contains Secrets? |
|------|---------|-------------------|
| `application.properties` | Base/shared settings (port, JPA defaults, file upload) | ❌ No |
| `application-dev.properties` | Local development (localhost DB, debug logging, dev JWT) | ⚠️ Dev-only |
| `application-prod.properties` | Production (ALL values from environment variables) | ❌ No |

## Activating Profiles

### Method 1: Environment Variable (Recommended)
```bash
export SPRING_PROFILES_ACTIVE=prod
java -jar app.jar
```

### Method 2: Command Line Argument
```bash
java -jar app.jar --spring.profiles.active=prod
```

### Method 3: Docker (Automatic)
The Dockerfile automatically activates the `prod` profile.

## Docker Deployment

### Build the Docker Image
```bash
# From project root
docker build -t gymstore-backend:latest ./Backend
```

### Run with Docker (All Environment Variables)

```bash
docker run -d \
  --name gymstore-backend \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
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

### Run with Environment File

```bash
# Create .env from .env.example and fill in values
cp Backend/.env.example Backend/.env
# Edit Backend/.env with your values

docker run -d \
  --name gymstore-backend \
  -p 8080:8080 \
  --env-file Backend/.env \
  -v $(pwd)/Backend/uploads:/app/uploads \
  gymstore-backend:latest
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Yes | Spring profile to activate | `prod` |
| `DATABASE_URL` | Yes | PostgreSQL JDBC URL | `jdbc:postgresql://host:5432/db` |
| `DATABASE_USERNAME` | Yes | Database username | `postgres` |
| `DATABASE_PASSWORD` | Yes | Database password | `secure_password` |
| `JWT_SECRET` | Yes | JWT signing key (min 32 chars) | `random-base64-string` |
| `SPRING_MAIL_USERNAME` | Yes | SMTP email address | `noreply@domain.com` |
| `SPRING_MAIL_PASSWORD` | Yes | SMTP password | `app-password` |
| `FRONTEND_URL` | Yes | CORS allowed origins | `https://domain.com` |

## Local Development

### Option 1: Run with dev profile (uses application-dev.properties)
```bash
# Set dev profile
export SPRING_PROFILES_ACTIVE=dev

# Run the application
cd Backend
mvn spring-boot:run
```

### Option 2: Run with IDE
Set VM options: `-Dspring.profiles.active=dev`

### Option 3: Docker for Local Testing
```bash
docker run -d \
  --name gymstore-backend-dev \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/gymstore \
  -e DATABASE_USERNAME=postgres \
  -e DATABASE_PASSWORD=postgres \
  -e JWT_SECRET=DevSecretKeyForJWTTokenGenerationMustBeAtLeast256BitsLongForHS256AlgorithmChangeInProd \
  -e SPRING_MAIL_USERNAME=your-email@gmail.com \
  -e SPRING_MAIL_PASSWORD=your-app-password \
  -e FRONTEND_URL=http://localhost:5173,http://localhost:3000 \
  gymstore-backend:latest
```

## Production Checklist

- [ ] Generate a strong JWT secret: `openssl rand -base64 64`
- [ ] Use a production database (not localhost)
- [ ] Configure production email (Gmail App Password or SMTP service)
- [ ] Set `FRONTEND_URL` to your production domain
- [ ] Use a strong database password
- [ ] Mount uploads volume for persistent file storage
- [ ] Set `SPRING_PROFILES_ACTIVE=prod`

## Troubleshooting

### Application fails to start - Missing environment variables
Ensure all required environment variables are provided:
```bash
docker run -e DATABASE_URL=... -e DATABASE_USERNAME=... ... gymstore-backend:latest
```

### Database connection refused (Docker)
If your database runs on your host machine, use `host.docker.internal`:
```
DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/gymstore
```

### Email not sending
- For Gmail: Use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password
- Ensure SMTP settings are correct

### CORS errors
Ensure `FRONTEND_URL` includes all your frontend domains:
```
FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com
```

### Profile not activating
Check that `SPRING_PROFILES_ACTIVE=prod` is set. The Dockerfile sets this automatically, but environment variables can override it.

## Security Notes

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Never hardcode secrets** in properties files for production
3. **Use strong JWT secrets** - minimum 256 bits (32 characters)
4. **Use App Passwords** for Gmail, not regular passwords
5. **Rotate secrets regularly** in production