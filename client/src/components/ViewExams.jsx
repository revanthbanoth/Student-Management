import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft, BsCalendarEvent, BsClock } from 'react-icons/bs';

const ViewExams = () => {
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();
    const role = localStorage.getItem('role') || 'student';

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/exam/all`)
            .then(res => setExams(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
                >
                    <BsArrowLeft /> Back to Dashboard
                </button>

                <div className="text-center mb-12">
                    <div className="inline-block p-4 rounded-full bg-blue-600/20 text-blue-500 mb-4 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                        <BsCalendarEvent size={40} />
                    </div>
                    <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">Examination Schedule</h2>
                    <p className="text-gray-400 mt-2 max-w-lg mx-auto">Stay updated with upcoming examination dates and comprehensive timetables.</p>
                </div>

                <div className="space-y-10">
                    {exams.map(exam => (
                        <div key={exam._id} className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 shadow-2xl relative overflow-hidden group">
                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/20 transition duration-700"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-700">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{exam.title}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <span className="flex items-center gap-1"><BsCalendarEvent /> {new Date(exam.startDate).toLocaleDateString()}</span>
                                            <span>&rarr;</span>
                                            <span>{new Date(exam.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">Upcoming Exam</span>
                                    {role === 'student' && (
                                        <>
                                            {exam.isReleased ? (
                                                exam.blockedCandidates?.includes(localStorage.getItem('userId')) ? (
                                                    <div className="ml-auto text-right">
                                                        <span className="inline-block px-4 py-2 bg-red-900/40 border border-red-500/30 text-red-300 rounded-lg text-sm font-bold animate-pulse">
                                                            Access Blocked
                                                        </span>
                                                        <p className="text-xs text-red-400 mt-1 max-w-[200px]">Please meet the admin to download the hallticket.</p>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => navigate(`/student/hallticket/${exam._id}`)}
                                                        className="ml-auto flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-lg"
                                                    >
                                                        <BsCalendarEvent /> Download Hall Ticket
                                                    </button>
                                                )
                                            ) : (
                                                <span className="ml-auto text-gray-500 text-sm font-medium italic">Hall Ticket not yet released</span>
                                            )}
                                        </>
                                    )}
                                </div>

                                {exam.description && (
                                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 mb-8">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Instructions</h4>
                                        <p className="text-gray-300 whitespace-pre-line leading-relaxed">{exam.description}</p>
                                    </div>
                                )}

                                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-inner">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-950 text-gray-400 uppercase text-xs tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold">Date</th>
                                                    <th className="px-6 py-4 font-semibold">Subject</th>
                                                    <th className="px-6 py-4 font-semibold text-right">Time</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800">
                                                {exam.timetable.map((t, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-800/80 transition duration-150">
                                                        <td className="px-6 py-4 font-medium text-blue-400">{new Date(t.date).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 font-bold text-white">{t.subject}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="inline-flex items-center gap-2 bg-gray-800 px-3 py-1 rounded text-xs font-mono text-gray-300 border border-gray-700">
                                                                <BsClock size={10} /> {t.time}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {exams.length === 0 && (
                        <div className="text-center py-20 bg-gray-800/30 rounded-3xl border border-gray-700/50">
                            <BsCalendarEvent size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">No exams scheduled yet</h3>
                            <p className="text-gray-500 mt-2">Check back later for updates.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewExams;
