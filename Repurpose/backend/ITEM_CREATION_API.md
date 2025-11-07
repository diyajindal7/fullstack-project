# Item Creation API Documentation

## Endpoint: POST `/api/items/add`

### Description
Creates a new donation item. Requires user authentication.

### Authentication
- **Required**: Yes
- **Method**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <token>`

### Request Body
```json
{
  "title": "string (required, max 150 chars)",
  "description": "string (optional)",
  "category_id": "number (required, must be valid category ID)",
  "location": "string (optional, max 255 chars)",
  "image_url": "string (optional, max 255 chars)"
}
```

### Example Request
```json
{
  "title": "Gently used winter jacket",
  "description": "Men's size M, excellent condition",
  "category_id": 1,
  "location": "New York, NY",
  "image_url": "https://example.com/image.jpg"
}
```

### Success Response
- **Status Code**: `201 Created`
- **Body**:
```json
{
  "success": true,
  "message": "Item added successfully",
  "itemId": 123
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Title and category_id are required"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```
or
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

### Backend Implementation

**File**: `routes/items.js`

**Route Handler**:
```javascript
router.post('/add', auth(), validate(itemSchema), async (req, res, next) => {
  try {
    const { title, description, category_id, location, image_url } = req.validated;

    if (!title || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Title and category_id are required',
      });
    }

    const query = `
      INSERT INTO items 
      (title, description, category_id, user_id, location, image_url) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [results] = await db.query(query, [
      title,
      description || '',
      category_id,
      req.user.id,  // Automatically set from JWT token
      location || '',
      image_url || '',
    ]);

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      itemId: results.insertId,
    });
  } catch (err) {
    next(err);
  }
});
```

### Validation Schema

**File**: `validators/item.js`

```javascript
const itemSchema = Joi.object({
  title: Joi.string().max(150).required(),
  description: Joi.string().allow('').optional(),
  category_id: Joi.number().integer().required(),
  location: Joi.string().max(255).allow('').optional(),
  image_url: Joi.string().max(255).allow('').optional()
});
```

### Database Schema

**Table**: `items`

| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | AUTO_INCREMENT PRIMARY KEY |
| title | VARCHAR(150) | NOT NULL |
| description | TEXT | |
| category_id | INT | NOT NULL, FOREIGN KEY |
| user_id | INT | NOT NULL, FOREIGN KEY |
| location | VARCHAR(255) | |
| image_url | VARCHAR(255) | |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Notes
- The `user_id` is automatically extracted from the JWT token (`req.user.id`)
- Category must exist in the `categories` table
- User must be authenticated (logged in)
- All validation is handled by Joi schema before reaching the route handler

