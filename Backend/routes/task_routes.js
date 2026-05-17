const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

// All task routes are protected by the auth middleware
router.use(authenticateToken); 

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;