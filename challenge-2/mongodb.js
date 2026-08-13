// Challenge 2: MongoDB Query Optimization

// Retrieve Electronics products
// Sorted by price descending
// 5 products per page

db.products
    .find({
        category: "Electronics"
    })
    .sort({
        price: -1
    })
    .skip(0)
    .limit(5);


// Page 2

db.products
    .find({
        category: "Electronics"
    })
    .sort({
        price: -1
    })
    .skip(5)
    .limit(5);


// Recommended compound index

db.products.createIndex({
    category: 1,
    price: -1
});


// Query analysis

db.products
    .find({
        category: "Electronics"
    })
    .sort({
        price: -1
    })
    .limit(5)
    .explain("executionStats");