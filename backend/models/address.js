const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Auth0 user ID
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
