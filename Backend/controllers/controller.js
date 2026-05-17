const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists' });
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ error: 'Invalid email or password' });

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};