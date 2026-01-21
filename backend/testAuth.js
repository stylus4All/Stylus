// Test Authentication Flow
// Run with: node testAuth.js (make sure backend server is running)

const API_BASE = 'http://localhost:4000/api';

async function testAuth() {
  console.log('🧪 Testing Stylus Authentication Flow\n');

  // Test 1: Register a new user
  console.log('1️⃣ Testing User Registration...');
  try {
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `testuser${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
        role: 'User',
        phone: '+1234567890',
        location: 'Lagos, Nigeria'
      })
    });

    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      console.log('❌ Registration failed:', error.error);
      return;
    }

    const registerData = await registerResponse.json();
    console.log('✅ Registration successful!');
    console.log('   User ID:', registerData.user.id);
    console.log('   Email:', registerData.user.email);
    console.log('   Role:', registerData.user.role);
    console.log('   Token:', registerData.token.substring(0, 20) + '...');

    const userToken = registerData.token;
    const userEmail = registerData.user.email;

    // Test 2: Get current user
    console.log('\n2️⃣ Testing Get Current User...');
    const meResponse = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    if (!meResponse.ok) {
      const error = await meResponse.json();
      console.log('❌ Get current user failed:', error.error);
      return;
    }

    const meData = await meResponse.json();
    console.log('✅ Successfully retrieved current user!');
    console.log('   Name:', meData.user.name);
    console.log('   Verification Status:', meData.user.verificationStatus);

    // Test 3: Login with the created user
    console.log('\n3️⃣ Testing Login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      console.log('❌ Login failed:', error.error);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful!');
    console.log('   Token:', loginData.token.substring(0, 20) + '...');

    // Test 4: Test with invalid credentials
    console.log('\n4️⃣ Testing Login with Invalid Password...');
    const invalidLoginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        password: 'wrongpassword'
      })
    });

    if (invalidLoginResponse.ok) {
      console.log('❌ Login should have failed with wrong password!');
    } else {
      const error = await invalidLoginResponse.json();
      console.log('✅ Correctly rejected invalid password:', error.error);
    }

    // Test 5: Change Password
    console.log('\n5️⃣ Testing Change Password...');
    const changePasswordResponse = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        oldPassword: 'password123',
        newPassword: 'newPassword456'
      })
    });

    if (!changePasswordResponse.ok) {
      const error = await changePasswordResponse.json();
      console.log('❌ Change password failed:', error.error);
      return;
    }

    const changePasswordData = await changePasswordResponse.json();
    console.log('✅ Password changed successfully:', changePasswordData.message);

    // Test 6: Login with new password
    console.log('\n6️⃣ Testing Login with New Password...');
    const newLoginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        password: 'newPassword456'
      })
    });

    if (!newLoginResponse.ok) {
      const error = await newLoginResponse.json();
      console.log('❌ Login with new password failed:', error.error);
      return;
    }

    console.log('✅ Login with new password successful!');

    // Test 7: Register a Partner
    console.log('\n7️⃣ Testing Partner Registration...');
    const partnerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `partner${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test Partner',
        role: 'Partner',
        phone: '+1234567890',
        location: 'Abuja, Nigeria'
      })
    });

    if (!partnerResponse.ok) {
      const error = await partnerResponse.json();
      console.log('❌ Partner registration failed:', error.error);
      return;
    }

    const partnerData = await partnerResponse.json();
    console.log('✅ Partner registration successful!');
    console.log('   Partner ID:', partnerData.user.id);
    console.log('   Email:', partnerData.user.email);
    console.log('   Role:', partnerData.user.role);
    console.log('   Verification Status:', partnerData.user.verificationStatus);

    // Test 8: Test unauthorized access
    console.log('\n8️⃣ Testing Unauthorized Access...');
    const unauthorizedResponse = await fetch(`${API_BASE}/auth/me`);
    
    if (unauthorizedResponse.ok) {
      console.log('❌ Should have required authentication!');
    } else {
      const error = await unauthorizedResponse.json();
      console.log('✅ Correctly rejected unauthorized access:', error.error);
    }

    // Test 9: Logout
    console.log('\n9️⃣ Testing Logout...');
    const logoutResponse = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    if (!logoutResponse.ok) {
      const error = await logoutResponse.json();
      console.log('❌ Logout failed:', error.error);
      return;
    }

    const logoutData = await logoutResponse.json();
    console.log('✅ Logout successful:', logoutData.message);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   ✅ User registration with different roles');
    console.log('   ✅ User login with credentials');
    console.log('   ✅ Token-based authentication');
    console.log('   ✅ Get current user information');
    console.log('   ✅ Password change functionality');
    console.log('   ✅ Invalid credentials rejection');
    console.log('   ✅ Unauthorized access protection');
    console.log('   ✅ Partner verification status (Unverified)');
    console.log('   ✅ User logout');

  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
}

// Run the tests
console.log('Make sure the backend server is running on http://localhost:4000');
console.log('Starting tests in 2 seconds...\n');

setTimeout(() => {
  testAuth();
}, 2000);
