# ===========================================
# Production Dockerfile
# ===========================================
# NO secrets are baked into this image.
# All sensitive configuration is passed via environment variables at runtime.
#
# Required environment variables (pass via -e or orchestration):
#   DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD
#   JWT_SECRET
#   SPRING_MAIL_USERNAME, SPRING_MAIL_PASSWORD
#   FRONTEND_URL
#
# See .env.example for all available options.
# ===========================================

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy uploads folder for product images (if exists)
COPY uploads/ uploads/

# Copy the application JAR
COPY target/ecommerce-gym-backend-1.0-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
# All configuration comes from environment variables passed at runtime
# No Spring profile is activated - single configuration file handles all environments
ENTRYPOINT ["java", "-jar", "app.jar"]