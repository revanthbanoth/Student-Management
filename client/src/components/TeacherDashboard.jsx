import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
    const navigate = useNavigate();

    // Mock teacher ID - in real app, get from auth context/localstorage
    // For now, I'll fetch the first teacher found or just list all classes if no ID
    // Actually, I should probably store teacherId in localStorage on login. 
    // I'll add a temporary "Select Teacher" or just fetch all classes for now to demonstrate.
    // Better: I will use the "teacher" role logic.
    // Let's assume the user IS logged in. I'll fetch ALL classes for now since I don't have auth context set up fully to pass ID.
    // Wait, the user wants "Teacher Login".
    // I'll grab the teacher ID from localStorage if I put it there in Login.jsx.
    // I will update Login.jsx to save it.

    useEffect(() => {
        // Fetch classes (ideally by teacher ID from localStorage)
        const teacherId = localStorage.getItem('userId');
        if (teacherId) {
            axios.get(`http://localhost:5000/class/class/teacher/${teacherId}`)
                .then(res => setClasses(res.data))
                .catch(err => console.log(err));
        } else {
            // Fallback: fetch all classes
            axios.get('http://localhost:5000/class/classes')
                .then(res => setClasses(res.data))
                .catch(err => console.log(err));
        }
    }, []);

    const handleClassSelect = (cls) => {
        setSelectedClass(cls);
        // Fetch students for this class based on grade match
        // Assuming class.name is like "Grade 10" or just "10"
        // And student.grade matches.
        // I'll try to match name first.
        axios.get(`http://localhost:5000/student/students/grade/${cls.name}`) // logic might be brittle if names don't match exactly
            .then(res => setStudents(res.data))
            .catch(err => console.log(err));
    };

    const handleAttendance = (studentId, status) => {
        axios.post('http://localhost:5000/academic/attendance', {
            student_id: studentId,
            class_id: selectedClass._id,
            date: attendanceDate,
            status: status
        })
            .then(res => {
                if (res.data.recorded) {
                    alert('Attendance recorded');
                } else {
                    alert('Failed to record');
                }
            })
            .catch(err => console.log(err));
    };

    // Marks handling moved to dedicated page

    const handleLogout = () => {
        localStorage.removeItem('userId'); // clear
        navigate('/');
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-blue-400">Teacher Dashboard</h1>
                <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition">Logout</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Classes Sidebar */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 col-span-1">
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-blue-300">My Classes</h2>
                    <ul className="space-y-4">
                        {classes.map(cls => (
                            <li
                                key={cls._id}
                                className={`p-4 rounded-lg shadow-md border transition flex flex-col gap-3 ${selectedClass?._id === cls._id ? 'bg-blue-900/30 border-blue-500' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
                            >
                                <div>
                                    <div className="font-bold text-lg text-white">{cls.name}</div>
                                    <div className="text-sm text-gray-400">Section: {cls.section}</div>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <button
                                        onClick={() => handleClassSelect(cls)}
                                        className="w-full bg-blue-600 text-white py-2 rounded text-sm font-semibold hover:bg-blue-500 transition shadow-lg"
                                    >
                                        Post Attendance
                                    </button>
                                    <button
                                        onClick={() => navigate(`/teacher/class/${cls._id}/marks`)}
                                        className="w-full bg-green-600 text-white py-2 rounded text-sm font-semibold hover:bg-green-500 transition shadow-lg"
                                    >
                                        Add Marks
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {classes.length === 0 && (
                        <div className="text-center mt-6">
                            <p className="text-gray-400 mb-2">No classes assigned.</p>
                            <p className="text-xs text-blue-400">Contact Admin to assign classes.</p>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 col-span-2">
                    {selectedClass ? (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-700 pb-4">
                                <h2 className="text-xl font-bold text-white">
                                    Manage Student: <span className="text-blue-400">{selectedClass.name}</span> <span className="text-gray-400 text-sm">({selectedClass.section})</span>
                                </h2>
                                <div className="mt-2 md:mt-0 flex items-center">
                                    <label className="mr-3 font-semibold text-gray-300">Date:</label>
                                    <input
                                        type="date"
                                        value={attendanceDate}
                                        onChange={(e) => setAttendanceDate(e.target.value)}
                                        className="bg-gray-700 border border-gray-600 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-700">
                                <table className="min-w-full text-left">
                                    <thead className="bg-gray-900 text-gray-400 uppercase text-xs font-semibold">
                                        <tr>
                                            <th className="p-4">Roll</th>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Attendance</th>
                                            <th className="p-4">Marks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {students.map(student => (
                                            <tr key={student._id} className="hover:bg-gray-750 transition duration-150">
                                                <td className="p-4 text-gray-300">{student.roll}</td>
                                                <td className="p-4 font-medium text-white">{student.username}</td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAttendance(student._id, 'Present')}
                                                            className="bg-green-900/50 text-green-400 border border-green-700 px-3 py-1 rounded hover:bg-green-800 transition"
                                                        >
                                                            Present
                                                        </button>
                                                        <button
                                                            onClick={() => handleAttendance(student._id, 'Absent')}
                                                            className="bg-red-900/50 text-red-400 border border-red-700 px-3 py-1 rounded hover:bg-red-800 transition"
                                                        >
                                                            Absent
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => navigate(`/teacher/class/${selectedClass._id}/marks`)}
                                                        className="bg-blue-900/50 text-blue-400 border border-blue-700 px-3 py-1 rounded hover:bg-blue-800 transition"
                                                    >
                                                        Add Marks
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {students.length === 0 && <p className="text-center p-8 text-gray-500 italic">No students found for this class.</p>}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                            <span className="text-6xl opacity-20">📚</span>
                            <p className="text-lg">Select a class from the list to view students</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
