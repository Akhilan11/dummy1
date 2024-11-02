const express = require('express');
const Cart = require('../models/cart');
const router = express.Router();

// Create or update a user's cart
router.post('/carts', async (req, res) => {
    const { userId, items } = req.body;
    try {
        // Validate userId and items before processing
        if (!userId || !Array.isArray(items)) {
            return res.status(400).send({ error: 'Invalid request: userId and items are required' });
        }

        if (!userId || !items) {
            return res.status(400).send('Invalid request data');
        }

        // Validate each item in the array
        for (const item of items) {
            if (!item.productId || !item.quantity || !item.size) {
                return res.status(400).send({ error: 'Invalid item: productId, quantity, and size are required' });
            }
        }

        let cart = await Cart.findOne({ userId });

        if (cart) {
            // If the cart exists, update it
            items.forEach(item => {
                const existingItem = cart.items.find(i => i.productId.toString() === item.productId);
                if (existingItem) {
                    existingItem.quantity += item.quantity; // Increment quantity
                    existingItem.size = item.size; // Update size if needed
                } else {
                    cart.items.push(item); // Add new item
                }
            });
            await cart.save();
        } else {
            // Create a new cart if it doesn't exist
            cart = new Cart({ userId, items });
            await cart.save();
        }

        res.status(201).send(cart);
    } catch (error) {
        console.error('Error creating/updating cart:', error); // Log the error for debugging
        res.status(500).send({ error: 'Cart creation failed', details: error.message });
    }
});

// Get user's cart
router.get('/carts/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).send({ error: 'Cart not found' });
    }
    res.send(cart);
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

// Optional: Update item quantity in the cart
router.patch('/carts/:userId/items/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity, size } = req.body; // Accept size if needed

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send({ error: 'Cart not found' });
    }

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (item) {
      item.quantity = quantity; // Update quantity
      if (size) {
        item.size = size; // Update size if provided
      }
      await cart.save();
      res.send(cart);
    } else {
      res.status(404).send({ error: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Update failed', details: error.message });
  }
});

// Optional: Remove item from the cart
router.delete('/carts/:userId/items/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    await cart.save();
    res.send(cart);
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

// Optional: Clear the cart
router.delete('/carts/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    await Cart.deleteOne({ userId });
    res.send({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

module.exports = router;
