// index.js  
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');

// index.js  
const rateLimit = require('express-rate-limit');  

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const fileRoutes = require('./routes/fileRoutes');
const mfgRoutes = require("./routes/mfgBotRoutes")

// Connect to MongoDB  
connectDB();

const app = express();

// Middleware  
app.use(cors()); // Enable CORS for all routes (customize as needed)  
app.use(express.json()); // Parse JSON bodies

// Apply rate limiting to authentication routes  
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes  
  max: 100, // limit each IP to 100 requests per windowMs  
  message: 'Too many requests from this IP, please try again later.',
});

// Routes  
app.use('/api/auth', authLimiter ,authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/mfg_bot', mfgRoutes);

// Root Route  
app.get('/', (req, res) => {
  res.send('AI Chat Bot Backend API');
});

// Error Handling Middleware (Optional)  
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Server error' });
});

// Start Server  
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});  