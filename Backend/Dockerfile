# ===========================================
# Production Dockerfile
# ===========================================
# NO secrets are baked into this image.
# All sensitive configuration is passed via environment variables at runtime.
# The 'prod' Spring profile is activated by default.
# ===========================================

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy uploads folder for product images
COPY uploads/ uploads/

# Copy the application JAR
COPY target/ecommerce-gym-backend-1.0-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application with 'prod' profile
# Environment variables must be provided at runtime via -e flags or orchestration
ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=prod"]