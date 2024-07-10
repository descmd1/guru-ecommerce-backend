const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product'); 

// Add item to cart
router.post('/cart', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart();
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cart items
router.get('/cart', async (req, res) => {
  try {
    const cart = await Cart.findOne().populate('items.productId');
    res.status(200).json(cart ? cart.items : []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
