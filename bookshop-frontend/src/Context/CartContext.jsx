import React, { createContext, useState, useContext, useCallback } from 'react';
import { getCartItems, addToCart, removeCartItem, updateCartItem } from '../service/cartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (err) {
      setError('Failed to fetch cart items.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (book) => {
    setLoading(true);
    setError(null);
    try {
      await addToCart(book);
      await fetchCart();
    } catch (err) {
      setError('Failed to add item to cart.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await removeCartItem(id);
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to remove item from cart.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    setLoading(true);
    setError(null);
    try {
      await updateCartItem(id, quantity);
      setCartItems(cartItems.map(item => (item.id === id ? { ...item, quantity } : item)));
    } catch (err) {
      setError('Failed to update cart item quantity.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};