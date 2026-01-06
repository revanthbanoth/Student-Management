const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const mult = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = mult.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = mult({ storage: storage });

const Student = require('../models/Student');

// Send a notification (Admin to Teacher, or System to Student)
router.post('/send', upload.single('attachment'), async (req, res) => {
    try {
        const { recipient_role, recipient_id, message, type, target_grade } = req.body;

        let attachmentUrl = null;
        let attachmentType = null;

        if (req.file) {
            attachmentUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            if (req.file.mimetype.startsWith('image/')) {
                attachmentType = 'image';
            } else if (req.file.mimetype === 'application/pdf') {
                attachmentType = 'pdf';
            } else {
                attachmentType = 'document';
            }
        }

        const newNotification = new Notification({
            recipient_role,
            recipient_id: recipient_id || null,
            message,
            type,
            target_grade: target_grade || null,
            attachmentUrl,
            attachmentType
        });
        await newNotification.save();
        return res.json({ sent: true, notification: newNotification });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to send notification" });
    }
});

// Get notifications for a specific user (Student or Teacher)
router.get('/user/:role/:userId', async (req, res) => {
    try {
        const { role, userId } = req.params;

        let query = {
            $or: [
                { recipient_id: userId, recipient_role: role }, // Specific to user
            ]
        };

        if (role === 'teacher') {
            query.$or.push({ recipient_role: 'all-teachers' }); // Broadcasts
        }
        if (role === 'student') {
            query.$or.push({ recipient_role: 'all-students' }); // Broadcasts

            // Check for grade-specific notifications
            const student = await Student.findById(userId);
            if (student) {
                query.$or.push({ recipient_role: 'grade-students', target_grade: student.grade });
            }
        }

        const notifications = await Notification.find(query).sort({ date: -1 });
        return res.json(notifications);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

// Mark as read
router.put('/read/:id', async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json(err);
    }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        return res.json({ deleted: true });
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
