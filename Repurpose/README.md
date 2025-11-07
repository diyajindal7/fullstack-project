# RePurpose Backend

Backend for the **RePurpose** project — manages users, items, categories, and requests. Built with **Node.js**, **Express**, and **MySQL**.

---

## 📦 Features

- User registration and login with password hashing (`bcrypt`)
- CRUD for:
  - Categories
  - Items
  - Requests
- Filtering items by category
- Database connection using MySQL
- Dev tooling with `nodemon` for live reload
- Fully reproducible via `schema.sql`

---

## ✅ Project Progress

- [x] Express server with CORS and JSON middleware (`backend/server.js`)
- [x] MySQL connection via `mysql2` and `.env` support (`backend/config/db.js`)
- [x] Users: list, register (hashed), login (bcrypt compare)
- [x] Categories: list, add
- [x] Items: list, list by category, add
- [x] Requests: list (joined with items/users), add
- [x] Database schema and seed categories (`schema.sql`)
- [x] Dev script with `nodemon`
- [ ] Input validation hardening (e.g., JOI/Zod) and error normalization
- [ ] Auth tokens/sessions (JWT) and role checks (admin)
- [ ] Tests (unit/integration)
- [ ] Deployment configuration (ENV, Docker, CI/CD)

---

## ⚙️ Prerequisites

- Node.js >= 18
- MySQL installed locally
- npm installed

---

## 🛠 Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd repurpose
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a `.env` file** at the project root with your DB credentials:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=repurpose_db
```

4. **Provision the database** using the provided schema and seeds:
```bash
# In your MySQL client
SOURCE /absolute/path/to/repurpose/schema.sql;
```

5. **Verify DB connectivity (optional)**
```bash
node backend/test-db.js
```

6. **Run the server**
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The server runs on `http://localhost:5000` by default.

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

### Users
- `GET /users` — List all users
- `POST /users/register` — Register a new user
  - Body: `{ name, email, password, phone?, user_type? }`
- `POST /users/login` — Login a user
  - Body: `{ email, password }`

### Categories
- `GET /categories` — List categories
- `POST /categories/add` — Add a category
  - Body: `{ name, description? }`

### Items
- `GET /items` — List items
- `GET /items/category/:id` — List items by category id
- `POST /items/add` — Add an item
  - Body: `{ title, description?, category_id, user_id, location?, image_url? }`

### Requests
- `GET /requests` — List requests (includes item title and requester name)
- `POST /requests/add` — Create a request
  - Body: `{ item_id, requester_id }`

---

## 📂 Project Structure

```text
backend/
  config/db.js        # MySQL connection
  routes/
    users.js          # users endpoints
    categories.js     # categories endpoints
    items.js          # items endpoints
    requests.js       # requests endpoints
  server.js           # Express app and route mounting
  test-db.js          # Simple DB connectivity test
schema.sql            # DB schema and seeds
```

---

## 🧪 Sample Requests

```bash
# Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret"}'

# Add category
curl -X POST http://localhost:5000/api/categories/add \
  -H "Content-Type: application/json" \
  -d '{"name":"Books","description":"Reading material"}'

# Add item
curl -X POST http://localhost:5000/api/items/add \
  -H "Content-Type: application/json" \
  -d '{"title":"Desk","category_id":1,"user_id":1}'

# Create request
curl -X POST http://localhost:5000/api/requests/add \
  -H "Content-Type: application/json" \
  -d '{"item_id":1,"requester_id":1}'
```

---

## 🧭 Notes

- Ensure the `.env` values match your local MySQL setup.
- The schema includes category seeds for quick start.
- Add validation, auth, and tests before production use.
