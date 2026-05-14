const express = require('express');
const { logStudyActivity, getStudyHistory } = require('../controllers/studyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/log', protect, logStudyActivity);
router.get('/history', protect, getStudyHistory);

module.exports = router;
