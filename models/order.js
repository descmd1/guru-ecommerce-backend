const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const CartSchema = new mongoose.Schema({
  items: [CartItemSchema],
});

const OrderSchema = new mongoose.Schema({
  items: [CartItemSchema],
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model('Cart', CartSchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = { Cart, Order };
