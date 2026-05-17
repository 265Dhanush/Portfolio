const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authroutes');
const taskRoutes = require('./routes/task_routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
