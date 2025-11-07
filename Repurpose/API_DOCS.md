# API Documentation

Base URL: `/api`

### Conventions
- **Auth**: Endpoints marked with Auth require header `Authorization: Bearer <JWT>`.
- **Validation**: Requests validated with Joi. On validation failure:
```json
{
  "status": "error",
  "type": "ValidationError",
  "message": "Invalid request data",
  "details": [{ "field": "email", "message": "email must be a valid email" }]
}
```
- **Errors**: Centralized handler returns:
```json
{ "status": "error", "message": "<error message>" }
```

## Health
- `GET /` (no prefix)
  - Returns API status.
  - Response 200 example:
```json
{ "message": "RePurpose API is running" }
```

## Users
Mounted at: `/api/users`

- `GET /api/users/`
  - Description: List all users (id, name, email, phone, user_type). Public in current code.
  - Auth: None
  - Success 200 example:
```json
[
  { "id": 1, "name": "Aditi", "email": "aditi@example.com", "phone": "9876543210", "user_type": "individual" }
]
```

- `POST /api/users/register`
  - Description: Register a new user.
  - Auth: None
  - Body (JSON):
    - `name` string (2-100) required
    - `email` string email required
    - `password` string (6-128) required
    - `phone` string 10-digit optional (allows empty/null)
    - `role` string optional. Accepted: `individual`, `organization`
  - Example request body:
```json
{
  "name": "Aditi",
  "email": "aditi@example.com",
  "password": "secret123",
  "phone": "9876543210",
  "role": "individual"
}
```
  - Success 201 example:
```json
{ "success": true, "message": "User registered successfully", "userId": 42 }
```
  - Errors:
    - 400 if user already exists: `{ "status": "error", "message": "User already exists" }`

- `POST /api/users/login`
  - Description: Login with email/password and receive a JWT.
  - Auth: None
  - Body (JSON):
    - `email` string email required
    - `password` string required
  - Example request body:
```json
{ "email": "aditi@example.com", "password": "secret123" }
```
  - Success 200 example:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt>",
  "user": { "id": 42, "name": "Aditi", "email": "aditi@example.com", "phone": "9876543210", "user_type": "individual" }
}
```
  - Errors:
    - 400 user not found / invalid password

## Categories
Mounted at: `/api/categories`

- `GET /api/categories/`
  - Description: List all categories. Public.
  - Auth: None
  - Success 200 example:
```json
{ "success": true, "categories": [ { "id": 1, "name": "Clothes", "description": "..." } ] }
```

- `POST /api/categories/add`
  - Description: Create a new category. Admin only.
  - Auth: `Authorization: Bearer <JWT>` with `user_type = admin`
  - Body (JSON):
    - `name` string (max 50) required
    - `description` string (max 255) optional
  - Example request body:
```json
{ "name": "Books", "description": "Textbooks and novels" }
```
  - Success 201 example:
```json
{ "success": true, "message": "Category added successfully", "categoryId": 10 }
```
  - Errors:
    - 401 missing/invalid token, 403 insufficient role, 400 validation errors

- `DELETE /api/categories/:id`
  - Description: Delete a category by id. Admin only.
  - Auth: `Authorization: Bearer <JWT>` with `user_type = admin`
  - Params: `id` path param
  - Success 200 example:
```json
{ "success": true, "message": "Category deleted successfully" }
```
  - Errors:
    - 404 not found, 401/403 auth issues

## Items
Mounted at: `/api/items`

- `GET /api/items/`
  - Description: List all items. Public.
  - Auth: None
  - Success 200 example:
```json
{ "success": true, "items": [ { "id": 1, "title": "Winter Jacket", "category_id": 2, "location": "NYC", "image_url": "" } ] }
```

- `GET /api/items/category/:id`
  - Description: List items by category id. Public.
  - Auth: None
  - Params: `id` category id
  - Success 200 example:
```json
{ "success": true, "items": [ { "id": 5, "title": "Book Set", "category_id": 3 } ] }
```

- `POST /api/items/add`
  - Description: Create a new item. Any logged-in user.
  - Auth: `Authorization: Bearer <JWT>`
  - Body (JSON):
    - `title` string (max 150) required
    - `description` string optional
    - `category_id` integer required
    - `location` string optional
    - `image_url` string optional
  - Example request body:
```json
{
  "title": "Winter Jacket",
  "description": "Gently used, size M",
  "category_id": 2,
  "location": "NYC",
  "image_url": "https://example.com/jacket.jpg"
}
```
  - Success 201 example:
```json
{ "success": true, "message": "Item added successfully", "itemId": 123 }
```
  - Errors:
    - 400 when `title` or `category_id` missing, 401 invalid token, 400 validation errors

## Requests
Mounted at: `/api/requests`

- `GET /api/requests/`
  - Description: List all requests with requester name and item title. Public (current code).
  - Auth: None
  - Success 200 example:
```json
{ "success": true, "requests": [ { "id": 7, "item_id": 123, "requester_id": 42, "quantity_needed": 1, "status": "pending", "requester_name": "Aditi", "item_title": "Winter Jacket" } ] }
```

- `POST /api/requests/add`
  - Description: Create a new request for an item. Any logged-in user.
  - Auth: `Authorization: Bearer <JWT>`
  - Body (JSON):
    - `item_id` integer required
    - `quantity_needed` integer min 1 optional (default 1)
  - Example request body:
```json
{ "item_id": 123, "quantity_needed": 2 }
```
  - Success 201 example:
```json
{ "success": true, "message": "Request created successfully", "requestId": 55 }
```
  - Errors:
    - 400 when `item_id` missing, 401 invalid token, 400 validation errors

- `PUT /api/requests/:id/status`
  - Description: Update request status. Admin only. Accepted: `pending`, `approved`, `rejected`, `completed`.
  - Auth: `Authorization: Bearer <JWT>` with `user_type = admin`
  - Params: `id` path param
  - Body (JSON):
    - `status` string required, one of the accepted values
  - Example request body:
```json
{ "status": "approved" }
```
  - Success 200 example:
```json
{ "success": true, "message": "Request status updated to approved" }
```
  - Errors:
    - 404 not found, 400 invalid status, 401/403 auth issues

### Auth Header Example
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Notes
- JWT payload includes: `{ id, email, user_type }`.
- Admin-only routes check `user_type === 'admin'`.
