#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🚀 Retail Store Management System - Backend Setup      ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    echo -e "${YELLOW}Visit: https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm found: $(npm --version)${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo ""

# Ask if user wants to seed database
echo -e "${YELLOW}Would you like to seed the database with demo data? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${BLUE}🌱 Seeding database...${NC}"
    npm run seed
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database seeded successfully!${NC}"
        echo ""
        echo -e "${BLUE}📝 Demo Credentials:${NC}"
        echo -e "   Email: ${GREEN}demo@store.com${NC}"
        echo -e "   Password: ${GREEN}demo123${NC}"
    else
        echo -e "${RED}❌ Failed to seed database${NC}"
        echo -e "${YELLOW}You can try again later with: npm run seed${NC}"
    fi
fi

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║   🎉 Installation Complete!                              ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🚀 To start the server, run:${NC}"
echo -e "   ${GREEN}npm run dev${NC}     (Development mode with auto-restart)"
echo -e "   ${GREEN}npm start${NC}       (Production mode)"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo -e "   ${GREEN}server/README.md${NC}              - Complete API documentation"
echo -e "   ${GREEN}server/QUICK_START.md${NC}         - Quick start guide"
echo -e "   ${GREEN}BACKEND_SETUP.md${NC}              - Detailed setup instructions"
echo ""
echo -e "${BLUE}🔗 After starting:${NC}"
echo -e "   API: ${GREEN}http://localhost:5000/api${NC}"
echo -e "   Health Check: ${GREEN}http://localhost:5000/api/health${NC}"
echo ""
echo -e "${YELLOW}Happy Coding! 🎊${NC}"
