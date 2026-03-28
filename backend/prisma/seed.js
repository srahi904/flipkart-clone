require('dotenv').config();

const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const { PrismaClient } = require('../generated/prisma');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const categories = [
  {
    name: 'Mobiles',
    description: 'Top smartphones, accessories, and smart wearables.',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: "Men's Fashion",
    description: 'Trending shirts, jeans, t-shirts, sneakers, and more for men.',
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: "Women's Fashion",
    description: 'Sarees, kurtis, dresses, accessories, and more for women.',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Electronics',
    description: 'Laptops, televisions, audio gear, and smart home devices.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Home & Kitchen',
    description: 'Cookware, decor, appliances, and storage solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Baby & Kids',
    description: 'Kids clothing, toys, baby care, and school essentials.',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sports & Fitness',
    description: 'Running shoes, gym equipment, and sports accessories.',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Books',
    description: 'Bestsellers, fiction, non-fiction, and academic titles.',
    imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'TVs & Appliances',
    description: 'Smart TVs, washing machines, ACs, and large appliances.',
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Grocery',
    description: 'Everyday essentials, snacks, beverages, and fresh produce.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  },
];

const products = [
  // ─── Mobiles ───────────────────────────────────────────────
  {
    name: 'Samsung Galaxy S24 Ultra (Titanium Gray, 256 GB)',
    brand: 'Samsung',
    category: 'Mobiles',
    price: 129999,
    mrp: 134999,
    stock: 25,
    rating: 4.7,
    reviewCount: 2453,
    isFeatured: true,
    description: 'Galaxy AI is here. The most powerful Galaxy smartphone with built-in AI, titanium frame, 200MP camera, and S Pen.',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Display: '6.8-inch Dynamic AMOLED 2X', Processor: 'Snapdragon 8 Gen 3', RAM: '12 GB', Storage: '256 GB', Camera: '200MP + 50MP + 12MP + 10MP', Battery: '5000 mAh' },
  },
  {
    name: 'Apple iPhone 15 Pro (Natural Titanium, 128 GB)',
    brand: 'Apple',
    category: 'Mobiles',
    price: 127990,
    mrp: 134900,
    stock: 30,
    rating: 4.7,
    reviewCount: 124562,
    isFeatured: true,
    description: 'iPhone 15 Pro is the first iPhone to feature an aerospace-grade titanium design, using the same alloy that spacecraft use for missions to Mars.',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: {
      General_HEADER: '',
      'In The Box': 'iPhone, USB-C Charge Cable (1m), Documentation',
      'Model Number': 'MTV13HN/A',
      'Model Name': 'iPhone 15 Pro',
      Color: 'Natural Titanium',
      'Display Features_HEADER': '',
      'Display Size': '15.49 cm (6.1 inch)',
      Resolution: '2556 x 1179 Pixels',
      'Resolution Type': 'Super Retina XDR Display',
      'Os & Processor Features_HEADER': '',
      'Operating System': 'iOS 17',
      'Processor Type': 'A17 Pro Chip, 6 Core Processor',
    },
  },
  {
    name: 'Google Pixel 8 Pro (Bay, 128 GB)',
    brand: 'Google',
    category: 'Mobiles',
    price: 106999,
    mrp: 109999,
    stock: 15,
    rating: 4.4,
    reviewCount: 8421,
    isFeatured: false,
    description: 'The best of Google AI with Tensor G3 chip, pro-level camera, and 7 years of OS updates.',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Display: '6.7-inch LTPO OLED', Processor: 'Google Tensor G3', RAM: '12 GB', Storage: '128 GB', Camera: '50MP + 48MP + 48MP', Battery: '5050 mAh' },
  },
  {
    name: 'Nothing Phone (2) (Dark Grey, 256 GB)',
    brand: 'Nothing',
    category: 'Mobiles',
    price: 36999,
    mrp: 49999,
    stock: 2,
    rating: 4.2,
    reviewCount: 12710,
    isFeatured: true,
    description: 'Distinctive design with Glyph Interface, Snapdragon 8+ Gen 1, 50MP dual camera.',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Display: '6.7-inch OLED', Processor: 'Snapdragon 8+ Gen 1', RAM: '12 GB', Storage: '256 GB', Camera: '50MP + 50MP', Battery: '4700 mAh' },
  },
  {
    name: 'Motorola Edge 50 Pro 5G',
    brand: 'Motorola',
    category: 'Mobiles',
    price: 29999,
    mrp: 35999,
    stock: 20,
    rating: 4.4,
    reviewCount: 3201,
    isFeatured: false,
    description: 'Premium design with 50MP camera, 125W fast charging, and smooth 144Hz pOLED display.',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Display: '6.7-inch pOLED 144Hz', Processor: 'Snapdragon 7 Gen 3', RAM: '8 GB', Storage: '256 GB', Camera: '50MP + 13MP + 10MP', Battery: '4500 mAh' },
  },
  {
    name: 'Xiaomi 14 (Black, 512 GB)',
    brand: 'Xiaomi',
    category: 'Mobiles',
    price: 69999,
    mrp: 79999,
    stock: 12,
    rating: 4.5,
    reviewCount: 4310,
    isFeatured: false,
    description: 'Leica optics, Snapdragon 8 Gen 3, compact flagship design with 75W HyperCharge.',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Display: '6.36-inch AMOLED 120Hz', Processor: 'Snapdragon 8 Gen 3', RAM: '12 GB', Storage: '512 GB', Camera: '50MP Leica', Battery: '4610 mAh' },
  },
  {
    name: 'POCO X6 Pro 5G (Grey, 256 GB)',
    brand: 'POCO',
    category: 'Mobiles',
    price: 24999,
    mrp: 30999,
    stock: 35,
    rating: 4.2,
    reviewCount: 9812,
    isFeatured: false,
    description: 'Dimensity 8300-Ultra, 64MP OIS camera, 67W turbo charging and 120Hz AMOLED display.',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Display: '6.67-inch AMOLED 120Hz', Processor: 'Dimensity 8300-Ultra', RAM: '8 GB', Storage: '256 GB', Camera: '64MP OIS', Battery: '5000 mAh' },
  },
  {
    name: 'Realme 12 Pro+ 5G',
    brand: 'Realme',
    category: 'Mobiles',
    price: 29999,
    mrp: 34999,
    stock: 18,
    rating: 4.5,
    reviewCount: 2100,
    isFeatured: false,
    description: 'Periscope portrait camera, Snapdragon 7s Gen 2, 67W SUPERVOOC charging.',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Display: '6.7-inch AMOLED 120Hz', Processor: 'Snapdragon 7s Gen 2', RAM: '8 GB', Storage: '256 GB', Camera: '64MP Periscope', Battery: '5000 mAh' },
  },

  // ─── Men's Fashion ──────────────────────────────────────────
  {
    name: 'Allen Solly Men Solid Formal Shirt',
    brand: 'Allen Solly',
    category: "Men's Fashion",
    price: 1299,
    mrp: 2499,
    stock: 40,
    rating: 4.0,
    reviewCount: 1981,
    isFeatured: false,
    description: 'Tailored formal shirt with breathable cotton blend and all-day office comfort.',
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Fabric: 'Cotton blend', Fit: 'Regular', Sleeve: 'Full sleeve', Pattern: 'Solid', Care: 'Machine wash' },
  },
  {
    name: "Levi's Men 511 Slim Fit Jeans",
    brand: "Levi's",
    category: "Men's Fashion",
    price: 2799,
    mrp: 4599,
    stock: 28,
    rating: 4.3,
    reviewCount: 7823,
    isFeatured: true,
    description: 'Classic slim fit jeans with stretch comfort and iconic Levi\'s styling.',
    images: [
      'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Fabric: 'Cotton Denim with Stretch', Fit: 'Slim Fit', Rise: 'Mid Rise', Wash: 'Dark Indigo', Care: 'Machine wash cold' },
  },
  {
    name: 'U.S. Polo Assn. Men Polo T-Shirt',
    brand: 'U.S. Polo Assn.',
    category: "Men's Fashion",
    price: 899,
    mrp: 1799,
    stock: 60,
    rating: 4.1,
    reviewCount: 12320,
    isFeatured: false,
    description: 'Classic polo t-shirt with comfortable cotton fabric and iconic branding.',
    images: [
      'https://images.unsplash.com/photo-1625910513413-5fc68e7990a7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Fabric: '100% Cotton', Fit: 'Regular', Sleeve: 'Short sleeve', Pattern: 'Solid', Collar: 'Polo collar' },
  },
  {
    name: 'Roadster Men Casual Jacket',
    brand: 'Roadster',
    category: "Men's Fashion",
    price: 1999,
    mrp: 3499,
    stock: 22,
    rating: 4.2,
    reviewCount: 3456,
    isFeatured: false,
    description: 'Stylish bomber jacket with wind-resistant fabric and a modern urban look.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559582798-678dfc71ccd8?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Fabric: 'Polyester', Fit: 'Regular', Sleeve: 'Full sleeve', Type: 'Bomber', Care: 'Dry clean only' },
  },
  {
    name: 'PUMA Smashic Casual Sneakers',
    brand: 'PUMA',
    category: "Men's Fashion",
    price: 2399,
    mrp: 4999,
    stock: 32,
    rating: 4.3,
    reviewCount: 4412,
    isFeatured: true,
    description: 'Clean everyday sneakers with cushioned comfort, durable outsole, and versatile style.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Material: 'Synthetic leather', Sole: 'Rubber', Closure: 'Lace-up', Occasion: 'Casual', Warranty: 'No warranty' },
  },
  {
    name: 'Peter England Men Kurta Set',
    brand: 'Peter England',
    category: "Men's Fashion",
    price: 1599,
    mrp: 2999,
    stock: 35,
    rating: 4.0,
    reviewCount: 2100,
    isFeatured: false,
    description: 'Elegant kurta set in cotton fabric, perfect for festive and formal occasions.',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Fabric: 'Cotton', Fit: 'Regular', Sleeve: 'Full sleeve', Pattern: 'Solid', Occasion: 'Festive/Formal' },
  },
  {
    name: 'Fossil Gen 6 Smartwatch',
    brand: 'Fossil',
    category: "Men's Fashion",
    price: 12495,
    mrp: 24995,
    stock: 10,
    rating: 4.1,
    reviewCount: 876,
    isFeatured: false,
    description: 'Premium smartwatch with leather strap, heart rate monitor, and Wear OS by Google.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Display: '1.28-inch AMOLED', Battery: '24 hours', Connectivity: 'Bluetooth, WiFi, NFC', WaterResistance: '3 ATM', OS: 'Wear OS' },
  },

  // ─── Women's Fashion ────────────────────────────────────────
  {
    name: 'BIBA Women Anarkali Kurta',
    brand: 'BIBA',
    category: "Women's Fashion",
    price: 1299,
    mrp: 2499,
    stock: 45,
    rating: 4.2,
    reviewCount: 5621,
    isFeatured: true,
    description: 'Beautiful Anarkali kurta with intricate embroidery, perfect for festive occasions.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Fabric: 'Cotton blend', Fit: 'Flared', Sleeve: 'Three-quarter sleeve', Pattern: 'Embroidered', Occasion: 'Festive' },
  },
  {
    name: 'Saree Mall Banarasi Silk Saree',
    brand: 'Saree Mall',
    category: "Women's Fashion",
    price: 3499,
    mrp: 7999,
    stock: 18,
    rating: 4.4,
    reviewCount: 3200,
    isFeatured: true,
    description: 'Exquisite Banarasi silk saree with rich zari work, comes with unstitched blouse piece.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Fabric: 'Banarasi Silk', Length: '6.3 meters', Blouse: 'Unstitched 0.8m', Pattern: 'Zari Woven', Occasion: 'Wedding/Festive' },
  },
  {
    name: 'ZARA Women Midi Dress',
    brand: 'ZARA',
    category: "Women's Fashion",
    price: 2999,
    mrp: 4999,
    stock: 15,
    rating: 4.3,
    reviewCount: 1870,
    isFeatured: false,
    description: 'Elegant midi dress with floral print, perfect for brunch and casual outings.',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Fabric: 'Viscose', Fit: 'Regular', Length: 'Midi', Pattern: 'Floral Print', Care: 'Machine wash cold' },
  },
  {
    name: 'Lavie Women Handbag',
    brand: 'Lavie',
    category: "Women's Fashion",
    price: 1599,
    mrp: 3199,
    stock: 25,
    rating: 4.1,
    reviewCount: 4560,
    isFeatured: false,
    description: 'Stylish tote handbag with spacious compartments and premium faux leather finish.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Material: 'Faux Leather', Type: 'Tote', Compartments: '3', Closure: 'Zip', Strap: 'Double handle' },
  },
  {
    name: 'Bata Women Block Heels',
    brand: 'Bata',
    category: "Women's Fashion",
    price: 1799,
    mrp: 2999,
    stock: 20,
    rating: 4.0,
    reviewCount: 2340,
    isFeatured: false,
    description: 'Comfortable block heels with ankle strap, ideal for work and parties.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Material: 'Synthetic', HeelHeight: '3 inches', Type: 'Block Heel', Closure: 'Ankle Strap', Occasion: 'Formal/Party' },
  },
  {
    name: 'Tanishq 18KT Gold Earrings',
    brand: 'Tanishq',
    category: "Women's Fashion",
    price: 15999,
    mrp: 18999,
    stock: 8,
    rating: 4.7,
    reviewCount: 1250,
    isFeatured: false,
    description: '18KT gold stud earrings with diamond accents, BIS Hallmarked.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599459183200-59c3fd3f2993?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Metal: '18KT Gold', GemStone: 'Diamond', Weight: '2.5 grams', Certification: 'BIS Hallmarked', Type: 'Stud Earrings' },
  },

  // ─── Electronics ──────────────────────────────────────────
  {
    name: 'Samsung Galaxy Book 4',
    brand: 'Samsung',
    category: 'Electronics',
    price: 67999,
    mrp: 79999,
    stock: 9,
    rating: 4.6,
    reviewCount: 786,
    isFeatured: true,
    description: 'Lightweight productivity laptop with Intel Core performance, all-day battery, and a premium design.',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Display: '15.6-inch Full HD', Processor: 'Intel Core i5', RAM: '16 GB', Storage: '512 GB SSD', OS: 'Windows 11' },
  },
  {
    name: 'boAt Airdopes 441 Pro',
    brand: 'boAt',
    category: 'Electronics',
    price: 1799,
    mrp: 5999,
    stock: 70,
    rating: 4.2,
    reviewCount: 18672,
    isFeatured: false,
    description: 'True wireless earbuds with punchy bass, low-latency mode, and durable battery backup.',
    images: [
      'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Playback: '150 hours with case', Driver: '6 mm', Connectivity: 'Bluetooth 5.3', SweatResistance: 'IPX5', Warranty: '1 Year' },
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    brand: 'Sony',
    category: 'Electronics',
    price: 19990,
    mrp: 29990,
    stock: 16,
    rating: 4.7,
    reviewCount: 5430,
    isFeatured: true,
    description: 'Industry-leading noise cancellation with exceptional sound quality and 30-hour battery life.',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Driver: '30mm', NoiseCancel: 'Active (ANC)', Battery: '30 hours', Connectivity: 'Bluetooth 5.2', Weight: '250g' },
  },
  {
    name: 'Apple MacBook Air M3 (15-inch)',
    brand: 'Apple',
    category: 'Electronics',
    price: 149900,
    mrp: 164900,
    stock: 7,
    rating: 4.8,
    reviewCount: 2190,
    isFeatured: true,
    description: 'Remarkably thin, with M3 chip, 18-hour battery, Liquid Retina display, and fanless design.',
    images: [
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Display: '15.3-inch Liquid Retina', Processor: 'Apple M3', RAM: '8 GB', Storage: '256 GB SSD', Battery: '18 hours' },
  },
  {
    name: 'realme Pad 2 Lite',
    brand: 'realme',
    category: 'Electronics',
    price: 15999,
    mrp: 19999,
    stock: 19,
    rating: 4.4,
    reviewCount: 2310,
    isFeatured: false,
    description: 'Entertainment-first tablet with a large display, stereo speakers, and all-day battery life.',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Display: '11-inch 2K', Processor: 'Helio G99', Battery: '8360 mAh', Speakers: 'Quad speaker', Warranty: '1 Year' },
  },
  {
    name: 'JBL Charge 5 Bluetooth Speaker',
    brand: 'JBL',
    category: 'Electronics',
    price: 11999,
    mrp: 18999,
    stock: 25,
    rating: 4.5,
    reviewCount: 6780,
    isFeatured: false,
    description: 'Powerful portable speaker with deep bass, IP67 waterproof, and 20-hour battery.',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Output: '40W', Battery: '20 hours', Waterproof: 'IP67', Driver: 'Dual bass radiators', Weight: '960g' },
  },

  // ─── TVs & Appliances ─────────────────────────────────────
  {
    name: 'Sony Bravia 55-inch 4K Smart TV',
    brand: 'Sony',
    category: 'TVs & Appliances',
    price: 68990,
    mrp: 89990,
    stock: 6,
    rating: 4.7,
    reviewCount: 1243,
    isFeatured: true,
    description: 'Immersive 4K smart television with vibrant color, strong upscaling, and Google TV apps.',
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Resolution: '3840 x 2160', Audio: '20W Dolby Audio', Connectivity: 'HDMI x3, USB x2', OS: 'Google TV', Warranty: '1 Year' },
  },
  {
    name: 'LG 7 Kg Front Load Washing Machine',
    brand: 'LG',
    category: 'TVs & Appliances',
    price: 29990,
    mrp: 38990,
    stock: 7,
    rating: 4.6,
    reviewCount: 642,
    isFeatured: true,
    description: 'Energy efficient washing machine with intelligent fabric care and steam wash support.',
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Capacity: '7 Kg', WashPrograms: '10', Motor: 'Inverter Direct Drive', EnergyRating: '5 Star', Warranty: '2 Years' },
  },
  {
    name: 'Samsung 253L 3-Star Refrigerator',
    brand: 'Samsung',
    category: 'TVs & Appliances',
    price: 24990,
    mrp: 31990,
    stock: 10,
    rating: 4.4,
    reviewCount: 3210,
    isFeatured: false,
    description: 'Digital Inverter technology for energy efficiency, frost-free cooling, and convertible freezer.',
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Capacity: '253 Litres', Type: 'Double Door', EnergyRating: '3 Star', Compressor: 'Digital Inverter', Warranty: '1 Year' },
  },
  {
    name: 'Daikin 1.5 Ton 5 Star Split AC',
    brand: 'Daikin',
    category: 'TVs & Appliances',
    price: 42990,
    mrp: 56990,
    stock: 5,
    rating: 4.5,
    reviewCount: 1870,
    isFeatured: false,
    description: 'Premium inverter AC with powerful cooling, PM 2.5 filter, and copper condenser for longevity.',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Capacity: '1.5 Ton', EnergyRating: '5 Star', Type: 'Inverter Split', Condenser: 'Copper', Warranty: '1 Year comprehensive' },
  },

  // ─── Home & Kitchen ────────────────────────────────────────
  {
    name: 'Prestige Omega Deluxe Cookware Set',
    brand: 'Prestige',
    category: 'Home & Kitchen',
    price: 3499,
    mrp: 6499,
    stock: 22,
    rating: 4.4,
    reviewCount: 1156,
    isFeatured: true,
    description: 'Non-stick cookware combo for daily Indian cooking with sturdy handles and even heating.',
    images: [
      'https://images.unsplash.com/photo-1584990347449-a8d4f7160e7f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Pieces: '3', Coating: 'Non-stick', Material: 'Aluminium', InductionBase: 'Yes', Warranty: '2 Years' },
  },
  {
    name: 'IFB 25L Convection Microwave Oven',
    brand: 'IFB',
    category: 'Home & Kitchen',
    price: 12990,
    mrp: 16990,
    stock: 11,
    rating: 4.5,
    reviewCount: 884,
    isFeatured: true,
    description: 'Convection microwave with auto cook menus, quick reheating, and child lock safety.',
    images: [
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Capacity: '25 L', Type: 'Convection', Presets: '26 auto cook menus', Control: 'Touch keypad', Warranty: '1 Year' },
  },
  {
    name: 'Milton Thermosteel Bottle Set',
    brand: 'Milton',
    category: 'Home & Kitchen',
    price: 899,
    mrp: 1599,
    stock: 64,
    rating: 4.3,
    reviewCount: 2371,
    isFeatured: false,
    description: 'Vacuum insulated steel bottle set that keeps beverages hot or cold for extended hours.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Capacity: '750 ml x 2', Material: 'Stainless steel', Insulation: 'Double wall', LeakProof: 'Yes', Warranty: '1 Year' },
  },
  {
    name: 'Philips Air Purifier AC1215/20',
    brand: 'Philips',
    category: 'Home & Kitchen',
    price: 8999,
    mrp: 12995,
    stock: 14,
    rating: 4.3,
    reviewCount: 1950,
    isFeatured: false,
    description: 'VitaShield IPS technology removes 99.97% of airborne allergens, ideal for rooms up to 333 sq ft.',
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584990347449-a8d4f7160e7f?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Coverage: '333 sq ft', Filter: 'HEPA', CADR: '270 m³/h', NoiseLevel: '33 dB', Warranty: '2 Years' },
  },

  // ─── Baby & Kids ────────────────────────────────────────────
  {
    name: 'Babyhug Cotton Romper Pack of 3',
    brand: 'Babyhug',
    category: 'Baby & Kids',
    price: 799,
    mrp: 1499,
    stock: 50,
    rating: 4.3,
    reviewCount: 3210,
    isFeatured: true,
    description: 'Soft cotton rompers in vibrant colors, easy snap buttons for quick diaper changes.',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771930-78b353280cef?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Fabric: '100% Cotton', Pieces: '3', Size: '6-12 months', Closure: 'Snap buttons', Care: 'Machine wash gentle' },
  },
  {
    name: 'LEGO Classic Creative Bricks Box',
    brand: 'LEGO',
    category: 'Baby & Kids',
    price: 1999,
    mrp: 2999,
    stock: 30,
    rating: 4.7,
    reviewCount: 8450,
    isFeatured: true,
    description: '790 pieces with 33 colors, building instructions for multiple models. Ages 4+.',
    images: [
      'https://images.unsplash.com/photo-1560961911-ba7ef651a56c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Pieces: '790', Age: '4+ years', Colors: '33', Theme: 'Classic', Material: 'ABS Plastic' },
  },
  {
    name: 'Pampers All-Round Protection Diapers',
    brand: 'Pampers',
    category: 'Baby & Kids',
    price: 1199,
    mrp: 1699,
    stock: 80,
    rating: 4.4,
    reviewCount: 15200,
    isFeatured: false,
    description: 'Up to 12 hours of dryness with magic channels that distribute wetness evenly.',
    images: [
      'https://images.unsplash.com/photo-1522771930-78b353280cef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Size: 'Large (9-14 kg)', Count: '64', Type: 'Pants', Absorbency: '12 hours', SkinSafe: 'Dermatologically tested' },
  },
  {
    name: 'Hot Wheels Track Builder Barrel Box',
    brand: 'Hot Wheels',
    category: 'Baby & Kids',
    price: 2499,
    mrp: 3999,
    stock: 22,
    rating: 4.5,
    reviewCount: 1890,
    isFeatured: false,
    description: 'Build incredible tracks with barrel connectors and loops. Includes 2 die-cast cars.',
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560961911-ba7ef651a56c?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Cars: '2 included', Age: '5+ years', Material: 'Plastic + Die-cast', TrackLength: '6 feet', Theme: 'Racing' },
  },

  // ─── Sports & Fitness ──────────────────────────────────────
  {
    name: 'Nike Revolution 6 Running Shoes',
    brand: 'Nike',
    category: 'Sports & Fitness',
    price: 3495,
    mrp: 4995,
    stock: 40,
    rating: 4.3,
    reviewCount: 6780,
    isFeatured: true,
    description: 'Lightweight running shoes with foam cushioning and breathable mesh upper.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Sole: 'Rubber', Upper: 'Mesh', Cushioning: 'Foam midsole', Weight: '250g', Occasion: 'Running/Training' },
  },
  {
    name: 'PowerMax Fitness TDM-98 Treadmill',
    brand: 'PowerMax',
    category: 'Sports & Fitness',
    price: 24999,
    mrp: 42999,
    stock: 5,
    rating: 4.1,
    reviewCount: 1230,
    isFeatured: false,
    description: 'Motorized treadmill with 12 preset programs, heart rate sensor, and foldable design.',
    images: [
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1461896836934-bd45ba6343c8?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Motor: '2.0 HP', Speed: '1-14 km/h', Incline: '3 levels', Programs: '12', MaxWeight: '100 kg' },
  },
  {
    name: 'Cosco Cricket Bat English Willow',
    brand: 'Cosco',
    category: 'Sports & Fitness',
    price: 3999,
    mrp: 5999,
    stock: 15,
    rating: 4.2,
    reviewCount: 2100,
    isFeatured: false,
    description: 'Premium English Willow cricket bat with round cane handle and full size blade.',
    images: [
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1461896836934-bd45ba6343c8?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Material: 'English Willow', Handle: 'Round Cane', Size: 'Full Size', Weight: '1.2 kg', Grip: 'Chevron' },
  },
  {
    name: 'Boldfit Gym Resistance Bands Set',
    brand: 'Boldfit',
    category: 'Sports & Fitness',
    price: 499,
    mrp: 1299,
    stock: 90,
    rating: 4.0,
    reviewCount: 8970,
    isFeatured: false,
    description: 'Set of 5 resistance bands with varying resistance levels for full body workouts.',
    images: [
      'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Bands: '5 levels', Material: 'Natural Latex', Resistance: '5-50 lbs', Length: '12 inches', Includes: 'Carry bag' },
  },

  // ─── Books ─────────────────────────────────────────────────
  {
    name: 'Atomic Habits by James Clear',
    brand: 'Penguin',
    category: 'Books',
    price: 399,
    mrp: 799,
    stock: 100,
    rating: 4.7,
    reviewCount: 45000,
    isFeatured: true,
    description: 'An easy & proven way to build good habits & break bad ones. International bestseller.',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Author: 'James Clear', Pages: '320', Language: 'English', Publisher: 'Penguin', Format: 'Paperback' },
  },
  {
    name: 'The Psychology of Money',
    brand: 'Jaico Publishing',
    category: 'Books',
    price: 299,
    mrp: 399,
    stock: 75,
    rating: 4.6,
    reviewCount: 32100,
    isFeatured: true,
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
    images: [
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Author: 'Morgan Housel', Pages: '256', Language: 'English', Publisher: 'Jaico', Format: 'Paperback' },
  },
  {
    name: 'Rich Dad Poor Dad',
    brand: 'Plata Publishing',
    category: 'Books',
    price: 349,
    mrp: 599,
    stock: 85,
    rating: 4.5,
    reviewCount: 52000,
    isFeatured: false,
    description: 'What the rich teach their kids about money that the poor and middle class do not.',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Author: 'Robert T. Kiyosaki', Pages: '336', Language: 'English', Publisher: 'Plata Publishing', Format: 'Paperback' },
  },

  // ─── Grocery ──────────────────────────────────────────────
  {
    name: 'Tata Sampann Chana Dal 1kg',
    brand: 'Tata',
    category: 'Grocery',
    price: 149,
    mrp: 185,
    stock: 200,
    rating: 4.3,
    reviewCount: 8900,
    isFeatured: false,
    description: 'Unpolished split chickpeas rich in protein and fiber, sourced from premium farms.',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Weight: '1 kg', Type: 'Unpolished', ProteinPer100g: '20g', ShelfLife: '12 months', Origin: 'India' },
  },
  {
    name: 'Saffola Gold Edible Oil 5L',
    brand: 'Saffola',
    category: 'Grocery',
    price: 899,
    mrp: 1099,
    stock: 150,
    rating: 4.2,
    reviewCount: 6200,
    isFeatured: false,
    description: 'Pro Heart Conscious edible oil with dual seed technology for a healthier heart.',
    images: [
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Volume: '5 Litres', Type: 'Blended Oil', MUFA: 'High', ShelfLife: '9 months', Packaging: 'Can' },
  },
  {
    name: 'Cadbury Dairy Milk Silk Gift Pack',
    brand: 'Cadbury',
    category: 'Grocery',
    price: 699,
    mrp: 899,
    stock: 120,
    rating: 4.6,
    reviewCount: 14500,
    isFeatured: true,
    description: 'Premium chocolate gift pack with assorted Silk variants, perfect for gifting.',
    images: [
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Weight: '340g', Variants: '4 assorted', Type: 'Milk Chocolate', ShelfLife: '9 months', Packaging: 'Gift Box' },
  },

  // ─── More Mobiles (Noise, Realme) ─────────────────────────
  {
    name: 'Noise ColorFit Pulse 4 Max Smartwatch',
    brand: 'Noise',
    category: 'Mobiles',
    price: 2999,
    mrp: 4999,
    stock: 55,
    rating: 4.1,
    reviewCount: 9021,
    isFeatured: false,
    description: 'Feature-rich smartwatch with Bluetooth calling, bright display, and long battery life.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=1200&q=80',
    ],
    specs: { Display: '1.85-inch HD', Battery: '7 days', Connectivity: 'Bluetooth calling', WaterResistance: 'IP68', Warranty: '1 Year' },
  },
];

const main = async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productSpec.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const demoPassword = await bcrypt.hash('Demo@12345', 10);
  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo Shopper',
      email: 'demo@flipkartclone.dev',
      phone: '9876543210',
      passwordHash: demoPassword,
      cart: { create: {} },
      addresses: {
        create: {
          name: 'Demo Shopper',
          phone: '9876543210',
          line1: '221B Residency Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: true,
        },
      },
    },
  });

  const categoryMap = {};

  for (const category of categories) {
    categoryMap[category.name] = await prisma.category.create({
      data: {
        ...category,
        slug: slugify(category.name, { lower: true, strict: true }),
      },
    });
  }

  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        name: product.name,
        slug: slugify(product.name, { lower: true, strict: true }),
        description: product.description,
        brand: product.brand,
        price: product.price,
        mrp: product.mrp,
        stock: product.stock,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isFeatured: product.isFeatured,
        categoryId: categoryMap[product.category].id,
      },
    });

    await prisma.productImage.createMany({
      data: product.images.map((url, index) => ({
        productId: created.id,
        url,
        altText: `${product.name} image ${index + 1}`,
        isPrimary: index === 0,
        sortOrder: index,
      })),
    });

    await prisma.productSpec.createMany({
      data: Object.entries(product.specs).map(([specKey, specValue]) => ({
        productId: created.id,
        specKey,
        specValue,
      })),
    });
  }

  const featuredProducts = await prisma.product.findMany({
    take: 3,
    orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }],
  });
  const demoCart = await prisma.cart.findUnique({ where: { userId: demoUser.id } });

  await prisma.wishlist.createMany({
    data: featuredProducts.slice(0, 2).map((product) => ({
      userId: demoUser.id,
      productId: product.id,
    })),
  });

  if (demoCart) {
    await prisma.cartItem.createMany({
      data: featuredProducts.slice(1, 3).map((product, index) => ({
        cartId: demoCart.id,
        productId: product.id,
        quantity: index + 1,
      })),
    });
  }

  console.log(`Database seeded successfully — ${categories.length} categories, ${products.length} products`);
  console.log('Demo login: demo@flipkartclone.dev / Demo@12345');
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
