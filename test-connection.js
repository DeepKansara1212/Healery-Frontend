// Test script to verify frontend-backend connection
// Run this with: node test-connection.js

const API_BASE_URL = 'http://localhost:5000/api';

async function testConnection() {
  console.log('🔍 Testing connection to Healery Backend...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.message);
    
    // Test 2: Categories
    console.log('\n2️⃣ Testing Categories API...');
    const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log(`✅ Categories: ${categoriesData.data.categories.length} categories found`);
    
    // Test 3: Products
    console.log('\n3️⃣ Testing Products API...');
    const productsResponse = await fetch(`${API_BASE_URL}/products?limit=3`);
    const productsData = await productsResponse.json();
    console.log(`✅ Products: ${productsData.data.products.length} products found`);
    
    // Test 4: Featured Products
    console.log('\n4️⃣ Testing Featured Products API...');
    const featuredResponse = await fetch(`${API_BASE_URL}/products?isFeatured=true&limit=3`);
    const featuredData = await featuredResponse.json();
    console.log(`✅ Featured Products: ${featuredData.data.products.length} featured products found`);
    
    console.log('\n🎉 All tests passed! Frontend can successfully connect to backend.');
    console.log('\n📋 Next steps:');
    console.log('1. Start your backend server: cd BACKEND && npm run dev');
    console.log('2. Start your frontend: cd FRONTEND && npm run dev');
    console.log('3. Test the full application in your browser');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    console.log('\n💡 Make sure your backend server is running on http://localhost:5000');
    console.log('   Run: cd BACKEND && npm run dev');
  }
}

testConnection();
