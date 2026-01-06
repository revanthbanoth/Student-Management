const mongoose = require('mongoose');
const Student = require('./server/models/Student');
const Class = require('./server/models/Class');

const MONGO_URI = "mongodb://localhost:27017/student_management";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to DB");

        console.log("--- STUDENTS ---");
        const students = await Student.find({});
        students.forEach(s => {
            console.log(`User: ${s.username}, Roll: ${s.roll}, Grade: ${s.grade}, Section: ${s.section}, ID: ${s._id}`);
        });

        console.log("\n--- CLASSES ---");
        const classes = await Class.find({});
        classes.forEach(c => {
            console.log(`Class: ${c.name}, Section: ${c.section}, ID: ${c._id}`);
        });

        process.exit();
    })
    .catch(err => console.error(err));
