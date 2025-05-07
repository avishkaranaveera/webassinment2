const pool = require('../config/db');
const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { bookId, title, authors, price, quantity } = req.body;

  try {
    if (!bookId || !title || !price || !quantity) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Add new item to cart (no check for existing item)
    const newItem = await Cart.create({
      userId,
      bookId,
      title,
      authors: authors || 'Unknown',
      price,
      quantity,
    });

    res.status(201).json({ message: 'Item added to cart.', item: newItem });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Failed to add item to cart.' });
  }
};

exports.getCartItems = async (req, res) => {
  const userId = req.user.id;
  try {
    const [items] = await pool.query('SELECT * FROM cart WHERE userId = ?', [userId]);
    res.json(items);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Failed to fetch cart items.' });
  }
};

exports.removeCartItem = async (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;

  try {
    const [result] = await pool.query('DELETE FROM cart WHERE id = ? AND userId = ?', [cartItemId, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }
    res.json({ message: 'Item removed from cart.' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Failed to remove item.' });
  }
};

exports.updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;
  const { quantity } = req.body;

  try {
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity.' });
    }
    const [result] = await pool.query('UPDATE cart SET quantity = ? WHERE id = ? AND userId = ?', [quantity, cartItemId, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }
    res.json({ message: 'Quantity updated.' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Failed to update quantity.' });
  }
};