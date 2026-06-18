# 🍫 ChocoBits — Premium Artisan Chocolate E-Commerce

A full-stack MERN e-commerce platform for a premium chocolate store, featuring JWT authentication, Redux Toolkit, Bootstrap 5, and a complete admin dashboard.

---

## 📁 Project Structure

```
chocobits/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Profile, Wishlist
│   │   ├── productController.js   # CRUD + Reviews
│   │   ├── orderController.js     # Orders + Stats
│   │   ├── categoryController.js  # Category CRUD
│   │   └── userController.js      # Admin user management
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect + admin guard
│   │   └── errorMiddleware.js     # Global error handler
│   ├── models/
│   │   ├── userModel.js           # User schema (bcrypt)
│   │   ├── productModel.js        # Product + Reviews schema
│   │   ├── categoryModel.js       # Category schema
│   │   └── orderModel.js          # Order schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── generateToken.js       # JWT generator
│   │   └── seeder.js              # Sample data seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── admin/
        │   │   └── AdminSidebar.js
        │   ├── common/
        │   │   ├── AdminRoute.js
        │   │   ├── Loader.js
        │   │   ├── PrivateRoute.js
        │   │   ├── ProductCard.js
        │   │   └── StarRating.js
        │   └── layout/
        │       ├── Footer.js
        │       └── Navbar.js
        ├── pages/
        │   ├── admin/
        │   │   ├── AdminDashboard.js
        │   │   ├── AdminOrders.js
        │   │   ├── AdminProductForm.js
        │   │   ├── AdminProducts.js
        │   │   └── AdminUsers.js
        │   ├── auth/
        │   │   ├── LoginPage.js
        │   │   └── RegisterPage.js
        │   ├── user/
        │   │   ├── OrderDetailPage.js
        │   │   ├── OrderHistoryPage.js
        │   │   └── ProfilePage.js
        │   ├── AboutPage.js
        │   ├── CartPage.js
        │   ├── CheckoutPage.js
        │   ├── ContactPage.js
        │   ├── HomePage.js
        │   ├── ProductDetailPage.js
        │   ├── ProductsPage.js
        │   └── WishlistPage.js
        ├── redux/
        │   ├── slices/
        │   │   ├── authSlice.js
        │   │   ├── cartSlice.js
        │   │   └── wishlistSlice.js
        │   └── store.js
        ├── utils/
        │   └── api.js             # Axios instance with auth interceptor
        ├── App.js
        ├── index.css              # Global chocolate-themed CSS
        └── index.js
```

---

## ⚙️ Environment Setup

### Backend `.env`
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/chocobits
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Running

### Prerequisites
- Node.js v16+ and npm
- MongoDB (local or Atlas cloud)

### Step 1 — Clone & Install
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Step 2 — Configure Environment
```bash
# Copy env files and fill in your values
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Step 3 — Seed the Database
```bash
cd backend && npm run seed
```
This creates:
- **Admin:** admin@chocobits.com / admin123
- **User:** user@chocobits.com / user123
- 5 categories + 12 sample products

### Step 4 — Run Development Servers
```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm start
```

Or from root (requires concurrently):
```bash
npm install && npm run dev
```

Open: **http://localhost:3000**

---

## 🔐 API Endpoints

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/profile | Private |
| PUT | /api/auth/profile | Private |
| POST | /api/auth/wishlist/:id | Private |
| GET | /api/auth/wishlist | Private |

### Products
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/products | Public |
| GET | /api/products/:id | Public |
| POST | /api/products | Admin |
| PUT | /api/products/:id | Admin |
| DELETE | /api/products/:id | Admin |
| POST | /api/products/:id/reviews | Private |

### Orders
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/orders | Private |
| GET | /api/orders/myorders | Private |
| GET | /api/orders/:id | Private |
| GET | /api/orders | Admin |
| GET | /api/orders/stats | Admin |
| PUT | /api/orders/:id/status | Admin |

### Categories
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/categories | Public |
| POST | /api/categories | Admin |
| PUT | /api/categories/:id | Admin |
| DELETE | /api/categories/:id | Admin |

### Users (Admin)
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/users | Admin |
| GET | /api/users/:id | Admin |
| PUT | /api/users/:id | Admin |
| DELETE | /api/users/:id | Admin |

---

## 🎨 Pages Overview

| Page | Route | Auth |
|------|-------|------|
| Home | / | Public |
| Shop | /products | Public |
| Product Detail | /products/:id | Public |
| About | /about | Public |
| Contact | /contact | Public |
| Cart | /cart | Public |
| Login | /login | Public |
| Register | /register | Public |
| Wishlist | /wishlist | Private |
| Checkout | /checkout | Private |
| Profile | /profile | Private |
| Order History | /orders | Private |
| Order Detail | /orders/:id | Private |
| Admin Dashboard | /admin/dashboard | Admin |
| Admin Products | /admin/products | Admin |
| Add/Edit Product | /admin/products/new | Admin |
| Admin Orders | /admin/orders | Admin |
| Admin Users | /admin/users | Admin |

---

## 🎨 Design System

- **Font:** Playfair Display (headings) + Lato (body)
- **Primary:** `#3B1A08` (dark chocolate)
- **Accent:** `#C68642` (caramel gold)
- **Background:** `#FFF8F0` (cream)
- **Breakpoints:** Bootstrap 5 (xs/sm/md/lg/xl)

---

## ☁️ Deployment

### Backend (Railway / Render / Heroku)
1. Set all env vars in the platform dashboard
2. Set `MONGO_URI` to your MongoDB Atlas connection string
3. Deploy from root of `backend/` folder

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Set build command: `npm run build`
3. Set output dir: `build`

### MongoDB Atlas (Free Tier)
1. Create cluster at mongodb.com/atlas
2. Create database user
3. Whitelist `0.0.0.0/0` in Network Access
4. Copy connection string to `MONGO_URI`

---

## 🧪 Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@chocobits.com | admin123 |
| User | user@chocobits.com | user123 |

---

## 📦 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, React Router v6 |
| Styling | Bootstrap 5, Custom CSS, Google Fonts |
| HTTP Client | Axios with auth interceptor |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Notifications | React Toastify |
| Icons | React Icons (FontAwesome) |

---

*Made with 🍫 and ❤️ — ChocoBits © 2025*
