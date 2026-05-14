const mongoose = require('mongoose');

const roadmapSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    targetRole: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    duration: {
        type: Number,
        required: true, // in months
    },
    roadmapData: {
        type: Object, // Structured JSON from Gemini
        required: true,
    },
    progress: {
        type: Number,
        default: 0,
    },
    completedTasks: {
        type: [String],
        default: []
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
module.exports = Roadmap;
