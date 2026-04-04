# 💰 Finance Data Processing & RBAC Backend

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com/)

A production-grade financial data management system built with a **Security-First** mindset. This backend implements a robust **Role-Based Access Control (RBAC)** architecture, ensuring that financial data is processed and accessed only by authorized personnel.

---

## 🚀 Live Deployment

The API is fully deployed and can be accessed at the following endpoints:

- **🏠 API Root:** [https://finops-rbac-backend.onrender.com/](https://finops-rbac-backend.onrender.com/)
- **📚 Interactive API Docs:** [https://finops-rbac-backend.onrender.com/api-docs](https://finops-rbac-backend.onrender.com/api-docs)

---

## 🏗️ Technical Architecture

This project follows a clean, modular architecture designed for scalability and maintainability:

- **Core Engine:** Node.js & Express.js with TypeScript for end-to-end type safety.
- **Database Layer:** PostgreSQL hosted on Neon (Serverless Postgres).
- **ORM:** Prisma for type-safe database queries and automated migrations.
- **Security:** 
  - **JWT Authentication:** Secure stateless session management.
  - **RBAC Matrix:** Custom middleware for multi-level permission gating.
  - **Data Integrity:** Schema-level validation using **Zod**.
  - **Protective Layers:** Helmet (headers), CORS (origin control), and Rate Limiting (DoS protection).

---

## 🔐 Access Control Matrix

This system implements a strict permission hierarchy governed by three distinct roles:

| Module | Feature | VIEWER | ANALYST | ADMIN |
| :--- | :--- | :---: | :---: | :---: |
| **Dashboard** | View Summary Stats | ✅ | ✅ | ✅ |
| **Analytics** | View Trends & Categories | ❌ | ✅ | ✅ |
| **Records** | Read Personal Records | ✅ | ✅ | ✅ |
| **Records** | Read ALL Records | ❌ | ❌ | ✅ |
| **Records** | Create/Update/Delete | ❌ | ❌ | ✅ |
| **Users** | Full User Management | ❌ | ❌ | ✅ |

---

## ⚙️ Local Development Setup

### 1. Requirements
- Node.js (v18+)
- PostgreSQL (Local or Docker)

### 2. Installation
```bash
# Clone and enter the repository
git clone https://github.com/DevRony04/finops-rbac-backend.git
cd finops-rbac-backend

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Update your `.env` with your `DATABASE_URL` and a strong `JWT_SECRET`.

### 4. Database Initialization
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate dev --name init

# Seed the database (Default Users: viewer, analyst, admin)
npx prisma db seed
```

### 5. Running the App
- **Development:** `npm run dev`
- **Production:** `npm run build && npm start`

---

## ☁️ Deployment (Render + Neon)

### Build Settings
When deploying to Render, use these settings:
- **Build Command:** `npm install && npm run build && npx prisma migrate deploy`
- **Start Command:** `npm start`

### Environment Variables
Ensure the following are set in your Render dashboard:
- `DATABASE_URL`: Your Neon connection string.
- `JWT_SECRET`: A unique secure string.
- `NODE_ENV`: `production`

---

## 👨‍💻 Author

**Deepyaman Mondal**  
*Backend / Software Engineer*

- **GitHub:** [@DevRony04](https://github.com/DevRony04)
- **Status:** Production Ready

---
*License: This project is licensed under the MIT License.*
