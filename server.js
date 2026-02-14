const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

//! Load env vars
dotenv.config();

//! Connect to database
connectDB();

const app = express();

//! Middleware to parse JSON bodies
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});