const mongoose = require('mongoose');

const studyLogSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
    },
    minutesStudied: {
        type: Number,
        default: 0
    },
    completedTasks: [{
        type: String // Task IDs or descriptions
    }]
}, {
    timestamps: true,
});

// Ensure unique entry per user per day
studyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const StudyLog = mongoose.model('StudyLog', studyLogSchema);
module.exports = StudyLog;
