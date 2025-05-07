import axios from 'axios';

const API_URL = 'http://localhost:3001/api/cart';
const CHECKOUT_API_URL = 'http://localhost:3001/api/checkout';

const getAuthHeader = () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error('User is not authenticated. Please log in.');
  }
  return { Authorization: `Bearer ${token}` };
};

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

export const getCartItems = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch cart items.');
  }
};

export const addToCart = async (book) => {
  try {
    if (!book?.id || !book?.volumeInfo?.title) {
      throw new Error('Invalid book data.');
    }
    const price = book.saleInfo?.listPrice?.amount || 1000; // Default price: 1000 LKR
    const currency = book.saleInfo?.listPrice?.currencyCode || 'LKR';
    const lkrPrice = convertToLKR(price, currency);
    const response = await axios.post(
      `${API_URL}/add`,
      {
        bookId: book.id,
        title: book.volumeInfo.title || 'Untitled',
        authors: book.volumeInfo.authors?.join(', ') || 'Unknown',
        price: lkrPrice,
        quantity: 1,
      },
      { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to add item to cart.');
  }
};

export const removeCartItem = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  } catch (error) {
    console.error('Error removing cart item:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to remove item from cart.');
  }
};

export const updateCartItem = async (id, quantity) => {
  try {
    await axios.put(
      `${API_URL}/${id}`,
      { quantity },
      { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } }
    );
  } catch (error) {
    console.error('Error updating cart item:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update cart item.');
  }
};

export const createCheckout = async (shippingAddress, paymentMethod) => {
  try {
    const response = await axios.post(
      CHECKOUT_API_URL,
      { shippingAddress, paymentMethod },
      { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating checkout:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to process checkout.');
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get(`${CHECKOUT_API_URL}/orders`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch orders.');
  }
};

export const getInvoice = async (orderId) => {
  try {
    const response = await axios.get(`${CHECKOUT_API_URL}/invoices/${orderId}`, {
      headers: getAuthHeader(),
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch invoice.');
  }
};