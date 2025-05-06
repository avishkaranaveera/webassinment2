// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { getCartItems, removeCartItem, updateCartItem } from '../service/cartService'; // Correct import

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await getCartItems(); // Fetch cart items
        setCartItems(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load cart items.');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = async (id) => {
    try {
      await removeCartItem(id); // Remove item from cart
      setCartItems(cartItems.filter(item => item.id !== id)); // Update cart state
    } catch (error) {
      setError('Failed to remove item.');
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    try {
      await updateCartItem(id, quantity); // Update item quantity
      setCartItems(cartItems.map(item => (item.id === id ? { ...item, quantity } : item)));
    } catch (error) {
      setError('Failed to update quantity.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              <p>{item.title}</p>
              <p>Price: ₹{item.price}</p>
              <p>Quantity: 
                <input 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => handleUpdateQuantity(item.id, e.target.value)} 
                  min="1" 
                />
              </p>
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartPage;
