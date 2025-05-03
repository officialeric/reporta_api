const express = require('express');
const cors =require('cors')
const path =require('path')
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const otherRoutes = require('./routes/otherRoutes');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://report.johshopping.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400, 
};

// Middleware
app.use(cors(corsOptions));


app.use(bodyParser.json());
require('dotenv').config();

app.use('/api/auth', authRoutes);
app.use('/api/other', otherRoutes);

app.listen(process.env.SERVER_PORT, () => {
    console.log(
      `Server is running on http://localhost:${process.env.SERVER_PORT}`
    );
  });