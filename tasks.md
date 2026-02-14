# Kharcha Expense Tracker – Backend Tasks

## Phase 1: Foundation
- [x] 1.1 Project scaffolding (package.json, folder structure, .env.example)
- [x] 1.2 Database setup – Prisma schema for User, Transaction, UserBudget
- [x] 1.3 Run Prisma migrations
- [x] 1.4 Config & env validation (dotenv, Zod)

## Phase 2: Auth
- [x] 2.1 Auth service (bcrypt, JWT access + refresh)
- [x] 2.2 User service (create, findByEmail, findById)
- [x] 2.3 Auth middleware (verify access token)
- [x] 2.4 Auth routes: register, login, refresh, logout, me
- [x] 2.5 Rate limiting on auth endpoints (5/min)

## Phase 3: Transactions
- [x] 3.1 Transaction service (CRUD, scoped by userId, search)
- [x] 3.2 Transaction validation (Zod schemas)
- [x] 3.3 Transaction routes: GET, POST, PUT, DELETE

## Phase 4: Budget
- [x] 4.1 Budget service (get/update, default 50/30/20)
- [x] 4.2 Budget validation (percentages sum to 100)
- [x] 4.3 Budget routes: GET, PUT

## Phase 5: Summary & Extras
- [x] 5.1 Summary service & endpoint (balance, dailyChange, monthSpending, budgetLimits)
- [x] 5.2 Error handling middleware (consistent { error, code })
- [x] 5.3 CORS config (allow frontend origins)
- [x] 5.4 Health check endpoint
- [x] 5.5 Refresh token blacklist / storage for logout

## Phase 6: Polish
- [x] 6.1 README with setup & API docs
- [x] 6.2 Security checklist (no passwordHash in responses, input sanitization)
