import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsPersonCircle, BsBellFill, BsFileEarmarkTextFill, BsCheckCircleFill, BsGenderMale, BsCalendarEventFill, BsTelephoneFill, BsEnvelopeFill } from 'react-icons/bs';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState([]);
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const studentId = localStorage.getItem('userId');
        if (studentId) {
            // Fetch Student Details
            axios.get(`${import.meta.env.VITE_API_URL}/student/student/${studentId}`)
                .then(res => setStudent(res.data))
                .catch(err => console.log(err));

            // Fetch Attendance
            axios.get(`${import.meta.env.VITE_API_URL}/academic/attendance/${studentId}`)
                .then(res => setAttendance(res.data))
                .catch(err => console.log(err));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/');
    };

    const [notifications, setNotifications] = useState([]);
    const [popupNotification, setPopupNotification] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            const studentId = localStorage.getItem('userId');
            if (studentId) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/notification/user/student/${studentId}`);
                    const notifs = res.data;
                    setNotifications(notifs);

                    // Check for important unread popups (e.g., type 'result' or 'alert' or 'exam')
                    const importantUnread = notifs.find(n => !n.isRead && (n.type === 'result' || n.type === 'alert' || n.type === 'exam'));
                    if (importantUnread) {
                        setPopupNotification(importantUnread);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        };
        fetchNotifications();
    }, []);

    const [showNotifications, setShowNotifications] = useState(false);

    const markAsRead = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/notification/read/${id}`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) { console.log(err); }
    };

    const closePopup = async () => {
        if (popupNotification) {
            await markAsRead(popupNotification._id);
            if (popupNotification.type === 'result') {
                navigate('/student/marks');
            } else if (popupNotification.type === 'exam') {
                navigate('/student/exams');
            }
            setPopupNotification(null);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Calculate Attendance Percentage
    let totalClasses = 0;
    let presentClasses = 0;
    attendance.forEach(att => {
        if (att.periods) {
            Object.values(att.periods).forEach(status => {
                if (status === 'Present') {
                    presentClasses++;
                    totalClasses++;
                } else if (status === 'Absent') {
                    totalClasses++;
                }
            });
        } else if (att.status) {
            totalClasses++;
            if (att.status === 'Present') presentClasses++;
        }
    });

    const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;
    const isGood = parseFloat(percentage) > 75;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans relative">
            {/* Pop Up Modal - Intact */}
            {popupNotification && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 transform scale-100 transition-transform">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <BsCheckCircleFill className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">New Update!</h3>
                            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 mb-6">
                                <p className="text-gray-100 font-medium whitespace-pre-wrap">{popupNotification.message}</p>
                            </div>

                            {/* Attachment Display */}
                            {popupNotification.attachmentUrl && (
                                <div className="mb-6">
                                    {popupNotification.attachmentType === 'image' ? (
                                        <img src={popupNotification.attachmentUrl} alt="Attachment" className="w-full h-auto rounded-lg border border-gray-600" />
                                    ) : (
                                        <a
                                            href={popupNotification.attachmentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block bg-gray-700 text-blue-400 py-2 px-4 rounded border border-gray-600 hover:bg-gray-600 transition"
                                        >
                                            📄 View Attachment ({popupNotification.attachmentType?.toUpperCase() || 'FILE'})
                                        </a>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={closePopup}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
                            >
                                Acknowledge & View
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header / Navbar - Intact (Skipping repetitive code to focus on changes, but replace_file_content needs context) */}
            {/* Actually I need to be careful with replace_file_content. I should match the START of the return block to insert calculation logic BEFORE it, and then the return block. */}
            {/* Wait, I can't put logic inside JSX. So I need to replace from 'const unreadCount' down to the widgets area. */}

            {/* Modern Glass Header */}
            <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800 px-6 py-4 shadow-2xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                            <img src={logo} alt="Logo" className="relative h-12 w-12 rounded-full border-2 border-gray-800 shadow-xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">STUDENT<span className="text-blue-500">PORTAL</span></h1>
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">UGC Autonomous</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                className="relative flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full border border-gray-700 transition-all duration-300"
                                onClick={() => navigate('/student/notifications')}
                            >
                                <span className="text-sm font-bold">Notifications</span>
                                {unreadCount > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* User Profile Dropdown / Area */}
                        <div className="flex items-center gap-4 pl-6 border-l border-gray-800">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-white leading-tight">{student?.username || 'Student Name'}</p>
                                <p className="text-xs text-blue-400 font-mono">{student?.roll || 'ID: ...'}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20">
                                <div className="h-full w-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                    <BsPersonCircle className="text-gray-300 w-full h-full" />
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="ml-2 text-xs font-bold text-gray-500 hover:text-red-400 transition-colors duration-300"
                            >
                                LOGOUT
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Modern Flash News */}
                <div className="mb-8 rounded-2xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-sm overflow-hidden flex shadow-lg">
                    <div className="bg-blue-600/20 px-6 py-3 flex items-center gap-2 border-r border-blue-500/20">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Updates</span>
                    </div>
                    <div className="flex-1 flex items-center overflow-hidden relative py-3">
                        <div className="whitespace-nowrap animate-marquee text-gray-300 text-sm font-medium px-4">
                            <span className="mr-8">📢 Exams listed for next month! Preparation holidays start from 25th.</span>
                            <span className="mr-8 text-blue-400">📢 Results for Semester 3 declared. Check your portal.</span>
                            <span className="text-green-400">📢 New Elective courses available for registration.</span>
                        </div>
                    </div>
                </div>

                {/* Hero / Profile Section */}
                <div className="mb-10 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl -z-10"></div>
                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 md:p-10 shadow-2xl relative overflow-hidden">

                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 transition duration-500 blur"></div>
                                <div className="relative w-32 h-32 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden border-4 border-gray-800">
                                    <BsPersonCircle className="w-full h-full text-gray-300" />
                                </div>
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-gray-900 rounded-full z-10"></div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                                            {student?.username || 'Welcome Student'}
                                        </h2>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                                                Class {student?.grade || 'N/A'}
                                            </span>
                                            <span className="h-1 w-1 bg-gray-500 rounded-full"></span>
                                            <span className="text-gray-400 text-sm font-medium">Roll No: {student?.roll || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block text-right">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Academic Year</p>
                                        <p className="text-2xl font-bold text-white">2024-2025</p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-gray-700/50 mb-6"></div>

                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 text-gray-400">
                                            <BsGenderMale size={14} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Gender</span>
                                        </div>
                                        <p className="text-white font-medium capitalize">{student?.gender || '--'}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 text-gray-400">
                                            <BsEnvelopeFill size={14} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Email</span>
                                        </div>
                                        <p className="text-white font-medium truncate max-w-[150px]" title={student?.username ? `${student.username}@college.edu` : ''}>
                                            {student?.username ? `${student.username.toLowerCase().replace(/\s/g, '')}@college.edu` : '--'}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 text-gray-400">
                                            <BsTelephoneFill size={14} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Mobile</span>
                                        </div>
                                        <p className="text-white font-medium font-mono">98*******10</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 text-gray-400">
                                            <BsCalendarEventFill size={14} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Status</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            <span className="text-green-400 font-bold text-sm">Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Widgets */}
                <div className="lg:col-span-12">
                    <div className="text-center mb-6 relative">
                        <h3 className="text-2xl font-bold text-gray-400 uppercase tracking-[0.2em] relative z-10 inline-block bg-gray-900 px-4">Dashboard Features</h3>
                        <div className="absolute top-1/2 left-0 w-full h-px bg-gray-700 z-0"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Percentage Widget */}
                        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col justify-center items-center text-center hover:border-green-500 transition-all duration-300">
                            <div className="mb-4">
                                <div className={`w-32 h-32 rounded-full border-[10px] flex items-center justify-center shadow-lg ${isGood ? 'border-green-500 shadow-green-500/20' : 'border-red-500 shadow-red-500/20'}`}>
                                    <span className={`text-3xl font-black ${isGood ? 'text-green-500' : 'text-red-500'}`}>{percentage}%</span>
                                </div>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-1">Overall Attendance</h4>
                            <p className="text-gray-400 text-xs mb-3">Total Classes: {totalClasses} | Attended: {presentClasses}</p>
                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${isGood ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                                {isGood ? 'Good' : 'Make your attendance good'}
                            </div>
                        </div>

                        {/* Attendance Widget */}
                        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden group hover:border-blue-500 transition-all duration-300">
                            <div className="bg-gray-700 p-6 border-b border-gray-700 flex justify-between items-center">
                                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                                    <BsCheckCircleFill className="text-green-500" /> Attendance Log
                                </h4>
                                <span className="text-xs font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded">Recent</span>
                            </div>
                            <div className="p-0">
                                {attendance.length > 0 ? (
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                                            <tr>
                                                <th className="px-6 py-3 font-semibold">Date</th>
                                                <th className="px-6 py-3 font-semibold text-right">Periods Present</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700/50">
                                            {attendance.slice(0, 5).map((att, index) => {
                                                let pCount = 0;
                                                let tCount = 0;
                                                if (att.periods) {
                                                    Object.values(att.periods).forEach(v => {
                                                        if (v) tCount++;
                                                        if (v === 'Present') pCount++;
                                                    });
                                                    // Handle case where periods are empty in DB but date exists (shouldn't happen with new logic properly used)
                                                    if (tCount === 0) tCount = 6; // Assume 6 periods per day if record exists?
                                                } else if (att.status) {
                                                    tCount = 1;
                                                    if (att.status === 'Present') pCount = 1;
                                                }
                                                return (
                                                    <tr key={index} className="hover:bg-gray-700/50 transition duration-150">
                                                        <td className="px-6 py-4 text-gray-300 font-medium">{new Date(att.date).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className="text-white font-bold">{pCount}</span> <span className="text-gray-500">/ {tCount}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 italic">No attendance records found.</div>
                                )}
                            </div>
                        </div>

                        {/* Exam Results Widget */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl shadow-lg border border-blue-500/30 p-8 flex flex-col justify-center items-center text-center hover:shadow-blue-500/20 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="bg-blue-500/20 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                <BsFileEarmarkTextFill size={48} className="text-blue-400" />
                            </div>

                            <h4 className="text-2xl font-bold text-white mb-2 relative z-10">Exam Results</h4>
                            <p className="text-blue-200/80 mb-8 max-w-xs relative z-10">Check your comprehensive marksheet. Analyze your performance across all semesters.</p>

                            <button
                                onClick={() => navigate('/student/marks')}
                                className="relative z-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                            >
                                View My Marks &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    display: inline-block;
                    animation: marquee 20s linear infinite;
                }
            `}</style>
        </div >
    );
};

export default StudentDashboard;
