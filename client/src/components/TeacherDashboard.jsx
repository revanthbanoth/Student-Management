import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsPersonCircle, BsBellFill, BsCheckCircleFill, BsPencilSquare, BsCalendarCheck, BsBookHalf, BsEnvelopeFill, BsTelephoneFill, BsJournalBookmarkFill } from 'react-icons/bs';

const TeacherDashboard = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
    const [teacher, setTeacher] = useState(null);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [popupNotification, setPopupNotification] = useState(null);


    useEffect(() => {
        const teacherId = localStorage.getItem('userId');
        if (teacherId) {
            // Fetch Teacher Details
            axios.get(`${import.meta.env.VITE_API_URL}/teacher/teacher/${teacherId}`)
                .then(res => setTeacher(res.data))
                .catch(err => console.log(err));

            // Fetch Classes
            axios.get(`${import.meta.env.VITE_API_URL}/class/class/teacher/${teacherId}`)
                .then(res => setClasses(res.data))
                .catch(err => console.log(err));
        }
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            const teacherId = localStorage.getItem('userId');
            if (teacherId) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/notification/user/teacher/${teacherId}`);
                    const notifs = res.data;
                    setNotifications(notifs);

                    // Check for important unread popups (e.g., type 'alert' or 'exam')
                    const importantUnread = notifs.find(n => !n.isRead && (n.type === 'alert' || n.type === 'exam'));
                    if (importantUnread) {
                        setPopupNotification(importantUnread);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        };
        fetchNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleClassSelect = (cls) => {
        setSelectedClass(cls);
        axios.get(`${import.meta.env.VITE_API_URL}/student/students/grade/${cls.name}/section/${cls.section}`)
            .then(res => setStudents(res.data))
            .catch(err => console.log(err));
    };

    const [attendanceStatus, setAttendanceStatus] = useState({});

    // Fetch attendance when class or date changes
    useEffect(() => {
        if (selectedClass && attendanceDate) {
            const fetchAttendance = async () => {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/academic/attendance/class/${selectedClass._id}/date/${attendanceDate}`);
                    const newStatus = {};
                    res.data.forEach(record => {
                        if (record.periods) {
                            Object.keys(record.periods).forEach(key => {
                                // key is like 'period1', we need the number 1
                                const periodNum = key.replace('period', '');
                                newStatus[`${record.student_id}-${periodNum}`] = record.periods[key];
                            });
                        }
                    });
                    setAttendanceStatus(newStatus);
                } catch (err) {
                    console.error("Error fetching attendance:", err);
                }
            };
            fetchAttendance();
        }
    }, [selectedClass, attendanceDate]);

    const handleAttendanceChange = (studentId, period, status) => {
        setAttendanceStatus(prev => ({ ...prev, [`${studentId}-${period}`]: status }));
        axios.post(`${import.meta.env.VITE_API_URL}/academic/attendance`, {
            student_id: studentId,
            class_id: selectedClass._id,
            date: attendanceDate,
            period: period,
            status: status
        }).then(res => {
            console.log("Recorded");
            // alert(`Attendance marked as ${status}`); 
        }).catch(err => {
            console.log(err);
            alert("Failed to record attendance");
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleBellClick = () => {
        setShowNotifications(!showNotifications);
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/notification/read/${id}`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) { console.log(err); }
    };

    const closePopup = async () => {
        if (popupNotification) {
            await markAsRead(popupNotification._id);
            if (popupNotification.type === 'exam') {
                navigate('/teacher/exams');
            }
            setPopupNotification(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans relative">
            {/* Pop Up Modal */}
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

                            <button
                                onClick={closePopup}
                                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
                            >
                                Acknowledge & View
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modern Glass Header */}
            <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800 px-6 py-4 shadow-2xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                            <div className="relative bg-black rounded-full p-2 border border-gray-700">
                                <span className="text-xl font-bold text-green-500">TMS</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">TEACHER<span className="text-green-500">PORTAL</span></h1>
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">Faculty Access</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        {/* Notifications */}
                        <div className="relative">
                            <div className="relative">
                                <button
                                    className="relative flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full border border-gray-700 transition-all duration-300"
                                    onClick={() => navigate('/teacher/notifications')}
                                >
                                    <span className="text-sm font-bold">Notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* User Profile Dropdown / Area */}
                        <div className="flex items-center gap-4 pl-6 border-l border-gray-800">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-white leading-tight">{teacher?.username || 'Faculty'}</p>
                                <p className="text-xs text-green-400 font-mono">{teacher?.subject || '...'}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 p-0.5 shadow-lg shadow-green-500/20">
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
                    <div className="bg-green-600/20 px-6 py-3 flex items-center gap-2 border-r border-green-500/20">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                        <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Notices</span>
                    </div>
                    <div className="flex-1 flex items-center overflow-hidden relative py-3">
                        <div className="whitespace-nowrap animate-marquee text-gray-300 text-sm font-medium px-4">
                            <span className="mr-8">📝 Grade submission deadline for Mid-Term is 15th Oct.</span>
                            <span className="mr-8 text-red-400">📝 Staff meeting scheduled for Friday at 3 PM in Conference Hall A.</span>
                            <span className="text-blue-400">📝 Please update attendance logs daily by 4 PM.</span>
                        </div>
                    </div>
                </div>

                {/* Hero / Profile Section */}
                <div className="mb-10 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-teal-600/10 rounded-3xl blur-3xl -z-10"></div>
                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 md:p-10 shadow-2xl relative overflow-hidden">

                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-teal-500 rounded-full opacity-75 group-hover:opacity-100 transition duration-500 blur"></div>
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
                                            {teacher?.username || 'Welcome Faculty'}
                                        </h2>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
                                                ID: {teacher?._id?.slice(-6).toUpperCase() || '...'}
                                            </span>
                                            <span className="h-1 w-1 bg-gray-500 rounded-full"></span>
                                            <span className="text-gray-400 text-sm font-medium">{teacher?.subject || 'Subject N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block text-right">
                                        <div className="flex items-center justify-end gap-2 mb-1">
                                            <BsJournalBookmarkFill className="text-green-500" />
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Classes Assigned</p>
                                        </div>
                                        <p className="text-3xl font-bold text-white">{classes.length}</p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-gray-700/50 mb-6"></div>

                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 text-gray-400">
                                            <BsEnvelopeFill size={14} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Email</span>
                                        </div>
                                        <p className="text-white font-medium truncate" title={teacher?.email}>
                                            {teacher?.email || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 text-gray-400">
                                            <BsTelephoneFill size={14} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Contact</span>
                                        </div>
                                        <p className="text-white font-medium font-mono">{teacher?.contact || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 text-gray-400">
                                            <BsCalendarCheck size={14} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Status</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            <span className="text-green-400 font-bold text-sm">Active Faculty</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Operations */}
                <div className="lg:col-span-12">
                    <div className="text-center mb-6 relative">
                        <h3 className="text-2xl font-bold text-gray-400 uppercase tracking-[0.2em] relative z-10 inline-block bg-gray-900 px-4">Class Operations</h3>
                        <div className="absolute top-1/2 left-0 w-full h-px bg-gray-700 z-0"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Sidebar: List of Classes */}
                        <div className="md:col-span-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden flex flex-col h-[500px]">
                            <div className="bg-gray-750 p-4 border-b border-gray-700 font-bold text-white flex items-center justify-between">
                                <span className="flex items-center gap-2"><BsBookHalf /> Assigned Classes</span>
                                <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">{classes.length}</span>
                            </div>
                            <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
                                {classes.map(cls => (
                                    <div
                                        key={cls._id}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 group ${selectedClass?._id === cls._id ? 'bg-blue-900/40 border-blue-500 shadow-blue-500/20 shadow-md' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500'}`}
                                        onClick={() => handleClassSelect(cls)}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">{cls.name}</h4>
                                            <span className="text-xs bg-gray-900 text-gray-400 px-2 py-1 rounded border border-gray-700">Sec: {cls.section}</span>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <span className="text-xs text-green-400 flex items-center gap-1"><BsCheckCircleFill size={10} /> Attendance</span>
                                            <span className="text-xs text-gray-500">|</span>
                                            <span className="text-xs text-blue-400 flex items-center gap-1"><BsPencilSquare size={10} /> Marks</span>
                                        </div>
                                    </div>
                                ))}
                                {classes.length === 0 && (
                                    <div className="text-center text-gray-500 italic mt-10 p-4 border-2 border-dashed border-gray-700 rounded-lg">
                                        No classes found assigned to your ID.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Interaction Area */}
                        <div className="md:col-span-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden flex flex-col min-h-[500px]">
                            {selectedClass ? (
                                <>
                                    <div className="bg-gradient-to-r from-gray-800 to-gray-750 p-6 border-b border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <span className="bg-blue-600 w-2 h-6 rounded-sm"></span>
                                                {selectedClass.name} - Section {selectedClass.section}
                                            </h3>
                                            <p className="text-sm text-gray-400 ml-4 mt-1">Manage attendance and marks for this class.</p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate(`/teacher/class/${selectedClass._id}/marks`)}
                                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5"
                                            >
                                                Manage Marks
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-gray-800/50">
                                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 mb-6 flex flex-wrap items-center gap-4">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <BsCalendarCheck className="text-green-500" />
                                                <span className="font-semibold text-sm">Attendance Date:</span>
                                            </div>
                                            <input
                                                type="date"
                                                value={attendanceDate}
                                                onChange={(e) => setAttendanceDate(e.target.value)}
                                                className="bg-gray-800 border border-gray-600 text-white text-sm rounded px-3 py-1.5 focus:ring-2 focus:ring-green-500 outline-none hover:border-gray-500 transition"
                                            />
                                        </div>

                                        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-inner">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead className="bg-gray-950 text-gray-400 text-xs uppercase tracking-wider">
                                                        <tr>
                                                            <th className="p-4 font-semibold border-b border-gray-800">Roll No</th>
                                                            <th className="p-4 font-semibold border-b border-gray-800">Student Name</th>
                                                            {[1, 2, 3, 4, 5, 6].map(p => (
                                                                <th key={p} className="p-4 font-semibold border-b border-gray-800 text-center">P{p}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-800">
                                                        {students.map(student => (
                                                            <tr key={student._id} className="hover:bg-gray-800/80 transition duration-150 group">
                                                                <td className="p-4 text-gray-400 font-mono text-sm">{student.roll}</td>
                                                                <td className="p-4 text-white font-medium">{student.username}</td>
                                                                {[1, 2, 3, 4, 5, 6].map(p => (
                                                                    <td key={p} className="p-4 text-center">
                                                                        <div className="flex flex-col items-center gap-1">
                                                                            <button
                                                                                onClick={() => handleAttendanceChange(student._id, p, 'Present')}
                                                                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all text-[10px] font-bold ${attendanceStatus[`${student._id}-${p}`] === 'Present' ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-500/40' : 'bg-transparent border-gray-600 text-gray-500 hover:border-green-500 hover:text-green-400'}`}
                                                                                title="Mark Present"
                                                                            >
                                                                                P
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleAttendanceChange(student._id, p, 'Absent')}
                                                                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all text-[10px] font-bold ${attendanceStatus[`${student._id}-${p}`] === 'Absent' ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-500/40' : 'bg-transparent border-gray-600 text-gray-500 hover:border-red-500 hover:text-red-400'}`}
                                                                                title="Mark Absent"
                                                                            >
                                                                                A
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                        {students.length === 0 && (
                                                            <tr>
                                                                <td colSpan="8" className="p-8 text-center text-gray-500 italic">No students found in this class section.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-10 text-center opacity-60">
                                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4 text-4xl">📚</div>
                                    <h3 className="text-xl font-bold text-gray-300">No Class Selected</h3>
                                    <p className="text-gray-500 mt-2 max-w-xs">Click on a class from the sidebar to manage attendance and view student details.</p>
                                </div>
                            )}
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
                    animation: marquee 25s linear infinite;
                }
                /* Custom scrollbar for sidebar */
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #1f2937; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #4b5563; 
                  border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #6b7280; 
                }
            `}</style>
        </div >
    );
};

export default TeacherDashboard;
