const express = require('express');
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Sample data for users, products, and orders
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

const products = [
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Smartphone', price: 800 }
];

const orders = [
    { id: 1, user_id: 1, product_id: 1, quantity: 2 },
    { id: 2, user_id: 2, product_id: 2, quantity: 1 }
];

// GET /api/users - Returns a list of users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// GET /api/products - Returns a list of products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// POST /api/orders - Create a new order (uses sample data)
app.post('/api/orders', (req, res) => {
    const newOrder = req.body;  // Expected format { user_id, product_id, quantity }
    
    if (!newOrder.user_id || !newOrder.product_id || !newOrder.quantity) {
        return res.status(400).json({ error: 'Invalid order data' });
    }

    const order = {
        id: orders.length + 1, // Simulating unique order ID
        user_id: newOrder.user_id,
        product_id: newOrder.product_id,
        quantity: newOrder.quantity
    };

    orders.push(order);  // Adding to sample order list
    res.status(201).json({ message: 'Order created successfully', order });
});

// GET /api/orders - Returns a list of orders
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// Default route for non-existent endpoints
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
