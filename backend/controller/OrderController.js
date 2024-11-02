const express = require('express');
const Order = require('../models/orders');
const Cart = require('../models/cart'); 
const Product = require('../models/product');
const Address = require('../models/address');

const router = express.Router();

// Place a new order
router.post('/orders', async (req, res) => {
    const { userId, items, totalAmount, address } = req.body;

    try {
        // Check product stock before creating an order
        for (const item of items) {
            const product = await Product.findById(item.productId);

            // If product not found, return an error
            if (!product) {
                return res.status(404).send({ error: `Product with ID ${item.productId} not found` });
            }

            // If not enough stock, return an error
            if (product.stock < item.quantity) {
                return res.status(400).send({ error: `Not enough stock for product ${product.name}` });
            }
        }

        // Check if the address already exists
        let savedAddress = await Address.findOne({ userId, fullName: address.fullName, phone: address.phone });

        if (!savedAddress) {
            // If no existing address, create a new one
            savedAddress = new Address({
                userId,
                fullName: address.fullName,
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country,
                phone: address.phone
            });

            await savedAddress.save();
            // console.log("New address saved to the database:", savedAddress);
        } else {
            // console.log("Address already exists in the database:", savedAddress);
        }

        // Create the order
        const order = new Order({
            userId,
            items: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                size: item.size
            })),
            totalAmount,
            address: savedAddress // Use the saved address
        });

        // Save the order to the database
        await order.save();

        // Update product stock for each item in the order
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }

        // Clear the user's cart after placing the order
        await Cart.deleteOne({ userId });

        // Send the saved order as the response
        res.status(201).send(order);
    } catch (error) {
        // Send specific error details in case of failure
        res.status(400).send({ error: 'Order creation failed', details: error.message });
    }
});


// Get all orders for a specific user
router.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId }).populate('items.productId'); // Adjusted to 'productId'
    res.send(orders);
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

// Optional: Get a specific order by ID
router.get('/orders/:userId/:orderId', async (req, res) => {
  const { userId, orderId } = req.params;

  try {
    const order = await Order.findOne({ userId, _id: orderId }).populate('items.productId'); // Adjusted to 'productId'
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }
    res.send(order);
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

// Update order status
router.patch('/orders/:orderId', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }
    res.send(order);
  } catch (error) {
    res.status(400).send({ error: 'Update failed', details: error.message });
  }
});


// Get all orders for all users
router.get('/orders', async (req, res) => {
    try {
      const orders = await Order.find().populate('items.productId'); // Populate product details if needed
      res.send(orders);
    } catch (error) {
      res.status(500).send({ error: 'Server Error', details: error.message });
    }
});

module.exports = router;