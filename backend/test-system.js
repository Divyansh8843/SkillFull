const mongoose = require('mongoose');
const axios = require('axios');
const io = require('socket.io-client');

// Test configuration
const API_BASE_URL = 'http://localhost:3001/api';
const SOCKET_URL = 'http://localhost:3001';

// Test data
const testUser = {
  googleId: 'test_google_id_123',
  email: 'test@example.com',
  name: 'Test User',
  picture: 'https://example.com/avatar.jpg'
};

const testRequest = {
  title: 'Test Help Request',
  description: 'This is a test request for system verification',
  categoryId: null, // Will be set after getting categories
  skillsNeeded: ['JavaScript', 'React'],
  urgency: 'medium',
  estimatedDuration: '1 hour',
  isRemote: true,
  budgetMin: 20,
  budgetMax: 50
};

async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...');
  
  try {
    // Try to connect with default MongoDB URI
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge';
    await mongoose.connect(mongoURI);
    console.log('✅ Database connection successful');
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testAPIServer() {
  console.log('\n🧪 Testing API Server...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ API server is running');
    console.log('📊 Server response:', response.data);
    return true;
  } catch (error) {
    console.error('❌ API server test failed:', error.message);
    return false;
  }
}

async function testCategories() {
  console.log('\n🧪 Testing Categories API...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/requests/categories/all`);
    console.log('✅ Categories API working');
    console.log('📊 Categories found:', response.data.length);
    
    if (response.data.length > 0) {
      testRequest.categoryId = response.data[0]._id;
      console.log('📝 Using category ID:', testRequest.categoryId);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Categories API test failed:', error.message);
    return false;
  }
}

async function testSocketConnection() {
  console.log('\n🧪 Testing Socket.io Connection...');
  
  return new Promise((resolve) => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000
    });

    const timeout = setTimeout(() => {
      console.error('❌ Socket connection timeout');
      socket.disconnect();
      resolve(false);
    }, 5000);

    socket.on('connect', () => {
      clearTimeout(timeout);
      console.log('✅ Socket.io connection successful');
      console.log('📊 Socket ID:', socket.id);
      socket.disconnect();
      resolve(true);
    });

    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      console.error('❌ Socket connection failed:', error.message);
      resolve(false);
    });
  });
}

async function testAuthentication() {
  console.log('\n🧪 Testing Authentication...');
  
  try {
    // Test Google OAuth endpoint
    const response = await axios.post(`${API_BASE_URL}/auth/google`, testUser);
    console.log('✅ Authentication working');
    console.log('📊 Auth response:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    return null;
  }
}

async function testRequestCreation(token) {
  console.log('\n🧪 Testing Request Creation...');
  
  if (!token || !testRequest.categoryId) {
    console.log('⚠️ Skipping request creation - missing token or category');
    return null;
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}/requests`, testRequest, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Request creation successful');
    console.log('📊 Created request ID:', response.data._id);
    return response.data._id;
  } catch (error) {
    console.error('❌ Request creation failed:', error.message);
    return null;
  }
}

async function testMessageSystem(token, requestId) {
  console.log('\n🧪 Testing Message System...');
  
  if (!token || !requestId) {
    console.log('⚠️ Skipping message test - missing token or request ID');
    return false;
  }
  
  try {
    // Test getting messages
    const messagesResponse = await axios.get(`${API_BASE_URL}/messages/request/${requestId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Message API working');
    console.log('📊 Messages found:', messagesResponse.data.length);
    
    return true;
  } catch (error) {
    console.error('❌ Message system test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive System Test...\n');
  
  const results = {
    database: false,
    api: false,
    categories: false,
    socket: false,
    auth: false,
    requests: false,
    messages: false
  };
  
  // Run tests
  results.database = await testDatabaseConnection();
  results.api = await testAPIServer();
  results.categories = await testCategories();
  results.socket = await testSocketConnection();
  
  const token = await testAuthentication();
  results.auth = !!token;
  
  const requestId = await testRequestCreation(token);
  results.requests = !!requestId;
  
  results.messages = await testMessageSystem(token, requestId);
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All systems are working correctly!');
    console.log('✅ The application is ready for use.');
  } else {
    console.log('⚠️ Some systems need attention before deployment.');
  }
  
  // Cleanup
  await mongoose.disconnect();
  process.exit(0);
}

// Run tests
runAllTests().catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
}); 