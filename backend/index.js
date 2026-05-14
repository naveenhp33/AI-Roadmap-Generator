const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const studyRoutes = require('./routes/studyRoutes');
const todoRoutes = require('./routes/todoRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/todos', todoRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
    });
} else {
    // Error Handling Middleware (dev only, in prod the catch-all handles it)
    const { errorHandler, notFound } = require('./middleware/errorMiddleware');
    app.use(notFound);
    app.use(errorHandler);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Roadmap routes registered: /api/roadmaps`);
});
