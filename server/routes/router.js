const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (role === 'admin') {
            const admin = await Admin.findOne({ username });
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }
            // In a real app, use bcrypt to compare hashes!
            if (admin.password !== password) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            return res.status(200).json({ login: true, role: 'admin' });
        } else if (role === 'student') {
            const student = await Student.findOne({ username });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            if (student.password !== password) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            return res.status(200).json({ login: true, role: 'student', id: student._id });
        } else if (role === 'teacher') {
            const teacher = await Teacher.findOne({ username });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            if (teacher.password !== password) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            return res.status(200).json({ login: true, role: 'teacher', id: teacher._id }); // access teacher id
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
