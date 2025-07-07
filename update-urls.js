#!/usr/bin/env node

/**
 * 🔄 Quick URL Update Script
 * Updates environment variables with new URLs
 */

const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node update-urls.js <backend-url> <frontend-url>');
  console.log('Example: node update-urls.js https://my-backend.onrender.com https://my-app.vercel.app');
  process.exit(1);
}

const backendUrl = args[0];
const frontendUrl = args[1];

console.log('🔄 Updating URLs...');
console.log(`Backend URL: ${backendUrl}`);
console.log(`Frontend URL: ${frontendUrl}`);

// Update frontend environment
const frontendEnvPath = '.env';
const frontendEnvContent = `# Frontend Environment Variables
VITE_BACKEND_URL=${backendUrl}
NODE_ENV=production
`;

try {
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Frontend .env updated');
} catch (error) {
  console.error('❌ Error updating frontend .env:', error.message);
}

// Update backend environment
const backendEnvPath = 'backend/.env';
const backendEnvContent = `# Backend Environment Variables
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/skillfull
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=${frontendUrl}
PORT=3001
NODE_ENV=production
`;

try {
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ Backend .env updated');
} catch (error) {
  console.error('❌ Error updating backend .env:', error.message);
}

console.log('\n🎉 URL update completed!');
console.log('📝 Remember to:');
console.log('1. Update MongoDB URI in backend/.env');
console.log('2. Update JWT_SECRET in backend/.env');
console.log('3. Set environment variables in your deployment platform'); 