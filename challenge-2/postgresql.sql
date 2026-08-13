-- Challenge 2: PostgreSQL Query Optimization

-- Fetch products with a price between $50 and $200
-- Ordered by price ascending
-- 10 products per page

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


-- Recommended index

CREATE INDEX idx_products_price_id
ON products(price, id);


-- Query analysis

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