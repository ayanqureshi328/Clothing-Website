require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  { name: 'The Atelier Coat', price: 680, category: 'Outerwear', description: 'A sculpted wool-blend coat with a generous shoulder and considered horn buttons.', imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85', sizes: ['XS', 'S', 'M', 'L'], colors: ['Charcoal', 'Bone'], stockQuantity: 14 },
  { name: 'Soft Structure Blazer', price: 480, category: 'Outerwear', description: 'Unlined Japanese cotton tailoring with a relaxed fit and precise, clean lapel.', imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85', sizes: ['XS', 'S', 'M', 'L'], colors: ['Olive', 'Black'], stockQuantity: 11 },
  { name: 'Lune Silk Shirt', price: 220, category: 'Tops', description: 'Fluid silk satin cut for an easy drape, finished with a softly curved cuff.', imageUrl: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1200&q=85', sizes: ['XS', 'S', 'M', 'L'], colors: ['Noir', 'Ivory'], stockQuantity: 24 },
  { name: 'Form Knit', price: 310, category: 'Knitwear', description: 'A tactile cashmere and merino knit with a quiet, architectural neckline.', imageUrl: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=1200&q=85', sizes: ['S', 'M', 'L'], colors: ['Oat', 'Ink'], stockQuantity: 18 },
  { name: 'Noir Bias Dress', price: 420, category: 'Dresses', description: 'A fluid satin dress cut on the bias to move softly through the evening.', imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85', sizes: ['XS', 'S', 'M', 'L'], colors: ['Noir', 'Wine'], stockQuantity: 12 },
  { name: 'The Column Skirt', price: 285, category: 'Bottoms', description: 'A clean, ankle-skimming silhouette in compact stretch wool with a hidden slit.', imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=1200&q=85', sizes: ['XS', 'S', 'M', 'L'], colors: ['Black', 'Stone'], stockQuantity: 16 },
  { name: 'No. 04 Trousers', price: 260, category: 'Bottoms', description: 'High-waisted tailoring in a dry wool suiting cloth, with a relaxed straight leg.', imageUrl: 'https://images.unsplash.com/photo-1506629905607-d9d04b55f2d8?auto=format&fit=crop&w=1200&q=85', sizes: ['XS', 'S', 'M', 'L'], colors: ['Black', 'Stone'], stockQuantity: 21 },
  { name: 'The Everyday Bag', price: 390, category: 'Accessories', description: 'A supple leather carryall designed to gather the essentials without excess.', imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=85', sizes: ['One size'], colors: ['Umber', 'Black'], stockQuantity: 9 }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/maison-noir')
  .then(async () => { await Product.deleteMany({}); await Product.insertMany(products); console.log(`Seeded ${products.length} products.`); await mongoose.disconnect(); })
  .catch((error) => { console.error(error); process.exit(1); });
