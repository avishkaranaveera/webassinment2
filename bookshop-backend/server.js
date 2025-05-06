require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/checkout', require('./routes/checkoutRoutes'));

// Server + DB Check
const pool = require('./config/db');
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  pool.query('SELECT 1')
    .then(() => console.log('Database connected.'))
    .catch(err => console.error('DB connection error:', err));
});