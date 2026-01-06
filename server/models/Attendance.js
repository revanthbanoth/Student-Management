const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, required: true },
    periods: {
        period1: { type: String, enum: ['Present', 'Absent', null], default: null },
        period2: { type: String, enum: ['Present', 'Absent', null], default: null },
        period3: { type: String, enum: ['Present', 'Absent', null], default: null },
        period4: { type: String, enum: ['Present', 'Absent', null], default: null },
        period5: { type: String, enum: ['Present', 'Absent', null], default: null },
        period6: { type: String, enum: ['Present', 'Absent', null], default: null }
    }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
