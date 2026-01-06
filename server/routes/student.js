const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
// const bcrypt = require('bcrypt'); // Add back if installed

router.get('/students/grade/:grade', async (req, res) => {
    try {
        const students = await Student.find({ grade: req.params.grade });
        return res.json(students);
    } catch (err) {
        return res.json(err);
    }
});

router.get('/students/grade/:grade/section/:section', async (req, res) => {
    try {
        const { grade, section } = req.params;
        const students = await Student.find({ grade, section });
        return res.json(students);
    } catch (err) {
        return res.json(err);
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, roll, password, grade, section, gender } = req.body;
        const student = await Student.findOne({ roll });
        if (student) {
            return res.json({ message: "Student already registered" });
        }

        // Plain text for now as per existing Admin.js pattern
        // const hashPassword = await bcrypt.hash(password, 10);

        const newStudent = new Student({
            username,
            roll,
            password,
            grade,
            section,
            gender
        });

        await newStudent.save();

        // Notification Logic
        try {
            const Class = require('../models/Class');
            const Notification = require('../models/Notification');

            // Find class to get teacher
            const cls = await Class.findOne({ name: grade, section: section });
            if (cls && cls.teacher_id) {
                const notif = new Notification({
                    userId: cls.teacher_id,
                    userType: 'teacher',
                    message: `New student ${username} (Roll: ${roll}) has been added to your class ${grade}-${section}.`,
                    type: 'alert'
                });
                await notif.save();
            }
        } catch (notifErr) {
            console.log("Notification error:", notifErr);
            // Don't fail the registration if notification fails
        }

        return res.json({ registered: true });

    } catch (err) {
        return res.json({ message: "Error in registering student" });
    }
});

router.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        return res.json(students);
    } catch (err) {
        return res.json(err);
    }
});

router.get('/student/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        return res.json(student);
    } catch (err) {
        return res.json(err);
    }
});

router.put('/student/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, roll, grade } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(id, { username, roll, grade }, { new: true });
        if (!updatedStudent) {
            return res.json({ message: "Student not found" });
        }
        return res.json({ updated: true, student: updatedStudent });
    } catch (err) {
        return res.json({ message: "Error updating student" });
    }
});

router.delete('/student/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.json({ message: "Student not found" });
        }
        return res.json({ deleted: true });
    } catch (err) {
        return res.json({ message: "Error deleting student" });
    }
});

module.exports = router;
