import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createCheckout } from '../service/cartService';

function CheckoutPage() {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await createCheckout(shippingAddress, paymentMethod);
      navigate('/order-confirmation', {
        state: { orderId: response.orderId, invoiceNumber: response.invoiceNumber },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Checkout
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Shipping Information
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Full Name"
            name="fullName"
            value={shippingAddress.fullName}
            onChange={handleAddressChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Address Line 1"
            name="addressLine1"
            value={shippingAddress.addressLine1}
            onChange={handleAddressChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Address Line 2"
            name="addressLine2"
            value={shippingAddress.addressLine2}
            onChange={handleAddressChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="City"
            name="city"
            value={shippingAddress.city}
            onChange={handleAddressChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="State"
            name="state"
            value={shippingAddress.state}
            onChange={handleAddressChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Postal Code"
            name="postalCode"
            value={shippingAddress.postalCode}
            onChange={handleAddressChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Country"
            name="country"
            value={shippingAddress.country}
            onChange={handleAddressChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Phone"
            name="phone"
            value={shippingAddress.phone}
            onChange={handleAddressChange}
            disabled={loading}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Payment Method
          </Typography>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              label="Payment Method"
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
              <MenuItem value="PAYPAL">PayPal</MenuItem>
              <MenuItem value="CASH_ON_DELIVERY">Cash on Delivery</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={
              loading ||
              !shippingAddress.fullName ||
              !shippingAddress.addressLine1 ||
              !shippingAddress.city ||
              !shippingAddress.state ||
              !shippingAddress.postalCode ||
              !shippingAddress.country ||
              !paymentMethod
            }
          >
            {loading ? <CircularProgress size={24} /> : 'Place Order'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CheckoutPage;