import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { getInvoice } from '../service/cartService';

function OrderConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!state?.orderId || !state?.invoiceNumber) {
    return <Typography>Invalid order data. Please try again.</Typography>;
  }

  const { orderId, invoiceNumber } = state;

  const handleDownloadInvoice = async () => {
    setLoading(true);
    setError('');
    try {
      const pdfBlob = await getInvoice(orderId);
      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Order Confirmation
        </Typography>
        <Typography variant="body1" gutterBottom>
          Thank you for your order! Your order ID is <strong>{orderId}</strong>.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Invoice Number: <strong>{invoiceNumber}</strong>
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button
          variant="contained"
          onClick={handleDownloadInvoice}
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Download Invoice'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ mt: 2, ml: 2 }}
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
}

export default OrderConfirmationPage;