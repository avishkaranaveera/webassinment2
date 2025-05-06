import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../service/bookService';
import {
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  InputLabel,
  FormControl,
  Rating,
  CircularProgress,
} from '@mui/material';

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

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('bestsellers');
  const [priceSortOption, setPriceSortOption] = useState('priceAsc');
  const [titleSortOption, setTitleSortOption] = useState('titleAsc');
  const [ratingSortOption, setRatingSortOption] = useState('ratingAsc');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const getBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await fetchBooks(searchQuery);

        const filtered = result
          .map((book) => {
            const price = book.saleInfo?.listPrice?.amount || 0;
            const currency = book.saleInfo?.listPrice?.currencyCode;
            const inrPrice = convertToINR(price, currency);

            return {
              ...book,
              inrPrice,
              stock: Math.floor(Math.random() * 10), // Simulated stock
              category: book.volumeInfo.categories ? book.volumeInfo.categories.join(', ') : 'Other',
            };
          })
          .filter((book) => {
            if (categoryFilter && !book.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
              return false;
            }
            return true;
          })
          .sort((a, b) => {
            // Add checks if data is missing
            const priceA = a.inrPrice || 0;
            const priceB = b.inrPrice || 0;
            const titleA = a.volumeInfo?.title || '';
            const titleB = b.volumeInfo?.title || '';
            const ratingA = a.volumeInfo?.averageRating || 0;
            const ratingB = b.volumeInfo?.averageRating || 0;

            if (priceSortOption === 'priceAsc') {
              return priceA - priceB;
            } else if (priceSortOption === 'priceDesc') {
              return priceB - priceA;
            }

            if (titleSortOption === 'titleAsc') {
              return titleA.localeCompare(titleB);
            } else if (titleSortOption === 'titleDesc') {
              return titleB.localeCompare(titleA);
            }

            if (ratingSortOption === 'ratingAsc') {
              return ratingA - ratingB;
            } else if (ratingSortOption === 'ratingDesc') {
              return ratingB - ratingA;
            }

            return 0;
          });

        setBooks(filtered);
      } catch (error) {
        setError('Failed to fetch books. Please try again later.');
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    getBooks();
  }, [searchQuery, priceSortOption, titleSortOption, ratingSortOption, categoryFilter]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Book List
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By Price</InputLabel>
            <Select
              value={priceSortOption}
              label="Sort By Price"
              onChange={(e) => setPriceSortOption(e.target.value)}
            >
              <MenuItem value="priceAsc">Price: Low to High</MenuItem>
              <MenuItem value="priceDesc">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By Title</InputLabel>
            <Select
              value={titleSortOption}
              label="Sort By Title"
              onChange={(e) => setTitleSortOption(e.target.value)}
            >
              <MenuItem value="titleAsc">Title: A to Z</MenuItem>
              <MenuItem value="titleDesc">Title: Z to A</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By Rating</InputLabel>
            <Select
              value={ratingSortOption}
              label="Sort By Rating"
              onChange={(e) => setRatingSortOption(e.target.value)}
            >
              <MenuItem value="ratingAsc">Rating: Low to High</MenuItem>
              <MenuItem value="ratingDesc">Rating: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="fiction">Fiction</MenuItem>
              <MenuItem value="story">Story</MenuItem>
              <MenuItem value="non-fiction">Non-Fiction</MenuItem>
              <MenuItem value="Science">Science</MenuItem>
              <MenuItem value="General">General</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Show loading spinner or error message */}
      {loading && <CircularProgress />}

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {!loading && !error && books.map((book) => {
          const title = book.volumeInfo.title || 'No Title';
          const authors = book.volumeInfo.authors?.join(', ') || 'Unknown';
          const description = book.volumeInfo.description || 'No description available';
          const price = book.saleInfo?.listPrice?.amount;
          const currency = book.saleInfo?.listPrice?.currencyCode;
          const inrPrice = book.inrPrice;
          const stock = book.stock;
          const thumbnail = book.volumeInfo.imageLinks?.thumbnail;
          const rating = book.volumeInfo.averageRating || null;

          return (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt={title}
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        marginBottom: '1rem',
                      }}
                    />
                  )}
                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Author: {authors}
                  </Typography>
                  {rating && (
                    <Rating
                      name="book-rating"
                      value={rating}
                      readOnly
                      precision={0.5}
                      sx={{ mt: 1 }}
                    />
                  )}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {description.slice(0, 100)}...
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Price:{' '}
                    {inrPrice
                      ? `₹${inrPrice} (original: ${price} ${currency})`
                      : 'Not available'}
                  </Typography>
                  <Typography variant="body2">
                    Stock: {stock > 0 ? `${stock} available` : 'Out of stock'}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/book-details', { state: { book } })}
                  sx={{ m: 1 }}
                >
                  View Details
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default HomePage;
