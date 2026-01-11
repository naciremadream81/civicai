#!/bin/bash

###############################################################################
# Permit Management App - Project Generator
#
# This script creates a complete new project from scratch with all necessary
# files, directories, and configuration.
#
# Usage:
#   ./create-project.sh <project-name> [options]
#
# Example:
#   ./create-project.sh my-permit-app
#   ./create-project.sh ~/projects/my-permit-app --setup
#
# Options:
#   --setup        Run full setup after creating project files
#   --skip-setup   Only create files, don't run setup
#   --help         Show this help message
###############################################################################

set -eo pipefail

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

print_section() {
    echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${BLUE}  $1${NC}"
    echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
}

print_step() {
    echo -e "${CYAN}→${NC} ${BOLD}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${MAGENTA}ℹ${NC} $1"
}

# Parse arguments
PROJECT_NAME=""
RUN_SETUP=false

if [ $# -eq 0 ]; then
    echo -e "${RED}Error: Project name is required${NC}"
    echo "Usage: ./create-project.sh <project-name> [--setup]"
    exit 1
fi

while [[ $# -gt 0 ]]; do
    case $1 in
        --setup)
            RUN_SETUP=true
            shift
            ;;
        --skip-setup)
            RUN_SETUP=false
            shift
            ;;
        --help)
            head -n 20 "$0" | grep -E '^# ' | sed 's/^# //'
            exit 0
            ;;
        -*)
            print_error "Unknown option: $1"
            exit 1
            ;;
        *)
            PROJECT_NAME="$1"
            shift
            ;;
    esac
done

if [ -z "$PROJECT_NAME" ]; then
    print_error "Project name is required"
    exit 1
fi

# Determine project directory
if [ "${PROJECT_NAME:0:1}" = "/" ]; then
    PROJECT_DIR="$PROJECT_NAME"
    PROJECT_NAME=$(basename "$PROJECT_NAME")
else
    PROJECT_DIR="$(pwd)/$PROJECT_NAME"
fi

print_section "Creating New Permit Management Project"
print_info "Project name: ${BOLD}$PROJECT_NAME${NC}"
print_info "Project directory: ${CYAN}$PROJECT_DIR${NC}"

# Check if directory already exists
if [ -d "$PROJECT_DIR" ]; then
    if [ "$(ls -A "$PROJECT_DIR" 2>/dev/null)" ]; then
        print_error "Directory $PROJECT_DIR already exists and is not empty"
        print_info "Please choose a different name or remove the existing directory"
        exit 1
    else
        print_warning "Directory exists but is empty. Proceeding..."
    fi
fi

# Create project directory
print_step "Creating project directory..."
mkdir -p "$PROJECT_DIR" || {
    print_error "Failed to create project directory"
    exit 1
}
cd "$PROJECT_DIR" || {
    print_error "Failed to change to project directory"
    exit 1
}
print_success "Project directory created"

# Copy scaffold.sh to new project
print_step "Copying scaffold script..."
cp "$SCRIPT_DIR/scaffold.sh" "$PROJECT_DIR/" 2>/dev/null || true
chmod +x "$PROJECT_DIR/scaffold.sh" 2>/dev/null || true

# Create all configuration files
print_section "Creating Configuration Files"

# package.json
print_step "Creating package.json..."
cat > package.json <<'PKG_EOF'
{
  "name": "PROJECT_NAME",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:setup": "npm run db:migrate && npm run db:seed",
    "db:reset": "prisma migrate reset --force",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.3",
    "lru-cache": "^11.2.4",
    "lucide-react": "^0.562.0",
    "next": "16.1.1",
    "prisma": "^5.22.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "recharts": "^3.6.0",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.1.1",
    "tailwindcss": "^4",
    "tsx": "^4.7.0",
    "typescript": "^5"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
PKG_EOF
# Replace PROJECT_NAME with actual project name
sed -i "s/PROJECT_NAME/$PROJECT_NAME/g" package.json
print_success "package.json created"

# tsconfig.json
print_step "Creating tsconfig.json..."
cat > tsconfig.json <<'TS_EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@tests/*": [
        "tests/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": [
    "node_modules"
  ]
}
TS_EOF
print_success "tsconfig.json created"

# next.config.ts
print_step "Creating next.config.ts..."
cat > next.config.ts <<'NEXT_EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
NEXT_EOF
print_success "next.config.ts created"

# postcss.config.mjs
print_step "Creating postcss.config.mjs..."
cat > postcss.config.mjs <<'POSTCSS_EOF'
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
POSTCSS_EOF
print_success "postcss.config.mjs created"

# eslint.config.mjs
print_step "Creating eslint.config.mjs..."
cat > eslint.config.mjs <<'ESLINT_EOF'
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
ESLINT_EOF
print_success "eslint.config.mjs created"

# next-env.d.ts
print_step "Creating next-env.d.ts..."
cat > next-env.d.ts <<'NEXTENV_EOF'
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
NEXTENV_EOF
print_success "next-env.d.ts created"

# jest.config.js
print_step "Creating jest.config.js..."
cat > jest.config.js <<'JEST_EOF'
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
JEST_EOF
print_success "jest.config.js created"

# .gitignore
print_step "Creating .gitignore..."
cat > .gitignore <<'GITIGNORE_EOF'
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# Prisma
prisma/migrations/*/migration.sql
!prisma/migrations/migration_lock.toml

# Uploads
/uploads/*
!/uploads/.gitkeep

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
Thumbs.db
GITIGNORE_EOF
print_success ".gitignore created"

# Create directory structure
print_section "Creating Directory Structure"

DIRS=(
    "src/app/api/auth"
    "src/app/api/documents"
    "src/app/api/health"
    "src/app/(dashboard)/admin"
    "src/app/(dashboard)/contractor"
    "src/app/(dashboard)/inspector"
    "src/app/(dashboard)/dashboard"
    "src/app/(dashboard)/notifications"
    "src/app/(dashboard)/profile"
    "src/app/new-application"
    "src/app/applications"
    "src/app/approvals"
    "src/app/reports"
    "src/app/users"
    "src/app/split-view"
    "src/app/permit-demo"
    "src/components/shared"
    "src/components/permit-demo"
    "src/context"
    "src/lib/auth"
    "src/lib/db"
    "src/lib/middleware"
    "src/lib/rbac"
    "src/lib/storage"
    "src/lib/utils"
    "prisma/migrations"
    "docker"
    "cloudflare"
    "docs"
    "tests/e2e"
    "tests/unit/auth"
    "tests/unit/rbac"
    "tests/unit/utils"
    "tests/integration/api/auth"
    "tests/integration/api"
    "tests/fixtures"
    "tests/helpers"
    "public"
    "uploads"
)

for dir in "${DIRS[@]}"; do
    mkdir -p "$dir"
done

# Create .gitkeep for uploads
touch uploads/.gitkeep

print_success "Directory structure created"

# Copy essential source files from template
print_section "Copying Source Files from Template"

# Check if we're in the template directory or a new location
SOURCE_DIR="$SCRIPT_DIR"
print_info "Copying files from template directory: $SOURCE_DIR"

# Copy all source files
if [ -d "$SOURCE_DIR/src" ]; then
    print_step "Copying src/ directory..."
    cp -r "$SOURCE_DIR/src/"* src/ 2>/dev/null || {
        print_warning "Could not copy all src files, creating minimal structure instead"
    }
    print_success "Source files copied"
fi

# Copy Prisma schema and seed
if [ -f "$SOURCE_DIR/prisma/schema.prisma" ]; then
    print_step "Copying Prisma schema..."
    cp "$SOURCE_DIR/prisma/schema.prisma" prisma/ 2>/dev/null || true
    if [ -f "$SOURCE_DIR/prisma/seed.ts" ]; then
        cp "$SOURCE_DIR/prisma/seed.ts" prisma/ 2>/dev/null || true
    fi
    print_success "Prisma files copied"
fi

# Copy docker compose
if [ -f "$SOURCE_DIR/docker/docker-compose.yml" ]; then
    print_step "Copying Docker configuration..."
    cp "$SOURCE_DIR/docker/docker-compose.yml" docker/ 2>/dev/null || true
    print_success "Docker files copied"
fi

# Copy cloudflare config
if [ -f "$SOURCE_DIR/cloudflare/cloudflared-config.yml" ]; then
    print_step "Copying Cloudflare configuration..."
    mkdir -p cloudflare
    cp "$SOURCE_DIR/cloudflare/cloudflared-config.yml" cloudflare/ 2>/dev/null || true
fi

# Copy docs
if [ -d "$SOURCE_DIR/docs" ]; then
    print_step "Copying documentation..."
    cp -r "$SOURCE_DIR/docs"/* docs/ 2>/dev/null || true
fi

# Copy additional documentation files
print_step "Copying documentation files..."
for doc_file in "README.md" "UI_COMPONENTS_GUIDE.md" "UI_DESIGN_SUMMARY.md" "UI_TROUBLESHOOTING.md" "IMPLEMENTATION_COMPLETE.md"; do
    if [ -f "$SOURCE_DIR/$doc_file" ]; then
        cp "$SOURCE_DIR/$doc_file" "$doc_file" 2>/dev/null || true
    fi
done
print_success "Documentation files copied"

# Copy public assets
if [ -d "$SOURCE_DIR/public" ]; then
    print_step "Copying public assets..."
    cp -r "$SOURCE_DIR/public"/* public/ 2>/dev/null || true
    print_success "Public assets copied"
fi

# Copy test structure if exists
if [ -d "$SOURCE_DIR/tests" ]; then
    print_step "Copying test structure..."
    # Copy test files but not node_modules or results
    find "$SOURCE_DIR/tests" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" \) | while read -r file; do
        rel_path="${file#$SOURCE_DIR/tests/}"
        dest_file="tests/$rel_path"
        mkdir -p "$(dirname "$dest_file")"
        cp "$file" "$dest_file" 2>/dev/null || true
    done
    print_success "Test files copied"
fi

# If template files weren't available, create minimal structure
if [ ! -f "src/app/layout.tsx" ]; then
    print_warning "Template source files not found. Creating minimal structure."
    print_warning "Template source files not found. Creating minimal structure."
    
    # Create minimal layout.tsx
    cat > src/app/layout.tsx <<'LAYOUT_EOF'
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Permit Management System",
  description: "Full-stack permit processing and document management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
LAYOUT_EOF

    # Create minimal page.tsx
    cat > src/app/page.tsx <<'PAGE_EOF'
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Permit Management System</h1>
    </div>
  );
}
PAGE_EOF

    # Create minimal globals.css
    cat > src/app/globals.css <<'CSS_EOF'
@import "tailwindcss";
CSS_EOF

    # Create minimal Prisma schema
    cat > prisma/schema.prisma <<'PRISMA_EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
PRISMA_EOF

    # Create minimal seed.ts
    cat > prisma/seed.ts <<'SEED_EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  // Add your seed data here
  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
SEED_EOF

    # Create docker-compose.yml
    cat > docker/docker-compose.yml <<'DOCKER_EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: permit_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-permituser}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme_in_development}
      POSTGRES_DB: ${POSTGRES_DB:-permitdb}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-permituser} -d ${POSTGRES_DB:-permitdb}"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

volumes:
  postgres_data:
DOCKER_EOF
fi

print_success "Essential files created"

# Create README
print_step "Creating README.md..."
cat > README.md <<README_EOF
# $PROJECT_NAME

Permit Processing & Document Management System

## Quick Start

\`\`\`bash
# Run the scaffold script to set up everything
./scaffold.sh --dev
\`\`\`

## Features

- 🔐 Secure JWT-based authentication
- 🛡️ Role-based access control (RBAC)
- 📁 Document management with file uploads
- ⚡ Rate limiting on API endpoints
- 🏥 Health check endpoints
- 📊 Activity tracking and audit logs

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Docker)

## Development

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
\`\`\`

## Database

\`\`\`bash
npm run db:setup    # Setup database (migrate + seed)
npm run db:studio   # Open Prisma Studio
npm run db:reset    # Reset database (⚠️ destroys data)
\`\`\`

## Testing

\`\`\`bash
npm test           # Run all tests
npm run test:e2e   # Run E2E tests
\`\`\`
README_EOF
print_success "README.md created"

print_section "Project Creation Complete! 🎉"

print_success "Project '$PROJECT_NAME' has been created in:"
print_info "  ${CYAN}$PROJECT_DIR${NC}"
echo ""
print_info "Next steps:"
echo "  1. ${CYAN}cd $PROJECT_DIR${NC}"
if [ "$RUN_SETUP" = true ]; then
    echo "  2. Run setup: ${CYAN}./scaffold.sh --dev${NC}"
else
    echo "  2. Run setup: ${CYAN}./scaffold.sh${NC}"
    echo "  3. Or start dev server: ${CYAN}./scaffold.sh --dev${NC}"
fi
echo ""

if [ "$RUN_SETUP" = true ]; then
    print_section "Running Setup..."
    cd "$PROJECT_DIR"
    ./scaffold.sh --dev
fi

print_success "Done!"