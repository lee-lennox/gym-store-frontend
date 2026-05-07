# Deployment Checklist - GymEquip Store

This checklist ensures your e-commerce gym equipment store is properly configured and secure for production deployment.

## Pre-Deployment Security Checks

### 🔐 Critical Security Items (MUST DO)

- [ ] **Remove all hardcoded credentials** from codebase
  - [ ] Check `Backend/src/main/resources/application.properties` - should only have `${ENV_VAR:default}` patterns
  - [ ] Check `Backend/.env` - should have placeholder values, not real credentials
  - [ ] Search codebase for any hardcoded passwords, API keys, or secrets

- [ ] **Generate strong JWT secret**
  - [ ] Run: `openssl rand -base64 64`
  - [ ] Update `JWT_SECRET` in `.env.production` with the generated value
  - [ ] Minimum 32 characters for HS256 algorithm

- [ ] **Configure production email**
  - [ ] Enable 2-factor authentication on Gmail account
  - [ ] Generate App Password: https://myaccount.google.com/apppasswords
  - [ ] Update `SPRING_MAIL_USERNAME` and `SPRING_MAIL_PASSWORD` in `.env.production`
  - [ ] Test email sending functionality

- [ ] **Update CORS configuration**
  - [ ] Set `FRONTEND_URL` to your actual production domain(s)
  - [ ] Include both `https://domain.com` and `https://www.domain.com` if applicable
  - [ ] Remove localhost entries for production

- [ ] **Secure database credentials**
  - [ ] Use strong database password
  - [ ] Ensure database allows connections only from your application's IP
  - [ ] Enable SSL for database connections (`sslmode=require`)

- [ ] **Protect environment files**
  - [ ] Add `.env` and `.env.production` to `.gitignore`
  - [ ] Never commit real credentials to version control
  - [ ] Use secrets management in production (Docker secrets, AWS Secrets Manager, etc.)

## Configuration Files Review

### Backend Configuration

- [ ] `Backend/src/main/resources/application.properties`
  - [ ] All sensitive values use environment variable placeholders
  - [ ] Default values are safe for development only
  - [ ] No real passwords or secrets

- [ ] `Backend/.env` (development)
  - [ ] Contains development-safe values
  - [ ] Not committed to version control

- [ ] `.env.production.template`
  - [ ] Created as a template with placeholder values
  - [ ] Clear instructions for filling in real values

- [ ] `docker-compose.yml`
  - [ ] Uses environment variables for sensitive data
  - [ ] Volumes properly configured for data persistence
  - [ ] Network configuration is correct

### Frontend Configuration

- [ ] `frontend/.env`
  - [ ] `REACT_APP_API_URL` points to correct backend URL
  - [ ] Different configurations for development and production

- [ ] `frontend/Dockerfile`
  - [ ] Uses build arguments for API URL
  - [ ] No hardcoded secrets

- [ ] `frontend/nginx.conf`
  - [ ] Properly proxies `/api` requests to backend
  - [ ] Handles React Router correctly

## Database Setup

- [ ] **PostgreSQL Database**
  - [ ] Database created and accessible
  - [ ] User with appropriate permissions created
  - [ ] SSL enabled for remote connections
  - [ ] Backup strategy in place

- [ ] **Hibernate Settings**
  - [ ] `SPRING_JPA_HIBERNATE_DDL_AUTO` set to `validate` or `none` in production
  - [ ] NOT set to `update` or `create` in production (can cause data loss)

## Deployment Steps

### Docker Compose Deployment (Local/Staging)

```bash
# 1. Copy production template
cp .env.production.template .env.production

# 2. Edit .env.production with your actual values
# Use your favorite editor to update:
# - DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD
# - JWT_SECRET
# - SPRING_MAIL_USERNAME, SPRING_MAIL_PASSWORD
# - FRONTEND_URL

# 3. Build and run
docker-compose --env-file .env.production up -d --build

# 4. Check logs
docker-compose logs -f backend
docker-compose logs -f frontend

# 5. Verify application is running
curl http://localhost:3000
curl http://localhost:8080/api/products
```

### Render.com Deployment (Backend)

1. **Connect Repository**
   - [ ] Connect your GitHub repository to Render
   - [ ] Select `Backend` directory as root

2. **Environment Variables**
   - [ ] Set all required environment variables in Render dashboard:
     - `DATABASE_URL` (from Neon PostgreSQL)
     - `DATABASE_USERNAME`
     - `DATABASE_PASSWORD`
     - `JWT_SECRET` (generate with `openssl rand -base64 64`)
     - `SPRING_MAIL_USERNAME`
     - `SPRING_MAIL_PASSWORD`
     - `FRONTEND_URL`
     - `SPRING_JPA_HIBERNATE_DDL_AUTO=validate`

3. **Build Settings**
   - [ ] Build Command: `./mvnw clean package -DskipTests`
   - [ ] Start Command: `java -Dserver.port=$PORT -jar target/ecommerce-gym-backend-1.0-SNAPSHOT.jar`

4. **Database Setup**
   - [ ] Create Neon PostgreSQL database
   - [ ] Copy connection string to Render environment variables
   - [ ] Ensure SSL mode is set to `require`

### Netlify Deployment (Frontend)

1. **Connect Repository**
   - [ ] Connect GitHub repository to Netlify
   - [ ] Set base directory to `frontend`
   - [ ] Set build command to `npm run build`
   - [ ] Set publish directory to `build`

2. **Environment Variables**
   - [ ] Set `REACT_APP_API_URL` to your Render backend URL
   - [ ] Example: `https://your-app.onrender.com/api`

3. **Deploy**
   - [ ] Trigger manual deploy
   - [ ] Verify site is accessible

## Post-Deployment Verification

### Functionality Tests

- [ ] **User Authentication**
  - [ ] User registration works
  - [ ] User login works
  - [ ] Password reset email is sent
  - [ ] JWT tokens are properly generated and validated

- [ ] **Product Management**
  - [ ] Products are displayed correctly
  - [ ] Product search works
  - [ ] Category filtering works
  - [ ] Admin can add/edit/delete products
  - [ ] Product images upload correctly

- [ ] **Shopping Cart**
  - [ ] Add to cart works
  - [ ] Cart persists across sessions
  - [ ] Update quantity works
  - [ ] Remove from cart works

- [ ] **Orders**
  - [ ] Checkout process completes
  - [ ] Order confirmation is sent via email
  - [ ] Order history is accessible
  - [ ] Admin can view and manage orders

- [ ] **Security**
  - [ ] CORS headers are correctly set
  - [ ] Protected endpoints require authentication
  - [ ] Admin endpoints require ADMIN role
  - [ ] SQL injection protection is active

### Performance Checks

- [ ] **Response Times**
  - [ ] API responses are under 500ms
  - [ ] Database queries are optimized
  - [ ] Static assets are cached

- [ ] **Resource Usage**
  - [ ] Memory usage is within limits
  - [ ] CPU usage is reasonable
  - [ ] Database connections are properly managed

## Monitoring and Maintenance

### Logging

- [ ] **Log Configuration**
  - [ ] Log level set to `INFO` or `WARN` in production
  - [ ] Sensitive data is not logged
  - [ ] Log rotation is configured

- [ ] **Monitoring**
  - [ ] Application health checks are implemented
  - [ ] Error tracking is set up (e.g., Sentry)
  - [ ] Performance monitoring is enabled

### Backups

- [ ] **Database Backups**
  - [ ] Automated daily backups configured
  - [ ] Backup restoration tested
  - [ ] Backups stored securely off-site

- [ ] **File Uploads**
  - [ ] Product images are backed up
  - [ ] Upload directory is on persistent storage

### Security Updates

- [ ] **Regular Updates**
  - [ ] Dependencies are regularly updated
  - [ ] Security patches are applied promptly
  - [ ] Docker images are rebuilt with security updates

- [ ] **Secret Rotation**
  - [ ] JWT secret is rotated periodically
  - [ ] Database passwords are changed regularly
  - [ ] Email credentials are updated as needed

## Troubleshooting Common Issues

### Database Connection Issues

**Problem:** "Connection refused" errors
- Check database is running and accessible
- Verify connection string format
- Ensure SSL mode is correct for cloud databases
- Check firewall rules allow connections

### Email Not Sending

**Problem:** Emails not being sent
- Verify Gmail 2FA is enabled
- Use App Password, not regular password
- Check SMTP settings are correct
- Verify email quota not exceeded

### CORS Errors

**Problem:** CORS errors in browser console
- Ensure `FRONTEND_URL` includes all frontend domains
- Check nginx configuration for proper proxying
- Verify backend CORS configuration matches frontend origin

### File Upload Issues

**Problem:** Product images not saving
- Check `FILE_UPLOAD_DIR` is writable
- Verify volume is mounted correctly in Docker
- Ensure directory exists and has correct permissions

## Emergency Procedures

### Rollback Plan

1. Keep previous version of application available
2. Database backup before any deployment
3. Quick rollback procedure documented
4. Test rollback process regularly

### Incident Response

1. **Security Breach**
   - Immediately rotate all secrets (JWT, database, email)
   - Review access logs
   - Notify affected users if data compromised
   - Patch vulnerability

2. **Service Outage**
   - Check application logs
   - Verify database connectivity
   - Check resource limits (memory, disk)
   - Restart services if needed

## Final Checklist Before Going Live

- [ ] All security vulnerabilities addressed
- [ ] Production environment properly configured
- [ ] Database backups automated and tested
- [ ] Monitoring and alerting set up
- [ ] SSL certificates configured (HTTPS)
- [ ] CDN configured for static assets (optional)
- [ ] Rate limiting implemented
- [ ] Error pages customized
- [ ] Privacy policy and terms of service in place
- [ ] GDPR compliance checked (if applicable)
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on deployment and maintenance procedures

---

**Remember:** Security is an ongoing process. Regularly review and update your security measures, keep dependencies up to date, and monitor your application for any suspicious activity.

For detailed deployment instructions, see:
- `Backend/DOCKER_DEPLOYMENT.md` - Comprehensive Docker deployment guide
- `README.md` - General project documentation
- `frontend/README.md` - Frontend-specific documentation