const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient_role: {
        type: String,
        enum: ['teacher', 'student', 'all-teachers', 'all-students', 'grade-students'],
        required: true
    },
    target_grade: {
        type: String,
        default: null
    },
    recipient_id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'recipient_role' // Dynamic reference based on role, though simple ID storage is often enough
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'info' // info, alert, result
    },
    isRead: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    attachmentUrl: {
        type: String,
        default: null
    },
    attachmentType: {
        type: String, // 'image', 'pdf', 'document', etc.
        default: null
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);
