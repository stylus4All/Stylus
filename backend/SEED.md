# Seed data for Stylus (demo user + sample products)

This file contains ready-to-run seed data for local development: a demo user that can act as a `User` (customer) or `Partner`, plus 10 example products the frontend can consume immediately.

## Demo user
- Email: `demo@stylus.test`
- Name: `Demo User`
- Phone: `+1234567890`
- Address: `123 Demo Street`
- Role: `User` (change to `Partner` to test partner flows)
- Wallet balance: `100.0`

### SQLite SQL (insert demo user)
```sql
INSERT INTO "User" (email, name, phone, address, role, tier, status, verificationStatus, walletBalance, joined, lastActive, avgSpend, rentalHistoryCount, createdAt, updatedAt)
VALUES (
  'demo@stylus.test',
  'Demo User',
  '+1234567890',
  '123 Demo Street',
  'User',
  'Gold',
  'Active',
  'Verified',
  100.0,
  datetime('now'),
  datetime('now'),
  0.0,
  0,
  datetime('now'),
  datetime('now')
);
```

To change the role to `Partner`:
```sql
UPDATE "User" SET role = 'Partner' WHERE email = 'demo@stylus.test';
```

## 10 sample products (SQL)

```sql
INSERT INTO "Product" (id, name, brand, category, rentalPrice, retailPrice, buyPrice, isForSale, ownerId, description, color, occasion, condition, rentalCount, createdAt, updatedAt, images)
VALUES
('prod-001','Classic Black Dress','Luma','Women',15.0,120.0,NULL,1,1,'A timeless black dress for evening occasions','Black','Evening','Excellent',0,datetime('now'),datetime('now'),'["https://picsum.photos/seed/prod1/600/800"]'),
('prod-002','Slim Fit Jeans','DenimCraft','Men',10.0,80.0,NULL,1,1,'Comfortable slim fit jeans','Blue','Casual','Good',0,datetime('now'),datetime('now'),'["https://picsum.photos/seed/prod2/600/800"]'),
('prod-003','Leather Handbag','Bello','Bags',12.0,150.0,NULL,1,1,'Genuine leather handbag with spacious interior','Brown','Everyday','Excellent',0,datetime('now'),datetime('now'),'["https://picsum.photos/seed/prod3/600/800"]'),
('prod-004','Gold Wristwatch','TickTock','Watches',20.0,350.0,NULL,1,1,'Elegant gold-tone wristwatch','Gold','Formal','Excellent',0,datetime('now'),datetime('now'),'["https://picsum.photos/seed/prod4/600/800"]'),
('prod-005','Floral Summer Dress','Bloom','Women',9.0,65.0,NULL,1,1,'Lightweight floral dress','Yellow','Casual','New',0,datetime('now'),datetime('now'),'["https://picsum.photos/seed/prod5/600/800"]'),
('prod-006','Oxford Shoes','Stride','Men',11.0,95.0,NULL,1,1,'Classic leather Oxford shoes','Black','Formal','Good',0,datetime('now'),datetime('now'),'["https://picsum.photos/seed/prod6/600/800"]'),
('prod-007','Silk Scarf','Silka','Accessories',5.0,40.0,NULL,1,1,'Luxurious silk scarf','Red','Casual','New',0,datetime('now'),datetime('now'),'["https://picsum.photos/seed/prod7/600/800"]'),
('prod-008','Denim Jacket','NorthCo','Men',13.0,110.0,NULL,1,1,'Durable denim jacket for cooler evenings','Blue','Casual','Good',0,datetime('now'),datetime('now'),'["https://picsum.photos/seed/prod8/600/800"]'),
('prod-009','Evening Clutch','Noir','Bags',6.0,60.0,NULL,1,1,'Compact clutch for special events','Black','Evening','New',0,datetime('now'),datetime('now'),'["https://picsum.photos/seed/prod9/600/800"]'),
('prod-010','Statement Necklace','Gleam','Accessories',7.0,85.0,NULL,1,1,'Bold necklace to complete your look','Silver','Formal','New',0,datetime('now'),datetime('now'),'["https://picsum.photos/seed/prod10/600/800"]');
```

Notes:
- `id` may be omitted to let Prisma generate `cuid()` values.
- `images` is stored as a JSON string; the examples use `picsum.photos` placeholders.

## Prisma seed (TypeScript) example
Create `prisma/seed.ts` with this content and run via a `prisma:seed` script.

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'demo@stylus.test',
      name: 'Demo User',
      phone: '+1234567890',
      address: '123 Demo Street',
      role: 'User',
      tier: 'Gold',
      status: 'Active',
      verificationStatus: 'Verified',
      walletBalance: 100.0
    }
  });

  const products = [
    { id: 'prod-001', name: 'Classic Black Dress', brand: 'Luma', category: 'Women', rentalPrice: 15.0, retailPrice: 120.0, isForSale: true, ownerId: user.id, description: 'A timeless black dress for evening occasions', images: JSON.stringify(['https://picsum.photos/seed/prod1/600/800']) },
    { id: 'prod-002', name: 'Slim Fit Jeans', brand: 'DenimCraft', category: 'Men', rentalPrice: 10.0, retailPrice: 80.0, isForSale: true, ownerId: user.id, description: 'Comfortable slim fit jeans', images: JSON.stringify(['https://picsum.photos/seed/prod2/600/800']) },
    { id: 'prod-003', name: 'Leather Handbag', brand: 'Bello', category: 'Bags', rentalPrice: 12.0, retailPrice: 150.0, isForSale: true, ownerId: user.id, description: 'Genuine leather handbag', images: JSON.stringify(['https://picsum.photos/seed/prod3/600/800']) },
    { id: 'prod-004', name: 'Gold Wristwatch', brand: 'TickTock', category: 'Watches', rentalPrice: 20.0, retailPrice: 350.0, isForSale: true, ownerId: user.id, description: 'Elegant gold-tone wristwatch', images: JSON.stringify(['https://picsum.photos/seed/prod4/600/800']) },
    { id: 'prod-005', name: 'Floral Summer Dress', brand: 'Bloom', category: 'Women', rentalPrice: 9.0, retailPrice: 65.0, isForSale: true, ownerId: user.id, description: 'Lightweight floral dress', images: JSON.stringify(['https://picsum.photos/seed/prod5/600/800']) },
    { id: 'prod-006', name: 'Oxford Shoes', brand: 'Stride', category: 'Men', rentalPrice: 11.0, retailPrice: 95.0, isForSale: true, ownerId: user.id, description: 'Classic leather Oxford shoes', images: JSON.stringify(['https://picsum.photos/seed/prod6/600/800']) },
    { id: 'prod-007', name: 'Silk Scarf', brand: 'Silka', category: 'Accessories', rentalPrice: 5.0, retailPrice: 40.0, isForSale: true, ownerId: user.id, description: 'Luxurious silk scarf', images: JSON.stringify(['https://picsum.photos/seed/prod7/600/800']) },
    { id: 'prod-008', name: 'Denim Jacket', brand: 'NorthCo', category: 'Men', rentalPrice: 13.0, retailPrice: 110.0, isForSale: true, ownerId: user.id, description: 'Durable denim jacket', images: JSON.stringify(['https://picsum.photos/seed/prod8/600/800']) },
    { id: 'prod-009', name: 'Evening Clutch', brand: 'Noir', category: 'Bags', rentalPrice: 6.0, retailPrice: 60.0, isForSale: true, ownerId: user.id, description: 'Compact clutch for special events', images: JSON.stringify(['https://picsum.photos/seed/prod9/600/800']) },
    { id: 'prod-010', name: 'Statement Necklace', brand: 'Gleam', category: 'Accessories', rentalPrice: 7.0, retailPrice: 85.0, isForSale: true, ownerId: user.id, description: 'Bold necklace to complete your look', images: JSON.stringify(['https://picsum.photos/seed/prod10/600/800']) }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p as any });
  }

  console.log('Seed complete');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Run seed (example)
Add to `backend/package.json`:
```json
  "prisma:seed": "ts-node --transpile-only prisma/seed.ts"
```
Then:
```bash
cd backend
npm run prisma:seed
```
