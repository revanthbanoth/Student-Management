import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsPeopleFill, BsPersonVideo3, BsCollectionFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import dashboardBg from '../../assets/dashboard-bg.png';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        classes: 0
    });

    const [recipient, setRecipient] = useState('all-teachers');
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');

    useEffect(() => {
        fetchStats();
        // Fetch teachers list for dropdown
        axios.get(`${import.meta.env.VITE_API_URL}/teacher/teachers`)
            .then(res => setTeachers(res.data))
            .catch(err => console.log("Error fetching teachers", err));
    }, []);

    const fetchStats = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/dashboard/stats`)
            .then(res => {
                setStats(res.data);
            })
            .catch(err => console.log(err));
    };

    const [attachment, setAttachment] = useState(null);

    const handleSendNotification = async () => {
        const msg = document.getElementById('admin-notice-input').value;
        if (!msg) return alert("Please enter a message");

        const formData = new FormData();
        formData.append('message', msg);
        formData.append('type', 'alert');

        if (recipient === 'all-teachers') {
            formData.append('recipient_role', 'all-teachers');
        } else if (recipient === 'all-students') {
            formData.append('recipient_role', 'all-students');
        } else if (recipient === 'teacher') {
            if (!selectedTeacher) return alert("Please select a teacher");
            formData.append('recipient_role', 'teacher');
            formData.append('recipient_id', selectedTeacher);
        }

        if (attachment) {
            formData.append('attachment', attachment);
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/notification/send`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Notification sent successfully!");
            document.getElementById('admin-notice-input').value = '';
            setAttachment(null);
        } catch (err) {
            console.error(err);
            alert("Failed to send notification.");
        }
    };

    const [notificationTab, setNotificationTab] = useState('teacher'); // 'teacher' or 'student'

    // Reset recipient when switching tabs
    useEffect(() => {
        if (notificationTab === 'teacher') {
            setRecipient('all-teachers');
        } else {
            setRecipient('all-students');
        }
        setSelectedTeacher('');
    }, [notificationTab]);

    return (
        <div className="space-y-8">
            <div
                className="relative bg-cover bg-center p-12 rounded-2xl shadow-2xl text-white overflow-hidden"
                style={{ backgroundImage: `url(${dashboardBg})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">Admin Dashboard</h1>
                    <p className="text-gray-200 mt-4 text-xl drop-shadow-md max-w-2xl font-light">
                        Welcome to your command center. Manage students, teachers, and classes effectively.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Students Card - Clickable */}
                <Link to="/dashboard/students" className="block">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer h-full">
                        <div className="flex items-center justify-between h-full">
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">Total Students</p>
                                <p className="text-5xl font-extrabold text-white mt-2 group-hover:text-blue-400 transition-colors">{stats.students}</p>
                            </div>
                            <div className="bg-blue-900/30 p-4 rounded-full text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-500/20">
                                <BsPeopleFill size={32} />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Teachers Card - Clickable */}
                <Link to="/dashboard/teachers" className="block">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl hover:border-green-500 transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer h-full">
                        <div className="flex items-center justify-between h-full">
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">Total Teachers</p>
                                <p className="text-5xl font-extrabold text-white mt-2 group-hover:text-green-400 transition-colors">{stats.teachers}</p>
                            </div>
                            <div className="bg-green-900/30 p-4 rounded-full text-green-400 group-hover:bg-green-600 group-hover:text-white transition-colors border border-green-500/20">
                                <BsPersonVideo3 size={32} />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Classes Card - Clickable */}
                <Link to="/dashboard/classes" className="block">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl hover:border-yellow-500 transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer h-full">
                        <div className="flex items-center justify-between h-full">
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">Total Classes</p>
                                <p className="text-5xl font-extrabold text-white mt-2 group-hover:text-yellow-400 transition-colors">{stats.classes}</p>
                            </div>
                            <div className="bg-yellow-900/30 p-4 rounded-full text-yellow-400 group-hover:bg-yellow-600 group-hover:text-white transition-colors border border-yellow-500/20">
                                <BsCollectionFill size={32} />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Quick Actions / Notifications */}
            <div className="grid grid-cols-1 gap-8">
                {/* Send Notification Card */}
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-white">Send Notification</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            onClick={() => setNotificationTab('teacher')}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${notificationTab === 'teacher' ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/10' : 'border-gray-700 bg-gray-700/30 text-gray-400 hover:bg-gray-700 hover:border-gray-600'}`}
                        >
                            <BsPersonVideo3 size={24} />
                            <span className="font-bold text-base">Teachers</span>
                        </button>
                        <button
                            onClick={() => setNotificationTab('student')}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${notificationTab === 'student' ? 'border-pink-500 bg-pink-500/10 text-white shadow-lg shadow-pink-500/10' : 'border-gray-700 bg-gray-700/30 text-gray-400 hover:bg-gray-700 hover:border-gray-600'}`}
                        >
                            <BsPeopleFill size={24} />
                            <span className="font-bold text-base">Students</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Recipient</label>

                            {/* Teacher Tab: All Teachers or Specific */}
                            {notificationTab === 'teacher' && (
                                <select
                                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                >
                                    <option value="all-teachers">All Teachers</option>
                                    <option value="teacher">Specific Teacher</option>
                                </select>
                            )}

                            {/* Student Tab: All Students (Initially) */}
                            {notificationTab === 'student' && (
                                <select
                                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                >
                                    <option value="all-students">All Students</option>
                                    {/* Could add 'student' logic here if needed for specific student later */}
                                </select>
                            )}

                            {notificationTab === 'teacher' && recipient === 'teacher' && (
                                <select
                                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                                    value={selectedTeacher}
                                    onChange={(e) => setSelectedTeacher(e.target.value)}
                                >
                                    <option value="">Select Teacher</option>
                                    {teachers.map(t => (
                                        <option key={t._id} value={t._id}>{t.username} ({t.subject})</option>
                                    ))}
                                </select>
                            )}

                            <label className="block text-gray-400 text-sm font-bold mb-2">Attachment (Image/PDF)</label>
                            <input
                                type="file"
                                className="w-full bg-gray-700 text-gray-300 rounded-lg p-3 border border-gray-600 mb-4"
                                onChange={(e) => setAttachment(e.target.files[0])}
                            />

                            <label className="block text-gray-400 text-sm font-bold mb-2">Message</label>
                            <textarea
                                className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                placeholder="Enter message..."
                                id="admin-notice-input"
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleSendNotification}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
                            >
                                Send Notification
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
