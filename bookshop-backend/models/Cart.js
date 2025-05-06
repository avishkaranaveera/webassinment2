// models/Cart.js
const pool = require('../config/db');

const Cart = {
  async findOne({ userId, bookId }) {
    const [rows] = await pool.query(
      'SELECT * FROM cart WHERE userId = ? AND bookId = ? LIMIT 1',
      [userId, bookId]
    );
    return rows[0] || null;
  },

  async create({ userId, bookId, title, authors, price, quantity }) {
    const [result] = await pool.query(
      'INSERT INTO cart (userId, bookId, title, authors, price, quantity) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, bookId, title, authors, price, quantity]
    );
    return { id: result.insertId, userId, bookId, title, authors, price, quantity };
  },

  async updateQuantity({ userId, bookId, newQuantity }) {
    await pool.query(
      'UPDATE cart SET quantity = ? WHERE userId = ? AND bookId = ?',
      [newQuantity, userId, bookId]
    );
  }
};

module.exports = Cart;
