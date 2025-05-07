
# 📚 Online Bookshop System

*A Full-Stack E-Commerce Bookstore App using React, Node.js, and MySQL*

---

## 🚀 Features

* 🔐 **User Authentication** – Sign up and log in using JWT (stored in HTTP-only cookies)
* 🔎 **Book Browsing** – Search and filter books via the Google Books API
* 📚 **CRUD Operations** – Create, update, delete, and view book records (admin)
* 🛒 **Cart Management** – Add, update, and remove items from your cart
* ✅ **Checkout** – Place orders with shipping/payment details and generate PDF invoices
* 📦 **Order History** – View previous orders and download invoices
* 🛡 **Robust Middleware** – Error handling and route protection

---

## ⚙️ Technologies Used

### Frontend

* React.js
* Material-UI
* Axios

### Backend

* Node.js + Express.js
* bcryptjs, JWT
* MySQL

### Other

* Google Books API (external book data)
* PDFKit (for generating invoices)

---

## 📁 Project Structure

```
bookshop/
├── backend/
│   ├── config/             # DB configs
│   ├── controllers/        # Auth, cart, orders, etc.
│   ├── middleware/         # Auth middleware
│   ├── models/             # DB models
│   ├── routes/             # API endpoints
│   ├── .env                # Environment variables
│   ├── index.js            # Entry point
│   └── package.json
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI
│       ├── context/        # Auth & cart context
│       ├── pages/          # Route pages (Home, Cart, etc.)
│       ├── service/        # Axios services
│       ├── App.js
│       └── index.js
└── README.md
```

---

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd bookshop
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

#### 📄 Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=bookshop_auth
JWT_SECRET=your_very_strong_secret_key
PORT=3001
```

#### 🛠 MySQL Setup

* Start MySQL server
* Create the DB:

```sql
CREATE DATABASE bookshop_auth;
```

* Import schema:

```bash
mysql -u root -p bookshop_auth < schema.sql
```

*Sample `schema.sql` tables include: `users`, `cart`, `orders`, `shipping_addresses`, `order_items`, `invoices`, `settings`.*

#### ▶️ Run the Backend

```bash
npm start     # Production
npm run dev   # Development (with nodemon)
```

> App will be available at: `http://localhost:3001`

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

> React App runs at: `http://localhost:3000`
> It proxies API requests to `http://localhost:3001`

---

## 🔌 API Endpoints Overview

### 🔐 Auth

* `POST /api/auth/signup` – Register new user
* `POST /api/auth/login` – Log in and receive JWT

### 👤 Profile

* `GET /api/profile` – Get user profile *(requires JWT)*

### 🛒 Cart

* `POST /api/cart/add` – Add book to cart
* `GET /api/cart` – Get user's cart items
* `PUT /api/cart/:id` – Update quantity
* `DELETE /api/cart/:id` – Remove item

### ✅ Checkout

* `POST /api/checkout` – Place order
* `GET /api/checkout/orders` – List orders
* `GET /api/checkout/invoices/:orderId` – Download invoice PDF
* `POST /api/checkout/settings` – Toggle checkout *(admin)*

---

## 🔍 External API

* **Google Books API:**
  `https://www.googleapis.com/books/v1/volumes`
  *(No API key required for basic use; recommended in production.)*

---

## 👤 Author

**Avishka Ranaveera**

---

Let me know if you'd like me to generate this as a downloadable `README.md` file. Would you like that?
