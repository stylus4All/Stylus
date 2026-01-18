# Authentication API Documentation

## Overview
This document describes the JWT-based authentication endpoints for the Stylus platform. All authenticated endpoints require a valid JWT token in the Authorization header.

## Authentication Flow

### 1. Register a New User
Creates a new user account with the specified role.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "phone": "+1234567890", // optional
  "address": "123 Main St", // optional
  "role": "User", // optional: "User" | "Partner" | "Admin", defaults to "User"
  "location": "Lagos, Nigeria" // optional
}
```

**Validation Rules:**
- Email: Required, must be valid email format
- Password: Required, minimum 6 characters
- Name: Required
- Role: Optional, must be one of: "User", "Partner", "Admin"

**Success Response (201):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "role": "User",
    "tier": "Gold",
    "status": "Active",
    "verificationStatus": "Verified",
    "walletBalance": 0,
    "location": "Lagos, Nigeria",
    "joined": "2026-01-17T14:25:00.000Z",
    "lastActive": "2026-01-17T14:25:00.000Z",
    "avgSpend": 0,
    "rentalHistoryCount": 0,
    "createdAt": "2026-01-17T14:25:00.000Z",
    "updatedAt": "2026-01-17T14:25:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid data
- `409 Conflict`: Email already registered
- `500 Internal Server Error`: Server error

**Notes:**
- Password is hashed using bcrypt before storage
- JWT token is automatically generated and returned
- Partners start with "Unverified" status, others with "Verified"
- Token expires in 7 days (configurable via JWT_EXPIRES_IN env var)

---

### 2. Login
Authenticates an existing user and returns a JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "User",
    // ... other user fields
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid email or password
- `403 Forbidden`: Account is suspended
- `500 Internal Server Error`: Server error

**Notes:**
- Updates user's `lastActive` timestamp on successful login
- Password is verified using bcrypt comparison
- Suspended accounts cannot login

---

### 3. Get Current User
Retrieves the current authenticated user's information.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "User",
    // ... other user fields (password excluded)
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error

**Notes:**
- Requires valid JWT token in Authorization header
- Password field is never included in response

---

### 4. Change Password
Changes the password for the authenticated user.

**Endpoint:** `POST /api/auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "oldPassword": "currentPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Validation Rules:**
- Old password: Required, must match current password
- New password: Required, minimum 6 characters

**Success Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid new password
- `401 Unauthorized`: Invalid token or incorrect old password
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

**Notes:**
- New password is hashed before storage
- User remains logged in after password change
- Consider re-issuing token in production for security

---

### 5. Logout
Logs out the current user (client-side token removal).

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Notes:**
- With JWT, logout is primarily client-side (remove token from storage)
- This endpoint is for logging purposes
- Future implementation may include token blacklisting

---

## Using Authentication in Other Endpoints

### Adding Authentication to Routes

All protected routes should use the `authenticateToken` middleware:

```typescript
import { authenticateToken, AuthRequest } from '../middleware/auth';

router.get('/protected', authenticateToken, async (req: AuthRequest, res: Response) => {
  // Access user data via req.user
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  // ... your logic
});
```

### Role-Based Access Control

Use the provided middleware for role checks:

```typescript
import { authenticateToken, requireAdmin, requirePartnerOrAdmin } from '../middleware/auth';

// Admin only
router.post('/admin-only', authenticateToken, requireAdmin, handler);

// Partner or Admin
router.post('/partner-or-admin', authenticateToken, requirePartnerOrAdmin, handler);
```

### Frontend Integration

Store the token in localStorage and include in all API requests:

```typescript
// After login/register
localStorage.setItem('authToken', response.token);

// Include in API calls (already handled in api.ts)
const token = localStorage.getItem('authToken');
fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// On logout
localStorage.removeItem('authToken');
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Change Password
```bash
curl -X POST http://localhost:4000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "newPassword456"
  }'
```

---

## Environment Variables

Required environment variables in `.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

---

## Security Considerations

1. **Password Storage**: Passwords are hashed with bcrypt (10 salt rounds)
2. **Token Expiration**: Tokens expire after 7 days by default
3. **HTTPS**: Always use HTTPS in production
4. **Token Storage**: Store tokens securely (httpOnly cookies recommended for production)
5. **Rate Limiting**: Consider implementing rate limiting for auth endpoints
6. **CORS**: Configure CORS properly for your frontend domain
7. **Suspended Accounts**: Suspended users cannot login
8. **Email Validation**: Email format is validated on registration

---

## Common Error Messages

- "Access token required" - Missing Authorization header
- "Invalid or expired token" - Token is malformed or expired
- "User with this email already exists" - Email already registered
- "Invalid email or password" - Login credentials incorrect
- "Account is suspended" - User account is suspended
- "Admin access required" - Endpoint requires admin role
- "Partner or Admin access required" - Endpoint requires partner or admin role
