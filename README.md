# Kharcha Expense Tracker API

SaaS-grade Node.js/Express backend for the Kharcha 50/30/20 expense tracker.

## Stack

- Node.js 18+ / Express
- MongoDB Atlas + Prisma ORM
- JWT (access + refresh tokens)
- Zod validation, bcrypt, express-rate-limit
- CORS, error handling

## Setup

1. **Clone & install**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env: DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET (min 32 chars each)
   ```

3. **Database**
   - Set `DATABASE_URL` in `.env` with your MongoDB Atlas connection string:
     `mongodb+srv://<username>:<password>@cluster0.wnwu59.mongodb.net/kharcha?retryWrites=true&w=majority`
   - Sync schema:
   ```bash
   npm run db:push
   ```

4. **Run**
   ```bash
   npm run dev
   ```

Server runs at `http://localhost:3000`.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (name, email, password) |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout (optional body: `{ refreshToken }`) |
| GET | `/api/auth/me` | Current user |
| PATCH | `/api/auth/me` | Update name (body: `{ name }`) |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List (query: `?search=string`) |
| POST | `/api/transactions` | Create |
| PUT | `/api/transactions/:id` | Update |
| DELETE | `/api/transactions/:id` | Delete |

### Budget
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budget` | Get budget |
| PUT | `/api/budget` | Update budget |

### Summary
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/summary` | Balance, dailyChange, monthSpending, budgetLimits, categoryBreakdown (spent, limit, remaining, overBy) |

### Health
| Method | Endpoint |
|--------|----------|
| GET | `/health` |

All protected routes require `Authorization: Bearer <accessToken>`.

## Error responses

```json
{ "error": "message", "code": "ERROR_CODE" }
```

- `400` – Validation
- `401` – Unauthorized
- `403` – Forbidden
- `404` – Not found
- `409` – Conflict (e.g. email exists)
- `500` – Internal error
