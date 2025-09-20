const express = require('express');
const router = express.Router();
const Nutrition = require('../models/Nutrition');

// GET /api/nutrition?name=Masala%20Dosa
router.get('/', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Food name is required' });
  try {
    const nutrition = await Nutrition.findOne({ name });
    if (!nutrition) return res.status(404).json({ error: 'Food not found' });
    res.json(nutrition);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
