# GymEquip Store - E-commerce Gym Equipment

A full-stack e-commerce application for gym equipment, built with React (frontend) and Spring Boot (backend).

## Project Structure

```
E-commerceGymEquipmentStore/
├── Backend/           # Spring Boot REST API
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md          # This file
```

## Quick Start

### 1. Backend (Spring Boot)

```bash
cd Backend

# Configure database in src/main/resources/application.properties
# Then build and run:
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

### 2. Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Configure API URL in .env file:
# REACT_APP_API_URL=http://localhost:8080/api

# Start development server
npm start
```

The application will open at `http://localhost:5173`

## Default Admin Credentials

- **Email:** admin@gymstore.com
- **Password:** admin123

## Tech Stack

- **Frontend:** React 18, React Router v7, Axios, Tailwind CSS
- **Backend:** Spring Boot 3.3.2, Spring Security, Spring Data JPA
- **Database:** PostgreSQL
- **Authentication:** JWT tokens

## Features

- Product catalog with search and category filtering
- Shopping cart with quantity management
- User registration, login, and profile management
- Checkout with shipping and payment flow
- Order history and tracking
- Admin dashboard for managing products, categories, and users
- Responsive design for mobile and desktop

## Detailed Documentation

- [Frontend README](frontend/README.md) - Frontend setup and API reference
- [Backend README](Backend/README.md) - Backend setup and configuration

## License

This project is part of an E-commerce Gym Equipment system.