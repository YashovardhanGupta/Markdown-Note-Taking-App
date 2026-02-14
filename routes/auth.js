const express =  require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//! Register a new user
//! Endpoint: POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        //? Check if the user already exists
        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //? Create a new user
        user = new User({ username, email, password });

        //? Save the user to the database
        await user.save();

        //? Create a token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//! Login a user
//! Endpoint: POST /api/auth/login

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        //? Find the user by email
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //? Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //? Create a token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;