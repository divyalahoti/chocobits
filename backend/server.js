const dns = require('dns');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// const connectDB = require('./config/db');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
// connectDB();

// change DNS

dns.setServers(["1.1.1.1", "8.8.8.8"]);


const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  "http://localhost:3000",
  "https://chocobitsbackend.vercel.app/",
  "https://chocobitsfrontend.vercel.app/"

];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser tools like Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(' CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // if using cookies or Authorization headers
};

app.use(cors(corsOptions));



app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ message: '🍫 ChocoBits API Running' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(notFound);
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected "))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
