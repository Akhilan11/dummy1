const express = require('express');
const Address = require('../models/address'); 
const router = express.Router();

// Create a new address
router.post('/address', async (req, res) => { // Changed to /address
  const { userId, fullName, addressLine1, addressLine2, city, state, postalCode, country, phone } = req.body;

  try {
    const address = new Address({
      userId,
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
    });

    await address.save();
    res.status(201).send(address);
  } catch (error) {
    res.status(400).send({ error: 'Address creation failed', details: error.message });
  }
});

// Get all addresses for a specific user
router.get('/address/:userId', async (req, res) => { // Changed to /address/:userId
  const { userId } = req.params;

  try {
    const addresses = await Address.find({ userId });
    res.send(addresses);
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

// Get a specific address by ID
router.get('/address/:userId/:addressId', async (req, res) => { // Changed to /address/:userId/:addressId
  const { userId, addressId } = req.params;

  try {
    const address = await Address.findOne({ userId, _id: addressId });
    if (!address) {
      return res.status(404).send({ error: 'Address not found' });
    }
    res.send(address);
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

// Update an address
router.patch('/address/:addressId', async (req, res) => { // Changed to /address/:addressId
  const { addressId } = req.params;

  try {
    const address = await Address.findByIdAndUpdate(addressId, req.body, { new: true, runValidators: true });
    if (!address) {
      return res.status(404).send({ error: 'Address not found' });
    }
    res.send(address);
  } catch (error) {
    res.status(400).send({ error: 'Update failed', details: error.message });
  }
});

// Delete an address
router.delete('/address/:addressId', async (req, res) => { // Added /address/:addressId for deletion
  const { addressId } = req.params;

  try {
    const address = await Address.findByIdAndDelete(addressId);
    if (!address) {
      return res.status(404).send({ error: 'Address not found' });
    }
    res.send(address);
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

module.exports = router;
