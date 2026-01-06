import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft, BsBellFill, BsCheckCircleFill, BsClock, BsFileEarmarkText } from 'react-icons/bs';

const ViewNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const navigate = useNavigate();
    const role = localStorage.getItem('role') || (localStorage.getItem('userId') && window.location.pathname.includes('teacher') ? 'teacher' : 'student');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId && role) {
            axios.get(`${import.meta.env.VITE_API_URL}/notification/user/${role}/${userId}`)
                .then(res => setNotifications(res.data))
                .catch(err => console.log(err));
        }
    }, [role, userId]);

    const handleNotificationClick = async (notification) => {
        setSelectedNotification(notification);
        if (!notification.isRead) {
            try {
                await axios.put(`${import.meta.env.VITE_API_URL}/notification/read/${notification._id}`);
                setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const closePopup = () => {
        setSelectedNotification(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12 font-sans relative">
            {/* Detail Modal */}
            {selectedNotification && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 p-4">
                    <div className="bg-gray-800 border border-gray-600 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col transform scale-100 transition-transform">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <BsBellFill /> Notification Details
                            </h3>
                            <button onClick={closePopup} className="text-white/80 hover:text-white text-2xl">&times;</button>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[70vh]">
                            <div className="flex items-center gap-2 mb-6 text-gray-400 text-sm">
                                <BsClock />
                                <span>{new Date(selectedNotification.date).toLocaleString()}</span>
                                <span className="mx-2">|</span>
                                <span className={`uppercase font-bold tracking-wider text-xs px-2 py-1 rounded ${selectedNotification.type === 'alert' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {selectedNotification.type || 'Info'}
                                </span>
                            </div>

                            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
                                <p className="text-lg text-gray-200 leading-relaxed whitespace-pre-wrap">
                                    {selectedNotification.message}
                                </p>
                            </div>

                            {selectedNotification.type === 'exam' && (
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={() => navigate(`/${role}/exams`)}
                                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
                                    >
                                        <BsCheckCircleFill /> View Complete Schedule
                                    </button>
                                </div>
                            )}

                            {selectedNotification.attachmentUrl && (
                                <div className="mt-8">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Attachment</h4>
                                    {selectedNotification.attachmentType === 'image' ? (
                                        <img src={selectedNotification.attachmentUrl} alt="Attachment" className="rounded-xl border border-gray-700 shadow-lg max-w-full" />
                                    ) : (
                                        <a
                                            href={selectedNotification.attachmentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 p-4 rounded-xl border border-gray-600 transition group"
                                        >
                                            <div className="p-3 bg-gray-800 rounded-lg text-blue-400 group-hover:text-white transition">
                                                <BsFileEarmarkText size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">View Attached Document</p>
                                                <p className="text-xs text-gray-400">Click to open</p>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-900 p-4 border-t border-gray-700 flex justify-end">
                            <button
                                onClick={closePopup}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-bold transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
                >
                    <BsArrowLeft /> Back to Dashboard
                </button>

                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-purple-600/20 rounded-2xl text-purple-500 shadow-lg shadow-purple-500/20">
                        <BsBellFill size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tight">Notifications</h2>
                        <p className="text-gray-400 mt-1">Updates, alerts, and announcements.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {notifications.length > 0 ? (
                        notifications.map(n => (
                            <div
                                key={n._id}
                                onClick={() => handleNotificationClick(n)}
                                className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-5 ${!n.isRead
                                    ? 'bg-gray-800/80 border-blue-500/50 shadow-lg shadow-blue-500/10 hover:border-blue-400'
                                    : 'bg-gray-800/40 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                                    }`}
                            >
                                <div className={`flex-shrink-0 mt-1 w-3 h-3 rounded-full ${!n.isRead ? 'bg-blue-500 ring-4 ring-blue-500/20' : 'bg-gray-600'}`}></div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className={`text-lg transition-colors whitespace-pre-wrap ${!n.isRead ? 'font-bold text-white' : 'font-medium text-gray-200 group-hover:text-white'}`}>
                                            {n.message}
                                        </p>
                                        <span className="text-xs font-mono text-gray-500 whitespace-nowrap ml-4">{new Date(n.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${n.type === 'alert' ? 'bg-red-900/30 text-red-400' :
                                            n.type === 'result' ? 'bg-green-900/30 text-green-400' :
                                                n.type === 'exam' ? 'bg-orange-900/30 text-orange-400' :
                                                    'bg-gray-700 text-gray-400'
                                            }`}>
                                            {n.type || 'General'}
                                        </span>
                                        {n.attachmentUrl && (
                                            <span className="flex items-center gap-1 text-xs text-blue-400 font-medium">
                                                <BsFileEarmarkText /> Attachment
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-800/30 rounded-3xl border border-gray-700/50">
                            <BsBellFill size={48} className="mx-auto text-gray-600 mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-gray-400">No notifications</h3>
                            <p className="text-gray-500 mt-2">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewNotifications;
