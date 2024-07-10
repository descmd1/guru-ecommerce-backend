const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.DB,
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/api/products', productRoutes);
app.use('/api', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
