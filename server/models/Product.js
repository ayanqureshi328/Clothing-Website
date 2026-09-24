const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, enum: ['Outerwear', 'Knitwear', 'Tops', 'Dresses', 'Bottoms', 'Accessories'] },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  stockQuantity: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
