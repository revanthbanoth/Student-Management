const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
// const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    try {
        const { username, password, email, subject, contact } = req.body;
        const teacher = await Teacher.findOne({ username });
        if (teacher) {
            return res.json({ message: "Teacher already registered" });
        }

        const newTeacher = new Teacher({
            username,
            password,
            email,
            subject,
            contact
        });
        await newTeacher.save();
        return res.json({ registered: true });
    } catch (err) {
        return res.json({ message: "Error in registering teacher" });
    }
});

router.get('/teachers', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        return res.json(teachers);
    } catch (err) {
        return res.json(err);
    }
});

router.get('/teacher/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        return res.json(teacher);
    } catch (err) {
        return res.json(err);
    }
});

router.put('/teacher/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, subject, contact } = req.body;
        const updatedTeacher = await Teacher.findByIdAndUpdate(id, { username, email, subject, contact }, { new: true });
        return res.json({ updated: true, teacher: updatedTeacher });
    } catch (err) {
        return res.json({ message: "Error updating teacher" });
    }
});

router.delete('/teacher/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Teacher.findByIdAndDelete(id);
        return res.json({ deleted: true });
    } catch (err) {
        return res.json({ message: "Error deleting teacher" });
    }
});

module.exports = router;
