const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');

// Attendance
router.post('/attendance', async (req, res) => {
    try {
        const { student_id, class_id, date, period, status } = req.body;

        let attendance = await Attendance.findOne({ student_id, date });

        if (attendance) {
            if (!attendance.periods) {
                attendance.periods = {};
            }
            attendance.periods[`period${period}`] = status;
            await attendance.save();
        } else {
            const periods = {};
            periods[`period${period}`] = status;
            attendance = new Attendance({
                student_id,
                class_id,
                date,
                periods
            });
            await attendance.save();
        }
        return res.json({ recorded: true });
    } catch (err) {
        console.error(err);
        return res.json({ message: "Error recording attendance" });
    }
});

router.get('/attendance/:studentId', async (req, res) => {
    try {
        const attendance = await Attendance.find({ student_id: req.params.studentId }).sort({ date: -1 });
        return res.json(attendance);
    } catch (err) {
        return res.json(err);
    }
});

router.get('/attendance/class/:classId/date/:date', async (req, res) => {
    try {
        const { classId, date } = req.params;
        const attendance = await Attendance.find({
            class_id: classId,
            date: date
        });
        return res.json(attendance);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error fetching attendance" });
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
