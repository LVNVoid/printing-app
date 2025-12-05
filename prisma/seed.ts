import 'dotenv/config';
import { Role } from '@/app/generated/prisma/enums';
import prisma from '@/lib/prisma';
import  bcrypt from 'bcrypt';


async function main() {
  console.log('🌱 Mulai seeding database...');

  // Bersihkan data lama (opsional - hapus jika tidak diperlukan)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productPicture.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Seed Users
  console.log('👤 Seeding users...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@percetakan.com',
      name: 'Administrator',
      phoneNumber: '08123456789',
      password: hashedPassword,
      role: Role.ADMIN,
      profileUrl: 'https://ui-avatars.com/api/?name=Administrator&background=0D8ABC&color=fff',
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John',
      phoneNumber: '08123456788',
      password: hashedPassword,
      role: Role.CUSTOMER,
      profileUrl: 'https://ui-avatars.com/api/?name=John&background=4CAF50&color=fff',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'doe@example.com',
      name: 'Doe',
      phoneNumber: '08123456777',
      password: hashedPassword,
      role: Role.CUSTOMER,
      profileUrl: 'https://ui-avatars.com/api/?name=Doe&background=FF9800&color=fff',
    },
  });

  // Seed Categories
  console.log('📁 Seeding categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Kartu Nama',
        slug: 'kartu-nama',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Brosur',
        slug: 'brosur',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Spanduk',
        slug: 'spanduk',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Undangan',
        slug: 'undangan',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Stiker',
        slug: 'stiker',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Kalender',
        slug: 'kalender',
      },
    }),
  ]);

  // Seed Products
  console.log('📦 Seeding products...');
  const products = [
    {
      name: 'Kartu Nama Premium',
      description: 'Kartu nama dengan bahan artpaper 310gsm, finishing glossy/doff. Ukuran standar 9x5.5cm',
      price: 150000,
      categoryId: categories[0].id,
      slug: 'kartu-nama-premium',
      pictures: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
          imagePublicId: 'kartu-nama-premium-1',
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1621570074981-1704ce1fc0b1?w=800',
          imagePublicId: 'kartu-nama-premium-2',
        },
      ],
    },
    {
      name: 'Brosur A4 2 Sisi',
      description: 'Brosur ukuran A4, cetak 2 sisi warna, bahan artpaper 150gsm',
      price: 250000,
      categoryId: categories[1].id,
      slug: 'brosur-a4-2-sisi',
      pictures: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
          imagePublicId: 'brosur-a4-1',
        },
      ],
    },
    {
      name: 'Spanduk MMT 3x1 Meter',
      description: 'Spanduk bahan MMT (Material Mactac Translucent) ukuran 3x1 meter, cetak full color',
      price: 180000,
      categoryId: categories[2].id,
      slug: 'spanduk-mmt-3x1',
      pictures: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800',
          imagePublicId: 'spanduk-mmt-1',
        },
      ],
    },
    {
      name: 'Undangan Pernikahan Hardcover',
      description: 'Undangan pernikahan dengan cover hardcover, isi artcarton 260gsm',
      price: 12000,
      categoryId: categories[3].id,
      slug: 'undangan-pernikahan-hardcover',
      pictures: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
          imagePublicId: 'undangan-hardcover-1',
        },
      ],
    },
    {
      name: 'Stiker Vinyl Cut',
      description: 'Stiker vinyl dengan cutting sesuai bentuk, cocok untuk branding produk',
      price: 50000,
      categoryId: categories[4].id,
      slug: 'stiker-vinyl-cut',
      pictures: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800',
          imagePublicId: 'stiker-vinyl-1',
        },
      ],
    },
    {
      name: 'Kalender Meja 2025',
      description: 'Kalender meja tahun 2025, ukuran A5, full color dengan stand kokoh',
      price: 75000,
      categoryId: categories[5].id,
      slug: 'kalender-meja-2025',
      pictures: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800',
          imagePublicId: 'kalender-meja-1',
        },
      ],
    },
    {
      name: 'Brosur Lipat 3 A4',
      description: 'Brosur lipat 3 ukuran A4, cetak 2 sisi, bahan artpaper 150gsm',
      price: 300000,
      categoryId: categories[1].id,
      slug: 'brosur-lipat-3-a4',
      pictures: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
          imagePublicId: 'brosur-lipat-1',
        },
      ],
    },
    {
      name: 'Kartu Nama Emboss',
      description: 'Kartu nama dengan efek emboss (timbul), bahan artcarton 310gsm',
      price: 250000,
      categoryId: categories[0].id,
      slug: 'kartu-nama-emboss',
      pictures: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
          imagePublicId: 'kartu-nama-emboss-1',
        },
      ],
    },
  ];

  const createdProducts = [];
  for (const productData of products) {
    const { pictures, ...productInfo } = productData;
    const product = await prisma.product.create({
      data: {
        ...productInfo,
        pictures: {
          create: pictures,
        },
      },
      include: {
        pictures: true,
      },
    });
    createdProducts.push(product);
  }

  // Seed Orders
  console.log('🛒 Seeding orders...');
  
  // Order 1 - Customer 1 (PAID)
  await prisma.order.create({
    data: {
      userId: customer1.id,
      status: 'PAID',
      total: 400000,
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            quantity: 2,
            price: 150000,
          },
          {
            productId: createdProducts[4].id,
            quantity: 2,
            price: 50000,
          },
        ],
      },
    },
  });

  // Order 2 - Customer 2 (PENDING)
  await prisma.order.create({
    data: {
      userId: customer2.id,
      status: 'PENDING',
      total: 192000,
      items: {
        create: [
          {
            productId: createdProducts[3].id,
            quantity: 16,
            price: 12000,
          },
        ],
      },
    },
  });

  // Order 3 - Customer 1 (COMPLETED)
  await prisma.order.create({
    data: {
      userId: customer1.id,
      status: 'COMPLETED',
      total: 430000,
      items: {
        create: [
          {
            productId: createdProducts[1].id,
            quantity: 1,
            price: 250000,
          },
          {
            productId: createdProducts[2].id,
            quantity: 1,
            price: 180000,
          },
        ],
      },
    },
  });

  // Order 4 - Customer 2 (SHIPPED)
  await prisma.order.create({
    data: {
      userId: customer2.id,
      status: 'SHIPPED',
      total: 225000,
      items: {
        create: [
          {
            productId: createdProducts[5].id,
            quantity: 3,
            price: 75000,
          },
        ],
      },
    },
  });

  console.log('✅ Seeding selesai!');
  console.log('\n📊 Ringkasan:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Categories: ${await prisma.category.count()}`);
  console.log(`- Products: ${await prisma.product.count()}`);
  console.log(`- Product Pictures: ${await prisma.productPicture.count()}`);
  console.log(`- Orders: ${await prisma.order.count()}`);
  console.log(`- Order Items: ${await prisma.orderItem.count()}`);
  console.log('\n🔑 Login credentials:');
  console.log('Admin: admin@percetakan.com / password123');
  console.log('Customer 1: john@example.com / password123');
  console.log('Customer 2: doe@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });