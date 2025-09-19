const express = require('express');
const router = express.Router();
const axios = require('axios');

// Proxy endpoint for Ayurveda chatbot
router.post('/ayurveda-chat', async (req, res) => {
  try {
    const { question } = req.body;
    const response = await axios.post('http://localhost:5001/api/ayurveda-chat', { question });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
