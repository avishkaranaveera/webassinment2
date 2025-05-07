CREATE DATABASE IF NOT EXISTS bookshop_auth;
USE bookshop_auth;

CREATE TABLE users (
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
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
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
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
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
