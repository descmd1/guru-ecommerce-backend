const express = require('express');
const { Cart, Order } = require('../models/order');
const router = express.Router();

// Add item to cart
router.post('/cart', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart();
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

// Create order
router.post('/order', async (req, res) => {
  try {
    const cart = await Cart.findOne().populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

    const order = new Order({
      items: cart.items,
      total,
    });

    await order.save();
    await Cart.deleteOne(); // Clear the cart

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
