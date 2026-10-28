# ShopKart — E-Commerce Store with Mini Inventory & Cart

A production-style, full-stack mini e-commerce application with live inventory
tracking and a shopping cart. Built with **React + Bootstrap** on the front end
and **Node.js + Express + MongoDB (Mongoose)** on the back end.

---

## ✨ Features

- **Product catalog** with image, title, price, category badge, and live stock status.
- **Live search** (by name/description) and **category filter** in the navbar.
- **Product details modal** with extended description.
- **Slide-out cart drawer** with +/− quantity controls, item removal, and a live grand total.
- **Inventory-safe cart logic on the backend** — adding to cart decrements stock,
  removing restores it, and stock can never go negative. Insufficient stock is
  rejected with a clear message.
- **REST API** for products and cart, including filtering/search.

---

## 🧱 Tech Stack

| Layer      | Tech                                              |
| ---------- | ------------------------------------------------- |
| Frontend   | React 18, Vite, Bootstrap 5, react-bootstrap, axios |
| Backend    | Node.js, Express                                  |
| Database   | MongoDB via Mongoose                              |
| Tooling    | npm workspaces, nodemon, concurrently             |

---

## 📁 Folder Structure

```
E-Commerce and mini inventory sytem/
├── package.json                 # root (workspaces + run scripts)
├── README.md
├── server/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js            # Express app + middleware + routes
│       ├── config/db.js         # Mongoose connection
│       ├── models/Product.js    # Product schema
│       ├── models/Cart.js       # Cart schema + total virtuals
│       ├── routes/productRoutes.js
│       ├── routes/cartRoutes.js
│       ├── controllers/productController.js
│       ├── controllers/cartController.js
│       └── seed/seedData.js     # Sample product seeder
└── client/
    ├── package.json
    ├── vite.config.js           # dev server + /api proxy to :5000
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── styles.css
        ├── constants.js
        ├── api/products.js
        ├── api/cart.js
        ├── context/CartContext.jsx
        └── components/
            ├── Navbar.jsx
            ├── ProductCard.jsx
            ├── ProductGrid.jsx
            ├── ProductModal.jsx
            ├── CartDrawer.jsx
            └── Footer.jsx
```

---

## ✅ Prerequisites

- **Node.js 18+** — <https://nodejs.org>
- **MongoDB** — either:
  - **Local**: install MongoDB Community Edition and run it on the default port
    (`mongodb://localhost:27017`), **or**
  - **MongoDB Atlas**: create a free cluster and copy a connection string like
    `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ecommerce`

---

## 🚀 Setup & Run

### 1) Install dependencies (both workspaces)

From the project root:

```bash
npm install
```

This installs the backend, the frontend, and the `concurrently` helper.

### 2) Configure environment

Copy the example env file and edit if needed:

```bash
copy server\.env.example server\.env
```

Defaults work for a local MongoDB on `localhost:27017`. For Atlas, edit
`MONGO_URI` in `server\.env`.

### 3) Seed the database with sample products

```bash
npm run seed
```

This clears existing products/carts and inserts 10 sample products across
Electronics, Apparel, Groceries, and Books.

### 4) Start both servers (one terminal)

```bash
npm run dev
```

- Backend API → <http://localhost:5000/api>
- Frontend UI  → <http://localhost:5173>

> Or run them in two terminals:
> - `npm run dev:server`
> - `npm run dev:client`

### 5) Build the frontend for production

```bash
npm run build
```

Output is written to `client/dist`. Set `VITE_API_URL` in `client/.env` to your
backend URL before building for production.

---

## 🔌 Environment Variables

| File            | Variable     | Default                              | Description                              |
| --------------- | ------------ | ------------------------------------ | ---------------------------------------- |
| `server/.env`   | `PORT`       | `5000`                               | Express API port                         |
| `server/.env`   | `MONGO_URI`  | `mongodb://localhost:27017/ecommerce`| MongoDB connection string                |
| `server/.env`   | `CLIENT_URL` | `http://localhost:5173`              | Allowed CORS origin (Vite dev port)     |
| `client/.env`   | `VITE_API_URL` | _(empty)_                          | Backend base URL; empty = use Vite proxy |

---

## 📡 REST API

| Method | Endpoint            | Body / Query                          | Description                                            |
| ------ | ------------------- | ------------------------------------- | ----------------------------------------------------- |
| GET    | `/api/products`      | `?category=&search=` (query, optional) | List products; filter by category, search by keyword |
| GET    | `/api/products/:id`  | —                                     | Fetch a single product by id                          |
| GET    | `/api/cart`          | —                                     | Get current cart (populated, with totals)             |
| POST   | `/api/cart`          | `{ "productId": "...", "quantity": N }` | Set desired total quantity in cart (0 removes line)  |
| DELETE | `/api/cart/:id`      | — (`:id` = product id)                | Remove a cart line and restore stock                  |
| GET    | `/api/health`        | —                                     | Health check                                          |

### Cart & stock behavior

- `POST /api/cart` sets the **desired total** quantity for a product.
  - Adding units decrements `Product.stockQuantity`.
  - Removing units increments `Product.stockQuantity`.
  - `quantity: 0` removes the line and restores all its stock.
  - If the requested quantity exceeds available stock, the server returns
    `400` with a message like `Insufficient stock for "X". Only N available.`
- `DELETE /api/cart/:id` removes the whole line and restores its quantity to stock.
- Stock can never go negative.

---

## 🧪 Quick API test (PowerShell)

```powershell
# List products
Invoke-RestMethod http://localhost:5000/api/products

# Add product to cart (use a real product id from the list above)
$body = @{ productId = "<PRODUCT_ID>"; quantity = 1 } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/cart -Body $body -ContentType "application/json"

# View cart
Invoke-RestMethod http://localhost:5000/api/cart
```

---

## 📝 Notes

- This demo uses a **single shared cart** (one document). For multi-user use,
  key carts by an authenticated user id in the `Cart` schema.
- Product images use Unsplash URLs; the UI shows a "No Image" placeholder if
  any image fails to load.
- The cart controller uses read-modify-write for stock. For high-concurrency
  production use, wrap the stock update + cart update in a MongoDB transaction
  (requires a replica set) or use atomic `$inc` with a precondition.
