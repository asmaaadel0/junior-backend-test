# Challenge 2 - Database Query Optimization


# 1. PostgreSQL Query

## Requirement

Fetch products with:

- Price between `$50` and `$200`
- Results ordered by price in ascending order
- Pagination with `10` products per page

## Query

```sql
SELECT
    id,
    name,
    category,
    price,
    quantity,
    created_at,
    updated_at
FROM products
WHERE price BETWEEN 50 AND 200
ORDER BY price ASC, id ASC
LIMIT 10
OFFSET 0;
```

## Pagination

The offset can be calculated using:

`OFFSET = (page - 1) * 10`

### Page 1

```sql
SELECT
    id,
    name,
    category,
    price,
    quantity
FROM products
WHERE price BETWEEN 50 AND 200
ORDER BY price ASC, id ASC
LIMIT 10
OFFSET 0;
```

### Page 2

```sql
SELECT
    id,
    name,
    category,
    price,
    quantity
FROM products
WHERE price BETWEEN 50 AND 200
ORDER BY price ASC, id ASC
LIMIT 10
OFFSET 10;
```

### Page 3

```sql
SELECT
    id,
    name,
    category,
    price,
    quantity
FROM products
WHERE price BETWEEN 50 AND 200
ORDER BY price ASC, id ASC
LIMIT 10
OFFSET 20;
```

The `id` field is included as a secondary sort field to provide stable ordering when multiple products have the same price.

---

## PostgreSQL Optimization

### Indexing

An index can be created on the fields used for filtering and sorting:

```sql
CREATE INDEX idx_products_price_id
ON products(price, id);
```

This index helps PostgreSQL efficiently locate products within the required price range and maintain the requested ordering.

### Query Analysis

PostgreSQL's `EXPLAIN ANALYZE` can be used to check the query execution plan and determine whether the index is being used:

```sql
EXPLAIN ANALYZE
SELECT
    id,
    name,
    category,
    price,
    quantity
FROM products
WHERE price BETWEEN 50 AND 200
ORDER BY price ASC, id ASC
LIMIT 10
OFFSET 0;
```

---

# 2. MongoDB Query

## Requirement

Retrieve products where:

- Category is `"Electronics"`
- Results are sorted by price in descending order
- Maximum `5` products per page

## Query

```javascript
db.products
    .find({
        category: "Electronics"
    })
    .sort({
        price: -1
    })
    .skip(0)
    .limit(5);
```

---

## MongoDB Pagination

The number of products per page is `5`.

The offset can be calculated using:

`skip = (page - 1) * 5`

### Page 1

```javascript
db.products
    .find({
        category: "Electronics"
    })
    .sort({
        price: -1
    })
    .skip(0)
    .limit(5);
```

### Page 2

```javascript
db.products
    .find({
        category: "Electronics"
    })
    .sort({
        price: -1
    })
    .skip(5)
    .limit(5);
```

### Page 3

```javascript
db.products
    .find({
        category: "Electronics"
    })
    .sort({
        price: -1
    })
    .skip(10)
    .limit(5);
```

---

## MongoDB Optimization

### Compound Index

A compound index can be created for the category and price fields:

```javascript
db.products.createIndex({
    category: 1,
    price: -1
});
```

This index is useful because the query filters by `category` and sorts by `price`.

The compound index allows MongoDB to efficiently locate products belonging to the requested category and retrieve them in the required price order.

---

## MongoDB Query Analysis

MongoDB's `explain()` method can be used to analyze the query and verify index usage:

```javascript
db.products
    .find({
        category: "Electronics"
    })
    .sort({
        price: -1
    })
    .limit(5)
    .explain("executionStats");
```

The execution statistics can be reviewed to determine whether the expected index is being used and how many documents were examined.

---

## High-Traffic Optimization

When the application receives a high number of requests, database queries should be optimized to reduce database load and response time.

### Indexing

Indexes should be created on fields that are frequently used for filtering, sorting, and searching.

#### PostgreSQL

```sql
CREATE INDEX idx_products_price_id
ON products(price, id);
```

#### MongoDB

```javascript
db.products.createIndex({
    category: 1,
    price: -1
});
```

Indexes reduce the amount of data that the database needs to scan.

However, excessive indexes should be avoided because indexes also require storage and can increase the cost of insert and update operations.

---

### Caching

Frequently requested data can be cached using a caching system such as Redis.

For example, requests for products in the `Electronics` category could be cached for a short period.

Instead of querying MongoDB for every request:

```text
Client
   |
   v
API
   |
   v
Redis Cache
   |
   v
MongoDB only when cache misses
```

Caching can significantly reduce database load and improve response time.

---

### Pagination

Pagination prevents the API from returning a large number of records in a single request.

The requirements for this challenge are:

- PostgreSQL: 10 products per page
- MongoDB: 5 products per page

For very large datasets, cursor-based or keyset pagination can be more efficient than large `OFFSET` or `skip` values.

---

### Keyset Pagination

For PostgreSQL, keyset pagination can be used instead of large offsets.

Example:

```sql
SELECT
    id,
    name,
    category,
    price,
    quantity
FROM products
WHERE price BETWEEN 50 AND 200
  AND (price, id) > (100, 25)
ORDER BY price ASC, id ASC
LIMIT 10;
```

Here `(100, 25)` represents the price and ID of the last product from the previous page.

Keyset pagination can perform better than large `OFFSET` values when working with very large datasets.

---

### Return Only Required Fields

The application should avoid retrieving unnecessary columns.

Instead of:

```sql
SELECT *
FROM products;
```

select only the required fields:

```sql
SELECT
    id,
    name,
    category,
    price,
    quantity
FROM products;
```

Similarly, MongoDB can use projections:

```javascript
db.products.find(
    {
        category: "Electronics"
    },
    {
        name: 1,
        category: 1,
        price: 1,
        quantity: 1
    }
)
.sort({
    price: -1
})
.limit(5);
```

This reduces the amount of data transferred from the database.

---

### Database Connection Pooling

Database connection pooling should be used so that the application can reuse database connections instead of creating a new connection for every request.

Connection pooling improves performance and allows the application to handle more concurrent requests efficiently.

---

### Query Monitoring

Database performance should be monitored regularly.

### PostgreSQL

```sql
EXPLAIN ANALYZE
SELECT
    id,
    name,
    category,
    price,
    quantity
FROM products
WHERE price BETWEEN 50 AND 200
ORDER BY price ASC, id ASC
LIMIT 10
OFFSET 0;
```

### MongoDB

```javascript
db.products
    .find({
        category: "Electronics"
    })
    .sort({
        price: -1
    })
    .limit(5)
    .explain("executionStats");
```

Monitoring helps identify slow queries, inefficient execution plans, and missing indexes.

---

### Read Scaling

For applications with a large number of read operations, database read scaling can be considered.

Possible approaches include:

- PostgreSQL read replicas
- MongoDB replica sets
- Separating read-heavy workloads from write operations

This can help distribute database traffic as the application grows.

---

## Optimization Summary

| Optimization | PostgreSQL | MongoDB |
|---|---|---|
| Indexing | `price, id` index | `category, price` compound index |
| Pagination | `LIMIT/OFFSET` or keyset pagination | `skip/limit` or cursor pagination |
| Caching | Redis | Redis |
| Query analysis | `EXPLAIN ANALYZE` | `explain("executionStats")` |
| Reduce data transfer | Select required columns | Projection |
| High traffic | Connection pooling/read replicas | Connection pooling/replica sets |

---

## Conclusion

The PostgreSQL query uses a price range filter, ascending price ordering, and pagination to retrieve products efficiently.

The MongoDB query filters products by category, sorts them by price in descending order, and limits the results to five products per page.

For high-traffic environments, the main optimization strategies are:

1. Proper indexing
2. Efficient pagination
3. Caching frequently requested data
4. Returning only required fields
5. Database connection pooling
6. Query execution monitoring
7. Keyset or cursor pagination for large datasets
8. Read scaling when required

These techniques help reduce database workload, improve query performance, and allow the application to handle a larger number of concurrent users.