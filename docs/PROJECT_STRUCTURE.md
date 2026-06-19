# Project Structure

This document outlines the organization and purpose of directories and files in the restructured SiteWatch monorepository.

```
project-root/
│
├── client/                              # Next.js Frontend
│   ├── src/
│   │   ├── app/                         # App Router layout and pages
│   │   │   ├── globals.css              # Global styling variables
│   │   │   ├── layout.tsx               # Next.js HTML layout configuration
│   │   │   └── page.tsx                 # Main SPA router and modal controller
│   │   │
│   │   ├── components/                  # Global shared UI elements
│   │   │   └── layout/
│   │   │       └── Sidebar.tsx          # Navigation panel
│   │   │
│   │   ├── features/                    # Modular feature-based views
│   │   │   ├── dashboard/               # Main analytics cards and log list
│   │   │   ├── excel/                   # Excel spreadsheet parser and batch validator
│   │   │   ├── reports/                 # Historical PDF reports explorer
│   │   │   ├── settings/                # Email, SMTP and Scan Schedules settings
│   │   │   └── users/                   # Portal access administrator
│   │   │
│   │   └── styles/
│   │       └── theme.ts                 # Shared inline CSS design tokens
│   │
│   ├── next.config.js                   # Development proxy and rewrites config
│   ├── postcss.config.mjs               # PostCSS configurations for Tailwind v4
│   ├── tsconfig.json                    # TypeScript compiler options
│   └── package.json                     # Frontend scripts and dependencies
│
├── server/                              # Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js                   # Bulletproof environment variable loader
│   │   │
│   │   ├── controllers/                 # Route handlers & HTTP adapters
│   │   │   ├── capture.controller.js
│   │   │   ├── excel.controller.js
│   │   │   ├── report.controller.js
│   │   │   ├── settings.controller.js
│   │   │   └── website.controller.js
│   │   │
│   │   ├── lib/
│   │   │   └── prisma.ts                # Prisma Client constructor with MariaDB adapter
│   │   │
│   │   ├── middleware/
│   │   │   └── logger.js                # Debug logs persistence interceptor
│   │   │
│   │   ├── routes/                      # API routing mappings
│   │   │   ├── excel.routes.js
│   │   │   ├── index.js                 # API routes central entrypoint
│   │   │   ├── report.routes.js
│   │   │   ├── settings.routes.js
│   │   │   └── website.routes.js
│   │   │
│   │   ├── services/                    # Reusable backend core business logic
│   │   │   ├── capture.service.js       # Puppeteer automation & PDF generator
│   │   │   ├── db.service.js            # Prisma queries CRUD layer
│   │   │   ├── email.service.js         # SMTP nodemailer email reports dispatcher
│   │   │   └── scheduler.service.js     # node-cron polling scan routines
│   │   │
│   │   ├── utils/                       # Generic utilities
│   │   │   ├── excelParser.js           # Excel xlsx format parsing rules
│   │   │   └── urlFetcher.js            # HTTP status & response time ping checker
│   │   │
│   │   ├── app.js                       # Express app configuration
│   │   └── server.js                    # Backend service entrypoint
│   │
│   ├── prisma/
│   │   └── schema.prisma                # Prisma mapping definitions for MariaDB/MySQL
│   │
│   └── package.json                     # Backend scripts and dependencies
│
├── archive/                             # Safe container for original root files
│   ├── db.cjs
│   ├── server.cjs
│   ├── postcss.config.mjs
│   ├── prisma.config.ts
│   └── src/                             # Backup of old frontend src directory
│
├── docs/                                # Technical system documentation
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── PROJECT_STRUCTURE.md
│
├── docker-compose.yml                   # Service container definitions
├── package.json                         # Workspace definitions and launch scripts
├── README.md                            # Main system guide
└── .gitignore                           # Git ignore configurations
```
