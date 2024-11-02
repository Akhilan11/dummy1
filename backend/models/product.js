const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  imageUrls: [{ type: String }], // Array to store multiple image URLs
  gender: { type: String, required: true }, // Added gender field
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
