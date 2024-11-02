const express = require('express');
const Wishlist = require('../models/wishlist');
const Product = require('../models/product');
const router = express.Router();

// Add item to wishlist
router.post('/wishlist', async (req, res) => {
    const { userId, items } = req.body;
  
    // Check if userId and items array are provided
    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'userId and productId are required' });
    }
  
    // Validate each item for productId
    for (const item of items) {
      if (!item.productId) {
        return res.status(400).json({ error: 'Each item must contain a productId' });
      }
    }
  
    try {
      const wishlist = new Wishlist({ userId, items });
      await wishlist.save();
      res.status(201).json(wishlist);
    } catch (error) {
      res.status(400).json({ error: 'Wishlist creation failed', details: error.message });
    }
});
  

// Get user's wishlist
router.get('/wishlist/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const wishlist = await Wishlist.findOne({ userId }).populate('items.productId', 'name price imageUrls');
        if (!wishlist) {
            return res.status(404).send({ error: 'Wishlist not found' });
        }

        res.send(wishlist);
    } catch (error) {
        res.status(500).send({ error: 'Server Error', details: error.message });
    }
});

// Remove an item from the wishlist
router.delete('/wishlist/:userId/items/:productId', async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).send({ error: 'Wishlist not found' });
        }

        // Remove the item from the wishlist
        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
        await wishlist.save();
        res.send(wishlist);
    } catch (error) {
        res.status(500).send({ error: 'Failed to remove item', details: error.message });
    }
});

// Clear the wishlist
router.delete('/wishlist/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        await Wishlist.deleteOne({ userId });
        res.send({ message: 'Wishlist cleared' });
    } catch (error) {
        res.status(500).send({ error: 'Server Error', details: error.message });
    }
});

module.exports = router;
