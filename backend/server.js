const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');
const SECRET_KEY = process.env.SECRET_KEY || 'your-very-secret-key';

app.use(cors());
app.use(bodyParser.json());

// Root route to show server status
app.get('/', (req, res) => {
    res.json({ message: 'Server is running', database: 'Connected' });
});

// Helper to read DB
const readDB = async () => {
    try {
        return await fs.readJson(DB_FILE);
    } catch (error) {
        return { users: [], feedbacks: [], contacts: [] };
    }
};

// Helper to write DB
const writeDB = async (data) => {
    await fs.writeJson(DB_FILE, data, { spaces: 2 });
};

// --- Auth Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const db = await readDB();
    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), name, email, password: hashedPassword };
    db.users.push(newUser);
    await writeDB(db);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ token, user: { name: newUser.name, email: newUser.email } });
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const db = await readDB();
    const user = db.users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { name: user.name, email: user.email } });
});

// --- Feedback Routes ---

// Get all feedbacks
app.get('/api/feedback', async (req, res) => {
    const db = await readDB();
    res.json(db.feedbacks);
});

// Submit feedback
app.post('/api/feedback', async (req, res) => {
    const { name, email, rating, comment } = req.body;
    if (!name || !rating || !comment) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await readDB();
    const newFeedback = {
        id: Date.now(),
        name,
        email,
        rating,
        comment,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    db.feedbacks.unshift(newFeedback); // Add to beginning
    await writeDB(db);

    res.status(201).json(newFeedback);
});

// --- Contact Routes ---

// Submit contact form
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await readDB();
    const newContact = {
        id: Date.now(),
        name,
        email,
        phone,
        subject,
        message,
        date: new Date().toISOString()
    };
    db.contacts.push(newContact);
    await writeDB(db);

    res.status(201).json({ message: 'Message sent successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
