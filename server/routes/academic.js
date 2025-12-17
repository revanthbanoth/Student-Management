const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');

// Attendance
router.post('/attendance', async (req, res) => {
    try {
        const { student_id, class_id, date, status } = req.body;
        const newAttendance = new Attendance({
            student_id,
            class_id,
            date,
            status
        });
        await newAttendance.save();
        return res.json({ recorded: true });
    } catch (err) {
        return res.json({ message: "Error recording attendance" });
    }
});

router.get('/attendance/:studentId', async (req, res) => {
    try {
        const attendance = await Attendance.find({ student_id: req.params.studentId });
        return res.json(attendance);
    } catch (err) {
        return res.json(err);
    }
});

// Marks
router.post('/mark', async (req, res) => {
    try {
        const { student_id, subject, score, max_score, exam_type } = req.body;
        const newMark = new Mark({
            student_id,
            subject,
            score,
            max_score,
            exam_type
        });
        await newMark.save();
        return res.json({ recorded: true });
    } catch (err) {
        return res.json({ message: "Error recording mark" });
    }
});

router.get('/marks/:studentId', async (req, res) => {
    try {
        const marks = await Mark.find({ student_id: req.params.studentId });
        return res.json(marks);
    } catch (err) {
        return res.json(err);
    }
});

module.exports = router;
