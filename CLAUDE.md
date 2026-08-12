# Sellora – Claude Code Project

## Project Overview
Sellora is a full-stack marketplace web portal (buy/sell classifieds), built as part of the PSSPL AI Acceleration Month practical evaluation (8-day sprint, starting 2026-04-28). The project is branded **Sellora** throughout — UI, package names, database name, and container names. Use `sellora` naming for any new identifier; the earlier `olx*` naming has been retired.

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** NestJS + TypeScript
- **Database:** PostgreSQL
- **ORM:** Sequelize + sequelize-typescript
- **Auth:** JWT + bcrypt (@nestjs/jwt, @nestjs/passport)
- **File Storage:** Local disk via Multer (ad images, served from `server/uploads/`)
- **Maps:** Leaflet.js (location picking)
- **Payments:** Razorpay (ad promotion / featured ads)
- **Email:** Nodemailer (OTP-based password reset)
- **API Docs:** Swagger / OpenAPI (`/api/docs`)
- **State Management:** Redux Toolkit (frontend)
- **Version Control:** Git

## Project Structure
```
sellora/
├── client/                  # React frontend (Vite, port 5173)
│   └── src/
│       ├── components/      # Reusable UI (Navbar, Footer, AdCard, PromoteModal, PrivateRoute)
│       ├── pages/           # Route-level pages (see Pages section below)
│       ├── store/           # Redux slices: ads, auth, categories, favourites
│       ├── services/        # Per-feature Axios API calls
│       ├── common/          # axiosInstance, labels
│       └── api/             # Base axios config
├── server/                  # NestJS backend (port 3000)
│   └── src/
│       ├── auth/            # JWT auth, OTP password reset, mail service
│       ├── users/           # User profile CRUD
│       ├── ads/             # Ad CRUD, search, filters, pagination
│       ├── categories/      # Category tree (hierarchical)
│       ├── favourites/      # Save / unsave ads
│       ├── messages/        # Buyer–seller messaging
│       ├── payments/        # Razorpay order creation & verification
│       ├── upload/          # Multer disk image upload (max 5 files)
│       ├── database/        # Models, migrations, seeders, config
│       └── common/          # JWT guard, CurrentUser decorator
└── docker-compose.yml
```

## Pages (Frontend)
- **HomePage** — category carousel, featured ads, recent listings
- **LoginPage / RegisterPage** — authentication
- **ForgotPasswordPage** — OTP-based password reset
- **PostAdPage** — create ad with images + Leaflet map location picker
- **EditAdPage** — edit own ad details and images
- **AdDetailPage** — full ad view, seller info, message button
- **SearchPage** — keyword + category + city + price range filters
- **MyAdsPage** — dashboard for user's own ads (edit / delete / promote)
- **FavouritesPage** — saved ads
- **MessagesPage** — conversation list + per-ad message thread
- **ProfilePage** — user profile management

## NestJS Modules
| Module | Key Endpoints |
|---|---|
| auth | POST /auth/register, /auth/login, /auth/forgot-password, /auth/reset-password |
| users | GET/PATCH /users/me |
| ads | GET /ads, GET /ads/:id, POST /ads, PATCH /ads/:id, DELETE /ads/:id, GET /ads/my-ads |
| categories | GET /categories, GET /categories/:slug |
| favourites | GET /favourites, POST /favourites (toggle) |
| messages | POST /messages, GET /messages, GET /messages/:adId |
| payments | GET /payments/plans, POST /payments/create-order, POST /payments/verify |
| upload | POST /upload/images |

## Database Models (Sequelize)
- **User** — id, name, email, phone, passwordHash, city, avatar, resetOtp, resetOtpExpiry, createdAt
- **Category** — id, name, slug, icon, parentId (self-referential hierarchy)
- **Ad** — id, title, description, price, images (JSONB), categoryId, userId, city, state, lat, lng, status (active/sold/inactive), views, featuredUntil, createdAt
- **Favourite** — userId, adId
- **Message** — id, senderId, receiverId, adId, body, createdAt
- **Payment** — id, userId, adId, razorpayOrderId, razorpayPaymentId, amount, plan, status

## Migrations (in order)
1. `20260428000001-create-users`
2. `20260428000002-create-categories`
3. `20260428000003-create-ads`
4. `20260428000004-create-favourites`
5. `20260428000005-create-messages`
6. `20260428000006-add-reset-otp-to-users`
7. `20260428000007-add-featured-to-ads`
8. `20260428000008-create-payments`

## Development Commands
```bash
# Install all deps
npm run install:all

# Start dev servers (frontend + backend concurrently)
npm run dev

# Backend only
cd server && npm run start:dev

# Frontend only
cd client && npm run dev

# Database migrations (Sequelize CLI)
cd server && npx sequelize-cli db:migrate
cd server && npx sequelize-cli db:seed:all

# Build
npm run build

# Tests
npm test
```

## Environment Variables
See `.env.example` for all required vars. Copy to `.env` before running.

```
# server/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sellora
DB_USER=postgres
DB_PASS=yourpassword
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
PORT=3000

# client/.env
VITE_API_URL=http://localhost:3000
```

## Git Commit Convention
```
feat: add category filter to search
fix: resolve image upload 500 error
chore: update sequelize migration for messages
```

## Evaluation Checklist
- [x] Claude Code used throughout development
- [x] Git history with meaningful commits
- [x] Database migrations committed (Sequelize)
- [x] NestJS modules structured per feature
- [x] API documented (Swagger at /api/docs)
- [x] All 8 core features working
- [x] Mobile-responsive UI
- [x] .env.example present (no secrets committed)
- [x] Forgot password / OTP email flow
- [x] Razorpay payment integration for ad promotion
