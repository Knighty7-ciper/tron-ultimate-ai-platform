#!/bin/bash

# TRON Ultimate AI Platform Setup Script
# Pure class installation and configuration

set -e

echo "🚀 Setting up TRON Ultimate AI Platform..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is required but not installed."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed."
        exit 1
    fi
    
    # Check pip
    if ! command -v pip3 &> /dev/null; then
        print_error "pip3 is required but not installed."
        exit 1
    fi
    
    print_status "Prerequisites check passed ✓"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Create virtual environment
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Upgrade pip
    print_status "Upgrading pip..."
    pip install --upgrade pip
    
    # Install requirements
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Create .env file
    if [ ! -f .env ]; then
        print_status "Creating .env file..."
        cat > .env << EOL
# TRON Ultimate AI Platform Environment Configuration
GEMINI_API_KEY=your_gemini_api_key_here
HOST=0.0.0.0
PORT=8000
DEBUG=false
RELOAD=false

# Optional: Database Configuration
# DATABASE_URL=postgresql://user:password@localhost:5432/tron_ai
# REDIS_URL=redis://localhost:6379

# Optional: Security
# SECRET_KEY=your_secret_key_here
# ALGORITHM=HS256
# ACCESS_TOKEN_EXPIRE_MINUTES=30
EOL
        print_warning "Please update the .env file with your actual GEMINI_API_KEY"
    fi
    
    cd ..
    print_status "Backend setup complete ✓"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    # Create .env.local file
    if [ ! -f .env.local ]; then
        print_status "Creating .env.local file..."
        cat > .env.local << EOL
# TRON Ultimate AI Platform Frontend Environment
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=TRON Ultimate AI Platform
NEXT_PUBLIC_APP_VERSION=2.0.0
EOL
    fi
    
    cd ..
    print_status "Frontend setup complete ✓"
}

# Create additional directories
create_directories() {
    print_status "Creating additional directories..."
    
    # Create logs directory
    mkdir -p logs
    
    # Create temp directories
    mkdir -p temp
    
    # Create data directory
    mkdir -p data
    
    print_status "Additional directories created ✓"
}

# Install global tools
install_global_tools() {
    print_status "Installing global development tools..."
    
    # Install concurrently for running both services
    npm install -g concurrently
    
    # Install helpful Python packages globally
    pip3 install --upgrade pip setuptools wheel
    pip3 install black flake8 pytest pytest-asyncio
    
    print_status "Global tools installation complete ✓"
}

# Main setup function
main() {
    echo
    print_status "Starting TRON Ultimate AI Platform setup..."
    echo
    
    # Check prerequisites
    check_prerequisites
    
    # Install global tools
    install_global_tools
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Create directories
    create_directories
    
    echo
    print_status "🎉 TRON Ultimate AI Platform setup complete!"
    echo
    echo "📝 Next Steps:"
    echo "1. Update backend/.env with your GEMINI_API_KEY"
    echo "2. Run 'npm run dev' to start both services"
    echo "3. Visit http://localhost:3000 to access the platform"
    echo
    echo "🔧 Available Commands:"
    echo "• npm run dev          - Start both backend and frontend"
    echo "• npm run dev:backend  - Start backend only"
    echo "• npm run dev:frontend - Start frontend only"
    echo "• npm run build        - Build both applications"
    echo "• npm run start        - Start both applications in production mode"
    echo
    print_status "Happy coding with TRON Ultimate AI Platform! 🚀"
}

# Run main function
main "$@"