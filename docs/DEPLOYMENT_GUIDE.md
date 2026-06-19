# Deployment & Running Guide

This guide describes how to run and build the restructured portal codebase locally and deploy to target architectures (Vercel, Docker).

## 1. Local Development Setup

### Prerequisite Checklist
- Node.js (version 20+)
- NPM (version 10+)
- MySQL or MariaDB Database

### Step 1: Install Dependencies
Install all workspace dependencies at the monorepo root:
```bash
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file at the root:
```env
# Database Credentials
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=sitewatch

# Prisma Database connection URL string
DATABASE_URL="mysql://root:@127.0.0.1:3306/sitewatch"
```

### Step 3: Run Database Migrations
Generate the Prisma Client and migrate tables:
```bash
npm run prisma:generate
```

### Step 4: Run Client & Server
Start both applications concurrently using the workspaces command:
```bash
npm run dev
```
- The backend Express API service launches on `http://localhost:8080`.
- The Next.js frontend application compiles and opens on `http://localhost:3000`.

---

## 2. Docker Execution

Deploy the database and client/server applications in containers:
```bash
docker-compose up --build
```
This launches three containers:
- `sitewatch_db` (MariaDB database mapped on port 3306)
- `sitewatch_server` (Express API application on port 8080)
- `sitewatch_client` (Next.js frontend portal on port 3000)

---

## 3. Production Deployment Target (Vercel)

Vercel is the recommended serverless target platform for the frontend.

### Step 1: Deploy Next.js Client
1. Import the project repository into the Vercel dashboard.
2. In the setup, change **Root Directory** to `client`.
3. Configure Environment Variables:
   - Add `NEXT_PUBLIC_API_URL` pointing to your deployed Express backend URL (e.g. `https://api.sitewatch.com`).
4. Click **Deploy**. Vercel will build and serve the App Router frontend.

### Step 2: Deploy Express Backend
1. Host the `server` directory on any Node/Express host (such as Render, AWS ECS, Heroku, Railway).
2. Configure environmental database URL variables on the hosting platform matching your production database.
3. Make sure port `8080` or `PORT` matches the listener.
