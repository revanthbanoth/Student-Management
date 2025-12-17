const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

router.post('/create', async (req, res) => {
    try {
        const { name, section, teacher_id } = req.body;
        const newClass = new Class({
            name,
            section,
            teacher_id
        });
        await newClass.save();
        return res.json({ created: true });
    } catch (err) {
        return res.json({ message: "Error in creating class" });
    }
});

router.get('/classes', async (req, res) => {
    try {
        // Populate teacher details
        const classes = await Class.find().populate('teacher_id', 'username');
        return res.json(classes);
    } catch (err) {
        return res.json(err);
    }
});

router.get('/class/teacher/:id', async (req, res) => {
    try {
        const classes = await Class.find({ teacher_id: req.params.id });
        return res.json(classes);
    } catch (err) {
        return res.json(err);
    }
});

router.delete('/class/:id', async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        return res.json({ deleted: true });
    } catch (err) {
        return res.json(err);
    }
});

module.exports = router;
