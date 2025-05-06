const pool = require('../config/db');

// Already defined:
exports.addToCart = async (req, res) => { /* ... */ };

// GET all cart items for a user
exports.getCartItems = async (req, res) => {
  const userId = req.user.id;
  try {
    const [items] = await pool.query('SELECT * FROM cart WHERE userId = ?', [userId]);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart items.' });
  }
};

// DELETE a cart item
exports.removeCartItem = async (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;

  try {
    await pool.query('DELETE FROM cart WHERE id = ? AND userId = ?', [cartItemId, userId]);
    res.json({ message: 'Item removed from cart.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item.' });
  }
};

// PUT (update) item quantity
exports.updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;
  const { quantity } = req.body;

  try {
    await pool.query('UPDATE cart SET quantity = ? WHERE id = ? AND userId = ?', [quantity, cartItemId, userId]);
    res.json({ message: 'Quantity updated.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update quantity.' });
  }
};
