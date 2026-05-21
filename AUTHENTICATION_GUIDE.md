# JWT Authentication - Quick Start Guide

## ✅ Implementation Complete!

Your JWT-based authentication system is now fully implemented with role-based access (User, Partner, Admin).

## 🚀 What's Been Added

### Backend Components:
1. **Password field** added to User model in Prisma schema
2. **Auth Service** (`src/services/authService.ts`) - handles registration, login, password management
3. **Auth Routes** (`src/routes/auth.ts`) - API endpoints for authentication
4. **Auth Middleware** (`src/middleware/auth.ts`) - JWT verification and role checking
5. **Updated Dependencies** - jsonwebtoken, bcryptjs installed

### Frontend Components:
1. **Auth API Client** updated in `src/services/api.ts`
2. **Auto-token inclusion** in all API requests

## 🧪 Testing the Authentication

### Option 1: Using the Test Script

```bash
cd backend
node testAuth.js
```

This will run automated tests for:
- User registration
- Partner registration
- Login
- Get current user
- Password change
- Invalid credentials
- Unauthorized access

### Option 2: Using cURL

#### Register a New User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "User"
  }'
```

#### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Save the token from the response!**

#### Get Current User
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 3: Using Postman

1. **Import the collection** (if you have one) or create requests manually
2. **Register endpoint**: POST `http://localhost:4000/api/auth/register`
3. **Login endpoint**: POST `http://localhost:4000/api/auth/login`
4. **Use token** in Authorization header: `Bearer YOUR_TOKEN`

## 📝 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/logout` | Logout (client-side) | Yes |

## 🔐 User Roles

1. **User** - Regular customer (default)
   - Verification status: `Verified` automatically
   - Can browse, rent, and purchase items

2. **Partner** - Item owner/seller
   - Verification status: `Unverified` initially
   - Needs admin approval to list items
   - Can list products for rent/sale

3. **Admin** - Platform administrator
   - Full access to all features
   - Can manage users, verify partners

## 🎯 Frontend Integration

### Using the Auth API

```typescript
import { authAPI } from '@/services/api';

// Register
const result = await authAPI.register({
  email: 'user@example.com',
  password: 'password123',
  name: 'User Name',
  role: 'User'
});
// Save token
localStorage.setItem('authToken', result.token);

// Login
const loginResult = await authAPI.login({
  email: 'user@example.com',
  password: 'password123'
});
localStorage.setItem('authToken', loginResult.token);

// Get current user
const currentUser = await authAPI.getCurrentUser();

// Change password
await authAPI.changePassword({
  oldPassword: 'password123',
  newPassword: 'newPassword456'
});

// Logout
await authAPI.logout();
localStorage.removeItem('authToken');
```

### Token is Auto-Included

All API calls automatically include the token from localStorage:
```typescript
// No need to manually add token - it's automatic!
const products = await productAPI.getAll();
const cart = await cartAPI.getCart(userId);
```

## 🔧 Next Steps for Frontend

Update your `AuthContext.tsx` to use the real API:

```typescript
// Replace mock data with:
const register = async (email: string, password: string, name: string, role: string) => {
  const result = await authAPI.register({ email, password, name, role });
  localStorage.setItem('authToken', result.token);
  setUser(result.user);
  setIsAuthenticated(true);
};

const login = async (email: string, password: string) => {
  const result = await authAPI.login({ email, password });
  localStorage.setItem('authToken', result.token);
  setUser(result.user);
  setIsAuthenticated(true);
};

const logout = async () => {
  await authAPI.logout();
  localStorage.removeItem('authToken');
  setUser(null);
  setIsAuthenticated(false);
};
```

## 📚 Documentation

- Full API documentation: `AUTH_DOCUMENTATION.md`
- Test script: `testAuth.js`
- Environment variables needed in `.env`:
  ```env
  JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
  JWT_EXPIRES_IN=7d
  ```

## ⚠️ Important Notes

1. **Database Migration**: Already run - password field added
2. **Prisma Client**: Already regenerated
3. **Backend Server**: Should be running on port 4000
4. **Token Storage**: Currently using localStorage (consider httpOnly cookies for production)
5. **Password Security**: Uses bcrypt with 10 salt rounds
6. **Token Expiry**: 7 days (configurable)

## 🎉 You're Ready!

Your authentication system is complete and ready for testing. Try registering different user types and testing the role-based features!

For detailed endpoint documentation, see `AUTH_DOCUMENTATION.md`.
