const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
// const Teacher = require('../models/Teacher'); // Assuming you will have a Teacher model later
const Admin = require('../models/Admin');

router.get('/stats', async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();
        const adminCount = await Admin.countDocuments();
        // const teacherCount = await Teacher.countDocuments(); 

        // Hardcoding teacher/class counts for now as models might not exist yet based on file list
        // Or if I created dummy components, I likely don't have backend models for them yet.
        // I'll stick to what I know exists (Student) and return 0 or dummy for others until realized.

        return res.json({
            students: studentCount,
            teachers: 5, // Placeholder until Teacher model exists
            classes: 5   // Placeholder unti Class model exists
        });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching stats" });
    }
});

module.exports = router;
