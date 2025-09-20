const mongoose = require('mongoose');

const NutritionSchema = new mongoose.Schema({
  food_id: String,
  name: String,
  cuisine: String,
  category: String,
  sub_category: String,
  calories: Number,
  protein: Number,
  fat: Number,
  carbs: Number,
  fiber: Number,
  sugar: Number,
  allergens: String,
  ayurvedic_profile: String,
  vegan: String,
  vegetarian: String,
  origin: String,
  popularity_score: Number
});

module.exports = mongoose.model('Nutrition', NutritionSchema, 'nutrition');
