# SiteWatch Website Monitoring Portal

SiteWatch is a real-life website screenshot monitoring portal built with Next.js (App Router), Tailwind CSS, Express.js Backend, and Prisma ORM targeting MySQL/MariaDB.

It allows administrators to manage a list of active URLs, schedule checks, run bulk checks from Excel files, trigger automated screenshot captures (via Puppeteer), and view/download historical health check PDF reports.

## Main Directories
- **`client/`**: Next.js App Router frontend application.
- **`server/`**: Express.js REST API service with Prisma ORM integrations.
- **`shared/`**: Common assets, models, and type definitions.
- **`docs/`**: Developer guides, structure logs, and API routes guides.
- **`archive/`**: Unused/original files kept for reference.

---

## Fast Start

### Prerequisite Dependencies
- Node.js `20+`
- MySQL/MariaDB instance running locally

### Installation
Install dependencies at the root directory:
```bash
npm install
```

### Configure Variables
Copy `.env.example` into a new `.env` file at the root:
```bash
cp .env.example .env
```
Update credentials inside `.env` to match your local database settings.

### Run Local Portal
Start both Next.js frontend and Express backend concurrently:
```bash
npm run dev
```

Visit the dashboard in your web browser:
- Portal Frontend: `http://localhost:3000`
- API Backend: `http://localhost:8080`

---

## Learn More
Explore deep details in the documentation directory:
- [Project Architecture Layout](docs/PROJECT_STRUCTURE.md)
- [API Routes Directory](docs/API_DOCUMENTATION.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
