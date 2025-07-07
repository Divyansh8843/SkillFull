#!/bin/bash

# 🚀 SkillFull Local Deployment Script
# This script helps you deploy both frontend and backend locally

echo "🚀 Starting SkillFull Local Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_success "Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm is installed: $(npm --version)"

# Function to deploy backend
deploy_backend() {
    print_status "Deploying backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning "No .env file found in backend directory"
        print_status "Creating .env file from template..."
        cp env.example .env
        print_warning "Please update the .env file with your actual values"
    fi
    
    # Start backend server
    print_status "Starting backend server..."
    npm start &
    BACKEND_PID=$!
    
    # Wait a moment for server to start
    sleep 3
    
    # Check if backend is running
    if curl -s http://localhost:3001/health > /dev/null; then
        print_success "Backend is running on http://localhost:3001"
    else
        print_error "Backend failed to start"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    
    cd ..
}

# Function to deploy frontend
deploy_frontend() {
    print_status "Deploying frontend..."
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    # Build frontend
    print_status "Building frontend..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend built successfully"
    else
        print_error "Failed to build frontend"
        exit 1
    fi
    
    # Start frontend server
    print_status "Starting frontend server..."
    npm run preview &
    FRONTEND_PID=$!
    
    # Wait a moment for server to start
    sleep 3
    
    # Check if frontend is running
    if curl -s http://localhost:4173 > /dev/null; then
        print_success "Frontend is running on http://localhost:4173"
    else
        print_error "Frontend failed to start"
        kill $FRONTEND_PID 2>/dev/null
        exit 1
    fi
}

# Function to cleanup on exit
cleanup() {
    print_status "Cleaning up..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        print_status "Backend server stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        print_status "Frontend server stopped"
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main deployment
print_status "Starting deployment process..."

# Deploy backend first
deploy_backend

# Deploy frontend
deploy_frontend

print_success "🎉 Deployment completed successfully!"
print_status "Your application is now running:"
print_status "  Frontend: http://localhost:4173"
print_status "  Backend:  http://localhost:3001"
print_status "  Health Check: http://localhost:3001/health"
print_status ""
print_status "Press Ctrl+C to stop the servers"

# Keep the script running
wait 