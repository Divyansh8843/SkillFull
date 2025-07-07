#!/usr/bin/env node

/**
 * 🚀 SkillFull Deployment Configuration Script
 * This script helps you configure environment variables for different deployment environments
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function configureFrontend() {
  log('\n🎨 Frontend Configuration', 'cyan');
  log('========================', 'cyan');
  
  const backendUrl = await question('Enter your backend URL (e.g., https://your-backend.onrender.com): ');
  
  if (!backendUrl) {
    log('❌ Backend URL is required!', 'red');
    return false;
  }
  
  const frontendEnv = `# Frontend Environment Variables
VITE_BACKEND_URL=${backendUrl}
NODE_ENV=production
`;
  
  try {
    fs.writeFileSync('.env', frontendEnv);
    log('✅ Frontend .env file created successfully!', 'green');
    return true;
  } catch (error) {
    log(`❌ Error creating frontend .env: ${error.message}`, 'red');
    return false;
  }
}

async function configureBackend() {
  log('\n🔧 Backend Configuration', 'cyan');
  log('=======================', 'cyan');
  
  const mongoUri = await question('Enter your MongoDB URI: ');
  const jwtSecret = await question('Enter your JWT secret (or press Enter for auto-generate): ');
  const frontendUrl = await question('Enter your frontend URL (e.g., https://your-app.vercel.app): ');
  const port = await question('Enter port (default: 3001): ') || '3001';
  
  if (!mongoUri) {
    log('❌ MongoDB URI is required!', 'red');
    return false;
  }
  
  const finalJwtSecret = jwtSecret || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  const backendEnv = `# Backend Environment Variables
MONGODB_URI=${mongoUri}
JWT_SECRET=${finalJwtSecret}
FRONTEND_URL=${frontendUrl || 'http://localhost:8000'}
PORT=${port}
NODE_ENV=production
`;
  
  try {
    fs.writeFileSync('backend/.env', backendEnv);
    log('✅ Backend .env file created successfully!', 'green');
    return true;
  } catch (error) {
    log(`❌ Error creating backend .env: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('🚀 SkillFull Deployment Configuration', 'bright');
  log('=====================================', 'bright');
  
  const environment = await question('Select environment (development/production): ');
  
  if (!['development', 'production'].includes(environment.toLowerCase())) {
    log('❌ Invalid environment. Please choose "development" or "production"', 'red');
    rl.close();
    return;
  }
  
  log(`\n📋 Configuring for ${environment} environment...`, 'yellow');
  
  let success = true;
  
  // Configure frontend
  if (environment.toLowerCase() === 'production') {
    success = await configureFrontend() && success;
  } else {
    log('📝 Using development environment for frontend', 'blue');
  }
  
  // Configure backend
  if (environment.toLowerCase() === 'production') {
    success = await configureBackend() && success;
  } else {
    log('📝 Using development environment for backend', 'blue');
  }
  
  if (success) {
    log('\n🎉 Configuration completed successfully!', 'green');
    log('\n📝 Next steps:', 'yellow');
    log('1. Review the generated .env files', 'blue');
    log('2. Update any URLs or credentials as needed', 'blue');
    log('3. Run deployment commands:', 'blue');
    log('   - Frontend: npm run deploy:prod', 'blue');
    log('   - Backend: npm run deploy:prod (in backend folder)', 'blue');
  } else {
    log('\n❌ Configuration failed. Please check the errors above.', 'red');
  }
  
  rl.close();
}

// Handle script execution
if (require.main === module) {
  main().catch((error) => {
    log(`❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { configureFrontend, configureBackend }; 