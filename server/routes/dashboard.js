const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Class = require('../models/Class');

router.get('/stats', async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();
        const teacherCount = await Teacher.countDocuments();
        const classCount = await Class.countDocuments();

        return res.json({
            students: studentCount,
            teachers: teacherCount,
            classes: classCount
        });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching stats" });
    }
});

module.exports = router;
