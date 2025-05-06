import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, List, ListItem, ListItemText, Button, Alert, CircularProgress } from '@mui/material';
import { getOrders, getInvoice } from '../service/cartService';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders.');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDownloadInvoice = async (orderId, invoiceNumber) => {
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
      setError('Failed to download invoice.');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ mt: 8, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Your Orders
        </Typography>
        {orders.length === 0 ? (
          <Typography>No orders found.</Typography>
        ) : (
          <List>
            {orders.map((order) => (
              <ListItem key={order.id} divider>
                <ListItemText
                  primary={`Order ID: ${order.id} - Total: $${order.totalAmount.toFixed(2)}`}
                  secondary={`Status: ${order.status} | Shipping: ${order.fullName}, ${order.addressLine1}, ${order.city}, ${order.country}`}
                />
                <Button
                  variant="contained"
                  onClick={() => handleDownloadInvoice(order.id, `INV-${order.id}-${Date.now()}`)}
                >
                  Download Invoice
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default OrdersPage;