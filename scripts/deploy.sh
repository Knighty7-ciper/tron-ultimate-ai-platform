#!/bin/bash

# TRON Ultimate AI Platform - GitHub & Netlify Deployment Script
# Pure class deployment automation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    local missing_tools=()
    
    if ! command -v git &> /dev/null; then
        missing_tools+=("git")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_tools+=("npm")
    fi
    
    if ! command -v node &> /dev/null; then
        missing_tools+=("node")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        print_error "Please install the missing tools and try again."
        exit 1
    fi
    
    print_status "All dependencies are available ✓"
}

# Get GitHub repository URL from user
get_github_repo_url() {
    print_header "GitHub Repository Setup"
    echo
    echo "Please provide your GitHub repository URL:"
    echo "Example: https://github.com/yourusername/tron-ultimate-ai-platform"
    echo
    read -p "Repository URL: " GITHUB_REPO_URL
    
    if [ -z "$GITHUB_REPO_URL" ]; then
        print_error "Repository URL is required"
        exit 1
    fi
    
    if [[ ! $GITHUB_REPO_URL =~ ^https://github\.com/.+ ]]; then
        print_error "Invalid GitHub repository URL format"
        exit 1
    fi
    
    print_status "GitHub repository URL: $GITHUB_REPO_URL"
}

# Get Netlify site information
get_netlify_info() {
    print_header "Netlify Deployment Setup"
    echo
    echo "Choose deployment option:"
    echo "1. Create new Netlify site"
    echo "2. Use existing Netlify site"
    echo "3. Skip Netlify deployment (GitHub only)"
    echo
    read -p "Choose option (1-3): " NETLIFY_OPTION
    
    case $NETLIFY_OPTION in
        1|2)
            if ! command -v netlify &> /dev/null; then
                print_warning "Netlify CLI not found. Installing..."
                npm install -g netlify-cli
            fi
            
            if [ "$NETLIFY_OPTION" = "1" ]; then
                read -p "Enter site name for Netlify: " NETLIFY_SITE_NAME
                if [ -z "$NETLIFY_SITE_NAME" ]; then
                    print_error "Site name is required"
                    exit 1
                fi
            else
                read -p "Enter existing Netlify site name or ID: " NETLIFY_SITE_NAME
                if [ -z "$NETLIFY_SITE_NAME" ]; then
                    print_error "Site name is required"
                    exit 1
                fi
            fi
            ;;
        3)
            print_status "Skipping Netlify deployment"
            ;;
        *)
            print_error "Invalid option selected"
            exit 1
            ;;
    esac
}

# Initialize Git repository
init_git() {
    print_header "Git Repository Setup"
    
    if [ -d ".git" ]; then
        print_warning "Git repository already initialized"
        return
    fi
    
    print_status "Initializing Git repository..."
    git init
    
    # Create .gitignore if it doesn't exist
    if [ ! -f ".gitignore" ]; then
        print_status "Creating .gitignore file..."
        cp .gitignore .gitignore.backup 2>/dev/null || true
    fi
    
    print_status "Git repository initialized ✓"
}

# Prepare repository for GitHub
prepare_repository() {
    print_header "Preparing Repository"
    
    # Create deployment documentation
    create_deployment_docs
    
    # Update package.json with repository info
    if [ -f "package.json" ]; then
        print_status "Updating package.json repository information..."
        node -e "
            const fs = require('fs');
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            pkg.repository = {
                type: 'git',
                url: '$GITHUB_REPO_URL'
            };
            pkg.bugs = {
                url: '$GITHUB_REPO_URL/issues'
            };
            pkg.homepage = '$GITHUB_REPO_URL#readme';
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
        "
    fi
    
    # Create Netlify configuration
    create_netlify_config
    
    print_status "Repository preparation complete ✓"
}

# Create deployment documentation
create_deployment_docs() {
    print_status "Creating deployment documentation..."
    
    cat > DEPLOYMENT.md << 'EOF'
# TRON Ultimate AI Platform - Deployment Guide

## GitHub Repository Setup

Your TRON Ultimate AI Platform is ready for GitHub! 

### Repository Structure
```
tron-ultimate-ai-platform/
├── backend/           # FastAPI application
├── frontend/          # Next.js application
├── monitoring/        # Prometheus configuration
├── scripts/           # Setup and deployment scripts
├── docker-compose.yml # Container orchestration
├── README.md          # Complete documentation
└── DEPLOYMENT.md      # This file
```

### Next Steps
1. Push to GitHub: `git add . && git commit -m "Initial TRON Ultimate AI Platform" && git push -u origin main`
2. The repository is ready for deployment

## Netlify Deployment

### Frontend Deployment
1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/.next`
   - Node version: 18

3. Environment variables in Netlify:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

### Backend Deployment Options

#### Option 1: Railway (Recommended)
1. Connect GitHub repository to Railway
2. Deploy backend automatically
3. Set environment variables:
   ```
   GEMINI_API_KEY=your_api_key
   PORT=8000
   ```

#### Option 2: Heroku
1. Create Heroku app
2. Set buildpack: `heroku/python`
3. Deploy from GitHub

#### Option 3: DigitalOcean App Platform
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically

## Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Quick Start

1. Clone repository: `git clone <your-repo-url>`
2. Run setup: `chmod +x scripts/setup.sh && ./scripts/setup.sh`
3. Start development: `npm run dev`
4. Visit: http://localhost:3000

## Production Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Manual Deployment
```bash
npm run build
npm run start
```

---
Built with pure class and dedication to excellence.
EOF

    print_status "Deployment documentation created ✓"
}

# Create Netlify configuration
create_netlify_config() {
    print_status "Creating Netlify configuration..."
    
    cat > netlify.toml << 'EOF'
[build]
  publish = "frontend/.next"
  command = "cd frontend && npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.com/api/:splat"
  status = 200
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
EOF

    print_status "Netlify configuration created ✓"
}

# Git operations
git_operations() {
    print_header "Git Operations"
    
    print_status "Adding files to Git..."
    git add .
    
    print_status "Creating initial commit..."
    git commit -m "🚀 Initial TRON Ultimate AI Platform

✨ Features:
- 8 Specialized Gemini AI Models
- Professional Tron Aesthetics (Black & Red)
- Real-time Analytics & Monitoring
- Complete API with 12+ endpoints
- Docker & Netlify Deployment Ready
- TypeScript + FastAPI Architecture

🤖 AI Capabilities:
- Image Generation (Nano Banana)
- Web Research (Google Search)
- Code Execution (Python Sandbox)
- Browser Control (Automation)
- File Creation (Multi-format)
- Live Interactions (Voice/Video)
- Analytics & Monitoring
- Workflow Automation

📦 Ready for:
- GitHub Upload
- Netlify Deployment
- Docker Containerization
- Production Scaling

Built with pure class and dedication to excellence."
    
    print_status "Git operations complete ✓"
}

# GitHub operations
github_operations() {
    print_header "GitHub Repository Setup"
    
    print_status "Adding remote origin..."
    git remote add origin "$GITHUB_REPO_URL"
    
    print_status "Setting main branch..."
    git branch -M main
    
    print_status "Pushing to GitHub..."
    git push -u origin main
    
    print_status "🎉 Repository pushed to GitHub successfully!"
    print_status "Repository URL: $GITHUB_REPO_URL"
}

# Netlify deployment
netlify_deploy() {
    if [ "$NETLIFY_OPTION" = "3" ]; then
        return
    fi
    
    print_header "Netlify Deployment"
    
    print_status "Authenticating with Netlify..."
    netlify auth login || {
        print_error "Netlify authentication failed. Please run 'netlify login' manually."
        return
    }
    
    if [ "$NETLIFY_OPTION" = "1" ]; then
        print_status "Creating new Netlify site..."
        netlify sites:create --name="$NETLIFY_SITE_NAME" || {
            print_error "Failed to create Netlify site"
            return
        }
    fi
    
    print_status "Deploying to Netlify..."
    netlify deploy --prod || {
        print_error "Netlify deployment failed"
        return
    }
    
    print_status "🎉 Netlify deployment complete!"
    print_status "Site URL: https://$NETLIFY_SITE_NAME.netlify.app"
}

# Generate summary
generate_summary() {
    print_header "Deployment Summary"
    
    echo
    echo "🚀 TRON Ultimate AI Platform Deployment Complete!"
    echo
    echo "📁 GitHub Repository:"
    echo "   $GITHUB_REPO_URL"
    echo
    echo "🌐 Platform Access:"
    echo "   Local Development: http://localhost:3000"
    if [ "$NETLIFY_OPTION" != "3" ]; then
        echo "   Netlify Production: https://$NETLIFY_SITE_NAME.netlify.app"
    fi
    echo
    echo "📋 Next Steps:"
    echo "1. Update environment variables with your GEMINI_API_KEY"
    echo "2. Deploy backend to Railway/Heroku/DigitalOcean"
    echo "3. Update Netlify redirects with your backend URL"
    echo "4. Test all AI capabilities"
    echo
    echo "🔧 Available Commands:"
    echo "   npm run dev          - Start both services"
    echo "   npm run build        - Build for production"
    echo "   docker-compose up    - Deploy with Docker"
    echo
    print_status "Happy deploying with TRON Ultimate AI Platform! 🚀"
}

# Main deployment function
main() {
    clear
    echo
    echo "🚀 TRON Ultimate AI Platform - Deployment Script"
    echo "================================================="
    echo
    echo "This script will help you deploy your TRON Ultimate AI Platform"
    echo "to GitHub and optionally to Netlify."
    echo
    
    # Check dependencies
    check_dependencies
    
    # Get user input
    get_github_repo_url
    get_netlify_info
    
    # Prepare repository
    init_git
    prepare_repository
    
    # Git operations
    git_operations
    github_operations
    
    # Netlify deployment (if requested)
    netlify_deploy
    
    # Generate summary
    generate_summary
}

# Run main function
main "$@"