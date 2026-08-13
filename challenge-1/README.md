# Challenge 1 - Product Inventory REST API

## Objective

Build a secure RESTful API using **Node.js**, **Express.js**, and **MongoDB** to manage a Product Inventory System.

The API implements:

- JWT authentication
- Role-based authorization
- Product CRUD operations
- MongoDB data persistence
- Express Validator input validation
- Pagination
- Centralized error handling
- Basic security best practices

---

## Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM |
| JSON Web Token (JWT) | Authentication |
| Express Validator | Request validation |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| CORS | Cross-Origin Resource Sharing |
| Nodemon | Development server |

---

# Project Structure

```text
challenge-1/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   └── productController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
│
├── models/
│   └── Product.js
│
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
│
├── validators/
│   └── productValidator.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

---
## Product Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | Product name |
| `category` | String | No | Product category |
| `price` | Number | Yes | Positive product price |
| `quantity` | Number | Yes | Non-negative integer |
| `createdAt` | Date | Automatic | Creation timestamp |
| `updatedAt` | Date | Automatic | Last update timestamp |

The `createdAt` and `updatedAt` fields are automatically managed using Mongoose timestamps.

---

# Authentication

The API uses **JWT (JSON Web Token)** for authentication.

Users must first log in to obtain a JWT token.

## Login Endpoint

```http
POST /auth/login
```

Full URL:

```text
http://localhost:5000/auth/login
```

### Request Body

```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "YOUR_JWT_TOKEN"
}
```

The token should be included in the `Authorization` header when accessing protected endpoints.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# User Roles

The API supports role-based authorization.

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | `admin` |
| `user` | `user123` | `user` |

## Admin Permissions

Administrators can:

- Create products
- Update products
- Delete products

## Normal User Permissions

Normal users can:

- View products
- View individual products

Normal users cannot:

- Create products
- Update products
- Delete products

---

# Authorization

Protected endpoints require a valid JWT token.

The authentication middleware:

1. Reads the JWT from the `Authorization` header.
2. Verifies the token.
3. Decodes the user information.
4. Adds the authenticated user to the request.

Admin-only endpoints additionally check the user's role.

### Missing or Invalid Token

Response:

```http
401 Unauthorized
```

Example:

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### Valid Token but Insufficient Permissions

Response:

```http
403 Forbidden
```

Example:

```json
{
  "success": false,
  "message": "Admin access required"
}
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Login and generate JWT |

## Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/products` | Admin | Create a product |
| GET | `/products` | Public | Get products with pagination |
| GET | `/products/:id` | Public | Get a product by ID |
| PUT | `/products/:id` | Admin | Update a product |
| DELETE | `/products/:id` | Admin | Delete a product |

---

# Product API

## 1. Create Product

### Endpoint

```http
POST /products
```

### URL

```text
http://localhost:5000/products
```

### Headers

```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Laptop",
  "category": "Electronics",
  "price": 1200,
  "quantity": 10
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "PRODUCT_ID",
    "name": "Laptop",
    "category": "Electronics",
    "price": 1200,
    "quantity": 10,
    "createdAt": "DATE",
    "updatedAt": "DATE"
  }
}
```

Only administrators can access this endpoint.

---

# 2. Get All Products

### Endpoint

```http
GET /products
```

### URL

```text
http://localhost:5000/products
```

This endpoint is publicly accessible.

Products are returned using pagination with **10 products per page**.

## Page 1

```text
GET http://localhost:5000/products?page=1
```

## Page 2

```text
GET http://localhost:5000/products?page=2
```

### Pagination

The API uses the following calculation:

```text
skip = (page - 1) × 10
```

For example:

| Page | Skip | Limit |
|---|---:|---:|
| 1 | 0 | 10 |
| 2 | 10 | 10 |
| 3 | 20 | 10 |

### Example Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "PRODUCT_ID",
      "name": "Laptop",
      "category": "Electronics",
      "price": 1200,
      "quantity": 10
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

# 3. Get Product by ID

### Endpoint

```http
GET /products/:id
```

### Example

```text
GET http://localhost:5000/products/PRODUCT_ID
```

This endpoint is publicly accessible.

### Successful Response

```json
{
  "success": true,
  "data": {
    "_id": "PRODUCT_ID",
    "name": "Laptop",
    "category": "Electronics",
    "price": 1200,
    "quantity": 10
  }
}
```

### Product Not Found

```json
{
  "success": false,
  "message": "Product not found"
}
```

---

# 4. Update Product

### Endpoint

```http
PUT /products/:id
```

### Example

```text
PUT http://localhost:5000/products/PRODUCT_ID
```

### Headers

```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Gaming Laptop",
  "category": "Electronics",
  "price": 1500,
  "quantity": 8
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "PRODUCT_ID",
    "name": "Gaming Laptop",
    "category": "Electronics",
    "price": 1500,
    "quantity": 8
  }
}
```

Only administrators can update products.

---

# 5. Delete Product

### Endpoint

```http
DELETE /products/:id
```

### Example

```text
DELETE http://localhost:5000/products/PRODUCT_ID
```

### Headers

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Successful Response

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

Only administrators can delete products.

---

# Input Validation

Express Validator is used for validation on the `POST /products` and `PUT /products/:id` endpoints.

## Name

The `name` field:

- Is required.
- Must be a string.

### Invalid Request

```json
{
  "category": "Electronics",
  "price": 100,
  "quantity": 5
}
```

Expected response:

```http
400 Bad Request
```

---

## Category

The `category` field:

- Is optional.
- Must be a string when provided.

Valid example:

```json
{
  "name": "Laptop",
  "category": "Electronics",
  "price": 1200,
  "quantity": 10
}
```

---

## Price

The `price` field must be a positive number.

### Valid

```text
100
50.5
1200
```

### Invalid

```text
0
-100
```

Example:

```json
{
  "name": "Laptop",
  "category": "Electronics",
  "price": -100,
  "quantity": 5
}
```

Expected response:

```http
400 Bad Request
```

---

## Quantity

The `quantity` field must be a non-negative integer.

### Valid

```text
0
5
10
100
```

### Invalid

```text
-5
2.5
```

Example:

```json
{
  "name": "Laptop",
  "category": "Electronics",
  "price": 100,
  "quantity": -5
}
```

Expected response:

```http
400 Bad Request
```

---

# Validation Error Response

When validation fails, the API returns HTTP `400 Bad Request`.

Example:

```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "msg": "Name is required",
      "path": "name"
    }
  ]
}
```

---

# Error Handling

The API uses centralized error handling middleware.

| Status Code | Meaning |
|---|---|
| `200` | Request successful |
| `201` | Resource created successfully |
| `400` | Validation or bad request |
| `401` | Authentication required |
| `403` | Insufficient permissions |
| `404` | Resource not found |
| `500` | Internal server error |

Example server error:

```json
{
  "success": false,
  "message": "Server error"
}
```
---

# Testing with Postman

The API can be tested using Postman.

## Test 1 - Health Check

### Request

```http
GET http://localhost:5000/
```

### Expected Response

```json
{
  "success": true,
  "message": "Product Inventory API is running"
}
```

---

## Test 2 - Admin Login

### Request

```http
POST http://localhost:5000/auth/login
```

### Body

```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Expected Result

- Status: `200 OK`
- JWT token returned

Copy the JWT token for the next tests.

---

## Test 3 - Create Product

### Request

```http
POST http://localhost:5000/products
```

### Headers

```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Body

```json
{
  "name": "Laptop",
  "category": "Electronics",
  "price": 1200,
  "quantity": 10
}
```

### Expected Result

- Status: `201 Created`
- Product created successfully

---

## Test 4 - Get Products

### Request

```http
GET http://localhost:5000/products?page=1
```

### Expected Result

- Status: `200 OK`
- Products returned
- Maximum 10 products per page
- Pagination metadata returned

---

## Test 5 - Get Product by ID

### Request

```http
GET http://localhost:5000/products/PRODUCT_ID
```

### Expected Result

- Status: `200 OK`
- Requested product returned

---

## Test 6 - Update Product

### Request

```http
PUT http://localhost:5000/products/PRODUCT_ID
```

### Headers

```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Body

```json
{
  "name": "Gaming Laptop",
  "category": "Electronics",
  "price": 1500,
  "quantity": 8
}
```

### Expected Result

- Status: `200 OK`
- Product updated successfully

---

## Test 7 - Delete Product

### Request

```http
DELETE http://localhost:5000/products/PRODUCT_ID
```

### Headers

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Expected Result

- Status: `200 OK`
- Product deleted successfully

---

# Authorization Testing

To verify that role-based authorization works correctly, log in using the normal user account.

## User Login

```http
POST http://localhost:5000/auth/login
```

Body:

```json
{
  "username": "user",
  "password": "user123"
}
```

Copy the returned JWT token.

Then attempt to create a product:

```http
POST http://localhost:5000/products
```

Header:

```http
Authorization: Bearer USER_JWT_TOKEN
```

Expected response:

```http
403 Forbidden
```

```json
{
  "success": false,
  "message": "Admin access required"
}
```

This confirms that admin-only authorization is working correctly.

---

# Validation Testing

## Missing Name

Request:

```json
{
  "category": "Electronics",
  "price": 100,
  "quantity": 5
}
```

Expected:

```text
400 Bad Request
```

## Negative Price

Request:

```json
{
  "name": "Test Product",
  "category": "Electronics",
  "price": -100,
  "quantity": 5
}
```

Expected:

```text
400 Bad Request
```

## Negative Quantity

Request:

```json
{
  "name": "Test Product",
  "category": "Electronics",
  "price": 100,
  "quantity": -5
}
```

Expected:

```text
400 Bad Request
```

## Decimal Quantity

Request:

```json
{
  "name": "Test Product",
  "category": "Electronics",
  "price": 100,
  "quantity": 2.5
}
```

Expected:

```text
400 Bad Request
```

---

# API Request Flow

```text
                         ┌──────────────────┐
                         │      Client      │
                         └────────┬─────────┘
                                  │
                                  │ POST /auth/login
                                  ▼
                         ┌──────────────────┐
                         │  Login Controller│
                         └────────┬─────────┘
                                  │
                                  │ Validate Credentials
                                  ▼
                         ┌──────────────────┐
                         │   Generate JWT   │
                         └────────┬─────────┘
                                  │
                                  │ Return Token
                                  ▼
                         ┌──────────────────┐
                         │      Client      │
                         └────────┬─────────┘
                                  │
                                  │ Bearer Token
                                  ▼
                         ┌──────────────────┐
                         │ Authentication   │
                         │   Middleware     │
                         └────────┬─────────┘
                                  │
                                  │ Verify JWT
                                  ▼
                         ┌──────────────────┐
                         │ Authorization    │
                         │   Middleware     │
                         └────────┬─────────┘
                                  │
                           Check User Role
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Product          │
                         │ Controller       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     MongoDB      │
                         └──────────────────┘
```
