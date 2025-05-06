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

export const getCartItems = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const addToCart = async (book) => {
  try {
    const response = await axios.post(
      `${API_URL}/add`,
      {
        bookId: book.id,
        title: book.volumeInfo.title || 'Untitled',
        authors: book.volumeInfo.authors || ['Unknown'],
        price: book.saleInfo?.listPrice?.amount || 0,
       poraquantity: 1,
      },
      { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const removeCartItem = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  } catch (error) {
    console.error(error.message);
    throw error;
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
    console.error(error.message);
    throw error;
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
    console.error(error.message);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get(`${CHECKOUT_API_URL}/orders`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
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
    console.error(error.message);
    throw error;
  }
};