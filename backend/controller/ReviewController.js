const express = require('express');
const Review = require('../models/review');
const router = express.Router();

// Create a new review
router.post('/reviews', async (req, res) => {
  const review = new Review(req.body);
  try {
    await review.save();
    res.status(201).send(review);
  } catch (error) {
    res.status(400).send({ error: 'Review creation failed', details: error.message });
  }
});

// Get all reviews for a product
router.get('/reviews/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.find({ productId });
    res.send(reviews);
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

// Optional: Update a review
router.patch('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!review) {
      return res.status(404).send({ error: 'Review not found' });
    }
    res.send(review);
  } catch (error) {
    res.status(400).send({ error: 'Update failed', details: error.message });
  }
});

// Optional: Delete a review
router.delete('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).send({ error: 'Review not found' });
    }
    res.send(review);
  } catch (error) {
    res.status(500).send({ error: 'Server Error', details: error.message });
  }
});

module.exports = router;
