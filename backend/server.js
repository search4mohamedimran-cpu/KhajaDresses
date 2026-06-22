const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Set DNS to Google DNS to resolve MongoDB SRV records reliably
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('./models/User');
const Feedback = require('./models/Feedback');
const Contact = require('./models/Contact');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-very-secret-key';
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://IMRAN:IMRAN%402317@cluster0.jdoux74.mongodb.net/?appName=Cluster0';

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Root route to show server status
app.get('/', (req, res) => {
    res.json({
        message: 'Server is running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// --- Auth Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ token, user: { name: newUser.name, email: newUser.email } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});

// --- Feedback Routes ---

// Get all feedbacks
app.get('/api/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ message: 'Error fetching feedbacks' });
    }
});

// Submit feedback
app.post('/api/feedback', async (req, res) => {
    const { name, email, rating, comment } = req.body;
    if (!name || !rating || !comment) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const newFeedback = await Feedback.create({
            name,
            email,
            rating,
            comment,
            date: dateStr
        });
        res.status(201).json(newFeedback);
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Error submitting feedback' });
    }
});

// --- Contact Routes ---

// Submit contact form
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        await Contact.create({
            name,
            email,
            phone: phone || '',
            subject,
            message,
            date: new Date().toISOString()
        });
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
});

// --- Order Routes ---

// Create Order
app.post('/api/orders', async (req, res) => {
    const { user, items, totalAmount, shippingAddress, phone, paymentMethod } = req.body;
    if (!user || !user.name || !user.email || !items || !items.length || !totalAmount || !shippingAddress || !phone) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newOrder = await Order.create({
            user: {
                name: user.name,
                email: user.email.toLowerCase()
            },
            items,
            totalAmount,
            shippingAddress,
            phone,
            paymentMethod: paymentMethod || 'COD'
        });
        res.status(201).json({ message: 'Order placed successfully', orderId: newOrder._id });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error processing your order' });
    }
});

// Get user orders
app.get('/api/orders/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const orders = await Order.find({ 'user.email': email.toLowerCase() }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
