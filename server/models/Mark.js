const mongoose = require('mongoose');

const MarkSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: String, required: true },
    score: { type: Number, required: true },
    max_score: { type: Number, required: true, default: 100 },
    exam_type: { type: String, required: true } // e.g., "Midterm", "Final"
});

module.exports = mongoose.model('Mark', MarkSchema);
