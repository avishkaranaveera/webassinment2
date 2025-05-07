import React, { useState } from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { useCart } from '../../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/authService';

const convertToLKR = (amount, currency) => {
  const rates = {
    USD: 300,
    EUR: 325,
    GBP: 380,
    INR: 3.6,
    LKR: 1,
  };
  const rate = rates[currency] || 1;
  return Math.round(amount * rate);
};

function BookCard({ book }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const price = book.saleInfo?.listPrice?.amount || 1000; // Default price: 1000 LKR
  const currency = book.saleInfo?.listPrice?.currencyCode || 'LKR';
  const lkrPrice = convertToLKR(price, currency);

  const handleAddToCart = async () => {
    const token = authService.getCurrentUserToken();
    if (!token) {
      setError('Please log in to add items to your cart.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      await addToCart({ ...book, lkrPrice }, navigate);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to add to cart.');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{book.title}</Typography>
        <Typography variant="body2">{book.author || book.volumeInfo?.authors?.join(', ') || 'Unknown'}</Typography>
        <Typography variant="body2">Price: Rs {lkrPrice}</Typography>
        {error && <Typography color="error">{error}</Typography>}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleAddToCart}>Add to Cart</Button>
      </CardActions>
    </Card>
  );
}

export default BookCard;