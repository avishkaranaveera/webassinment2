import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartItems, removeCartItem, updateCartItem } from '../service/cartService';
import { Box, Typography, List, ListItem, ListItemText, Button, TextField, IconButton, Alert, CircularProgress } from '@mui/material';
import { Delete } from '@mui/icons-material';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await getCartItems();
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
      await removeCartItem(id);
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (error) {
      setError('Failed to remove item.');
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    try {
      await updateCartItem(id, quantity);
      setCartItems(cartItems.map(item => (item.id === id ? { ...item, quantity } : item)));
    } catch (error) {
      setError('Failed to update quantity.');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography>Your cart is empty!</Typography>
      ) : (
        <>
          <List>
            {cartItems.map(item => (
              <ListItem key={item.id} divider>
                <ListItemText
                  primary={item.title}
                  secondary={`Price: ₹${item.price} | Quantity:`}
                />
                <TextField
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                  size="small"
                  sx={{ width: 80, mr: 1 }}
                  inputProps={{ min: 1 }}
                />
                <IconButton onClick={() => handleRemoveItem(item.id)}>
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            onClick={handleCheckout}
            sx={{ mt: 2 }}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </Box>
  );
};

export default CartPage;