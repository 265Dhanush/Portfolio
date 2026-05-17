const db = require('../config/db');

exports.createTask = async (req, res) => {
    const { title, description } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)',
            [req.user.id, title, description]
        );
        res.status(201).json({ id: result.insertId, title, description, status: 'pending' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const [tasks] = await db.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    const { title, description, status } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
            [title, description, status, req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};