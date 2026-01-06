const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./routes/router');
const Admin = require('./models/Admin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', router);
app.use('/student', require('./routes/student'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/teacher', require('./routes/teacher'));
app.use('/class', require('./routes/class'));
app.use('/academic', require('./routes/academic'));
app.use('/notification', require('./routes/notification'));
app.use('/exam', require('./routes/exam'));

app.get('/', (req, res) => {
    res.send('Welcome to the Student Management System API');
});

// Serve uploads
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Seed Admin if not exists
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            const newAdmin = new Admin({
                username: 'admin',
                password: 'admin123'
            });
            await newAdmin.save();
            console.log("Default Admin Created: admin / admin123");
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
