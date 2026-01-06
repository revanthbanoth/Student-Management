const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Notification = require('../models/Notification');

// Create a new Exam Schedule and Notify everyone
router.post('/create', async (req, res) => {
    try {
        const { title, description, startDate, endDate, timetable } = req.body;

        const newExam = new Exam({
            title,
            description,
            startDate,
            endDate,
            timetable
        });
        await newExam.save();

        // Notify All Students
        const studentNotification = new Notification({
            recipient_role: 'all-students',
            message: `Exam dates has been released: ${title}. Check the Examination Cell for details.`,
            type: 'exam', // Custom type to trigger specific popup/action
            date: new Date()
        });
        await studentNotification.save();

        // Notify All Teachers
        const teacherNotification = new Notification({
            recipient_role: 'all-teachers',
            message: `Exam dates has been released: ${title}.`,
            type: 'exam',
            date: new Date()
        });
        await teacherNotification.save();

        return res.json({ success: true, exam: newExam });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to create exam schedule" });
    }
});

// Get all Exams (sorted by latest)
router.get('/all', async (req, res) => {
    try {
        const exams = await Exam.find().sort({ createdAt: -1 });
        return res.json(exams);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch exams" });
    }
});

// Release Hall Ticket
router.put('/release/:id', async (req, res) => {
    try {
        await Exam.findByIdAndUpdate(req.params.id, { isReleased: true });
        return res.json({ success: true, message: "Hall ticket released" });
    } catch (err) {
        return res.status(500).json(err);
    }
});

// Block/Unblock a student from Hall Ticket
router.put('/block/:id', async (req, res) => {
    try {
        const { studentId, action } = req.body; // action: 'block' or 'unblock'
        const exam = await Exam.findById(req.params.id);

        if (action === 'block') {
            if (!exam.blockedCandidates.includes(studentId)) {
                exam.blockedCandidates.push(studentId);
            }
        } else {
            exam.blockedCandidates = exam.blockedCandidates.filter(id => id.toString() !== studentId);
        }

        await exam.save();
        return res.json({ success: true, blockedCandidates: exam.blockedCandidates });
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
