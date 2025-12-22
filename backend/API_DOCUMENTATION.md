# Stylus Backend API

Complete backend implementation for the Stylus fashion rental and e-commerce platform.

## Features

- ✅ User Management (authentication, roles, verification)
- ✅ Product Catalog (rental and sales items)
- ✅ Shopping Cart
- ✅ Orders Management
- ✅ Wishlist
- ✅ Reviews & Ratings
- ✅ Wallet & Transactions
- ✅ Partner Verification
- ✅ Admin Dashboard Support

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Node**: v18+

## Getting Started

### Installation

```bash
cd backend
npm install
```

### Database Setup

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:4000`

### Production Build

```bash
npm run build
npm start
```

## API Documentation

### Base URL
```
http://localhost:4000/api
```

### Health Check
```
GET /health
```

---

## Users (`/api/users`)

### Get All Users
```
GET /api/users
```

### Get User by ID
```
GET /api/users/:id
```

### Create User
```
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "role": "User"  // User, Partner, Admin
}
```

### Update User
```
PATCH /api/users/:id

{
  "name": "Jane Doe",
  "phone": "+9876543210"
}
```

### Update User Status
```
PATCH /api/users/:id/status

{
  "status": "Active",  // Active, Suspended
  "reason": "Verification pending"
}
```

### Update User Role
```
PATCH /api/users/:id/role

{
  "role": "Partner"  // User, Partner, Admin
}
```

### Submit Verification Documents
```
POST /api/users/:id/verify

{
  "bvn": "12345678901",
  "idType": "National ID",
  "govIdUrl": "https://...",
  "state": "Lagos",
  "lga": "Ikeja"
}
```

### Approve Verification
```
POST /api/users/:id/approve-verification
```

### Reject Verification
```
POST /api/users/:id/reject-verification

{
  "reason": "Invalid documents"
}
```

### Update Wallet Balance
```
PATCH /api/users/:id/wallet

{
  "amount": 5000  // Positive or negative
}
```

### Add Search History
```
POST /api/users/:id/search-history

{
  "query": "designer dresses"
}
```

### Delete User
```
DELETE /api/users/:id
```

---

## Products (`/api/products`)

### Get All Products (with filters)
```
GET /api/products?category=Women&searchQuery=dress&maxPrice=50000&sortBy=price_asc
```

Query Parameters:
- `category`: Women, Men, Accessories, Watches, Bags, All
- `searchQuery`: Search by name, brand, or description
- `maxPrice`: Maximum rental price
- `sortBy`: newest, price_asc, price_desc

### Get Product by ID
```
GET /api/products/:id
```

### Get Products by Owner
```
GET /api/products/owner/:ownerId
```

### Create Product
```
POST /api/products
Content-Type: application/json

{
  "name": "Designer Handbag",
  "brand": "Louis Vuitton",
  "category": "Bags",
  "rentalPrice": 5000,
  "retailPrice": 50000,
  "buyPrice": 35000,
  "isForSale": true,
  "ownerId": 1,
  "description": "Authentic designer bag",
  "color": "Black",
  "occasion": "Formal",
  "condition": "Excellent",
  "availableSizes": ["One Size"],
  "images": ["https://...", "https://..."]
}
```

### Update Product
```
PATCH /api/products/:id

{
  "rentalPrice": 4500,
  "isForSale": false
}
```

### Increment Rental Count
```
PATCH /api/products/:id/increment-rental
```

(Automatically converts to sale-only after 5 rentals)

### Delete Product
```
DELETE /api/products/:id
```

---

## Orders (`/api/orders`)

### Get All Orders
```
GET /api/orders
```

### Get Order by ID
```
GET /api/orders/:id
```

### Get Orders by User
```
GET /api/orders/user/:userId
```

### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "userId": 1,
  "userName": "John Doe",
  "items": [
    {
      "productId": "prod-123",
      "quantity": 1,
      "rentalStartDate": "2025-01-01T00:00:00Z",
      "rentalEndDate": "2025-01-05T00:00:00Z"
    }
  ]
}
```

### Update Order Status
```
PATCH /api/orders/:id/status

{
  "status": "Shipped"
  // Processing, Pending Approval, Accepted, Shipped, Completed, Returned, Cancelled, Rejected
}
```

### Update Order Item Status
```
PATCH /api/orders/:orderId/item/:itemId/status

{
  "status": "Shipped"
}
```

### Delete Order
```
DELETE /api/orders/:id
```

---

## Shopping Cart (`/api/cart`)

### Get Cart
```
GET /api/cart/:userId
```

Response includes items and total.

### Add to Cart
```
POST /api/cart/:userId/add

{
  "productId": "prod-123",
  "quantity": 1,
  "rentalStartDate": "2025-01-01T00:00:00Z",
  "rentalEndDate": "2025-01-05T00:00:00Z"
}
```

### Update Cart Item
```
PATCH /api/cart/:userId/item/:cartItemId

{
  "quantity": 2,
  "rentalStartDate": "2025-01-01T00:00:00Z",
  "rentalEndDate": "2025-01-05T00:00:00Z"
}
```

### Remove from Cart
```
DELETE /api/cart/:userId/remove/:productId
```

### Clear Cart
```
DELETE /api/cart/:userId/clear
```

---

## Wishlist (`/api/wishlist`)

### Get Wishlist
```
GET /api/wishlist/:userId
```

### Add to Wishlist
```
POST /api/wishlist/:userId/add

{
  "productId": "prod-123"
}
```

### Check if in Wishlist
```
GET /api/wishlist/:userId/contains/:productId
```

### Remove from Wishlist
```
DELETE /api/wishlist/:userId/remove/:productId
```

---

## Reviews (`/api/reviews`)

### Get Product Reviews
```
GET /api/reviews/product/:productId
```

Returns reviews array and average rating.

### Create Review
```
POST /api/reviews

{
  "productId": "prod-123",
  "userId": 1,
  "rating": 5,
  "comment": "Excellent product!"
}
```

Rating must be 1-5.

### Update Review
```
PATCH /api/reviews/:id

{
  "rating": 4,
  "comment": "Updated review"
}
```

### Delete Review
```
DELETE /api/reviews/:id
```

---

## Transactions (`/api/transactions`)

### Get All Transactions
```
GET /api/transactions
```

### Get User Transactions
```
GET /api/transactions/user/:userId
```

### Create Transaction
```
POST /api/transactions

{
  "userId": 1,
  "type": "Debit",  // Credit, Debit, Withdrawal, Fee
  "amount": 5000,
  "description": "Rental payment",
  "paymentMethod": "Wallet",
  "orderId": "order-123"
}
```

### Update Transaction Status
```
PATCH /api/transactions/:id/status

{
  "status": "Completed"  // Pending, Completed, Failed
}
```

### Request Withdrawal
```
POST /api/transactions/withdrawal/request

{
  "userId": 1,
  "amount": 10000,
  "bankDetails": "GTBank, Account: 123456789"
}
```

### Process Withdrawal
```
POST /api/transactions/:id/withdrawal/process
```

### Transfer Funds
```
POST /api/transactions/transfer

{
  "fromUserId": 1,
  "toUserId": 2,
  "amount": 5000,
  "description": "Commission payment"
}
```

---

## Database Models

### User
- id, email, name, phone, address
- role, tier, status, verificationStatus
- walletBalance, suspensionReason, adminNotes
- verificationDocs, searchHistory, location
- joined, lastActive, avgSpend, rentalHistoryCount

### Product
- id, name, brand, category
- rentalPrice, retailPrice, buyPrice
- isForSale, ownerId, description
- color, occasion, condition
- rentalCount, autoSellAfterRentals
- availableSizes, images

### Order
- id, userId, userName, date, total, status
- items (relationship to OrderItem)

### OrderItem
- id, orderId, productId, quantity
- status, rentalStartDate, rentalEndDate

### CartItem
- id, userId, productId, quantity
- rentalStartDate, rentalEndDate

### WishlistItem
- id, userId, productId

### Review
- id, productId, userId, rating, comment, date

### Transaction
- id, userId, orderId, type, amount
- description, date, status, paymentMethod

---

## Error Handling

All errors are returned in the format:
```json
{
  "error": "Error message here"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Server Error

---

## Environment Variables

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=4000
NODE_ENV=development
```

---

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

---

## Integration with Frontend

The backend API is designed to work seamlessly with the frontend. The frontend contexts (ProductContext, OrderContext, CartContext, AuthContext, WishlistContext) map directly to the backend API endpoints.

Example frontend integration:
```typescript
// Fetch products
const response = await fetch('http://localhost:4000/api/products');
const products = await response.json();

// Create order
const response = await fetch('http://localhost:4000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    userName: 'John Doe',
    items: cartItems
  })
});
```

---

## Development Notes

- All routes follow RESTful conventions
- Dates are in ISO 8601 format
- IDs are auto-generated (UUID for products/orders, auto-increment for users)
- Prisma handles database schema validation
- Wallet transactions update user balances automatically
- Products are auto-converted to sale-only after 5 rentals

---

## Future Enhancements

- Authentication & JWT tokens
- Email notifications
- Payment gateway integration
- Image upload handling
- Advanced search with Elasticsearch
- Real-time notifications with WebSocket
- Analytics dashboard endpoints
