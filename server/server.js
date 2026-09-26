require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MONGODB_URI is missing.');
}

app.use(cors());
app.use(express.json());

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let mongoConnection;

async function connectDB() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing.');
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!mongoConnection) {
    mongoConnection = mongoose.connect(mongoUri);
  }

  await mongoConnection;
}

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();

    res.json({
      status: 'ok',
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check error:', error.message);

    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: error.message
    });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    await connectDB();

    const filter = {};

    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$or = [
        {
          name: {
            $regex: req.query.search,
            $options: 'i'
          }
        },
        {
          description: {
            $regex: req.query.search,
            $options: 'i'
          }
        }
      ];
    }

    const products = await Product
      .find(filter)
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {
    console.error('Products error:', error);

    res.status(500).json({
      message: 'Unable to load the collection.',
      error: error.message
    });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    await connectDB();

    const { customer, items } = req.body;

    if (
      !customer ||
      !customer.name ||
      !emailPattern.test(customer.email || '') ||
      !customer.address ||
      !customer.city ||
      !customer.postalCode
    ) {
      return res.status(400).json({
        message: 'Please complete every delivery field with a valid email.'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Your bag is empty.'
      });
    }

    const session = await mongoose.startSession();

    try {
      let createdOrder;

      await session.withTransaction(async () => {
        const ids = items.map((item) => item.productId);

        const products = await Product
          .find({ _id: { $in: ids } })
          .session(session);

        const productMap = new Map(
          products.map((product) => [product.id, product])
        );

        const orderItems = [];
        let total = 0;

        for (const item of items) {
          const product = productMap.get(item.productId);
          const quantity = Number(item.quantity);

          if (
            !product ||
            !Number.isInteger(quantity) ||
            quantity < 1
          ) {
            throw new Error(
              'One of the items is no longer available.'
            );
          }

          if (product.stockQuantity < quantity) {
            throw new Error(
              `${product.name} has only ${product.stockQuantity} left.`
            );
          }

          if (
            !product.sizes.includes(item.size) ||
            !product.colors.includes(item.color)
          ) {
            throw new Error(
              'Please select a valid size and color.'
            );
          }

          product.stockQuantity -= quantity;

          await product.save({ session });

          orderItems.push({
            product: product._id,
            name: product.name,
            quantity,
            size: item.size,
            color: item.color,
            price: product.price
          });

          total += product.price * quantity;
        }

        [createdOrder] = await Order.create(
          [
            {
              customer,
              items: orderItems,
              total: Number(total.toFixed(2))
            }
          ],
          { session }
        );
      });

      res.status(201).json({
        message: 'Order confirmed.',
        orderId: createdOrder.id,
        total: createdOrder.total
      });

    } finally {
      await session.endSession();
    }

  } catch (error) {
    console.error('Order error:', error);

    res.status(400).json({
      message: error.message || 'We could not process your order.'
    });
  }
});

if (process.env.NODE_ENV !== 'production') {
  connectDB()
    .then(() => {
      app.listen(port, () => {
        console.log(`Maison Noir API listening on ${port}`);
      });
    })
    .catch((error) => {
      console.error('MongoDB connection failed:', error.message);
    });
}

module.exports = app;