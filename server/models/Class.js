const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Grade 10"
    section: { type: String, required: true }, // e.g., "A"
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true } // Class Teacher
});

module.exports = mongoose.model('Class', ClassSchema);
