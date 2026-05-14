const StudyLog = require('../models/StudyLog');

// @desc    Log study activity
// @route   POST /api/study/log
// @access  Private
const logStudyActivity = async (req, res) => {
    try {
        const { date, minutesStudied, task } = req.body;
        
        let studyLog = await StudyLog.findOne({ userId: req.user._id, date });

        if (studyLog) {
            studyLog.minutesStudied += (minutesStudied || 0);
            if (task && !studyLog.completedTasks.includes(task)) {
                studyLog.completedTasks.push(task);
            }
            await studyLog.save();
        } else {
            studyLog = await StudyLog.create({
                userId: req.user._id,
                date,
                minutesStudied: minutesStudied || 0,
                completedTasks: task ? [task] : []
            });
        }

        res.status(201).json(studyLog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get study history
// @route   GET /api/study/history
// @access  Private
const getStudyHistory = async (req, res) => {
    try {
        const history = await StudyLog.find({ userId: req.user._id }).sort({ date: 1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { logStudyActivity, getStudyHistory };
