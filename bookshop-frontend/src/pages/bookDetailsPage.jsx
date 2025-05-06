import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { addToCart } from '../service/cartService';  // Importing addToCart from cartService

const convertToINR = (amount, currency) => {
  const rates = {
    USD: 83,
    EUR: 90,
    GBP: 105,
    INR: 1,
  };
  const rate = rates[currency] || 1;
  return Math.round(amount * rate);
};

const BookDetailsPage = () => {
  const { state } = useLocation();
  const book = state?.book;
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  if (!book) return <p>No book data found.</p>;

  const title = book.volumeInfo.title || 'No Title';
  const authors = book.volumeInfo.authors?.join(', ') || 'Unknown';
  const description = book.volumeInfo.description || 'No description';
  const price = book.saleInfo?.listPrice?.amount;
  const currency = book.saleInfo?.listPrice?.currencyCode;
  const inrPrice = price && currency ? convertToINR(price, currency) : null;
  const stock = Math.floor(Math.random() * 10) + 1;
  const thumbnail = book.volumeInfo.imageLinks?.thumbnail;

  const handleAddToCart = async () => {
    if (stock > 0) {
      try {
        await addToCart(book);  // Calls the function from cartService
        navigate('/cart');  // Navigate to the cart page after adding the book
      } catch (error) {
        setError('Failed to add to cart. Please try again.');
      }
    } else {
      setError('Out of stock!');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      {thumbnail && (
        <img
          src={thumbnail}
          alt={title}
          style={{ width: '200px', maxHeight: '300px', objectFit: 'contain', marginBottom: '1rem' }}
        />
      )}
      <h2>{title}</h2>
      <p><strong>Author:</strong> {authors}</p>
      <p><strong>Description:</strong> {description}</p>
      <p><strong>Price:</strong> {inrPrice ? `₹${inrPrice} (original: ${price} ${currency})` : 'Not available'}</p>
      <p><strong>Stock:</strong> {stock > 0 ? `${stock} in stock` : 'Out of stock'}</p>

      {error && <Typography color="error">{error}</Typography>}

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddToCart}
        disabled={stock === 0}
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default BookDetailsPage;
