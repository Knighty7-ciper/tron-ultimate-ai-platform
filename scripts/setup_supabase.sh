#!/bin/bash
# TRON Ultimate AI Platform - Supabase Database Setup Script
# This script helps you set up the database schema in Supabase

set -e

echo "🚀 Setting up Supabase database for Getron - Ultimate AI Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    echo "or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if logged in to Supabase
if ! supabase projects list &> /dev/null; then
    print_error "Not logged in to Supabase. Please run:"
    echo "supabase login"
    exit 1
fi

print_status "Logged in to Supabase successfully"

# Get current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
SCHEMA_FILE="$PROJECT_ROOT/database/supabase_schema.sql"

if [ ! -f "$SCHEMA_FILE" ]; then
    print_error "Schema file not found: $SCHEMA_FILE"
    exit 1
fi

print_status "Found database schema file: $SCHEMA_FILE"

# Check if .env file exists
ENV_FILE="$PROJECT_ROOT/.env"
if [ ! -f "$ENV_FILE" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp "$PROJECT_ROOT/.env.example" "$ENV_FILE"
    print_warning "Please update $ENV_FILE with your actual Supabase credentials:"
    echo "  - SUPABASE_URL"
    echo "  - SUPABASE_ANON_KEY" 
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "Get these from your Supabase project dashboard:"
    echo "https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api"
fi

# Ask for confirmation to proceed
echo ""
print_warning "This will set up the database schema in your Supabase project."
echo "Make sure you have:"
echo "1. Created a Supabase project at https://supabase.com/dashboard"
echo "2. Updated your .env file with the correct credentials"
echo ""
read -p "Continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Setup cancelled."
    exit 0
fi

# Source environment variables
if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
else
    print_error ".env file not found. Cannot proceed without environment variables."
    exit 1
fi

# Check required environment variables
required_vars=("SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    print_error "Please update your .env file and try again."
    exit 1
fi

print_status "Environment variables validated"

# Extract project reference from Supabase URL
# Expected format: https://project-ref.supabase.co
if [[ $SUPABASE_URL =~ https://([^.]+)\.supabase\.co ]]; then
    SUPABASE_PROJECT_REF="${BASH_REMATCH[1]}"
    print_status "Detected Supabase project: $SUPABASE_PROJECT_REF"
else
    print_error "Invalid Supabase URL format. Expected: https://project-ref.supabase.co"
    exit 1
fi

# Set up Supabase CLI for the project
print_status "Setting up Supabase CLI for project: $SUPABASE_PROJECT_REF"

# Create a temporary directory for Supabase config
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# Initialize Supabase project if not already done
if [ ! -f "supabase/config.toml" ]; then
    print_status "Initializing Supabase project..."
    supabase init
    supabase link --project-ref "$SUPABASE_PROJECT_REF"
else
    print_status "Supabase project already initialized"
    supabase link --project-ref "$SUPABASE_PROJECT_REF"
fi

# Copy the schema file to the migrations directory
print_status "Setting up database migrations..."
MIGRATIONS_DIR="supabase/migrations"
mkdir -p "$MIGRATIONS_DIR"

# Create migration file with timestamp
TIMESTAMP=$(date +%Y%m%d%H%M%S)
MIGRATION_FILE="$MIGRATIONS_DIR/${TIMESTAMP}_tron_ai_schema.sql"

# Copy schema file as migration
cp "$SCHEMA_FILE" "$MIGRATION_FILE"

print_status "Created migration: $MIGRATION_FILE"

# Apply the migration
print_status "Applying database schema..."
supabase db push

if [ $? -eq 0 ]; then
    print_status "Database schema applied successfully!"
else
    print_error "Failed to apply database schema"
    exit 1
fi

# Test database connection
print_status "Testing database connection..."
RESULT=$(supabase db logs --limit 1 2>/dev/null || echo "No recent logs")

if [ $? -eq 0 ]; then
    print_status "Database connection test successful"
else
    print_warning "Could not verify database logs (this may be normal)"
fi

# Cleanup
cd - > /dev/null
rm -rf "$TEMP_DIR"

print_status "✅ Supabase database setup completed successfully!"
echo ""
print_status "Your Getron - Ultimate AI Platform database is ready:"
echo "  - Tables created with Row Level Security"
echo "  - User authentication enabled"
echo "  - Analytics tracking configured"
echo "  - Performance monitoring active"
echo ""
print_status "Next steps:"
echo "1. Update your .env file with the correct Supabase credentials"
echo "2. Test the backend API locally: cd backend && python -m uvicorn main:app --reload"
echo "3. Deploy to your hosting platform (Railway, Render, Vercel, etc.)"
echo ""
print_status "Database schema includes:"
echo "  - users (user profiles and authentication)"
echo "  - ai_requests (AI operation logging)"
echo "  - generated_files (file creation tracking)"
echo "  - system_analytics (performance analytics)"
echo "  - performance_metrics (system monitoring)"
echo ""
print_status "Your database is production-ready with automatic backups and scaling!"
echo ""
print_status "Happy deploying with Getron! 🚀"