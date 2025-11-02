#!/bin/bash
# Getron Repository Structure Verification Script
# This script checks if your repository is ready for Netlify deployment

echo "🔍 Checking Getron repository structure for Netlify..."

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 exists${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 missing${NC}"
        return 1
    fi
}

check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $1/ directory exists${NC}"
        return 0
    else
        echo -e "${RED}❌ $1/ directory missing${NC}"
        return 1
    fi
}

echo ""
echo "📋 Checking essential files..."
check_file "netlify.toml"
check_file "index.html"

echo ""
echo "📁 Checking functions directory..."
check_directory "netlify"
check_directory "netlify/functions"

echo ""
echo "🔧 Checking functions..."
if [ -f "netlify/functions/api.js" ]; then
    echo -e "${GREEN}✅ JavaScript API function exists${NC}"
elif [ -f "netlify/functions/api/index.py" ]; then
    echo -e "${GREEN}✅ Python API function exists${NC}"
else
    echo -e "${RED}❌ No API function found${NC}"
fi

if [ -f "netlify/functions/health.js" ]; then
    echo -e "${GREEN}✅ JavaScript health function exists${NC}"
elif [ -f "netlify/functions/health.py" ]; then
    echo -e "${GREEN}✅ Python health function exists${NC}"
else
    echo -e "${YELLOW}⚠️  No health function found${NC}"
fi

echo ""
echo "🎨 Checking frontend..."
check_directory "frontend"
if [ -d "frontend" ]; then
    if [ -f "frontend/package.json" ]; then
        echo -e "${GREEN}✅ Frontend package.json exists${NC}"
    else
        echo -e "${YELLOW}⚠️  No frontend package.json${NC}"
    fi
fi

echo ""
echo "🗄️  Checking database..."
check_directory "database"
if [ -d "database" ]; then
    if [ -f "database/supabase_schema.sql" ]; then
        echo -e "${GREEN}✅ Supabase schema exists${NC}"
    else
        echo -e "${YELLOW}⚠️  No Supabase schema found${NC}"
    fi
fi

echo ""
echo "📊 Netlify Configuration Check:"
echo ""

if [ -f "netlify.toml" ]; then
    echo "📄 netlify.toml content:"
    echo "----------------------------------------"
    cat netlify.toml | grep -E "(functions|publish|command)" | head -5
    echo "----------------------------------------"
fi

echo ""
echo "🎯 Structure Summary:"
echo "================================"

# Count functions
function_count=0
if [ -d "netlify/functions" ]; then
    function_count=$(find netlify/functions -name "*.js" -o -name "*.py" 2>/dev/null | wc -l)
fi
echo "Functions found: $function_count"

# Check frontend build capability
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
    echo "Frontend: Ready for build"
else
    echo "Frontend: Missing or incomplete"
fi

echo ""
echo "✅ READY FOR NETLIFY if:"
echo "  - All ✅ checks above are green"
echo "  - At least 1 function exists"
echo "  - Frontend directory exists"

echo ""
echo "🚀 TO DEPLOY:"
echo "  1. git add . && git commit -m 'Netlify ready'"
echo "  2. git push"
echo "  3. Redeploy on Netlify with same settings"

echo ""
echo "📝 Next steps:"