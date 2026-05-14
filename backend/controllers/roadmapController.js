const mongoose = require('mongoose');
const Roadmap = require('../models/Roadmap');
const { generateRoadmap, chatWithMentor } = require('../services/geminiService');

// @desc    Generate a new roadmap
// @route   POST /api/roadmaps/generate
// @access  Private
const createRoadmap = async (req, res) => {
    try {
        console.log('Generating roadmap for user:', req.user._id);
        const { targetRole, skills, experienceLevel, studyHours, duration, preferredLearningStyle, interests } = req.body;

        const roadmapData = await generateRoadmap({
            targetRole,
            skills,
            experienceLevel,
            studyHours,
            duration,
            preferredLearningStyle,
            interests
        });

        console.log('Roadmap data generated successfully');

        const roadmap = await Roadmap.create({
            userId: req.user._id,
            targetRole,
            skills: skills ? skills.split(',').map(s => s.trim()) : [],
            duration,
            roadmapData,
            progress: 0,
            completedTasks: []
        });

        res.status(201).json(roadmap);
    } catch (error) {
        console.error('Create Roadmap Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user roadmaps
// @route   GET /api/roadmaps
// @access  Private
const getUserRoadmaps = async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(roadmaps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get roadmap by ID
// @route   GET /api/roadmaps/:id
// @access  Private
const getRoadmapById = async (req, res) => {
    try {
        const roadmap = await Roadmap.findById(req.params.id);

        if (roadmap) {
            // Check if user owns roadmap OR if it is public
            if (roadmap.userId.toString() !== req.user._id.toString() && !roadmap.isPublic) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            res.json(roadmap);
        } else {
            res.status(404).json({ message: 'Roadmap not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update roadmap progress
// @route   PUT /api/roadmaps/:id/progress
// @access  Private
const updateProgress = async (req, res) => {
    try {
        const { taskId, isCompleted } = req.body;
        const roadmap = await Roadmap.findById(req.params.id);

        if (roadmap) {
            if (roadmap.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            let completedTasks = [...roadmap.completedTasks];
            if (isCompleted && !completedTasks.includes(taskId)) {
                completedTasks.push(taskId);
            } else if (!isCompleted && completedTasks.includes(taskId)) {
                completedTasks = completedTasks.filter(t => t !== taskId);
            }

            // Simple progress calculation based on number of tasks.
            // A more complex implementation would count all tasks from roadmapData.
            let totalTasks = 0;
            if (roadmap.roadmapData && roadmap.roadmapData.monthlyRoadmap) {
                roadmap.roadmapData.monthlyRoadmap.forEach(m => {
                    m.weeklyGoals.forEach(w => {
                        totalTasks += w.tasks.length;
                    });
                });
            }

            const progress = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

            roadmap.completedTasks = completedTasks;
            roadmap.progress = progress;

            const updatedRoadmap = await roadmap.save();
            res.json(updatedRoadmap);
        } else {
            res.status(404).json({ message: 'Roadmap not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Chat with Mentor
// @route   POST /api/roadmaps/chat
// @access  Private
const mentorChat = async (req, res) => {
    try {
        const { message, history } = req.body;
        const responseText = await chatWithMentor(message, history);
        res.json({ reply: responseText });
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle roadmap privacy
// @route   PUT /api/roadmaps/:id/privacy
// @access  Private
const togglePrivacy = async (req, res) => {
    try {
        const roadmap = await Roadmap.findById(req.params.id);
        if (roadmap) {
            if (roadmap.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            roadmap.isPublic = !roadmap.isPublic;
            await roadmap.save();
            res.json(roadmap);
        } else {
            res.status(404).json({ message: 'Roadmap not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all public roadmaps
// @route   GET /api/roadmaps/public
// @access  Private
const getPublicRoadmaps = async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({ isPublic: true }).sort({ createdAt: -1 });
        res.json(roadmaps);
    } catch (error) {
        console.error('Error in getPublicRoadmaps:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a roadmap
// @route   DELETE /api/roadmaps/:id
// @access  Private
const deleteRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        console.log(`Backend: Received delete request for Roadmap ID: ${id} from User ID: ${userId}`);

        // Ensure we are using valid ObjectIds
        const roadmapId = new mongoose.Types.ObjectId(id);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const roadmap = await Roadmap.findOneAndDelete({ _id: roadmapId, userId: userObjectId });

        if (!roadmap) {
            console.log(`Backend: Roadmap not found or user not authorized. ID: ${id}`);
            return res.status(404).json({ message: 'Roadmap not found or unauthorized' });
        }

        console.log(`Backend: Roadmap ${id} deleted successfully`);
        res.json({ message: 'Roadmap removed successfully' });
    } catch (error) {
        console.error('Backend: Delete Roadmap Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    createRoadmap, 
    getUserRoadmaps, 
    getRoadmapById, 
    updateProgress, 
    mentorChat, 
    togglePrivacy, 
    getPublicRoadmaps,
    deleteRoadmap
};
