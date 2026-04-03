# 💼 Finance Data Processing and Access Control Backend

AA scalable and production-ready Node.js + Express backend for financial data processing, featuring robust role-based access control (RBAC), secure authentication, and modular architecture.

## 🛠️ Tech Stack
- **Framework:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, bcrypt
- **Validation:** Zod
- **Security:** Helmet, CORS, express-rate-limit

## 🔐 Roles & Access Matrix

| Feature | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| Read Dashboard (Summary) | ✅ | ✅ | ✅ |
| Read Analytics (Trends/Categories)| ❌ | ✅ | ✅ |
| Read Own Records | ✅ | ✅ | ✅ |
| Mutate Own Records | ❌ | ❌ | ❌ |
| Create Records | ❌ | ❌ | ✅ |
| Read All Records | ❌ | ❌ | ✅ |
| Update/Delete Any Record | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

*(Note: In this specific implementation, only Admin can create or mutate any records, following the strict strictures inside the assignments)*

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone <repository_url>
cd finance-access-control-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env`. Ensure your PostgreSQL configurations match your local or docker setups.
```bash
cp .env.example .env
```

Environment Variables Explaination:
- `PORT`: The port the server will run on (e.g. 3000)
- `NODE_ENV`: Application environment (`development`, `production`, `test`)
- `DATABASE_URL`: Connection string to your PostgreSQL instance.
- `JWT_SECRET`: Secret key used for JWT signing and verification. Needs to be at least 10 chars.
- `JWT_EXPIRES_IN`: JWT expiration time (e.g. `7d`, `24h`)

### 4. Setup Database
You can spin up a PostgreSQL instance quickly using docker-compose:
```bash
docker-compose up -d
```

Apply migrations to initialize the database schema:
```bash
npm run prisma:migrate
```

### 5. Seed the Database
Populate the database with sample users and records:
```bash
npm run prisma:seed
```
This generates 3 users:
- `viewer@example.com` (password: `Password123!`)
- `analyst@example.com` (password: `Password123!`)
- `admin@example.com` (password: `Password123!`)

### 6. Run the Application
For development:
```bash
npm run dev
```

For production:
```bash
npm run build
npm start
```

## Testing Credentials

You can use the seeded users to test different RBAC levels on the API endpoints.

```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

## 📚 Interactive API Documentation (Swagger)

This project includes interactive API documentation powered by Swagger UI.

Once the server is running, you can access the interactive Swagger documentation at:
- **Swagger UI:** `http://localhost:3000/api-docs`
- **Swagger JSON:** `http://localhost:3000/api-docs.json`

You can use the Swagger UI to explore the available endpoints, view schemas, and test API requests directly from your browser. Remember to authenticate by clicking the "Authorize" button and providing your JWT bearer token.

## 🛣️ API Documentation

Responses generally follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": [] 
  }
}
```

### Auth Endpoints

#### POST `/api/auth/register`
Register a new user (defaults to VIEWER role). Can be accessed publicly.
- **Body Context:** `email`, `password`, `name`

#### POST `/api/auth/login`
Authentication point to retrieve JWT.
- **Body Context:** `email`, `password`

#### GET `/api/auth/me`
Retrieve currently logged in user context based on JWT. Requires Auth.

### User Endpoints (Admin Only)

#### GET `/api/users`
List all users.

#### POST `/api/users`
Create a new user with a specific role.

#### GET `/api/users/:id`
Get specific user profile.

#### PATCH `/api/users/:id`
Update a specific user profile or role/isActive status.

#### DELETE `/api/users/:id`
Delete a specific user.

### Record Endpoints

#### GET `/api/records`
Get records base on queries limit. If requester is Admin, can read all. Otherwise only requester's own records.
- **Query Params:** `startDate`, `endDate`, `category`, `type`

#### GET `/api/records/:id`
Get specific records details. Follows similar role gating.

#### POST `/api/records` (Admin Only)
Create new record manually for some user context.
- **Body Context:** `amount`, `type`, `category`, `date`, `description`, `userId`

#### PATCH `/api/records/:id` (Admin Only)
Update record parameters.

#### DELETE `/api/records/:id` (Admin Only)
Delete specific record.

### Dashboard Endpoints

#### GET `/api/dashboard/summary` (All Roles)
Get totally income, expense, net balance aggregation sum.

#### GET `/api/dashboard/trends` (Analyst, Admin)
Get monthly aggregations (trends over the last months).

#### GET `/api/dashboard/categories` (Analyst, Admin)
Get aggregates partitioned by item categories.

#### GET `/api/dashboard/recent` (All Roles)
Returns latest 10 transactional datasets.
- **Query Params:** `limit` - control how many lines returned.

## Curl Examples

**1. Login to get a token**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123!"}'
```

**2. Access Summary Dashboard**
```bash
curl -X GET http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

**3. Filter financial records**
```bash
curl -X GET 'http://localhost:3000/api/records?type=EXPENSE&category=Food' \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```
## 📜 License :->

This project is licensed under the MIT License.

## 👨‍💻 Author

- Deepyaman Mondal
- Backend / Software Engineer
