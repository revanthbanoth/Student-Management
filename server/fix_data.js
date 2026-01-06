const mongoose = require('mongoose');
const Student = require('./models/Student');
const Class = require('./models/Class');

const MONGO_URI = "mongodb://localhost:27017/student_management";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to DB...");

        // 1. Fix Duplicates in Classes
        const classes = await Class.find({});
        const seen = new Set();
        for (const cls of classes) {
            const key = `${cls.name}-${cls.section}`;
            if (seen.has(key)) {
                console.log(`Removing duplicate class: ${key} (ID: ${cls._id})`);
                await Class.findByIdAndDelete(cls._id);
            } else {
                seen.add(key);
            }
        }
        console.log("Class duplicates removed.");

        // 2. Fix Missing Sections in Students
        // Defaulting to "A" if missing, so they appear SOMEWHERE.
        const students = await Student.find({ section: { $exists: false } }); // or null/undefined check
        for (const stu of students) {
            if (!stu.section) {
                console.log(`Updating student ${stu.username} (Grade: ${stu.grade}) -> Defaulting to Section 'A'`);
                stu.section = 'A';
                await stu.save();
            }
        }

        // Also check if "section" field exists but is empty string
        const studentsEmpty = await Student.find({ section: "" });
        for (const stu of studentsEmpty) {
            console.log(`Updating student ${stu.username} -> Defaulting to Section 'A'`);
            stu.section = 'A';
            await stu.save();
        }

        console.log("Students updated.");
        process.exit();
    })
    .catch(err => console.error(err));
