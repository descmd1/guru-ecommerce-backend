const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
  quantity: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
});

module.exports = mongoose.model('Cart', cartSchema);
