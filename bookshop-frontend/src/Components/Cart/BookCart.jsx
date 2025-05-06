import React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { useCart } from '../../Context/CartContext';

function BookCard({ book }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(book);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{book.title}</Typography>
        <Typography variant="body2">{book.author}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleAddToCart}>Add to Cart</Button>
      </CardActions>
    </Card>
  );
}

export default BookCard;
