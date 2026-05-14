const Todo = require('../models/Todo');

// @desc    Get all todos
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
    try {
        const { text, priority, dueDate } = req.body;
        const todo = await Todo.create({
            userId: req.user._id,
            text,
            priority,
            dueDate
        });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo) {
            if (todo.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            todo.isCompleted = req.body.isCompleted !== undefined ? req.body.isCompleted : todo.isCompleted;
            todo.text = req.body.text || todo.text;
            todo.priority = req.body.priority || todo.priority;
            
            const updatedTodo = await todo.save();
            res.json(updatedTodo);
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo) {
            if (todo.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await todo.deleteOne();
            res.json({ message: 'Todo removed' });
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
