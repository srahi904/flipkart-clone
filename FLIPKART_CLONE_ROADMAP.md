# 🛒 Flipkart Clone — Full-Stack SDE Intern Assignment
### Complete Phase-Wise Roadmap | React.js + Node.js + PostgreSQL

---

## 📋 Table of Contents

1. [Tech Stack Overview](#tech-stack)
2. [Project Folder Structure](#folder-structure)
3. [Database Schema Design](#database-schema)
4. [Phase-Wise Roadmap](#phases)
   - [Phase 0 — Setup & Configuration](#phase-0)
   - [Phase 1 — Backend Foundation](#phase-1)
   - [Phase 2 — Frontend Foundation](#phase-2)
   - [Phase 3 — Core Features](#phase-3)
   - [Phase 4 — Bonus Features](#phase-4)
   - [Phase 5 — Polish & Deploy](#phase-5)
5. [API Endpoints Reference](#api-endpoints)
6. [Environment Variables](#env-variables)
7. [Deployment Guide](#deployment)
8. [README Template](#readme-template)

---

## 🧰 Tech Stack Overview <a name="tech-stack"></a>

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React.js 18 + Vite | SPA, fast HMR |
| Styling | Tailwind CSS + custom CSS | Flipkart-like UI, responsive |
| State Management | Redux Toolkit + React Query | Global cart/UI state + server state |
| Backend | Node.js + Express.js | REST API server |
| Database | PostgreSQL | Relational data storage |
| ORM | Prisma | Type-safe DB queries |
| Image Storage | Cloudinary (or local `/uploads`) | Product images |
| Auth (Bonus) | JWT + bcrypt | User login/signup |
| Deployment | Vercel (frontend) + Render (backend) | Free tier hosting |

---

## 📁 Project Folder Structure <a name="folder-structure"></a>

```
flipkart-clone/
├── README.md
├── .gitignore
│
├── backend/                             # Node.js + Express API
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma                # Full DB schema
│   │   └── seed.js                      # Seed script for sample data
│   │
│   └── src/
│       ├── server.js                    # Entry point — starts Express server
│       ├── app.js                       # Express app config, middleware, routes
│       │
│       ├── config/
│       │   ├── db.js                    # Prisma client instance
│       │   └── cloudinary.js            # Cloudinary config (optional)
│       │
│       ├── routes/
│       │   ├── index.js                 # Root router — mounts all sub-routes
│       │   ├── product.routes.js        # GET /products, GET /products/:id
│       │   ├── category.routes.js       # GET /categories
│       │   ├── cart.routes.js           # GET/POST/PUT/DELETE /cart
│       │   ├── order.routes.js          # POST /orders, GET /orders/:id
│       │   ├── user.routes.js           # GET /users/:id (default user)
│       │   └── auth.routes.js           # POST /auth/login, /auth/register [BONUS]
│       │
│       ├── controllers/
│       │   ├── product.controller.js    # Business logic for products
│       │   ├── category.controller.js
│       │   ├── cart.controller.js
│       │   ├── order.controller.js
│       │   ├── user.controller.js
│       │   └── auth.controller.js       # [BONUS]
│       │
│       ├── middleware/
│       │   ├── errorHandler.js          # Global error handler
│       │   ├── validate.js              # Request body validation
│       │   ├── auth.middleware.js       # JWT verification [BONUS]
│       │   └── logger.js                # Morgan request logger
│       │
│       ├── utils/
│       │   ├── ApiResponse.js           # Standardised response wrapper
│       │   ├── ApiError.js              # Custom error class
│       │   └── pagination.js            # Pagination helper
│       │
│       └── constants/
│           └── index.js                 # App-wide constants (DEFAULT_USER_ID etc.)
│
└── frontend/                            # React.js + Vite SPA
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .env
    ├── .env.example
    │
    └── src/
        ├── main.jsx                     # React entry point
        ├── App.jsx                      # Root component, router setup
        │
        ├── assets/
        │   ├── images/
        │   │   ├── flipkart-logo.svg
        │   │   └── no-image.png
        │   └── icons/
        │       └── (custom SVG icons)
        │
        ├── components/                  # Reusable UI components
        │   ├── layout/
        │   │   ├── Navbar.jsx           # Flipkart top navigation bar
        │   │   ├── Footer.jsx           # Footer with links
        │   │   ├── Sidebar.jsx          # Filter sidebar
        │   │   └── Layout.jsx           # Wrapper with Navbar + Footer
        │   │
        │   ├── common/
        │   │   ├── Button.jsx           # Reusable button (variants: primary, outline)
        │   │   ├── Badge.jsx            # Stock / discount badge
        │   │   ├── Spinner.jsx          # Loading spinner
        │   │   ├── StarRating.jsx       # 1–5 star rating display
        │   │   ├── Pagination.jsx       # Page navigation
        │   │   ├── Toast.jsx            # Success/error toast notifications
        │   │   ├── Modal.jsx            # Generic modal wrapper
        │   │   ├── EmptyState.jsx       # Empty cart / no results view
        │   │   └── ErrorBoundary.jsx    # React error boundary
        │   │
        │   ├── product/
        │   │   ├── ProductCard.jsx      # Grid card (Flipkart-style)
        │   │   ├── ProductGrid.jsx      # Grid layout wrapper
        │   │   ├── ProductSkeleton.jsx  # Loading skeleton card
        │   │   ├── ImageCarousel.jsx    # Detail page image slider
        │   │   ├── PriceDisplay.jsx     # MRP + discount % + final price
        │   │   └── SpecTable.jsx        # Product specifications table
        │   │
        │   ├── cart/
        │   │   ├── CartItem.jsx         # Single cart row
        │   │   ├── CartSummary.jsx      # Subtotal + tax + total panel
        │   │   └── QuantitySelector.jsx # +/- quantity control
        │   │
        │   ├── order/
        │   │   ├── AddressForm.jsx      # Shipping address form
        │   │   ├── OrderSummary.jsx     # Items list before placing order
        │   │   └── OrderConfirmation.jsx# Success page card
        │   │
        │   └── search/
        │       ├── SearchBar.jsx        # Navbar search input
        │       └── FilterPanel.jsx      # Category + price range filters
        │
        ├── pages/                       # Route-level page components
        │   ├── HomePage.jsx             # Banner + categories + featured products
        │   ├── ProductListPage.jsx      # /products — grid + filters + search
        │   ├── ProductDetailPage.jsx    # /products/:id — full detail view
        │   ├── CartPage.jsx             # /cart — cart management
        │   ├── CheckoutPage.jsx         # /checkout — address + order summary
        │   ├── OrderSuccessPage.jsx     # /order-success/:orderId
        │   ├── OrderHistoryPage.jsx     # /orders — past orders [BONUS]
        │   ├── WishlistPage.jsx         # /wishlist [BONUS]
        │   ├── LoginPage.jsx            # /login [BONUS]
        │   ├── RegisterPage.jsx         # /register [BONUS]
        │   └── NotFoundPage.jsx         # 404 fallback
        │
        ├── store/                       # Redux Toolkit global state
        │   ├── index.js                 # configureStore
        │   ├── slices/
        │   │   ├── cartSlice.js         # Cart items, quantities
        │   │   ├── uiSlice.js           # loading, modal, toast state
        │   │   ├── authSlice.js         # User session [BONUS]
        │   │   └── wishlistSlice.js     # Wishlist items [BONUS]
        │   └── middleware/
        │       └── localStorageSync.js  # Persist cart to localStorage
        │
        ├── hooks/                       # Custom React hooks
        │   ├── useProducts.js           # React Query — fetch products list
        │   ├── useProduct.js            # React Query — fetch single product
        │   ├── useCart.js               # Cart CRUD operations
        │   ├── useOrders.js             # Order operations
        │   ├── useDebounce.js           # Debounce search input
        │   └── useLocalStorage.js       # Local storage hook
        │
        ├── services/                    # Axios API layer
        │   ├── api.js                   # Axios instance + base URL + interceptors
        │   ├── productService.js        # Product API calls
        │   ├── categoryService.js       # Category API calls
        │   ├── cartService.js           # Cart API calls
        │   ├── orderService.js          # Order API calls
        │   └── authService.js           # Auth API calls [BONUS]
        │
        ├── utils/
        │   ├── formatCurrency.js        # ₹ INR formatter
        │   ├── formatDate.js            # Date formatting
        │   ├── calcDiscount.js          # Discount % calculator
        │   └── validators.js            # Form validation helpers
        │
        ├── constants/
        │   ├── routes.js                # Route path constants
        │   └── queryKeys.js             # React Query cache keys
        │
        └── styles/
            ├── index.css                # Tailwind directives + global reset
            ├── flipkart.css             # Flipkart color variables & overrides
            └── animations.css           # Custom keyframe animations
```

---

## 🗄️ Database Schema Design <a name="database-schema"></a>

> Full Prisma schema — covers all core + bonus features.

```prisma
// backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Users ─────────────────────────────────────────────────────
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String?                       // nullable — default guest user
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  cart      Cart?
  orders    Order[]
  wishlist  Wishlist[]
  addresses Address[]

  @@map("users")
}

// ─── Addresses ──────────────────────────────────────────────────
model Address {
  id        Int     @id @default(autoincrement())
  userId    Int
  name      String
  phone     String
  line1     String
  line2     String?
  city      String
  state     String
  pincode   String
  isDefault Boolean @default(false)

  user      User    @relation(fields: [userId], references: [id])
  orders    Order[]

  @@map("addresses")
}

// ─── Categories ─────────────────────────────────────────────────
model Category {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  slug        String    @unique
  imageUrl    String?
  description String?
  createdAt   DateTime  @default(now())

  products    Product[]

  @@map("categories")
}

// ─── Products ───────────────────────────────────────────────────
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  slug        String   @unique
  description String
  price       Decimal  @db.Decimal(10, 2)
  mrp         Decimal  @db.Decimal(10, 2)   // Maximum Retail Price (crossed out)
  stock       Int      @default(0)
  brand       String
  rating      Float    @default(0)
  reviewCount Int      @default(0)
  categoryId  Int
  isFeatured  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  category      Category       @relation(fields: [categoryId], references: [id])
  images        ProductImage[]
  specs         ProductSpec[]
  cartItems     CartItem[]
  orderItems    OrderItem[]
  wishlistItems Wishlist[]

  @@map("products")
}

// ─── Product Images ──────────────────────────────────────────────
model ProductImage {
  id        Int     @id @default(autoincrement())
  productId Int
  url       String
  altText   String?
  isPrimary Boolean @default(false)
  sortOrder Int     @default(0)

  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_images")
}

// ─── Product Specifications ──────────────────────────────────────
model ProductSpec {
  id        Int     @id @default(autoincrement())
  productId Int
  specKey   String
  specValue String

  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_specs")
}

// ─── Cart ────────────────────────────────────────────────────────
model Cart {
  id        Int        @id @default(autoincrement())
  userId    Int        @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  user      User       @relation(fields: [userId], references: [id])
  items     CartItem[]

  @@map("carts")
}

model CartItem {
  id        Int     @id @default(autoincrement())
  cartId    Int
  productId Int
  quantity  Int     @default(1)

  cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])

  @@unique([cartId, productId])
  @@map("cart_items")
}

// ─── Orders ──────────────────────────────────────────────────────
model Order {
  id           Int         @id @default(autoincrement())
  userId       Int
  addressId    Int
  status       OrderStatus @default(PENDING)
  subtotal     Decimal     @db.Decimal(10, 2)
  tax          Decimal     @db.Decimal(10, 2)
  shippingCost Decimal     @db.Decimal(10, 2) @default(0)
  total        Decimal     @db.Decimal(10, 2)
  placedAt     DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  user         User        @relation(fields: [userId], references: [id])
  address      Address     @relation(fields: [addressId], references: [id])
  items        OrderItem[]

  @@map("orders")
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  productId Int
  quantity  Int
  price     Decimal @db.Decimal(10, 2)  // price at time of order

  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

// ─── Wishlist [BONUS] ─────────────────────────────────────────────
model Wishlist {
  id        Int     @id @default(autoincrement())
  userId    Int
  productId Int

  user      User    @relation(fields: [userId], references: [id])
  product   Product @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
  @@map("wishlists")
}
```

### Schema Design Decisions (for interview)

| Decision | Reason |
|----------|--------|
| `price` + `mrp` both stored | Enables real-time discount % calculation |
| `CartItem` unique on `[cartId, productId]` | Prevents duplicate cart entries |
| `OrderItem.price` snapshot | Preserves price at time of purchase |
| `Address` as separate table | Reusable across multiple orders |
| Cascade deletes on images/specs | Clean product removal |
| `slug` on Product & Category | SEO-friendly URL routing |

---

## 🗺️ Phase-Wise Roadmap <a name="phases"></a>

> Total timeline: **2 days** (48 hours)

---

### ⚙️ Phase 0 — Project Setup & Configuration (2–3 hrs) <a name="phase-0"></a>

**Goal:** Working dev environment, both servers running.

#### Steps

```bash
# 1. Create monorepo structure
mkdir flipkart-clone && cd flipkart-clone
git init
echo "node_modules/\n.env\ndist/" > .gitignore

# 2. Backend setup
mkdir backend && cd backend
npm init -y
npm install express prisma @prisma/client cors helmet morgan dotenv
npm install -D nodemon

npx prisma init  # creates prisma/schema.prisma + .env

# 3. Frontend setup (from root)
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom @reduxjs/toolkit react-redux
npm install @tanstack/react-query
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Checklist
- [ ] Repo initialized with `.gitignore`
- [ ] Backend server runs on `localhost:5000`
- [ ] Frontend dev server runs on `localhost:5173`
- [ ] PostgreSQL database created and connected
- [ ] Prisma schema pushed: `npx prisma db push`
- [ ] Tailwind configured in `frontend/src/styles/index.css`

---

### 🔧 Phase 1 — Backend: API Development (8–10 hrs) <a name="phase-1"></a>

**Goal:** All REST endpoints working, DB seeded with sample data.

#### Step 1.1 — Express App Setup

**`src/app.js`**
```js
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const routes  = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1', routes);
app.use(errorHandler);   // must be last

module.exports = app;
```

**`src/server.js`**
```js
const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

#### Step 1.2 — Utility Classes

**`src/utils/ApiResponse.js`**
```js
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.success    = statusCode < 400;
    this.message    = message;
    this.data       = data;
  }
}
module.exports = ApiResponse;
```

**`src/utils/ApiError.js`**
```js
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors     = errors;
  }
}
module.exports = ApiError;
```

#### Step 1.3 — Product Controller

**`src/controllers/product.controller.js`**
```js
const prisma = require('../config/db');
const ApiResponse = require('../utils/ApiResponse');
const ApiError    = require('../utils/ApiError');

// GET /api/v1/products
const getAllProducts = async (req, res, next) => {
  try {
    const { search, categoryId, page = 1, limit = 20, sort = 'createdAt' } = req.query;

    const where = {
      ...(search     && { name: { contains: search, mode: 'insensitive' } }),
      ...(categoryId && { categoryId: parseInt(categoryId) }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { [sort]: 'desc' },
        include: {
          category: true,
          images: { where: { isPrimary: true }, take: 1 },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json(new ApiResponse(200, {
      products,
      pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) }
    }));
  } catch (err) { next(err); }
};

// GET /api/v1/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true, images: true, specs: true },
    });
    if (!product) throw new ApiError(404, 'Product not found');
    res.json(new ApiResponse(200, product));
  } catch (err) { next(err); }
};

module.exports = { getAllProducts, getProductById };
```

#### Step 1.4 — Cart Controller (core logic)

**`src/controllers/cart.controller.js`**
```js
const prisma = require('../config/db');
const ApiResponse = require('../utils/ApiResponse');
const ApiError    = require('../utils/ApiError');
const DEFAULT_USER_ID = 1;  // Assumed logged-in user

const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } } }
  });
  if (!cart) cart = await prisma.cart.create({ data: { userId }, include: { items: true } });
  return cart;
};

// GET /api/v1/cart
const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(DEFAULT_USER_ID);
    res.json(new ApiResponse(200, cart));
  } catch (err) { next(err); }
};

// POST /api/v1/cart/items  { productId, quantity }
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const cart = await getOrCreateCart(DEFAULT_USER_ID);

    const existing = cart.items.find(i => i.productId === productId);
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
    }

    const updated = await getOrCreateCart(DEFAULT_USER_ID);
    res.json(new ApiResponse(200, updated, 'Item added to cart'));
  } catch (err) { next(err); }
};

// PUT /api/v1/cart/items/:itemId  { quantity }
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) throw new ApiError(400, 'Quantity must be at least 1');
    await prisma.cartItem.update({ where: { id: parseInt(req.params.itemId) }, data: { quantity } });
    const cart = await getOrCreateCart(DEFAULT_USER_ID);
    res.json(new ApiResponse(200, cart));
  } catch (err) { next(err); }
};

// DELETE /api/v1/cart/items/:itemId
const removeCartItem = async (req, res, next) => {
  try {
    await prisma.cartItem.delete({ where: { id: parseInt(req.params.itemId) } });
    const cart = await getOrCreateCart(DEFAULT_USER_ID);
    res.json(new ApiResponse(200, cart, 'Item removed'));
  } catch (err) { next(err); }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
```

#### Step 1.5 — Order Controller

**`src/controllers/order.controller.js`**
```js
const prisma = require('../config/db');
const ApiResponse = require('../utils/ApiResponse');
const ApiError    = require('../utils/ApiError');
const DEFAULT_USER_ID = 1;

// POST /api/v1/orders  { address: {...} }
const placeOrder = async (req, res, next) => {
  try {
    const { address } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId: DEFAULT_USER_ID },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0)
      throw new ApiError(400, 'Cart is empty');

    // Create address
    const savedAddress = await prisma.address.create({
      data: { userId: DEFAULT_USER_ID, ...address }
    });

    // Calculate totals
    const subtotal = cart.items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
    const tax      = parseFloat((subtotal * 0.18).toFixed(2));
    const total    = parseFloat((subtotal + tax).toFixed(2));

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: DEFAULT_USER_ID,
        addressId: savedAddress.id,
        subtotal,
        tax,
        total,
        status: 'CONFIRMED',
        items: {
          create: cart.items.map(i => ({
            productId: i.productId,
            quantity:  i.quantity,
            price:     i.product.price,
          }))
        }
      },
      include: { items: { include: { product: true } }, address: true }
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.status(201).json(new ApiResponse(201, order, 'Order placed successfully'));
  } catch (err) { next(err); }
};

// GET /api/v1/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { items: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } }, address: true }
    });
    if (!order) throw new ApiError(404, 'Order not found');
    res.json(new ApiResponse(200, order));
  } catch (err) { next(err); }
};

// GET /api/v1/orders  (order history)
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { placedAt: 'desc' },
      include: { items: { include: { product: true } }, address: true }
    });
    res.json(new ApiResponse(200, orders));
  } catch (err) { next(err); }
};

module.exports = { placeOrder, getOrderById, getUserOrders };
```

#### Step 1.6 — Seed Database

**`prisma/seed.js`**
```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Default user (no login required)
  const user = await prisma.user.upsert({
    where: { email: 'default@flipkart.com' },
    update: {},
    create: { name: 'Default User', email: 'default@flipkart.com' }
  });

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'electronics' }, update: {}, create: { name: 'Electronics', slug: 'electronics', imageUrl: 'https://...' } }),
    prisma.category.upsert({ where: { slug: 'fashion' },     update: {}, create: { name: 'Fashion',     slug: 'fashion',     imageUrl: 'https://...' } }),
    prisma.category.upsert({ where: { slug: 'home' },        update: {}, create: { name: 'Home & Kitchen', slug: 'home',     imageUrl: 'https://...' } }),
    prisma.category.upsert({ where: { slug: 'books' },       update: {}, create: { name: 'Books',        slug: 'books',       imageUrl: 'https://...' } }),
    prisma.category.upsert({ where: { slug: 'sports' },      update: {}, create: { name: 'Sports',       slug: 'sports',      imageUrl: 'https://...' } }),
  ]);

  // Sample products (add 20+ across categories)
  const sampleProducts = [
    {
      name: 'Samsung Galaxy S24', slug: 'samsung-galaxy-s24',
      description: 'Latest Samsung flagship smartphone with AI features.',
      price: 74999, mrp: 89999, stock: 50, brand: 'Samsung',
      rating: 4.5, reviewCount: 1240, categoryId: categories[0].id, isFeatured: true,
      images: [
        { url: 'https://picsum.photos/seed/s24/600/600', isPrimary: true, altText: 'Samsung Galaxy S24' },
        { url: 'https://picsum.photos/seed/s24b/600/600', isPrimary: false }
      ],
      specs: [
        { specKey: 'Display', specValue: '6.2" Dynamic AMOLED 2X' },
        { specKey: 'Processor', specValue: 'Snapdragon 8 Gen 3' },
        { specKey: 'RAM', specValue: '8 GB' },
        { specKey: 'Storage', specValue: '256 GB' },
        { specKey: 'Battery', specValue: '4000 mAh' },
      ]
    },
    // ... add 20+ more products
  ];

  for (const p of sampleProducts) {
    const { images, specs, ...productData } = p;
    await prisma.product.create({
      data: {
        ...productData,
        images: { create: images },
        specs:  { create: specs  }
      }
    });
  }

  console.log('✅ Database seeded successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

Add to `package.json`:
```json
"prisma": { "seed": "node prisma/seed.js" }
```

Run: `npx prisma db seed`

---

### 🎨 Phase 2 — Frontend: Foundation & Routing (3–4 hrs) <a name="phase-2"></a>

**Goal:** React app skeleton with routing, Redux store, and API service layer.

#### Step 2.1 — Router Setup (`App.jsx`)

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import Layout from './components/layout/Layout';
import HomePage          from './pages/HomePage';
import ProductListPage   from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage          from './pages/CartPage';
import CheckoutPage      from './pages/CheckoutPage';
import OrderSuccessPage  from './pages/OrderSuccessPage';
import NotFoundPage      from './pages/NotFoundPage';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,              element: <HomePage /> },
      { path: 'products',        element: <ProductListPage /> },
      { path: 'products/:id',    element: <ProductDetailPage /> },
      { path: 'cart',            element: <CartPage /> },
      { path: 'checkout',        element: <CheckoutPage /> },
      { path: 'order-success/:orderId', element: <OrderSuccessPage /> },
      { path: '*',               element: <NotFoundPage /> },
    ]
  }
]);

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  );
}
```

#### Step 2.2 — Axios API Service (`services/api.js`)

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  res  => res.data,
  err  => Promise.reject(err.response?.data || err)
);

export default api;
```

#### Step 2.3 — Redux Cart Slice (`store/slices/cartSlice.js`)

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

export const fetchCart     = createAsyncThunk('cart/fetch',  cartService.getCart);
export const addItem       = createAsyncThunk('cart/add',    cartService.addToCart);
export const updateItem    = createAsyncThunk('cart/update', cartService.updateItem);
export const removeItem    = createAsyncThunk('cart/remove', cartService.removeItem);

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    const setCart = (state, action) => {
      state.items   = action.payload.data.items;
      state.loading = false;
    };
    builder
      .addCase(fetchCart.fulfilled,  setCart)
      .addCase(addItem.fulfilled,    setCart)
      .addCase(updateItem.fulfilled, setCart)
      .addCase(removeItem.fulfilled, setCart)
      .addMatcher(action => action.type.endsWith('/pending'),
        state => { state.loading = true; })
      .addMatcher(action => action.type.endsWith('/rejected'),
        (state, action) => { state.loading = false; state.error = action.error.message; });
  }
});

export const selectCartItems     = state => state.cart.items;
export const selectCartItemCount = state => state.cart.items.reduce((s, i) => s + i.quantity, 0);
export const selectCartTotal     = state => state.cart.items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);

export default cartSlice.reducer;
```

#### Step 2.4 — Flipkart CSS Variables (`styles/flipkart.css`)

```css
:root {
  --fk-blue:       #2874f0;   /* Primary brand blue */
  --fk-blue-dark:  #1a60d0;
  --fk-yellow:     #ff9f00;   /* CTA / Buy Now */
  --fk-orange:     #fb641b;   /* Add to Cart */
  --fk-green:      #388e3c;   /* In Stock */
  --fk-red:        #ff6161;   /* Out of Stock / Discount */
  --fk-gray-bg:    #f1f3f6;   /* Page background */
  --fk-white:      #ffffff;
  --fk-text:       #212121;
  --fk-text-light: #878787;
  --fk-border:     #e0e0e0;
  --fk-nav-height: 56px;
}
```

---

### 🚀 Phase 3 — Core Features Implementation (15–18 hrs) <a name="phase-3"></a>

**Goal:** All 4 core features from the PDF working end-to-end.

#### Feature 1: Product Listing Page

**Components to build:**
- `Navbar.jsx` — search bar, cart icon with count badge, Flipkart logo
- `FilterPanel.jsx` — category checkboxes, price range slider
- `ProductCard.jsx` — image, name, rating stars, price with MRP strikethrough, discount %
- `ProductGrid.jsx` — responsive CSS grid (2 cols mobile → 4 cols desktop)
- `ProductSkeleton.jsx` — 8 skeleton cards during loading

**Key Implementation:**
```jsx
// ProductCard.jsx — Flipkart-style card
function ProductCard({ product }) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const primaryImage = product.images?.[0]?.url;

  return (
    <Link to={`/products/${product.id}`}
      className="bg-white border border-[var(--fk-border)] rounded p-3 hover:shadow-lg
                 transition-shadow cursor-pointer group block">
      <div className="aspect-square overflow-hidden mb-3">
        <img src={primaryImage} alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
      </div>
      <h3 className="text-sm font-medium text-[var(--fk-text)] line-clamp-2 mb-1">{product.name}</h3>
      <StarRating rating={product.rating} count={product.reviewCount} />
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-lg font-semibold">₹{product.price.toLocaleString('en-IN')}</span>
        <span className="text-sm text-[var(--fk-text-light)] line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
        <span className="text-sm text-[var(--fk-green)] font-medium">{discount}% off</span>
      </div>
    </Link>
  );
}
```

**Search with Debounce:**
```jsx
// hooks/useDebounce.js
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// In ProductListPage.jsx
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search);
const { data } = useProducts({ search: debouncedSearch, categoryId });
```

---

#### Feature 2: Product Detail Page

**Components to build:**
- `ImageCarousel.jsx` — thumbnail strip + main image, click to switch
- `PriceDisplay.jsx` — MRP crossed, price, discount badge
- `SpecTable.jsx` — two-column key-value table
- Add to Cart & Buy Now buttons

```jsx
// ImageCarousel.jsx
function ImageCarousel({ images }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex gap-3">
      <div className="flex flex-col gap-2 w-16">
        {images.map((img, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`border-2 rounded p-1 ${active === i ? 'border-[var(--fk-blue)]' : 'border-transparent'}`}>
            <img src={img.url} alt={img.altText} className="w-full aspect-square object-contain" />
          </button>
        ))}
      </div>
      <div className="flex-1 aspect-square border rounded flex items-center justify-center">
        <img src={images[active]?.url} alt="Product" className="max-h-full object-contain" />
      </div>
    </div>
  );
}
```

---

#### Feature 3: Shopping Cart Page

**Layout:** Two-column on desktop (items left, summary right), stacked on mobile.

```jsx
// CartPage.jsx structure
function CartPage() {
  const cartItems = useSelector(selectCartItems);
  const total     = useSelector(selectCartTotal);

  if (cartItems.length === 0) return <EmptyState message="Your cart is empty" />;

  return (
    <div className="bg-[var(--fk-gray-bg)] min-h-screen py-4">
      <div className="max-w-5xl mx-auto px-4 flex flex-col lg:flex-row gap-4">
        {/* Items list */}
        <div className="flex-1 space-y-3">
          {cartItems.map(item => <CartItem key={item.id} item={item} />)}
          <button onClick={() => navigate('/checkout')}
            className="w-full bg-[var(--fk-orange)] hover:bg-orange-600 text-white
                       font-semibold py-3 rounded transition-colors">
            PLACE ORDER
          </button>
        </div>
        {/* Summary panel */}
        <CartSummary total={total} itemCount={cartItems.length} />
      </div>
    </div>
  );
}
```

---

#### Feature 4: Order Placement & Confirmation

**CheckoutPage flow:**
1. `AddressForm.jsx` — name, phone, address, city, state, pincode
2. `OrderSummary.jsx` — read-only cart review
3. Place Order → API call → redirect to `/order-success/:orderId`

```jsx
// AddressForm.jsx validation
const validate = (data) => {
  const errors = {};
  if (!data.name.trim())              errors.name    = 'Name is required';
  if (!/^\d{10}$/.test(data.phone))  errors.phone   = 'Enter valid 10-digit phone';
  if (!data.line1.trim())             errors.line1   = 'Address is required';
  if (!data.city.trim())              errors.city    = 'City is required';
  if (!/^\d{6}$/.test(data.pincode)) errors.pincode = 'Enter valid 6-digit pincode';
  return errors;
};
```

**OrderSuccessPage:**
```jsx
function OrderSuccessPage() {
  const { orderId } = useParams();
  const { data: order } = useOrder(orderId);

  return (
    <div className="min-h-screen bg-[var(--fk-gray-bg)] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-[var(--fk-text)] mb-2">Order Confirmed!</h1>
        <p className="text-[var(--fk-text-light)] mb-4">Order ID: <strong>#{orderId}</strong></p>
        <Link to="/products" className="bg-[var(--fk-blue)] text-white px-6 py-2 rounded">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
```

---

### ✨ Phase 4 — Bonus Features (4–6 hrs) <a name="phase-4"></a>

**Goal:** Implement good-to-have features to maximise evaluation score.

| Feature | Implementation Notes |
|---------|---------------------|
| **Responsive Design** | Tailwind breakpoints: `sm:` tablet, `lg:` desktop. Test grid: 1→2→3→4 cols |
| **User Authentication** | JWT tokens, `auth.middleware.js`, protected routes in React |
| **Order History** | `GET /api/v1/orders` → `OrderHistoryPage.jsx` with status badges |
| **Wishlist** | Heart icon on `ProductCard`, `wishlistSlice` in Redux, `WishlistPage` |
| **Email Notification** | Nodemailer on order placement, HTML email template |

#### Responsive Grid Example

```jsx
// ProductGrid.jsx
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</div>
```

#### Navbar Responsive

```jsx
// Mobile: hamburger menu   Tablet+: full nav links
<nav className="hidden md:flex items-center gap-6">...</nav>
<button className="md:hidden" onClick={toggleMenu}>☰</button>
```

---

### 🚢 Phase 5 — Polish, Testing & Deployment (3–4 hrs) <a name="phase-5"></a>

**Goal:** Production-ready, deployed, documented.

#### Code Quality Checklist
- [ ] All API calls wrapped in try/catch
- [ ] Loading states on all async operations (spinners / skeletons)
- [ ] Error boundaries around major page sections
- [ ] Form validation with user-friendly error messages
- [ ] Empty states for cart / wishlist / search results
- [ ] 404 page for unknown routes
- [ ] Console logs removed / replaced with proper logging

#### Performance Checklist
- [ ] React Query caching configured (staleTime, cacheTime)
- [ ] Images use `loading="lazy"` attribute
- [ ] Debounced search input (400ms)
- [ ] Pagination on product list (not infinite scroll of 1000 items)

---

## 📡 API Endpoints Reference <a name="api-endpoints"></a>

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/v1/products` | List products (search, filter, paginate) |
| `GET`  | `/api/v1/products/:id` | Single product with images + specs |

**Query params for GET /products:**
- `search` — text search on name
- `categoryId` — filter by category
- `page` — default 1
- `limit` — default 20
- `sort` — `price`, `rating`, `createdAt`

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/v1/categories` | All categories |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/api/v1/cart` | Get current cart |
| `POST`   | `/api/v1/cart/items` | Add item `{ productId, quantity }` |
| `PUT`    | `/api/v1/cart/items/:itemId` | Update quantity `{ quantity }` |
| `DELETE` | `/api/v1/cart/items/:itemId` | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/orders` | Place order `{ address: {...} }` |
| `GET`  | `/api/v1/orders` | Order history |
| `GET`  | `/api/v1/orders/:id` | Single order detail |

### Wishlist [BONUS]
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/api/v1/wishlist` | Get wishlist |
| `POST`   | `/api/v1/wishlist` | Add `{ productId }` |
| `DELETE` | `/api/v1/wishlist/:productId` | Remove item |

---

## 🔑 Environment Variables <a name="env-variables"></a>

**`backend/.env.example`**
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/flipkart_db"
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**`frontend/.env.example`**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🚀 Deployment Guide <a name="deployment"></a>

### Backend → Render.com

1. Push to GitHub
2. New Web Service on Render → connect repo
3. **Build command:** `cd backend && npm install && npx prisma generate && npx prisma db push && node prisma/seed.js`
4. **Start command:** `cd backend && node src/server.js`
5. Add all env vars in Render dashboard
6. Use Render's free PostgreSQL instance or Neon.tech

### Frontend → Vercel

1. Import GitHub repo on Vercel
2. Set **Root Directory** to `frontend`
3. Add env var: `VITE_API_URL=https://your-backend.onrender.com/api/v1`
4. Deploy

---

## 📝 README Template <a name="readme-template"></a>

```markdown
# Flipkart Clone — SDE Intern Assignment

Live Demo: [https://your-app.vercel.app](https://your-app.vercel.app)
API: [https://your-backend.onrender.com](https://your-backend.onrender.com)

## Tech Stack
- **Frontend**: React.js 18 + Vite + Redux Toolkit + React Query + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Prisma ORM

## Features Implemented
### Core (Required)
- [x] Product Listing with search + category filter
- [x] Product Detail Page with image carousel + specifications
- [x] Shopping Cart (add, update quantity, remove)
- [x] Order Placement with address form + confirmation page

### Bonus
- [x] Responsive design (mobile, tablet, desktop)
- [x] Order history
- [x] Wishlist
- [ ] User authentication (in progress)

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend
git clone https://github.com/your-username/flipkart-clone
cd flipkart-clone/backend
cp .env.example .env
# Fill in DATABASE_URL in .env
npm install
npx prisma db push
npx prisma db seed
npm run dev

### Frontend
cd ../frontend
cp .env.example .env
npm install
npm run dev

Open http://localhost:5173

## Database Schema
See `backend/prisma/schema.prisma` for full schema.
Key tables: users, categories, products, product_images,
product_specs, carts, cart_items, orders, order_items, wishlists

## Assumptions
- Default user (ID: 1) is pre-seeded — no login required for core features
- 18% GST applied on all orders
- Free shipping on all orders
- Product images hosted on Cloudinary / Picsum for demo
```

---

## ⏱️ Time Allocation Summary

| Phase | Task | Time |
|-------|------|------|
| Phase 0 | Setup & config | 2–3 hrs |
| Phase 1 | Backend + all APIs + seed | 8–10 hrs |
| Phase 2 | Frontend foundation + routing | 3–4 hrs |
| Phase 3 | Core features (4 features) | 15–18 hrs |
| Phase 4 | Bonus features | 4–6 hrs |
| Phase 5 | Polish + deploy + README | 3–4 hrs |
| **Total** | | **~40–45 hrs** |

> 💡 **Priority order if time is tight:** Phase 0 → Phase 1 → Phase 3 (features 1–4) → Phase 5 (deploy) → Phase 2 polish → Phase 4 bonus.

---

*Built for the Flipkart Clone SDE Intern Fullstack Assignment.*
