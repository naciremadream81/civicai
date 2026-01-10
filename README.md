# Permit Processing & Document Management

Full-stack application for managing building permits, contractors, jobs, documents, and workflows.

## ✨ Features

- 🔐 Secure JWT-based authentication with httpOnly cookies
- 🛡️ Role-based access control (RBAC)
- 📁 Document management with file uploads
- ⚡ Rate limiting on API endpoints
- 🏥 Health check endpoints
- 📊 Activity tracking and audit logs
- 🔒 Input validation with Zod
- 🚀 Production-ready configuration

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Docker)
- **Auth**: JWT + httpOnly cookies
- **File Storage**: Filesystem adapter (extensible to S3/R2)
- **Infrastructure**: Cloudflare Tunnel + Zero Trust Access

## Prerequisites

- Node.js 18+ (check with `node -v`)
- Docker & Docker Compose (check with `docker --version`)
- npm (comes with Node.js)

## Quick Start

### Automated Setup (Recommended)

Use the scaffold script to automate the entire setup process:

```bash
# Make the script executable (first time only)
chmod +x scaffold.sh

# Run the scaffold script
./scaffold.sh

# Or start development server after setup
./scaffold.sh --dev

# See all options
./scaffold.sh --help
```

**The scaffold script will:**
- ✅ Check all prerequisites (Node.js, npm, Docker)
- ✅ Create `.env` file with secure JWT secret
- ✅ Start PostgreSQL database container
- ✅ Install all npm dependencies
- ✅ Generate Prisma Client
- ✅ Run database migrations
- ✅ Seed database with initial data
- ✅ Build the application (optional)
- ✅ Start development server (optional)

### Manual Setup

If you prefer to set up manually:

#### 1. Start Database
```bash
docker-compose -f docker/docker-compose.yml up -d
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup Database
```bash
npm run db:setup
```

This will:
- Generate Prisma Client
- Run database migrations
- Seed initial data (users, contractor, job, permit, tasks)

#### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Seeded Users

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| admin@example.com | admin123 | ADMIN | Full access |
| coord@example.com | coord123 | COORDINATOR | Permits, Jobs, Documents, Tasks |
| billing@example.com | billing123 | BILLING | Read permits/jobs, Manage invoices |

⚠️ **SECURITY**: Change these passwords in production!

## Scaffold Script Options

The `scaffold.sh` script supports the following options with comprehensive error handling:

```bash
./scaffold.sh [options]

Options:
  --skip-deps     Skip dependency installation (useful if already installed)
  --skip-db       Skip database setup (migrations and seeding)
  --skip-build    Skip production build (faster for development setup)
  --dev           Start development server after setup completes
  --reset-db      Reset database before setup (⚠️ destroys all data)
  --debug         Enable verbose debug output for troubleshooting
  --help          Show help message
```

### Error Handling Features

The scaffold script includes comprehensive error handling for:

✅ **Port Conflicts**: Automatically detects if PostgreSQL port (5432) is in use and suggests alternatives
✅ **Database Validation**: Validates database names, URLs, and connection strings
✅ **Container Management**: Handles existing containers, stopped containers, and conflicts
✅ **File Permissions**: Checks write permissions before creating files
✅ **Disk Space**: Warns if insufficient disk space is available
✅ **Network Connectivity**: Tests npm registry and database connections
✅ **Dependency Verification**: Confirms critical dependencies are installed correctly
✅ **Migration Errors**: Provides specific guidance for common migration failures
✅ **Build Failures**: Offers solutions for TypeScript, memory, and dependency errors
✅ **Graceful Cleanup**: Provides cleanup instructions if setup fails partway through

**Examples:**
```bash
# Full setup including build
./scaffold.sh

# Quick development setup (skip build, start dev server)
./scaffold.sh --skip-build --dev

# Re-setup database only
./scaffold.sh --skip-deps --reset-db

# Fresh start with everything
./scaffold.sh --reset-db --dev
```

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:setup` - Run migrations and seed (full setup)
- `npm run db:reset` - Reset database (⚠️ destroys all data)

### Testing
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── documents/      # Document management
│   │   │   └── health/         # Health check endpoint
│   │   └── ...                 # Pages
│   └── lib/                    # Shared utilities
│       ├── auth/               # Authentication helpers
│       ├── db/                 # Database client
│       ├── middleware/         # Auth & rate limiting
│       ├── rbac/               # Role-based access control
│       └── storage/            # File storage adapters
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seed script
├── docker/
│   └── docker-compose.yml      # Postgres container
├── cloudflare/
│   └── cloudflared-config.yml  # Tunnel configuration
└── docs/
  └── zero-trust.md           # Cloudflare setup guide
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login (rate limited: 10/min)
- `POST /api/auth/logout` - User logout

### Documents
- `POST /api/documents/upload` - Upload document (rate limited: 20/min, requires auth)

### System
- `GET /api/health` - Health check endpoint

## Environment Variables

Copy `.env.example` to `.env` and configure. The setup script auto-generates a secure JWT_SECRET.

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens (min 32 chars, auto-generated)

### Optional
- `JWT_EXPIRES_IN` - JWT expiration time (default: "7d")
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in ms (default: 60000)
- `MAX_FILE_SIZE_MB` - Max upload size (default: 10)
- `UPLOAD_DIR` - File upload directory (default: "./uploads")

## Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT tokens in httpOnly cookies
- ✅ Input validation with Zod schemas
- ✅ File upload validation (type, size, filename sanitization)
- ✅ Rate limiting on API endpoints
- ✅ Authentication middleware
- ✅ Role-based access control
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (input sanitization)

## Database Models

- **User**: Authentication and authorization
- **Contractor**: License holders
- **Job**: Customer projects
- **Permit**: Building permits with status workflow
- **Task**: Action items linked to permits
- **Document**: Versioned file uploads
- **Note**: Comments on permits
- **ActivityEvent**: Audit log

## Cloudflare Zero Trust Setup

See [docs/zero-trust.md](docs/zero-trust.md) for detailed setup instructions.

## Production Deployment

### Before Deploying:

1. ✅ Change all default passwords
2. ✅ Generate new JWT_SECRET (64+ characters)
3. ✅ Update DATABASE_URL with production credentials
4. ✅ Set NODE_ENV=production
5. ✅ Configure CORS_ORIGIN
6. ✅ Set up proper file storage (S3/R2)
7. ✅ Enable rate limiting
8. ✅ Configure Cloudflare Tunnel
9. ✅ Set up monitoring and logging
10. ✅ Review and update .gitignore

### Recommended Additions:

- Application monitoring (Sentry, DataDog)
- Log aggregation (CloudWatch, LogRocket)
- Database backups
- CI/CD pipeline
- Automated testing
- Security headers middleware

## Troubleshooting

### Database Connection Issues
```bash
# Check if database is running
docker ps | grep permit_db

# Check database logs
docker logs permit_db

# Test connection
docker exec permit_db pg_isready -U permituser
```

### Prisma Issues
```bash
# Regenerate Prisma Client
npm run db:generate

# Reset database (⚠️ destroys data)
npm run db:reset
```

### Port Already in Use
```bash
# Change port in docker-compose.yml
# Or stop conflicting service
```

## License

Private - All Rights Reserved
