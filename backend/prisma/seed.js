const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create or find demo user
  let user = await prisma.user.findUnique({ where: { email: 'demo@stylus.test' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'demo@stylus.test',
        name: 'Demo User',
        phone: '+1234567890',
        address: '123 Demo Street',
        role: 'User',
        tier: 'Gold',
        status: 'Active',
        verificationStatus: 'Verified',
        walletBalance: 100.0,
      },
    });
    console.log('Created demo user:', user.email);
  } else {
    console.log('Demo user already exists:', user.email);
  }

  const products = [
    {
      id: 'prod-001',
      name: 'Classic Black Dress',
      brand: 'Luma',
      category: 'Women',
      rentalPrice: 15.0,
      retailPrice: 120.0,
      isForSale: true,
      ownerId: user.id,
      description: 'A timeless black dress for evening occasions',
      color: 'Black',
      occasion: 'Evening',
      condition: 'Excellent',
      images: JSON.stringify(['https://picsum.photos/seed/prod1/600/800']),
    },
    {
      id: 'prod-002',
      name: 'Slim Fit Jeans',
      brand: 'DenimCraft',
      category: 'Men',
      rentalPrice: 10.0,
      retailPrice: 80.0,
      isForSale: true,
      ownerId: user.id,
      description: 'Comfortable slim fit jeans',
      color: 'Blue',
      occasion: 'Casual',
      condition: 'Good',
      images: JSON.stringify(['https://picsum.photos/seed/prod2/600/800']),
    },
    {
      id: 'prod-003',
      name: 'Leather Handbag',
      brand: 'Bello',
      category: 'Bags',
      rentalPrice: 12.0,
      retailPrice: 150.0,
      isForSale: true,
      ownerId: user.id,
      description: 'Genuine leather handbag',
      color: 'Brown',
      occasion: 'Everyday',
      condition: 'Excellent',
      images: JSON.stringify(['https://picsum.photos/seed/prod3/600/800']),
    },
    {
      id: 'prod-004',
      name: 'Gold Wristwatch',
      brand: 'TickTock',
      category: 'Watches',
      rentalPrice: 20.0,
      retailPrice: 350.0,
      isForSale: true,
      ownerId: user.id,
      description: 'Elegant gold-tone wristwatch',
      color: 'Gold',
      occasion: 'Formal',
      condition: 'Excellent',
      images: JSON.stringify(['https://picsum.photos/seed/prod4/600/800']),
    },
    {
      id: 'prod-005',
      name: 'Floral Summer Dress',
      brand: 'Bloom',
      category: 'Women',
      rentalPrice: 9.0,
      retailPrice: 65.0,
      isForSale: true,
      ownerId: user.id,
      description: 'Lightweight floral dress',
      color: 'Yellow',
      occasion: 'Casual',
      condition: 'New',
      images: JSON.stringify(['https://picsum.photos/seed/prod5/600/800']),
    },
    {
      id: 'prod-006',
      name: 'Oxford Shoes',
      brand: 'Stride',
      category: 'Men',
      rentalPrice: 11.0,
      retailPrice: 95.0,
      isForSale: true,
      ownerId: user.id,
      description: 'Classic leather Oxford shoes',
      color: 'Black',
      occasion: 'Formal',
      condition: 'Good',
      images: JSON.stringify(['https://picsum.photos/seed/prod6/600/800']),
    },
    {
      id: 'prod-007',
      name: 'Silk Scarf',
      brand: 'Silka',
      category: 'Accessories',
      rentalPrice: 5.0,
      retailPrice: 40.0,
      isForSale: true,
      ownerId: user.id,
      description: 'Luxurious silk scarf',
      color: 'Red',
      occasion: 'Casual',
      condition: 'New',
      images: JSON.stringify(['https://picsum.photos/seed/prod7/600/800']),
    },
    {
      id: 'prod-008',
      name: 'Denim Jacket',
      brand: 'NorthCo',
      category: 'Men',
      rentalPrice: 13.0,
      retailPrice: 110.0,
      isForSale: true,
      ownerId: user.id,
      description: 'Durable denim jacket',
      color: 'Blue',
      occasion: 'Casual',
      condition: 'Good',
      images: JSON.stringify(['https://picsum.photos/seed/prod8/600/800']),
    },
    {
      id: 'prod-009',
      name: 'Evening Clutch',
      brand: 'Noir',
      category: 'Bags',
      rentalPrice: 6.0,
      retailPrice: 60.0,
      isForSale: true,
      ownerId: user.id,
      description: 'Compact clutch for special events',
      color: 'Black',
      occasion: 'Evening',
      condition: 'New',
      images: JSON.stringify(['https://picsum.photos/seed/prod9/600/800']),
    },
    {
      id: 'prod-010',
      name: 'Statement Necklace',
      brand: 'Gleam',
      category: 'Accessories',
      rentalPrice: 7.0,
      retailPrice: 85.0,
      isForSale: true,
      ownerId: user.id,
      description: 'Bold necklace to complete your look',
      color: 'Silver',
      occasion: 'Formal',
      condition: 'New',
      images: JSON.stringify(['https://picsum.photos/seed/prod10/600/800']),
    },
  ];

  for (const p of products) {
    const exists = await prisma.product.findUnique({ where: { id: p.id } });
    if (!exists) {
      await prisma.product.create({ data: p });
      console.log('Created product', p.id);
    } else {
      console.log('Product exists, skipping', p.id);
    }
  }

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
