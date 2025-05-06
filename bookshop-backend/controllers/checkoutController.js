const pool = require('../config/db');
const PDFDocument = require('pdfkit');
const Joi = require('joi');

const checkCheckoutEnabled = async () => {
  const [rows] = await pool.query('SELECT setting_value FROM settings WHERE setting_key = ?', ['checkout_enabled']);
  return rows.length > 0 && rows[0].setting_value === 'true';
};

exports.createCheckout = async (req, res) => {
  const isCheckoutEnabled = await checkCheckoutEnabled();
  if (!isCheckoutEnabled) {
    return res.status(403).json({ message: 'Checkout is disabled by admin.' });
  }

  const userId = req.user.id;
  const { shippingAddress, paymentMethod } = req.body;

  // Validation schema
  const schema = Joi.object({
    shippingAddress: Joi.object({
      fullName: Joi.string().required(),
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string().allow(''),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string().allow(''),
    }).required(),
    paymentMethod: Joi.string().valid('CREDIT_CARD', 'PAYPAL', 'CASH_ON_DELIVERY').required(),
  });

  const { error } = schema.validate({ shippingAddress, paymentMethod });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Fetch cart items
    const [cartItems] = await pool.query('SELECT * FROM cart WHERE userId = ?', [userId]);
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Save shipping address
    const [addressResult] = await pool.query(
      'INSERT INTO shipping_addresses (userId, fullName, addressLine1, addressLine2, city, state, postalCode, country, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        shippingAddress.fullName,
        shippingAddress.addressLine1,
        shippingAddress.addressLine2 || '',
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postalCode,
        shippingAddress.country,
        shippingAddress.phone || '',
      ]
    );

    // Create order
    const [orderResult] = await pool.query(
      'INSERT INTO orders (userId, shippingAddressId, paymentMethod, totalAmount) VALUES (?, ?, ?, ?)',
      [userId, addressResult.insertId, paymentMethod, totalAmount]
    );

    // Save order items
    for (const item of cartItems) {
      await pool.query(
        'INSERT INTO order_items (orderId, bookId, title, authors, price, quantity) VALUES (?, ?, ?, ?, ?, ?)',
        [orderResult.insertId, item.bookId, item.title, item.authors, item.price, item.quantity]
      );
    }

    // Generate invoice
    const invoiceNumber = `INV-${orderResult.insertId}-${Date.now()}`;
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);
      await pool.query('INSERT INTO invoices (orderId, invoiceNumber, pdfData) VALUES (?, ?, ?)', [
        orderResult.insertId,
        invoiceNumber,
        pdfData,
      ]);
    });

    // Create invoice PDF
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.fontSize(12).text(`Invoice Number: ${invoiceNumber}`, { align: 'left' });
    doc.text(`Order ID: ${orderResult.insertId}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Customer: ${req.user.email}`);
    doc.text(`Shipping: ${shippingAddress.fullName}, ${shippingAddress.addressLine1}, ${shippingAddress.city}`);
    doc.moveDown();
    doc.text('Items:');
    cartItems.forEach(item => {
      doc.text(`${item.title} - Qty: ${item.quantity} - Price: $${item.price}`);
    });
    doc.text(`Total: $${totalAmount.toFixed(2)}`);
    doc.end();

    // Clear cart
    await pool.query('DELETE FROM cart WHERE userId = ?', [userId]);

    res.json({ message: 'Order placed successfully.', orderId: orderResult.insertId, invoiceNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to process checkout.' });
  }
};

exports.getOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const [orders] = await pool.query(
      'SELECT o.*, s.fullName, s.addressLine1, s.city, s.state, s.postalCode, s.country FROM orders o JOIN shipping_addresses s ON o.shippingAddressId = s.id WHERE o.userId = ?',
      [userId]
    );
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

exports.getInvoice = async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user.id;

  try {
    const [invoices] = await pool.query(
      'SELECT i.pdfData, i.invoiceNumber FROM invoices i JOIN orders o ON i.orderId = o.id WHERE i.orderId = ? AND o.userId = ?',
      [orderId, userId]
    );
    if (invoices.length === 0) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }

    const invoice = invoices[0];
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoiceNumber}.pdf`);
    res.send(invoice.pdfData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch invoice.' });
  }
};

exports.toggleCheckout = async (req, res) => {
  // Assume admin role check (not implemented in provided code)
  const { enabled } = req.body;

  try {
    await pool.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      ['checkout_enabled', enabled.toString(), enabled.toString()]
    );
    res.json({ message: `Checkout ${enabled ? 'enabled' : 'disabled'}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update settings.' });
  }
};