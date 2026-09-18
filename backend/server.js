const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dns = require('dns');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// Set DNS to Google DNS to resolve MongoDB SRV records reliably
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Disable Mongoose buffering so operations fail fast when DB is disconnected
mongoose.set('bufferCommands', false);

const User = require('./models/User');
const Feedback = require('./models/Feedback');
const Contact = require('./models/Contact');
const Order = require('./models/Order');
const Uniform = require('./models/Uniform');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-very-secret-key';
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://IMRAN:IMRAN%402317@cluster0.jdoux74.mongodb.net/?appName=Cluster0';

app.use(cors());
app.use(bodyParser.json());

const DB_FILE = path.join(__dirname, 'db.json');

const initialUniforms = [
  {
    id: 1,
    name: "Boys White Shirt - Full Sleeve",
    category: "Boys",
    price: 350,
    sizes: ["32", "34", "36", "38", "40", "42", "44"],
    sizePrices: { "32": 350, "34": 370, "36": 390, "38": 410, "40": 430, "42": 460, "44": 470 },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png",
    stock: 100
  },
  {
    id: 2,
    name: "Girls White Shirt - Short Sleeve",
    category: "Girls",
    price: 230,
    sizes: ["20", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40"],
    sizePrices: { "20": 230, "22": 240, "24": 250, "26": 260, "28": 270, "30": 280, "32": 280, "34": 280, "36": 290, "38": 290, "40": 290 },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png",
    stock: 100
  },
  {
    id: 3,
    name: "Classic School Blazer - Navy",
    category: "Boys",
    price: 1199,
    sizes: ["28", "30", "32", "34"],
    sizePrices: { "28": 1199, "30": 1249, "32": 1299, "34": 1349 },
    school: "All Schools",
    image: "/uniforms/school_blazer.png",
    stock: 100
  },
  {
    id: 4,
    name: "Girls Navy Pleated Skirt",
    category: "Girls",
    price: 320,
    sizes: ["24", "26", "28", "30", "32", "34", "36", "38", "40"],
    sizePrices: { "24": 320, "26": 330, "28": 340, "30": 360, "32": 380, "34": 400, "36": 420, "38": 440, "40": 460 },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png",
    stock: 100
  },
  {
    id: 5,
    name: "Sports Uniform Set - Pro",
    category: "Sports",
    price: 480,
    sizes: ["20", "22", "24", "26", "28"],
    sizePrices: { "20": 480, "22": 500, "24": 520, "26": 540, "28": 560 },
    school: "St. Mary's High School",
    image: "/uniforms/sports_uniform.png",
    stock: 100
  },
  {
    id: 6,
    name: "Sports T-Shirt - Performance",
    category: "Sports",
    price: 230,
    sizes: ["20", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40"],
    sizePrices: { "20": 230, "22": 240, "24": 250, "26": 260, "28": 270, "30": 280, "32": 280, "34": 280, "36": 290, "38": 290, "40": 290 },
    school: "All Schools",
    image: "/uniforms/sports_uniform.png",
    stock: 100
  },
  {
    id: 7,
    name: "Salwar Kameez / Chudi Set",
    category: "Girls",
    price: 780,
    sizes: ["24", "26", "28", "30", "32", "34", "36", "38", "XL"],
    sizePrices: { "24": 780, "26": 810, "28": 840, "30": 870, "32": 910, "34": 940, "36": 990, "38": 1020, "XL": 1080 },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png",
    stock: 100
  },
  {
    id: 8,
    name: "School Pinafore Dress",
    category: "Girls",
    price: 320,
    sizes: ["24", "26", "28", "30", "32", "34", "36", "38", "40"],
    sizePrices: { "24": 320, "26": 330, "28": 340, "30": 360, "32": 380, "34": 400, "36": 420, "38": 440, "40": 460 },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png",
    stock: 100
  },
  {
    id: 9,
    name: "Khaki School Uniform Shirt",
    category: "Boys",
    price: 380,
    sizes: ["34", "36", "38", "40", "42", "44", "46"],
    sizePrices: { "34": 380, "36": 400, "38": 410, "40": 430, "42": 440, "44": 470, "46": 500 },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png",
    stock: 100
  },
  {
    id: 10,
    name: "School Frock (Frog)",
    category: "Girls",
    price: 320,
    sizes: ["24", "26", "28", "30", "32", "34", "36", "38", "40"],
    sizePrices: { "24": 320, "26": 330, "28": 340, "30": 360, "32": 380, "34": 400, "36": 420, "38": 440, "40": 460 },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png",
    stock: 100
  },
  {
    id: 11,
    name: "Classic School Trouser",
    category: "Boys",
    price: 250,
    sizes: ["20", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40", "42", "44"],
    sizePrices: { "20": 250, "22": 260, "24": 270, "26": 280, "28": 290, "30": 310, "32": 330, "34": 350, "36": 370, "38": 390, "40": 410, "42": 430, "44": 450 },
    school: "All Schools",
    image: "/uniforms/school_blazer.png",
    stock: 100
  },
  {
    id: 12,
    name: "Boys School Belt - Premium Leather",
    category: "Boys",
    price: 299,
    sizes: ["28-32", "32-36"],
    sizePrices: { "28-32": 299, "32-36": 320 },
    school: "All Schools",
    image: "/uniforms/school_blazer.png",
    stock: 100
  },
  {
    id: 13,
    name: "Girls School Belt - Premium Leather",
    category: "Girls",
    price: 299,
    sizes: ["24-28", "28-32"],
    sizePrices: { "24-28": 299, "28-32": 320 },
    school: "All Schools",
    image: "/uniforms/school_blazer.png",
    stock: 100
  },
  {
    id: 14,
    name: "Boys Striped School Tie",
    category: "Boys",
    price: 199,
    sizes: ["One Size"],
    sizePrices: { "One Size": 199 },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png",
    stock: 100
  },
  {
    id: 15,
    name: "Girls Striped School Tie",
    category: "Girls",
    price: 199,
    sizes: ["One Size"],
    sizePrices: { "One Size": 199 },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png",
    stock: 100
  },
  {
    id: 16,
    name: "Boys Cotton Socks (Pack of 3)",
    category: "Boys",
    price: 180,
    sizes: ["S", "M", "L"],
    sizePrices: { "S": 180, "M": 190, "L": 200 },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png",
    stock: 100
  },
  {
    id: 17,
    name: "Boys Formal Black Shoes",
    category: "Boys",
    price: 650,
    sizes: ["3", "4", "5", "6", "7", "8"],
    sizePrices: { "3": 650, "4": 670, "5": 690, "6": 710, "7": 730, "8": 750 },
    school: "All Schools",
    image: "/uniforms/school_blazer.png",
    stock: 100
  },
  {
    id: 18,
    name: "Boys Woolen Winter Sweater",
    category: "Boys",
    price: 550,
    sizes: ["30", "32", "34", "36", "38"],
    sizePrices: { "30": 550, "32": 580, "34": 610, "36": 640, "38": 670 },
    school: "All Schools",
    image: "/uniforms/school_blazer.png",
    stock: 100
  },
  {
    id: 19,
    name: "Girls Cotton Socks (Pack of 3)",
    category: "Girls",
    price: 180,
    sizes: ["S", "M", "L"],
    sizePrices: { "S": 180, "M": 190, "L": 200 },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png",
    stock: 100
  },
  {
    id: 20,
    name: "Girls Formal Black Shoes",
    category: "Girls",
    price: 600,
    sizes: ["2", "3", "4", "5", "6", "7"],
    sizePrices: { "2": 600, "3": 620, "4": 640, "5": 660, "6": 680, "7": 700 },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png",
    stock: 100
  },
  {
    id: 21,
    name: "Girls Premium Winter Cardigan",
    category: "Girls",
    price: 580,
    sizes: ["28", "30", "32", "34", "36"],
    sizePrices: { "28": 580, "30": 610, "32": 640, "34": 670, "36": 700 },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png",
    stock: 100
  },
  {
    id: 22,
    name: "Sports Track Pants - Premium",
    category: "Sports",
    price: 399,
    sizes: ["24", "26", "28", "30", "32", "34"],
    sizePrices: { "24": 399, "26": 420, "28": 440, "30": 460, "32": 480, "34": 500 },
    school: "All Schools",
    image: "/uniforms/sports_uniform.png",
    stock: 100
  },
  {
    id: 23,
    name: "Sports Windbreaker Jacket",
    category: "Sports",
    price: 799,
    sizes: ["S", "M", "L", "XL"],
    sizePrices: { "S": 799, "M": 849, "L": 899, "XL": 949 },
    school: "All Schools",
    image: "/uniforms/sports_uniform.png",
    stock: 100
  },
  {
    id: 24,
    name: "Sports Socks - Cushioned (Pair)",
    category: "Sports",
    price: 80,
    sizes: ["One Size"],
    sizePrices: { "One Size": 80 },
    school: "All Schools",
    image: "/uniforms/sports_uniform.png",
    stock: 100
  },
  {
    id: 25,
    name: "House T-Shirt - Red / Blue / Green / Yellow",
    category: "Sports",
    price: 199,
    sizes: ["22", "24", "26", "28", "30", "32", "34"],
    sizePrices: { "22": 199, "24": 210, "26": 220, "28": 230, "30": 240, "32": 250, "34": 260 },
    school: "All Schools",
    image: "/uniforms/sports_uniform.png",
    stock: 100
  },
  {
    id: 26,
    name: "Kamarajar School Special Blazer",
    category: "Boys",
    price: 1299,
    sizes: ["30", "32", "34", "36"],
    sizePrices: { "30": 1299, "32": 1349, "34": 1399, "36": 1449 },
    school: "Kamarajar Matriculation Higher Secondary School",
    image: "/uniforms/school_blazer.png",
    stock: 100
  },
  {
    id: 27,
    name: "Mahatma School Sports Uniform Set",
    category: "Sports",
    price: 520,
    sizes: ["22", "24", "26", "28", "30"],
    sizePrices: { "22": 520, "24": 540, "26": 560, "28": 580, "30": 600 },
    school: "Mahatma Montessori Matriculation School",
    image: "/uniforms/sports_uniform.png",
    stock: 100
  },
  {
    id: 28,
    name: "TVS Academy Uniform Tie",
    category: "Boys",
    price: 220,
    sizes: ["One Size"],
    sizePrices: { "One Size": 220 },
    school: "TVS Academy",
    image: "/uniforms/boys_shirt.png",
    stock: 100
  },
  {
    id: 29,
    name: "St. Joseph's Premium Salwar Kameez",
    category: "Girls",
    price: 850,
    sizes: ["26", "28", "30", "32", "34", "36", "38"],
    sizePrices: { "26": 850, "28": 890, "30": 930, "32": 970, "34": 1010, "36": 1050, "38": 1090 },
    school: "St. Joseph's Girls Higher Secondary School",
    image: "/uniforms/girls_skirt.png",
    stock: 100
  },
  {
    id: 30,
    name: "O.C.P.M. School Salwar Set",
    category: "Girls",
    price: 850,
    sizes: ["26", "28", "30", "32", "34", "36", "38"],
    sizePrices: { "26": 850, "28": 890, "30": 930, "32": 970, "34": 1010, "36": 1050, "38": 1090 },
    school: "O.C.P.M. Girls Higher Secondary School",
    image: "/uniforms/girls_skirt.png",
    stock: 100
  }
];

// File DB Fallback helpers
const getLocalDb = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeJsonSync(DB_FILE, { users: [], feedbacks: [], contacts: [], orders: [], uniforms: initialUniforms }, { spaces: 2 });
    }
    const data = fs.readJsonSync(DB_FILE);
    if (!data.uniforms || data.uniforms.length === 0) {
      data.uniforms = initialUniforms;
      fs.writeJsonSync(DB_FILE, data, { spaces: 2 });
    }
    if (!data.orders) data.orders = [];
    return data;
  } catch (e) {
    console.error('Local DB read error:', e);
    return { users: [], feedbacks: [], contacts: [], orders: [], uniforms: initialUniforms };
  }
};

const saveLocalDb = (data) => {
  try {
    fs.writeJsonSync(DB_FILE, data, { spaces: 2 });
  } catch (e) {
    console.error('Local DB save error:', e);
  }
};

const ensureUniformsSeeded = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            const count = await Uniform.countDocuments();
            if (count === 0) {
                console.log('Seeding 30 initial uniforms into MongoDB Atlas...');
                await Uniform.insertMany(initialUniforms);
                console.log('Uniform seeding completed successfully!');
            }
        }
    } catch (err) {
        console.error('Error during uniform seeding:', err);
    }
};

// Connect to MongoDB asynchronously without blocking server routes
mongoose.connect(MONGODB_URL, { serverSelectionTimeoutMS: 5000 })
    .then(async () => {
        console.log('Connected to MongoDB Atlas');
        await ensureUniformsSeeded();
    })
    .catch(err => {
        console.warn('MongoDB connection unavailable/timed out. Switching seamlessly to Local DB storage (db.json).', err.message);
    });

// Root route to show server status
app.get('/', (req, res) => {
    const isMongo = mongoose.connection.readyState === 1;
    res.json({
        message: 'Server is running',
        database: isMongo ? 'Connected (MongoDB Atlas)' : 'Local File Storage (db.json)'
    });
});

// --- Auth Routes ---

app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        if (mongoose.connection.readyState === 1) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                name,
                email: email.toLowerCase(),
                password: hashedPassword
            });

            const token = jwt.sign({ id: newUser._id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });
            return res.status(201).json({ token, user: { name: newUser.name, email: newUser.email } });
        } else {
            const dbData = getLocalDb();
            const existingUser = dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                id: Date.now(),
                name,
                email: email.toLowerCase(),
                password: hashedPassword
            };
            dbData.users.push(newUser);
            saveLocalDb(dbData);

            const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });
            return res.status(201).json({ token, user: { name: newUser.name, email: newUser.email } });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        if (mongoose.connection.readyState === 1) {
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ token, user: { name: user.name, email: user.email } });
        } else {
            const dbData = getLocalDb();
            const user = dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ token, user: { name: user.name, email: user.email } });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});

// --- Uniform Routes ---

app.get('/api/uniforms', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            let uniforms = await Uniform.find().sort({ id: 1 });
            if (uniforms.length === 0) {
                await ensureUniformsSeeded();
                uniforms = await Uniform.find().sort({ id: 1 });
            }
            return res.json(uniforms);
        } else {
            const dbData = getLocalDb();
            return res.json(dbData.uniforms);
        }
    } catch (error) {
        const dbData = getLocalDb();
        return res.json(dbData.uniforms);
    }
});

app.put('/api/uniforms/:id/stock', async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;
    try {
        if (mongoose.connection.readyState === 1) {
            const uniform = await Uniform.findOneAndUpdate({ id: Number(id) }, { stock: Number(stock) }, { new: true });
            if (!uniform) return res.status(404).json({ message: 'Uniform not found' });
            return res.json(uniform);
        } else {
            const dbData = getLocalDb();
            const uniform = dbData.uniforms.find(u => u.id === Number(id));
            if (!uniform) return res.status(404).json({ message: 'Uniform not found' });
            uniform.stock = Number(stock);
            saveLocalDb(dbData);
            return res.json(uniform);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating stock' });
    }
});

// --- Feedback Routes ---

app.get('/api/feedback', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const feedbacks = await Feedback.find().sort({ createdAt: -1 });
            return res.json(feedbacks);
        } else {
            const dbData = getLocalDb();
            return res.json(dbData.feedbacks || []);
        }
    } catch (error) {
        const dbData = getLocalDb();
        return res.json(dbData.feedbacks || []);
    }
});

app.post('/api/feedback', async (req, res) => {
    const { name, email, rating, comment } = req.body;
    if (!name || !rating || !comment) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        if (mongoose.connection.readyState === 1) {
            const newFeedback = await Feedback.create({
                name,
                email,
                rating,
                comment,
                date: dateStr
            });
            return res.status(201).json(newFeedback);
        } else {
            const dbData = getLocalDb();
            const newFeedback = {
                id: Date.now(),
                name,
                email,
                rating,
                comment,
                date: dateStr
            };
            dbData.feedbacks.unshift(newFeedback);
            saveLocalDb(dbData);
            return res.status(201).json(newFeedback);
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Error submitting feedback' });
    }
});

// --- Contact Routes ---

app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        if (mongoose.connection.readyState === 1) {
            await Contact.create({
                name,
                email,
                phone: phone || '',
                subject,
                message,
                date: new Date().toISOString()
            });
            return res.status(201).json({ message: 'Message sent successfully' });
        } else {
            const dbData = getLocalDb();
            dbData.contacts.unshift({
                id: Date.now(),
                name,
                email,
                phone: phone || '',
                subject,
                message,
                date: new Date().toISOString()
            });
            saveLocalDb(dbData);
            return res.status(201).json({ message: 'Message sent successfully' });
        }
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
});

// --- Order Routes ---

// Create Order and decrement stock with guaranteed fail-safe execution
app.post('/api/orders', async (req, res) => {
    const { user, items, totalAmount, shippingAddress, phone, paymentMethod } = req.body;
    if (!user || !user.name || !user.email || !items || !items.length || !totalAmount || !shippingAddress || !phone) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Local DB Order Processor
    const processLocalOrder = () => {
        const dbData = getLocalDb();
        
        // Check stock availability
        for (const item of items) {
            const uniform = dbData.uniforms.find(u => u.id === item.id);
            if (uniform && (uniform.stock ?? 100) < item.quantity) {
                return {
                    success: false,
                    status: 400,
                    message: `Insufficient stock for "${item.name}". Only ${uniform.stock ?? 100} left.`
                };
            }
        }

        // Deduct stock in db.json
        for (const item of items) {
            const uniform = dbData.uniforms.find(u => u.id === item.id);
            if (uniform) {
                uniform.stock = Math.max(0, (uniform.stock ?? 100) - item.quantity);
            }
        }

        const orderId = `ORD-${Date.now().toString().slice(-6)}`;
        const newOrder = {
            _id: orderId,
            user: { name: user.name, email: user.email.toLowerCase() },
            items,
            totalAmount,
            shippingAddress,
            phone,
            paymentMethod: paymentMethod || 'COD',
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        dbData.orders.unshift(newOrder);
        saveLocalDb(dbData);

        return {
            success: true,
            status: 201,
            message: 'Order placed successfully',
            orderId
        };
    };

    try {
        if (mongoose.connection.readyState === 1) {
            // Check stock in MongoDB Atlas
            for (const item of items) {
                const uniform = await Uniform.findOne({ id: item.id });
                if (uniform && uniform.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Insufficient stock for "${item.name}". Only ${uniform.stock} left in stock.`
                    });
                }
            }

            // Deduct stock in MongoDB Atlas
            for (const item of items) {
                await Uniform.findOneAndUpdate(
                    { id: item.id },
                    { $inc: { stock: -item.quantity } }
                );
            }

            const newOrder = await Order.create({
                user: {
                    name: user.name,
                    email: user.email.toLowerCase()
                },
                items,
                totalAmount,
                shippingAddress,
                phone,
                paymentMethod: paymentMethod || 'COD',
                status: 'Pending'
            });

            // Also sync local db file
            processLocalOrder();

            return res.status(201).json({ message: 'Order placed successfully', orderId: newOrder._id });
        } else {
            const localRes = processLocalOrder();
            return res.status(localRes.status).json({
                message: localRes.message,
                orderId: localRes.orderId
            });
        }
    } catch (error) {
        console.error('MongoDB operation error, executing fail-safe order processing:', error.message || error);
        const localRes = processLocalOrder();
        return res.status(localRes.status).json({
            message: localRes.message,
            orderId: localRes.orderId
        });
    }
});

// Get user orders with fallback
app.get('/api/orders/:email', async (req, res) => {
    const { email } = req.params;
    try {
        if (mongoose.connection.readyState === 1) {
            const orders = await Order.find({ 'user.email': email.toLowerCase() }).sort({ createdAt: -1 });
            return res.json(orders);
        } else {
            const dbData = getLocalDb();
            const userOrders = (dbData.orders || []).filter(
                (o) => o.user?.email?.toLowerCase() === email.toLowerCase()
            );
            return res.json(userOrders);
        }
    } catch (error) {
        const dbData = getLocalDb();
        const userOrders = (dbData.orders || []).filter(
            (o) => o.user?.email?.toLowerCase() === email.toLowerCase()
        );
        return res.json(userOrders);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
