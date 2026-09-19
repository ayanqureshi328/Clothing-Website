# Maison Noir

A high-end fashion storefront built with React, Express, and MongoDB Atlas.

## Run locally

1. Install dependencies:
   `npm install`
   `npm install --prefix client`
2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` to your MongoDB Atlas connection string.
3. In Atlas, add your development IP address to Network Access and create a database user.
4. Seed the catalog:
   `npm run seed`
5. Start both applications:
   `npm run dev`
6. Open `http://localhost:5173`.

The client proxies `/api` requests to Express on port 5000. Products are queried from MongoDB; the order endpoint validates the customer and line items, checks current inventory, decrements stock, and stores the order in a transaction.

## API

- `GET /api/products?category=Outerwear&search=coat`
- `POST /api/orders`
- `GET /api/health`
