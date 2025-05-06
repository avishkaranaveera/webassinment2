const API_URL = 'http://localhost:3001/api/cart';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User is not authenticated. Please log in.');
  }
  return { 'Authorization': `Bearer ${token}` };
};

export const getCartItems = async () => {
  try {
    const res = await fetch(API_URL, { headers: getAuthHeader() });

    if (!res.ok) {
      throw new Error(`Failed to fetch cart items: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const removeCartItem = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });

    if (!res.ok) {
      throw new Error(`Failed to delete cart item: ${res.statusText}`);
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const updateCartItem = async (id, quantity) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ quantity })
    });

    if (!res.ok) {
      throw new Error(`Failed to update cart item: ${res.statusText}`);
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// ✅ Improved `addToCart` function
export const addToCart = async (book) => {
  try {
    const res = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        bookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || [],
        price: book.saleInfo?.listPrice?.amount || 0,
        quantity: 1
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed to add to cart: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
