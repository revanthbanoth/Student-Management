const mongoose = require('mongoose');
const Student = require('./server/models/Student');
const Class = require('./server/models/Class');
require('dotenv').config({ path: './client/.env' }); // try to load env? No, backend env is usually in server/.env or root
// Actually usually root .env or hardcoded in main.js for this project?
// Let's assume standard mongo URI if I can find it, or use the one from server/index.js if I could see it.
// I'll try to read server/index.js first to see how it connects, or just check .env

// Wait, I can just cat the student.js route file again to see? No, connection is in index.js
console.log("Reading DB...");
