# API Testing Guide

Test these endpoints using Postman, Thunder Client, or curl.

## Base URL
```
http://localhost:8000/api
```

---

## Authentication Endpoints

### 1. Register User
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

Response:
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "1|abc123...",
  "token_type": "Bearer"
}
```

### 2. Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Get Current User
```http
GET /user
Authorization: Bearer {your_token}
```

### 4. Logout
```http
POST /logout
Authorization: Bearer {your_token}
```

---

## Inventory Item Endpoints

**Note:** All inventory endpoints require authentication.
Include header: `Authorization: Bearer {your_token}`

### 1. Get All Items
```http
GET /inventory-items
Authorization: Bearer {your_token}
```

### 2. Search Items
```http
GET /inventory-items?search=laptop
Authorization: Bearer {your_token}
```

### 3. Create Single Item
```http
POST /inventory-items
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "name": "Laptop",
  "description": "Dell XPS 15",
  "quantity": 10,
  "unit": "units"
}
```

### 4. Create Multiple Items (Bulk)
```http
POST /inventory-items/bulk
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "items": [
    {
      "name": "Laptop",
      "description": "Dell XPS 15",
      "quantity": 10,
      "unit": "units"
    },
    {
      "name": "Mouse",
      "description": "Wireless mouse",
      "quantity": 50,
      "unit": "units"
    },
    {
      "name": "Cable",
      "description": "HDMI Cable",
      "quantity": 100,
      "unit": "m"
    }
  ]
}
```

### 5. Get Single Item (with history)
```http
GET /inventory-items/1
Authorization: Bearer {your_token}
```

### 6. Update Item
```http
PUT /inventory-items/1
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "name": "Updated Laptop",
  "description": "Updated description",
  "unit": "units"
}
```

### 7. Delete Item
```http
DELETE /inventory-items/1
Authorization: Bearer {your_token}
```

---

## Stock Operation Endpoints

### 1. Add Stock (Single Item)
```http
POST /inventory-items/1/add-stock
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "quantity": 5,
  "notes": "Restocking from warehouse"
}
```

### 2. Deduct Stock (Single Item)
```http
POST /inventory-items/1/deduct-stock
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "quantity": 3,
  "notes": "Sold to customer"
}
```

### 3. Bulk Add Stock
```http
POST /inventory-items/bulk-add
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "items": [
    {
      "id": 1,
      "quantity": 10,
      "notes": "Monthly restock"
    },
    {
      "id": 2,
      "quantity": 20,
      "notes": "Weekly restock"
    }
  ]
}
```

### 4. Bulk Deduct Stock
```http
POST /inventory-items/bulk-deduct
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "items": [
    {
      "id": 1,
      "quantity": 5,
      "notes": "Bulk sale"
    },
    {
      "id": 2,
      "quantity": 10,
      "notes": "Office use"
    }
  ]
}
```

---

## cURL Examples

### Register
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Items
```bash
curl -X GET http://localhost:8000/api/inventory-items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Add Item
```bash
curl -X POST http://localhost:8000/api/inventory-items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Dell XPS 15",
    "quantity": 10,
    "unit": "units"
  }'
```

### Add Stock
```bash
curl -X POST http://localhost:8000/api/inventory-items/1/add-stock \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5,
    "notes": "Restocking"
  }'
```

---

## Response Status Codes

- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST (item created)
- `400 Bad Request` - Validation error or insufficient stock
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Item not found
- `500 Internal Server Error` - Server error

---

## Common Error Responses

### Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["The name field is required."],
    "quantity": ["The quantity must be at least 0."]
  }
}
```

### Insufficient Stock
```json
{
  "message": "Insufficient stock"
}
```

### Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

---

## Testing Workflow

1. **Register/Login** → Get token
2. **Create items** → Test single and bulk creation
3. **Add stock** → Test stock addition
4. **Deduct stock** → Test stock deduction
5. **View history** → Check transaction history
6. **Search** → Test search functionality
7. **Update/Delete** → Test CRUD operations

---

## Postman Collection

Import this JSON into Postman for quick testing:

```json
{
  "info": {
    "name": "Inventory Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{auth_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000/api"
    },
    {
      "key": "auth_token",
      "value": ""
    }
  ]
}
```

Save your token as `auth_token` variable after login!
