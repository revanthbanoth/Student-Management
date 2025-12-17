import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        const studentId = localStorage.getItem('userId');
        if (studentId) {
            axios.get(`http://localhost:5000/academic/attendance/${studentId}`)
                .then(res => setAttendance(res.data))
                .catch(err => console.log(err));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-blue-400">Student Portal</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Attendance Section */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                    <h2 className="text-2xl font-bold mb-4 text-white border-b border-gray-700 pb-2">My Attendance</h2>
                    {attendance.length > 0 ? (
                        <div className="space-y-3">
                            <div className="flex justify-between font-bold text-gray-400">
                                <span>Date</span>
                                <span>Status</span>
                            </div>
                            {attendance.slice(0, 5).map((att, index) => (
                                <div key={index} className="flex justify-between border-b border-gray-700 py-3">
                                    <span className="text-gray-200">{new Date(att.date).toLocaleDateString()}</span>
                                    <span className={att.status === 'Present' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                                        {att.status}
                                    </span>
                                </div>
                            ))}
                            {attendance.length > 5 && <p className="text-xs text-gray-500 mt-2">Showing recent entries...</p>}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No attendance records found.</p>
                    )}
                </div>

                {/* Marks Link Section */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 flex flex-col items-center justify-center text-center">
                    <div className="mb-4 text-blue-400">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-white">Exam Results</h2>
                    <p className="text-gray-400 mb-6">View your detailed marks and academic performance.</p>
                    <button
                        onClick={() => navigate('/student/marks')}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-500 transition transform hover:scale-105"
                    >
                        View My Marks
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
