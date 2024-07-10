const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Product = require('../models/product');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

router.post('/', async (req, res) => {
  const { items } = req.body;

  const transformedItems = await Promise.all(items.map(async (item) => {
    const product = await Product.findById(item.productId); 
    return {
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          description: product.description, 
        },
        unit_amount: product.price * 100,
      },
    };
  }));
  

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: transformedItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({url: session.url})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
