const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    timetable: [{
        subject: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true }
    }],
    isReleased: {
        type: Boolean,
        default: false
    },
    blockedCandidates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Exam', ExamSchema);
