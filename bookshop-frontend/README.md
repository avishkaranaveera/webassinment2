# 📚 Online Bookshop System (React + Node.js + MySQL)

The Bookshop application is an e-commerce platform for browsing, purchasing, and managing book orders. It features a React frontend with Material-UI for the user interface and a Node.js/Express backend with MySQL for data storage. Users can sign up, log in, browse books (via the Google Books API), add items to a cart, checkout, view order history, and download invoices.
Features
--------------------
## 🚀 Features

- 🔐 User Authentication: Sign up and log in with JWT-based authentication.
- 🔎 Book Browsing: Search and filter books using the Google Books API.
- 📚 Create, update, delete, and view book records
- 🛒 Cart Management: Add, update, and remove items from the cart.
- ✅ Checkout: Place orders with shipping and payment details, generate PDF invoices.
- 📦 Order History: View past orders and download invoices.
- 🛡 Middleware for error handling and authentication


Prerequisites

-*Node.js: v16 or higher
-*MySQL: v8 or higher
-*npm: Comes with Node.js
-*Git: For cloning the repository
-*Browser: Modern browser (e.g., Chrome, Firefox) for the frontend

--------------------

## ⚙ Technologies Used

- *Frontend:* React.js, Material-UI, Axios
- *Backend:* Node.js, Express.js, bcryptjs, JWT
- *Database:* MySQL
- *External API:* Google Books API
- *Session/Auth:* JWT with HTTP-only cookies

--------------------


## 📁 Project Structure

bookshop/
├── backend/                    # Node.js/Express backend
│   ├── config/                 # Database configuration
│   ├── controllers/            # API logic (auth, cart, checkout)
│   ├── middleware/             # Authentication middleware
│   ├── models/                 # Database models (e.g., Cart)
│   ├── routes/                 # API routes
│   ├── .env                    # Environment variables
│   ├── index.js                # Backend entry point
│   └── package.json            # Backend dependencies
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React Context for auth and cart
│   │   ├── pages/              # Page components (Home, Cart, etc.)
│   │   ├── service/            # API service files
│   │   ├── App.js              # Frontend entry point
│   │   └── index.js            # React DOM rendering
│   ├── public/                 # Static assets
│   └── package.json            # Frontend dependencies
└── README.md                   # This file

--------------------


## 📌 Setup Instructions

1. Clone the Repository
git clone <repository-url>
cd bookshop

### 📦 Backend Setup

1. - Navigate to the backend directory:
2. - cd backend

3. - Install dependencies:
npm install


4. - Set up environment variables:Create a .env file in the backend/ directory with the following:
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_DATABASE=bookshop_auth
    JWT_SECRET=your_very_strong_secret_key_here
    PORT=3001


=> Replace your_mysql_password with your MySQL root password.
=> Replace your_very_strong_secret_key_here with a secure random string.


5. - Set up MySQL database:

=> Ensure MySQL is running.
=> Create a database named bookshop_auth:CREATE DATABASE bookshop_auth;


6. - Run the following SQL to create required tables (save as schema.sql and import using mysql -u root -p bookshop_auth < schema.sql):CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    bookId VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    authors TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE shipping_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    addressLine1 VARCHAR(255) NOT NULL,
    addressLine2 VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    postalCode VARCHAR(50) NOT NULL,
    country VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    shippingAddressId INT NOT NULL,
    paymentMethod ENUM('CREDIT_CARD', 'PAYPAL', 'CASH_ON_DELIVERY') NOT NULL,
    totalAmount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (shippingAddressId) REFERENCES shipping_addresses(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    bookId VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    authors TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id)
);

CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    invoiceNumber VARCHAR(255) NOT NULL,
    pdfData BLOB NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id)
);

CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value VARCHAR(255) NOT NULL
);



7. - Start the backend:
8. - npm start


==> The server runs on http://localhost:3001.
==> Use npm run dev for development with auto-reloading (requires nodemon).

--------------------

### 🌐 Frontend Setup


1. - Navigate to the frontend directory:
2. - cd frontend

3.- Install dependencies:
npm install

4. - Start the frontend:
npm start

==> The React app runs on http://localhost:3000 and proxies API requests to http://localhost:3001 (configured in package.json).

--------------------


## 🔌 API Endpoints Overview


- 🔐 Authentication:
-- > POST /api/auth/signup: Register a new user.
-- > POST /api/auth/login: Log in and receive a JWT token.


- ✅ Profile:
-- > GET /api/profile: Get user profile (requires JWT).


- 🛒 Cart:
-- > POST /api/cart/add: Add book to cart.
-- > GET /api/cart: List cart items.
-- > DELETE /api/cart/:id: Remove cart item.
-- > PUT /api/cart/:id: Update item quantity.


- ✅ Checkout:
--> POST /api/checkout: Place an order.
--> GET /api/checkout/orders: List user orders.
--> GET /api/checkout/invoices/:orderId: Download invoice PDF.
--> POST /api/checkout/settings: Toggle checkout (admin-only).



🔎 External APIs

-- > Google Books API: Used to fetch book data (https://www.googleapis.com/books/v1/volumes).
-- > No API key required for basic usage, but consider adding one for production.


## ✅ Author
Avishka Ranaveera


