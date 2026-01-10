#!/bin/bash

###############################################################################
# Permit Management App - Complete Scaffold Script
#
# This script automates the complete setup of the Permit Management Application.
# It handles all prerequisites, dependencies, database setup, and configuration.
#
# Usage:
#   ./scaffold.sh [options]
#
# Options:
#   --skip-deps       Skip dependency installation
#   --skip-db         Skip database setup (migrations and seeding)
#   --skip-build      Skip production build
#   --dev             Start development server after setup
#   --reset-db        Reset database before setup (⚠️ destroys all data)
#   --debug           Enable debug output (verbose logging)
#   --help            Show this help message
###############################################################################

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Error handling
cleanup_on_error() {
    local exit_code=$?
    # Only show cleanup if we actually hit an error (not normal exit)
    if [ $exit_code -ne 0 ] && [ "${CLEANUP_SHOWN:-false}" != "true" ]; then
        export CLEANUP_SHOWN=true
        echo ""  # New line
        print_error "An error occurred during setup (exit code: $exit_code)"
        print_info "Check the output above for specific error details"
        echo ""
        print_info "Cleanup options:"
        echo "  • Stop containers: ${CYAN}docker stop permit_db${NC}"
        echo "  • Remove containers: ${CYAN}docker rm permit_db${NC}"
        echo "  • View container logs: ${CYAN}docker logs permit_db${NC}"
        echo "  • Remove node_modules: ${CYAN}rm -rf node_modules${NC}"
        echo "  • Remove .env: ${CYAN}rm -f .env${NC} (regenerates on next run)"
    fi
}
trap cleanup_on_error ERR

# Script directory (where scaffold.sh is located)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Flags
SKIP_DEPS=false
SKIP_DB=false
SKIP_BUILD=false
START_DEV=false
RESET_DB=false
DEBUG=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-deps)
            SKIP_DEPS=true
            shift
            ;;
        --skip-db)
            SKIP_DB=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --dev)
            START_DEV=true
            shift
            ;;
        --reset-db)
            RESET_DB=true
            shift
            ;;
        --debug)
            DEBUG=true
            export DEBUG=true
            shift
            ;;
        --help)
            head -n 20 "$0" | grep -E '^# ' | sed 's/^# //'
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Run ./scaffold.sh --help for usage information"
            exit 1
            ;;
    esac
done

###############################################################################
# Utility Functions
###############################################################################

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

print_debug() {
    if [ "${DEBUG:-false}" = "true" ]; then
        echo -e "${CYAN}[DEBUG]${NC} $1" >&2
    fi
}

# Check if a port is available
check_port_available() {
    local port=$1
    local service=${2:-"unknown"}
    
    if command -v lsof &> /dev/null; then
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_error "Port $port is already in use by another service"
            print_info "To find what's using it: ${CYAN}lsof -i :$port${NC}"
            print_info "Or specify a different port in .env: ${CYAN}POSTGRES_PORT=5433${NC}"
            return 1
        fi
    elif command -v netstat &> /dev/null; then
        if netstat -tuln 2>/dev/null | grep -q ":$port "; then
            print_error "Port $port is already in use"
            return 1
        fi
    elif command -v ss &> /dev/null; then
        if ss -tuln 2>/dev/null | grep -q ":$port "; then
            print_error "Port $port is already in use"
            return 1
        fi
    else
        print_warning "Cannot check port availability (lsof/netstat/ss not found)"
        print_info "Please manually verify port $port is available"
    fi
    
    return 0
}

# Validate database name (PostgreSQL naming rules)
validate_database_name() {
    local db_name=$1
    
    if [ -z "$db_name" ]; then
        print_error "Database name cannot be empty"
        return 1
    fi
    
    # Check length (PostgreSQL limit is 63 characters)
    if [ ${#db_name} -gt 63 ]; then
        print_error "Database name is too long (max 63 characters): $db_name"
        return 1
    fi
    
    # Check for valid characters (alphanumeric and underscore)
    if ! echo "$db_name" | grep -qE '^[a-zA-Z_][a-zA-Z0-9_]*$'; then
        print_error "Database name contains invalid characters: $db_name"
        print_info "Database names must start with a letter or underscore and contain only alphanumeric characters and underscores"
        return 1
    fi
    
    # Check for reserved PostgreSQL keywords (basic check)
    local reserved_words=("select" "insert" "update" "delete" "drop" "create" "alter" "database" "table" "user")
    for word in "${reserved_words[@]}"; do
        if [ "$(echo "$db_name" | tr '[:upper:]' '[:lower:]')" = "$word" ]; then
            print_warning "Database name '$db_name' is a reserved PostgreSQL keyword"
            print_info "While it may work, consider using a different name for clarity"
        fi
    done
    
    return 0
}

# Validate DATABASE_URL format
validate_database_url() {
    local db_url=$1
    
    if [ -z "$db_url" ]; then
        print_error "DATABASE_URL cannot be empty"
        return 1
    fi
    
    # Check basic PostgreSQL URL format
    if ! echo "$db_url" | grep -qE '^postgresql://'; then
        print_error "DATABASE_URL must start with 'postgresql://'"
        return 1
    fi
    
    # Try to parse components (basic validation)
    if ! echo "$db_url" | grep -qE 'postgresql://[^:]+:[^@]+@[^:]+:[0-9]+/[^?]+'; then
        print_warning "DATABASE_URL format may be incorrect"
        print_info "Expected format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    fi
    
    return 0
}

# Check disk space (at least 1GB free)
check_disk_space() {
    print_step "Checking available disk space..."
    
    local required_mb=1024  # 1GB in MB
    local available_mb
    
    if command -v df &> /dev/null; then
        available_mb=$(df -m . | tail -1 | awk '{print $4}')
        
        if [ "$available_mb" -lt "$required_mb" ]; then
            print_warning "Low disk space: ${available_mb}MB available (recommended: ${required_mb}MB+)"
            print_info "The setup may fail if there's not enough space for dependencies and database"
            read -p "Continue anyway? (y/N) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                print_error "Setup cancelled by user"
                exit 1
            fi
        else
            print_success "Sufficient disk space available (${available_mb}MB free)"
        fi
    else
        print_warning "Cannot check disk space (df command not found)"
    fi
}

# Check file/directory permissions
check_permissions() {
    print_step "Checking file permissions..."
    
    local issues=0
    
    # Check if we can write to current directory
    if [ ! -w . ]; then
        print_error "Cannot write to current directory: $(pwd)"
        issues=$((issues + 1))
    fi
    
    # Check if we can create directories
    if ! mkdir -p .scaffold_test 2>/dev/null; then
        print_error "Cannot create directories in current location"
        issues=$((issues + 1))
    else
        rmdir .scaffold_test 2>/dev/null || true
    fi
    
    # Check if we can write .env file
    if ! touch .env.test 2>/dev/null; then
        print_error "Cannot write .env file (permission denied)"
        issues=$((issues + 1))
    else
        rm -f .env.test 2>/dev/null || true
    fi
    
    if [ $issues -gt 0 ]; then
        print_error "Permission issues detected. Please fix file permissions and try again."
        exit 1
    fi
    
    print_success "File permissions OK"
}

###############################################################################
# Prerequisites Check
###############################################################################

check_prerequisites() {
    print_section "Checking Prerequisites"
    
    local missing_deps=()
    
    # Check Node.js
    print_step "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        local node_version
        node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -ge 18 ]; then
            print_success "Node.js $(node -v) found (requires 18+)"
        else
            print_error "Node.js version $(node -v) found, but version 18+ is required"
            print_info "Install Node.js 18+ from: https://nodejs.org/"
            missing_deps+=("nodejs (>=18)")
        fi
    else
        print_error "Node.js is not installed"
        print_info "Install Node.js from: https://nodejs.org/"
        missing_deps+=("nodejs (>=18)")
    fi
    
    # Check npm
    print_step "Checking npm installation..."
    if command -v npm &> /dev/null; then
        local npm_version
        npm_version=$(npm -v)
        print_success "npm $npm_version found"
        
        # Check npm version (should be compatible with Node.js)
        local npm_major
        npm_major=$(echo "$npm_version" | cut -d'.' -f1)
        if [ "$npm_major" -lt 8 ]; then
            print_warning "npm version $npm_version is quite old. Consider updating."
        fi
    else
        print_error "npm is not installed"
        print_info "npm usually comes with Node.js. Reinstall Node.js if npm is missing."
        missing_deps+=("npm")
    fi
    
    # Check Docker
    print_step "Checking Docker installation..."
    if command -v docker &> /dev/null; then
        local docker_version
        docker_version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        print_success "Docker $docker_version found"
    else
        print_error "Docker is not installed"
        print_info "Install Docker from: https://docs.docker.com/get-docker/"
        missing_deps+=("docker")
    fi
    
    # Check Docker Compose
    print_step "Checking Docker Compose installation..."
    local compose_cmd=""
    if command -v docker-compose &> /dev/null; then
        compose_cmd="docker-compose"
        print_success "Docker Compose (standalone) found"
    elif docker compose version &> /dev/null 2>&1; then
        compose_cmd="docker compose"
        print_success "Docker Compose (plugin) found"
    else
        print_error "Docker Compose is not installed"
        print_info "Install Docker Compose from: https://docs.docker.com/compose/install/"
        missing_deps+=("docker-compose")
    fi
    
    # Export compose command for later use
    export COMPOSE_CMD="$compose_cmd"
    
    # Check if Docker daemon is running
    if command -v docker &> /dev/null; then
        print_step "Checking Docker daemon..."
        if docker info &> /dev/null 2>&1; then
            print_success "Docker daemon is running"
        else
            print_error "Docker daemon is not running"
            print_info "Please start Docker Desktop or Docker service:"
            echo "  • macOS/Windows: Start Docker Desktop application"
            echo "  • Linux: sudo systemctl start docker"
            missing_deps+=("docker-daemon")
        fi
    fi
    
    # Check disk space
    check_disk_space
    
    # Check permissions
    check_permissions
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_error "Missing prerequisites: ${missing_deps[*]}"
        print_info "Please install the missing dependencies and run the script again."
        exit 1
    fi
    
    print_success "All prerequisites met!"
}

###############################################################################
# Environment Setup
###############################################################################

setup_environment() {
    print_section "Setting Up Environment Variables"
    
    if [ -f ".env" ]; then
        print_warning ".env file already exists"
        
        # Source existing .env to get values
        set -a
        # shellcheck source=/dev/null
        [ -f .env ] && . .env
        set +a
        
        # Validate existing DATABASE_URL if present
        if [ -n "${DATABASE_URL:-}" ]; then
            print_step "Validating existing DATABASE_URL..."
            if validate_database_url "$DATABASE_URL"; then
                print_success "Existing DATABASE_URL is valid"
            else
                print_warning "Existing DATABASE_URL may have issues"
            fi
        fi
        
        # Ask user if they want to regenerate
        print_info "If you need to regenerate, delete .env and run this script again."
        print_info "Or edit .env manually if you just need to update values."
        read -p "Continue with existing .env file? (Y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Nn]$ ]]; then
            print_info "To regenerate .env, run: ${CYAN}rm .env && ./scaffold.sh${NC}"
            exit 0
        fi
        
        # Extract values from existing .env or use defaults
        POSTGRES_USER="${POSTGRES_USER:-permituser}"
        POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-changeme_in_development}"
        POSTGRES_DB="${POSTGRES_DB:-permitdb}"
        POSTGRES_PORT="${POSTGRES_PORT:-5432}"
        
        # Check port availability even with existing .env
        check_port_available "$POSTGRES_PORT" "PostgreSQL"
        
        return
    fi
    
    print_step "Creating .env file from template..."
    
    # Generate a secure JWT secret (64 characters)
    if command -v openssl &> /dev/null; then
        JWT_SECRET=$(openssl rand -hex 32 2>/dev/null)
    elif [ -c /dev/urandom ]; then
        JWT_SECRET=$(head -c 64 /dev/urandom | base64 | tr -d '\n' | cut -c1-64)
    else
        print_error "Cannot generate secure JWT secret (openssl or /dev/urandom not available)"
        print_info "Please install openssl or manually set JWT_SECRET in .env file"
        exit 1
    fi
    
    if [ ${#JWT_SECRET} -lt 32 ]; then
        print_error "Generated JWT secret is too short"
        exit 1
    fi
    
    # Default database configuration (matching docker-compose.yml)
    POSTGRES_USER="${POSTGRES_USER:-permituser}"
    POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-changeme_in_development}"
    POSTGRES_DB="${POSTGRES_DB:-permitdb}"
    POSTGRES_PORT="${POSTGRES_PORT:-5432}"
    
    # Validate database name
    print_step "Validating database name..."
    if ! validate_database_name "$POSTGRES_DB"; then
        print_error "Invalid database name: $POSTGRES_DB"
        print_info "Set a valid name: ${CYAN}POSTGRES_DB=mydatabase ./scaffold.sh${NC}"
        exit 1
    fi
    
    # Check port availability
    print_step "Checking PostgreSQL port availability..."
    if ! check_port_available "$POSTGRES_PORT" "PostgreSQL"; then
        # Suggest alternative port
        local alt_port=$((POSTGRES_PORT + 1))
        print_info "Trying alternative port: $alt_port"
        if check_port_available "$alt_port" "PostgreSQL"; then
            POSTGRES_PORT=$alt_port
            print_warning "Using alternative port: $POSTGRES_PORT"
            print_info "Update docker-compose.yml if you want to use a different port"
        else
            print_error "Cannot find an available port. Please free up port $POSTGRES_PORT or specify a different one."
            exit 1
        fi
    fi
    
    # Construct DATABASE_URL
    DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
    
    # Validate DATABASE_URL format
    if ! validate_database_url "$DATABASE_URL"; then
        print_error "Generated DATABASE_URL is invalid"
        exit 1
    fi
    
    # Create .env file with error handling
    print_step "Writing .env file..."
    if ! cat > .env <<EOF
# Application Environment
NODE_ENV=development

# Database Configuration
DATABASE_URL=${DATABASE_URL}

# JWT Configuration
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000

# File Upload Configuration
MAX_FILE_SIZE_MB=10
UPLOAD_DIR=./uploads

# Optional: Cloudflare Zero Trust Configuration
# CF_ACCESS_AUD=your_aud_tag_here
# CF_TEAM_DOMAIN=yourteam.cloudflareaccess.com

# Database Seeding (optional - for custom passwords)
# ADMIN_SEED_PASSWORD=admin123
# COORD_SEED_PASSWORD=coord123
# BILLING_SEED_PASSWORD=billing123

# Docker Compose Environment Variables (used by docker-compose.yml)
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=${POSTGRES_DB}
POSTGRES_PORT=${POSTGRES_PORT}
EOF
    then
        print_error "Failed to create .env file"
        print_info "Check file permissions for current directory"
        exit 1
    fi
    
    print_success ".env file created successfully"
    print_info "Generated secure JWT_SECRET (${#JWT_SECRET} characters)"
    print_warning "⚠️  IMPORTANT: Update DATABASE_URL and other values for production use!"
    
    # Export values for later use
    export POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB POSTGRES_PORT DATABASE_URL
}

###############################################################################
# Docker Database Setup
###############################################################################

setup_database() {
    print_section "Setting Up PostgreSQL Database"
    
    local compose_file="docker/docker-compose.yml"
    
    if [ ! -f "$compose_file" ]; then
        print_error "Docker Compose file not found: $compose_file"
        print_info "Expected location: $SCRIPT_DIR/$compose_file"
        exit 1
    fi
    
    # Load environment variables from .env if exists
    if [ -f ".env" ]; then
        set -a
        # shellcheck source=/dev/null
        . .env
        set +a
    fi
    
    # Use exported values or defaults
    local postgres_user="${POSTGRES_USER:-permituser}"
    local postgres_db="${POSTGRES_DB:-permitdb}"
    local postgres_port="${POSTGRES_PORT:-5432}"
    local container_name="permit_db"
    
    # Check if container with same name exists but is stopped
    if docker ps -a --format '{{.Names}}' | grep -q "^${container_name}$"; then
        local container_status
        container_status=$(docker ps -a --filter "name=${container_name}" --format '{{.Status}}')
        
        if docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
            print_warning "Database container '${container_name}' is already running"
            
            # Test connection
            print_step "Testing database connection..."
            if docker exec "$container_name" pg_isready -U "$postgres_user" -d "$postgres_db" &> /dev/null 2>&1; then
                print_success "Database is accessible and ready"
                return
            else
                print_warning "Container is running but database is not ready"
                print_info "Checking container health..."
                docker logs --tail 20 "$container_name" 2>&1 | tail -5
            fi
        else
            print_warning "Container '${container_name}' exists but is stopped"
            print_info "Container status: $container_status"
            read -p "Start existing container? (Y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Nn]$ ]]; then
                print_info "To remove and recreate: ${CYAN}docker rm ${container_name} && ./scaffold.sh${NC}"
                exit 0
            fi
            
            print_step "Starting existing container..."
            if ! docker start "$container_name" 2>&1; then
                print_error "Failed to start existing container"
                print_info "Try removing it first: ${CYAN}docker rm ${container_name}${NC}"
                exit 1
            fi
        fi
    fi
    
    # Check for port conflicts before starting
    print_step "Checking for port conflicts..."
    if ! check_port_available "$postgres_port" "PostgreSQL"; then
        print_error "Port $postgres_port is already in use"
        print_info "Options:"
        echo "  1. Stop the service using port $postgres_port"
        echo "  2. Use a different port: ${CYAN}POSTGRES_PORT=5433 ./scaffold.sh${NC}"
        exit 1
    fi
    
    # Check for volume conflicts
    print_step "Checking for existing volumes..."
    if docker volume ls --format '{{.Name}}' | grep -q "^.*postgres_data$"; then
        print_info "Existing PostgreSQL volume found (this is normal)"
    fi
    
    # Determine which compose command to use
    local compose_cmd="${COMPOSE_CMD:-docker-compose}"
    if ! command -v docker-compose &> /dev/null && docker compose version &> /dev/null 2>&1; then
        compose_cmd="docker compose"
    fi
    
    # Start database container
    print_step "Starting PostgreSQL container..."
    print_debug "Using compose command: $compose_cmd"
    
    # Export env vars for docker-compose
    export POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB POSTGRES_PORT
    
    local start_output
    if start_output=$($compose_cmd -f "$compose_file" up -d 2>&1); then
        # Filter out "is up-to-date" messages
        if echo "$start_output" | grep -qv "is up-to-date"; then
            echo "$start_output" | grep -v "is up-to-date" || true
        fi
        print_success "Database container started"
    else
        print_error "Failed to start database container"
        print_info "Docker Compose output:"
        echo "$start_output"
        print_info "Try running manually: ${CYAN}$compose_cmd -f $compose_file up -d${NC}"
        exit 1
    fi
    
    # Wait for database to be ready with better error handling
    print_step "Waiting for database to be ready..."
    local max_attempts=60  # Increased timeout
    local attempt=0
    local check_interval=2
    
    while [ $attempt -lt $max_attempts ]; do
        # Check if container is still running
        if ! docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
            print_error "Container stopped unexpectedly"
            print_info "Container logs:"
            docker logs --tail 30 "$container_name" 2>&1 || true
            exit 1
        fi
        
        # Check database readiness
        if docker exec "$container_name" pg_isready -U "$postgres_user" -d "$postgres_db" &> /dev/null 2>&1; then
            echo ""  # New line after dots
            print_success "Database is ready!"
            
            # Additional verification: try to connect
            print_step "Verifying database connection..."
            if docker exec "$container_name" psql -U "$postgres_user" -d "$postgres_db" -c "SELECT 1;" &> /dev/null 2>&1; then
                print_success "Database connection verified"
                return 0
            else
                print_warning "Database is ready but connection test failed"
                print_info "This may be normal if the database is initializing"
            fi
            return 0
        fi
        
        attempt=$((attempt + 1))
        if [ $((attempt % 5)) -eq 0 ]; then
            echo -n "[${attempt}s]"
        else
            echo -n "."
        fi
        sleep $check_interval
    done
    
    echo ""  # New line after dots
    print_error "Database did not become ready within $((max_attempts * check_interval)) seconds"
    print_info "Container logs (last 50 lines):"
    docker logs --tail 50 "$container_name" 2>&1 || true
    print_info "Check container status: ${CYAN}docker ps -a | grep ${container_name}${NC}"
    print_info "View full logs: ${CYAN}docker logs ${container_name}${NC}"
    exit 1
}

###############################################################################
# Dependencies Installation
###############################################################################

install_dependencies() {
    print_section "Installing Dependencies"
    
    if [ "$SKIP_DEPS" = true ]; then
        print_warning "Skipping dependency installation (--skip-deps flag)"
        return
    fi
    
    print_step "Installing npm packages..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the correct directory?"
        print_info "Current directory: $(pwd)"
        exit 1
    fi
    
    # Check if node_modules exists and is valid
    if [ -d "node_modules" ]; then
        print_info "node_modules directory already exists"
        if [ ! -f "node_modules/.package-lock.json" ] && [ ! -f "package-lock.json" ]; then
            print_warning "node_modules exists but package-lock.json is missing"
            print_info "Consider removing node_modules and reinstalling for consistency"
        fi
    fi
    
    # Check npm registry connectivity
    print_step "Checking npm registry connectivity..."
    if ! npm ping &> /dev/null 2>&1; then
        print_warning "Cannot reach npm registry. Check your internet connection."
        print_info "If behind a proxy, configure npm: ${CYAN}npm config set proxy <proxy-url>${NC}"
    else
        print_success "npm registry is accessible"
    fi
    
    # Install dependencies with error handling
    print_step "Running npm install (this may take a few minutes)..."
    if npm install 2>&1 | tee /tmp/scaffold-npm-install.log; then
        print_success "Dependencies installed successfully"
        rm -f /tmp/scaffold-npm-install.log 2>/dev/null || true
    else
        local exit_code=$?
        print_error "Failed to install dependencies (exit code: $exit_code)"
        print_info "Common solutions:"
        echo "  1. Check internet connection"
        echo "  2. Clear npm cache: ${CYAN}npm cache clean --force${NC}"
        echo "  3. Remove node_modules and package-lock.json: ${CYAN}rm -rf node_modules package-lock.json && npm install${NC}"
        echo "  4. Check npm logs: ${CYAN}cat /tmp/scaffold-npm-install.log${NC}"
        exit 1
    fi
    
    # Verify critical dependencies are installed
    print_step "Verifying critical dependencies..."
    local missing_deps=()
    
    if [ ! -d "node_modules/@prisma/client" ]; then
        missing_deps+=("@prisma/client")
    fi
    if [ ! -d "node_modules/next" ]; then
        missing_deps+=("next")
    fi
    if [ ! -d "node_modules/react" ]; then
        missing_deps+=("react")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_error "Critical dependencies missing: ${missing_deps[*]}"
        print_info "Try: ${CYAN}npm install ${missing_deps[*]}${NC}"
        exit 1
    fi
    
    print_success "All critical dependencies verified"
}

###############################################################################
# Database Migrations and Seeding
###############################################################################

setup_prisma() {
    print_section "Setting Up Prisma Database"
    
    if [ "$SKIP_DB" = true ]; then
        print_warning "Skipping database setup (--skip-db flag)"
        return
    fi
    
    # Verify Prisma schema exists
    if [ ! -f "prisma/schema.prisma" ]; then
        print_error "Prisma schema not found: prisma/schema.prisma"
        exit 1
    fi
    
    # Check DATABASE_URL is set
    if [ -f ".env" ]; then
        set -a
        # shellcheck source=/dev/null
        . .env
        set +a
    fi
    
    if [ -z "${DATABASE_URL:-}" ]; then
        print_error "DATABASE_URL is not set in .env file"
        print_info "Run this script without --skip-deps to create .env file"
        exit 1
    fi
    
    # Validate DATABASE_URL format
    if ! validate_database_url "$DATABASE_URL"; then
        print_error "Invalid DATABASE_URL format"
        exit 1
    fi
    
    # Test database connection before proceeding
    print_step "Testing database connection..."
    local db_user db_pass db_host db_port db_name
    
    # Parse DATABASE_URL (basic extraction)
    if echo "$DATABASE_URL" | grep -qE 'postgresql://([^:]+):([^@]+)@([^:]+):([0-9]+)/([^?]+)'; then
        db_user=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
        db_host=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
        db_port=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
        db_name=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
        
        print_debug "Connecting to: $db_user@$db_host:$db_port/$db_name"
        
        # Check if we can reach the database host:port
        if command -v nc &> /dev/null || command -v timeout &> /dev/null; then
            if timeout 5 bash -c "echo > /dev/tcp/$db_host/${db_port:-5432}" 2>/dev/null; then
                print_success "Database host is reachable"
            else
                print_warning "Cannot reach database host $db_host:$db_port"
                print_info "Make sure the database container is running: ${CYAN}docker ps | grep permit_db${NC}"
            fi
        fi
    fi
    
    # Reset database if requested
    if [ "$RESET_DB" = true ]; then
        print_step "Resetting database (⚠️  this will destroy all data)..."
        if ! npm run db:reset -- --force 2>&1; then
            print_error "Failed to reset database"
            print_info "You may need to manually drop the database or check permissions"
            exit 1
        fi
        print_success "Database reset complete"
    fi
    
    # Generate Prisma Client
    print_step "Generating Prisma Client..."
    if ! npm run db:generate 2>&1; then
        print_error "Failed to generate Prisma Client"
        print_info "Common issues:"
        echo "  1. Prisma schema syntax errors - check prisma/schema.prisma"
        echo "  2. Missing @prisma/client dependency - run: npm install"
        echo "  3. Check Prisma logs above for specific errors"
        exit 1
    fi
    print_success "Prisma Client generated"
    
    # Run migrations with better error handling
    print_step "Running database migrations..."
    local migration_output
    if migration_output=$(npm run db:migrate 2>&1); then
        print_success "Database migrations completed"
        # Check if migrations actually ran or if database was already up to date
        if echo "$migration_output" | grep -qi "already.*applied\|no.*migrations\|database.*up.*to.*date"; then
            print_info "Database is already up to date (no new migrations needed)"
        fi
    else
        local exit_code=$?
        print_error "Failed to run database migrations (exit code: $exit_code)"
        
        # Check for common migration errors
        if echo "$migration_output" | grep -qi "database.*does.*not.*exist"; then
            print_info "Database does not exist. Creating..."
            # Try to create database (requires superuser or pre-created database)
            print_warning "You may need to create the database manually"
            print_info "Connect to PostgreSQL and run: ${CYAN}CREATE DATABASE ${POSTGRES_DB:-permitdb};${NC}"
        elif echo "$migration_output" | grep -qi "connection.*refused\|could.*not.*connect"; then
            print_info "Cannot connect to database"
            print_info "Check that the database container is running: ${CYAN}docker ps | grep permit_db${NC}"
        elif echo "$migration_output" | grep -qi "permission.*denied\|authentication.*failed"; then
            print_info "Database authentication failed"
            print_info "Check DATABASE_URL credentials in .env file"
        else
            print_info "Migration output:"
            echo "$migration_output" | tail -20
        fi
        
        print_info "If this is a fresh database, you may need to initialize:"
        echo "  ${CYAN}npm run db:migrate dev --name init${NC}"
        exit 1
    fi
    
    # Seed database
    print_step "Seeding database with initial data..."
    if ! npm run db:seed 2>&1; then
        print_error "Failed to seed database"
        
        # Check for common seeding errors
        if ! command -v tsx &> /dev/null && ! npm list tsx &> /dev/null 2>&1; then
            print_info "tsx is missing. Installing..."
            npm install --save-dev tsx
            # Retry seeding
            if npm run db:seed 2>&1; then
                print_success "Database seeded after installing tsx"
            else
                print_error "Seeding failed even after installing tsx"
                exit 1
            fi
        else
            print_info "Check that:"
            echo "  1. Database migrations completed successfully"
            echo "  2. All dependencies are installed: npm install"
            echo "  3. Seed script is valid: prisma/seed.ts"
            exit 1
        fi
    else
        print_success "Database seeded successfully"
        print_info "Default users created:"
        echo "  • admin@example.com / admin123 (ADMIN)"
        echo "  • coord@example.com / coord123 (COORDINATOR)"
        echo "  • billing@example.com / billing123 (BILLING)"
        print_warning "⚠️  Remember to change these passwords in production!"
    fi
}

###############################################################################
# Build Application
###############################################################################

build_application() {
    if [ "$SKIP_BUILD" = true ]; then
        print_warning "Skipping production build (--skip-build flag)"
        return
    fi
    
    print_section "Building Application"
    
    # Verify required files exist
    print_step "Checking required files..."
    local missing_files=()
    
    if [ ! -f "next.config.ts" ] && [ ! -f "next.config.js" ]; then
        print_warning "next.config.ts/js not found (using Next.js defaults)"
    fi
    
    if [ ! -f "tsconfig.json" ]; then
        missing_files+=("tsconfig.json")
    fi
    
    if [ ! -d "src/app" ]; then
        missing_files+=("src/app/")
    fi
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        print_error "Required files/directories missing: ${missing_files[*]}"
        print_info "This may indicate an incomplete project structure"
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Build cancelled by user"
            exit 1
        fi
    fi
    
    print_step "Building Next.js application (this may take a few minutes)..."
    
    # Capture build output
    local build_output build_log="/tmp/scaffold-build.log"
    
    if build_output=$(npm run build 2>&1 | tee "$build_log"); then
        print_success "Application built successfully"
        rm -f "$build_log" 2>/dev/null || true
        
        # Check if build artifacts exist
        if [ -d ".next" ]; then
            print_success "Build artifacts created in .next/"
        else
            print_warning "Build succeeded but .next directory not found"
        fi
    else
        local exit_code=$?
        print_error "Build failed (exit code: $exit_code)"
        
        # Analyze common build errors
        if echo "$build_output" | grep -qi "type.*error\|typescript.*error"; then
            print_info "TypeScript errors detected:"
            echo "$build_output" | grep -i "error" | head -10 || true
            print_info "Fix TypeScript errors and try again"
        elif echo "$build_output" | grep -qi "module.*not.*found\|cannot.*find.*module"; then
            print_info "Missing dependencies detected"
            print_info "Try: ${CYAN}npm install${NC}"
        elif echo "$build_output" | grep -qi "out.*of.*memory\|heap.*overflow"; then
            print_info "Build ran out of memory"
            print_info "Try increasing Node.js memory: ${CYAN}NODE_OPTIONS=--max-old-space-size=4096 npm run build${NC}"
        else
            print_info "Build output saved to: $build_log"
            print_info "Check the log file for detailed error information"
        fi
        
        print_warning "⚠️  Build failed but you can still run in development mode"
        print_info "Development mode doesn't require a successful build"
        print_info "To skip build next time: ${CYAN}./scaffold.sh --skip-build${NC}"
        
        # Ask if user wants to continue despite build failure
        read -p "Continue despite build failure? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Setup cancelled. Fix build errors and try again."
            exit 1
        fi
    fi
}

###############################################################################
# Development Server
###############################################################################

start_dev_server() {
    if [ "$START_DEV" != true ]; then
        return
    fi
    
    print_section "Starting Development Server"
    
    print_info "Starting Next.js development server..."
    print_info "Application will be available at: http://localhost:3000"
    print_info "Press Ctrl+C to stop the server"
    echo ""
    
    npm run dev
}

###############################################################################
# Create Upload Directory
###############################################################################

create_upload_directory() {
    print_step "Creating upload directory..."
    
    local upload_dir="${UPLOAD_DIR:-./uploads}"
    
    if [ ! -d "$upload_dir" ]; then
        if mkdir -p "$upload_dir" 2>/dev/null; then
            print_success "Upload directory created: $upload_dir"
        else
            print_error "Failed to create upload directory: $upload_dir"
            print_info "Check directory permissions or create manually: ${CYAN}mkdir -p $upload_dir${NC}"
            exit 1
        fi
    else
        print_info "Upload directory already exists: $upload_dir"
    fi
    
    # Check write permissions
    if [ ! -w "$upload_dir" ]; then
        print_warning "Upload directory is not writable: $upload_dir"
        print_info "Fix permissions: ${CYAN}chmod 755 $upload_dir${NC}"
    else
        print_success "Upload directory is writable"
    fi
}

###############################################################################
# Summary
###############################################################################

print_summary() {
    print_section "Setup Complete! 🎉"
    
    echo -e "${GREEN}The Permit Management Application has been successfully scaffolded!${NC}\n"
    
    echo -e "${BOLD}Quick Start:${NC}"
    echo "  • Development: ${CYAN}npm run dev${NC}"
    echo "  • Build:       ${CYAN}npm run build${NC}"
    echo "  • Production:  ${CYAN}npm start${NC}"
    echo ""
    
    echo -e "${BOLD}Database:${NC}"
    echo "  • Studio:      ${CYAN}npm run db:studio${NC} (database GUI)"
    echo "  • Reset:       ${CYAN}npm run db:reset${NC} (⚠️  destroys data)"
    echo ""
    
    echo -e "${BOLD}Testing:${NC}"
    echo "  • Unit:        ${CYAN}npm test${NC}"
    echo "  • E2E:         ${CYAN}npm run test:e2e${NC}"
    echo ""
    
    echo -e "${BOLD}Default Login Credentials:${NC}"
    echo "  • Admin:       admin@example.com / admin123"
    echo "  • Coordinator: coord@example.com / coord123"
    echo "  • Billing:     billing@example.com / billing123"
    echo ""
    
    echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
    echo "  • Change default passwords in production"
    echo "  • Update .env file with production values"
    echo "  • Review security settings before deployment"
    echo ""
    
    if [ "$START_DEV" != true ]; then
        echo -e "${CYAN}To start the development server, run:${NC} npm run dev"
        echo -e "${CYAN}Or run this script with:${NC} ./scaffold.sh --dev"
    fi
}

###############################################################################
# Main Execution
###############################################################################

main() {
    echo -e "${BOLD}${MAGENTA}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║     Permit Management App - Scaffold Script                   ║"
    echo "║     Setting up your development environment...                ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Verify we're in the right directory
    if [ ! -f "package.json" ] && [ ! -f "scaffold.sh" ]; then
        print_error "Cannot find package.json or scaffold.sh"
        print_info "Make sure you're running this script from the project root directory"
        exit 1
    fi
    
    # Run setup steps with error handling
    local step=0
    local total_steps=7
    
    ((step++)) && echo -e "\n${BOLD}Step $step/$total_steps${NC}"
    check_prerequisites || exit 1
    
    ((step++)) && echo -e "\n${BOLD}Step $step/$total_steps${NC}"
    setup_environment || exit 1
    
    ((step++)) && echo -e "\n${BOLD}Step $step/$total_steps${NC}"
    setup_database || exit 1
    
    ((step++)) && echo -e "\n${BOLD}Step $step/$total_steps${NC}"
    install_dependencies || exit 1
    
    ((step++)) && echo -e "\n${BOLD}Step $step/$total_steps${NC}"
    create_upload_directory || exit 1
    
    ((step++)) && echo -e "\n${BOLD}Step $step/$total_steps${NC}"
    setup_prisma || exit 1
    
    ((step++)) && echo -e "\n${BOLD}Step $step/$total_steps${NC}"
    build_application || {
        local build_exit=$?
        if [ $build_exit -ne 0 ]; then
            print_warning "Build failed but continuing (development mode still works)"
        fi
    }
    
    # Mark successful completion to avoid cleanup message
    export CLEANUP_SHOWN=true
    
    # Print summary (unless starting dev server, which will run indefinitely)
    if [ "$START_DEV" != true ]; then
        print_summary
    else
        start_dev_server
    fi
}

# Run main function
main "$@"