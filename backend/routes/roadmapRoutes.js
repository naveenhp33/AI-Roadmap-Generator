const express = require('express');
const { 
    createRoadmap, 
    getUserRoadmaps, 
    getRoadmapById, 
    updateProgress, 
    mentorChat, 
    togglePrivacy, 
    getPublicRoadmaps,
    deleteRoadmap
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getUserRoadmaps);
router.post('/generate', protect, createRoadmap);
router.post('/chat', protect, mentorChat);
router.get('/public', protect, getPublicRoadmaps);
router.get('/:id', protect, getRoadmapById);
router.put('/:id/progress', protect, updateProgress);
router.put('/:id/privacy', protect, togglePrivacy);
router.delete('/:id', protect, deleteRoadmap);

module.exports = router;
