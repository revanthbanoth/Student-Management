import React, { useState } from 'react';
import axios from 'axios';
import { BsCalendarEvent, BsPlusCircle, BsCheckCircleFill, BsExclamationTriangleFill } from 'react-icons/bs';

const ExaminationCell = () => {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [rows, setRows] = useState([{ subject: '', date: '', time: '' }]);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleRowChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const addRow = () => {
        setRows([...rows, { subject: '', date: '', time: '' }]);
    };

    const removeRow = (index) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setStatus({ type: 'loading', message: 'Publishing exam schedule...' });

            // Format timetable
            const formattedTimetable = rows.map(r => ({
                subject: r.subject,
                date: r.date,
                time: r.time
            }));

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/exam/create`, {
                title,
                description,
                startDate,
                endDate,
                timetable: formattedTimetable
            });

            if (res.data.success) {
                setStatus({ type: 'success', message: 'Exam dates released and notifications sent to all students and teachers!' });
                setTitle('');
                setStartDate('');
                setEndDate('');
                setDescription('');
                setRows([{ subject: '', date: '', time: '' }]);
            }
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Failed to publish exam schedule.' });
        }
    };

    const [exams, setExams] = useState([]);
    const [hallTicketModal, setHallTicketModal] = useState({ open: false, exam: null });
    const [targetAudience, setTargetAudience] = useState('all-students'); // 'all-students' or 'grade-students'
    const [selectedGrade, setSelectedGrade] = useState('');
    const [classList, setClassList] = useState([]);

    React.useEffect(() => {
        fetchExams();
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/class/classes`);
            // Extract unique grades if necessary or just use class names
            setClassList(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchExams = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/exam/all`);
            setExams(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const [manageModal, setManageModal] = useState({ open: false, exam: null });
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState([]);

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/student/students`);
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    React.useEffect(() => {
        fetchExams();
        fetchClasses();
        fetchStudents();
    }, []);

    // ... fetchClasses and fetchExams remain same ...

    const openManageModal = (exam) => {
        setManageModal({ open: true, exam });
        setSearchQuery('');
    };

    const toggleBlockStudent = async (studentId, action) => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/exam/block/${manageModal.exam._id}`, {
                studentId,
                action
            });
            if (res.data.success) {
                // Update local state
                setManageModal(prev => ({
                    ...prev,
                    exam: { ...prev.exam, blockedCandidates: res.data.blockedCandidates }
                }));
                // Update main exams list
                setExams(prev => prev.map(e => e._id === manageModal.exam._id ? { ...e, blockedCandidates: res.data.blockedCandidates } : e));
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update access");
        }
    };

    const openHallTicketModal = (exam) => {
        setHallTicketModal({ open: true, exam });
        setTargetAudience('all-students');
        setSelectedGrade('');
    };

    const confirmSendHallTicket = async () => {
        const { exam } = hallTicketModal;
        if (!exam) return;

        try {
            // First release the exam hall ticket
            await axios.put(`${import.meta.env.VITE_API_URL}/exam/release/${exam._id}`);

            const payload = {
                recipient_role: targetAudience,
                message: `Hall Ticket released for ${exam.title}. Check your Examination Schedule to download it.`,
                type: 'exam'
            };

            if (targetAudience === 'grade-students') {
                if (!selectedGrade) {
                    alert('Please select a grade/class');
                    return;
                }
                payload.target_grade = selectedGrade;
                payload.message = `Hall Ticket released for ${exam.title} (Grade: ${selectedGrade}). Check your Examination Schedule.`;
            }

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/notification/send`, payload);

            if (res.data.sent) {
                setStatus({ type: 'success', message: `Hall Ticket released and sent to students for ${exam.title}` });
                setHallTicketModal({ open: false, exam: null });
                fetchExams(); // Refresh to update isReleased status in list
            }
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Failed to send Hall Ticket notification.' });
        }
    };

    return (
        <div className="space-y-8 relative">
            {/* Modal */}
            {hallTicketModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-gray-800 border border-gray-600 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
                        <button
                            onClick={() => setHallTicketModal({ open: false, exam: null })}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-bold text-white mb-4">Send Hall Ticket</h3>
                        <p className="text-gray-300 mb-6">Select recipients for <strong>{hallTicketModal.exam?.title}</strong>:</p>

                        <div className="space-y-4 mb-8">
                            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700/50 transition">
                                <input
                                    type="radio"
                                    name="audience"
                                    checked={targetAudience === 'all-students'}
                                    onChange={() => setTargetAudience('all-students')}
                                    className="text-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-gray-200">All Students</span>
                            </label>

                            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700/50 transition">
                                <input
                                    type="radio"
                                    name="audience"
                                    checked={targetAudience === 'grade-students'}
                                    onChange={() => setTargetAudience('grade-students')}
                                    className="text-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-gray-200">Specific Grade / Class</span>
                            </label>

                            {targetAudience === 'grade-students' && (
                                <div className="ml-8 mt-2">
                                    <select
                                        value={selectedGrade}
                                        onChange={(e) => setSelectedGrade(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-600 text-white rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                    >
                                        <option value="">-- Select Grade --</option>
                                        {[...new Set(classList.map(c => c.grade || c.name))].map((g, idx) => (
                                            <option key={idx} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setHallTicketModal({ open: false, exam: null })}
                                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSendHallTicket}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition"
                            >
                                Send Notification
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-600/20 rounded-xl text-blue-500">
                        <BsCalendarEvent size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white">Examination Cell</h2>
                        <p className="text-gray-400 mt-1">Schedule exams and notify students & faculty.</p>
                    </div>
                </div>

                {status.message && (
                    <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                        {status.type === 'success' ? <BsCheckCircleFill /> : <BsExclamationTriangleFill />}
                        <span className="font-medium">{status.message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Exam Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Mid-Term Examinations 2026"
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Description / Instructions</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="General instructions for the students..."
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                        />
                    </div>

                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-lg font-bold text-white">Timetable Schedule</label>
                            <button
                                type="button"
                                onClick={addRow}
                                className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition"
                            >
                                <BsPlusCircle /> Add Subject
                            </button>
                        </div>

                        <div className="space-y-4">
                            {rows.map((row, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-800 p-4 rounded-lg border border-gray-700">
                                    <div className="md:col-span-5">
                                        <label className="block text-xs text-gray-500 mb-1">Subject</label>
                                        <input
                                            type="text"
                                            value={row.subject}
                                            onChange={(e) => handleRowChange(index, 'subject', e.target.value)}
                                            placeholder="Mathematics"
                                            className="w-full bg-gray-900 border border-gray-600 text-white rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-xs text-gray-500 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={row.date}
                                            onChange={(e) => handleRowChange(index, 'date', e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-600 text-white rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-xs text-gray-500 mb-1">Time</label>
                                        <input
                                            type="text"
                                            value={row.time}
                                            onChange={(e) => handleRowChange(index, 'time', e.target.value)}
                                            placeholder="10:00 AM - 01:00 PM"
                                            className="w-full bg-gray-900 border border-gray-600 text-white rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-1 flex justify-center">
                                        {rows.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRow(index)}
                                                className="text-red-400 hover:text-red-300 p-2"
                                                title="Remove"
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition duration-200"
                        >
                            Publish & Notify
                        </button>
                    </div>
                </form>
            </div >

            {/* Access Control Modal */}
            {manageModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-gray-800 border border-gray-600 rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[85vh]">
                        <button
                            onClick={() => setManageModal({ open: false, exam: null })}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-bold text-white mb-2">Manage Hall Ticket Access</h3>
                        <p className="text-sm text-gray-400 mb-4">Exam: <span className="text-white">{manageModal.exam?.title}</span></p>

                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search student by name or roll number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 border-t border-gray-700 pt-4">
                            {students
                                .filter(s => s.username.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map(student => {
                                    const isBlocked = manageModal.exam?.blockedCandidates?.includes(student._id);
                                    return (
                                        <div key={student._id} className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-700">
                                            <div>
                                                <p className="font-bold text-white">{student.username}</p>
                                                <p className="text-xs text-gray-400">Roll: {student.roll} | Grade: {student.grade}</p>
                                            </div>
                                            <button
                                                onClick={() => toggleBlockStudent(student._id, isBlocked ? 'unblock' : 'block')}
                                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${isBlocked ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                                            >
                                                {isBlocked ? 'Blocked' : 'Block Access'}
                                            </button>
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-6">Published Exams</h3>
                <div className="space-y-4">
                    {exams.length === 0 ? (
                        <p className="text-gray-400">No exams published yet.</p>
                    ) : (
                        exams.map(exam => (
                            <div key={exam._id} className="bg-gray-900 p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h4 className="text-xl font-bold text-white">{exam.title}</h4>
                                    <div className="flex gap-3 text-gray-400 text-sm mt-1">
                                        <span>{new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}</span>
                                        {exam.isReleased ? (
                                            <span className="text-green-400 font-bold bg-green-900/30 px-2 rounded text-xs py-0.5 border border-green-500/30">Released</span>
                                        ) : (
                                            <span className="text-amber-400 font-bold bg-amber-900/30 px-2 rounded text-xs py-0.5 border border-amber-500/30">Not Released</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openManageModal(exam)}
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition text-sm"
                                    >
                                        Manage Access
                                    </button>

                                    {!exam.isReleased && (
                                        <button
                                            onClick={() => openHallTicketModal(exam)}
                                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition text-sm"
                                        >
                                            <BsCheckCircleFill /> Release Hall Ticket
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div >
    );
};

export default ExaminationCell;
