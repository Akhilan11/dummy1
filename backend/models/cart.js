const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Auth0 user ID
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      size: { type: String, required: true } 
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
