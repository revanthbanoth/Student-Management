const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    roll: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: false // Optional for backward compatibility, strict it later
    }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
