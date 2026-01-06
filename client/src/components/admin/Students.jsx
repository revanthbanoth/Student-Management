import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BackButton from '../BackButton';
import { BsPlusCircle, BsPencilSquare, BsTrash, BsPersonWorkspace } from 'react-icons/bs';

const Students = () => {
    const [allStudents, setAllStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [classTeacher, setClassTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('initial'); // 'initial', 'classes', 'all'

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [studentsRes, classesRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/student/students`),
                    axios.get(`${import.meta.env.VITE_API_URL}/class/classes`)
                ]);
                setAllStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
                setClasses(Array.isArray(classesRes.data) ? classesRes.data : []);
                setLoading(false);
            } catch (err) {
                console.error("Error loading data:", err);
                setAllStudents([]);
                setClasses([]);
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (viewMode === 'all') {
            setFilteredStudents(allStudents);
            setClassTeacher(null);
        } else {
            // Filter mode
            if (selectedGrade && selectedSection) {
                const filtered = allStudents.filter(s =>
                    String(s.grade) === String(selectedGrade) &&
                    s.section === selectedSection
                );
                setFilteredStudents(filtered);
                findClassTeacher(selectedGrade, selectedSection);
            } else {
                setFilteredStudents([]);
                setClassTeacher(null);
            }
        }
    }, [selectedGrade, selectedSection, viewMode, allStudents, classes]);

    const findClassTeacher = (grade, section) => {
        if (!classes || classes.length === 0) {
            setClassTeacher("Not Assigned");
            return;
        }

        const cls = classes.find(c =>
            String(c.name) === String(grade) &&
            c.section === section
        );

        if (cls && cls.teacher_id) {
            const teacherName = typeof cls.teacher_id === 'object' ? cls.teacher_id.username : "Unknown";
            setClassTeacher(teacherName || "Assigned");
        } else {
            setClassTeacher("Not Assigned");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                const res = await axios.delete(`${import.meta.env.VITE_API_URL}/student/student/${id}`);
                if (res.data.deleted) {
                    setAllStudents(prev => prev.filter(s => s._id !== id));
                } else {
                    alert("Failed to delete");
                }
            } catch (err) {
                console.error(err);
                alert("Error deleting student");
            }
        }
    };

    const availableSections = useMemo(() => {
        if (!selectedGrade) return [];

        const sectionsFromClasses = classes
            .filter(c => String(c.name) === String(selectedGrade))
            .map(c => c.section);

        const sectionsFromStudents = allStudents
            .filter(s => String(s.grade) === String(selectedGrade))
            .map(s => s.section)
            .filter(Boolean);

        return [...new Set([...sectionsFromClasses, ...sectionsFromStudents])].sort();
    }, [selectedGrade, classes, allStudents]);

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-gray-100 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                <div className="flex items-center gap-4 bg-gray-800/40 p-3 pr-8 rounded-full border border-gray-700/50 backdrop-blur-sm shadow-lg">
                    <BackButton to="/dashboard" />
                    <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 tracking-wide">Students Directory</h1>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            if (viewMode === 'all') {
                                setViewMode('initial');
                            } else {
                                setViewMode('all');
                            }
                            setSelectedGrade(null);
                            setSelectedSection(null);
                        }}
                        className={`flex items-center px-6 py-3 rounded-full shadow-lg transform hover:-translate-y-1 transition duration-300 font-bold tracking-wide border ${viewMode === 'all'
                            ? 'bg-blue-600 text-white border-blue-500/20 shadow-blue-500/30'
                            : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        {viewMode === 'all' ? 'Back' : 'Show All Students'}
                    </button>
                    <Link
                        to="/dashboard/add-student"
                        className="flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 transition duration-300 border border-blue-500/20"
                    >
                        <BsPlusCircle className="mr-3 text-xl" />
                        <span className="font-bold tracking-wide">Add Student</span>
                    </Link>
                </div>
            </div>

            {viewMode === 'initial' && (
                <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
                    <button
                        onClick={() => setViewMode('classes')}
                        className="group relative flex flex-col items-center justify-center p-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-2 transition-all duration-300 w-full max-w-md"
                    >
                        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                            <BsPersonWorkspace className="text-5xl text-blue-400 group-hover:text-blue-300" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Classes Directory</h2>
                        <p className="text-gray-400 text-center">View and manage students by class and section</p>
                        <div className="mt-8 px-8 py-3 bg-blue-600/20 text-blue-300 rounded-full text-sm font-bold uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 border border-blue-500/30">
                            View All Classes
                        </div>
                    </button>
                </div>
            )}

            {viewMode === 'classes' && (
                <>
                    <div className="mb-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={() => setViewMode('initial')}
                                className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                            >
                                <span className="text-xl">←</span> Back
                            </button>
                            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm">Select Grade</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(grade => (
                                <button
                                    key={grade}
                                    onClick={() => { setSelectedGrade(grade); setSelectedSection(null); }}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg ${selectedGrade === grade ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/30 scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                                >
                                    Class {grade}
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedGrade && (
                        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                            <h3 className="text-gray-400 font-bold uppercase tracking-wider mb-4 text-sm">Select Section (Grade {selectedGrade})</h3>
                            <div className="flex flex-wrap gap-4">
                                {availableSections.length > 0 ? (
                                    availableSections.map(section => (
                                        <button
                                            key={section}
                                            onClick={() => setSelectedSection(section)}
                                            className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 border-2 ${selectedSection === section ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}
                                        >
                                            Section {section}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No classes/sections created for Grade {selectedGrade} yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {(viewMode === 'all' || (selectedGrade && selectedSection)) && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    {viewMode === 'classes' && (
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-3xl border-t border-x border-gray-700 p-6 flex justify-between items-center shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-500/30">
                                    <span className="text-xl font-bold text-blue-400">{selectedGrade}{selectedSection}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Class List</h2>
                                    <p className="text-sm text-gray-400">Manage students for this section</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-950/50 px-5 py-2 rounded-full border border-gray-800">
                                <BsPersonWorkspace className="text-purple-400" />
                                <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">In-Charge:</span>
                                <span className="text-purple-300 font-bold">{classTeacher || 'Loading...'}</span>
                            </div>
                        </div>
                    )}

                    {viewMode === 'all' && (
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-3xl border-t border-x border-gray-700 p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-white">All Students</h2>
                            <p className="text-sm text-gray-400">Viewing all registered students</p>
                        </div>
                    )}

                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-b-3xl shadow-2xl overflow-hidden border border-gray-700/50 border-t-0">
                        {loading ? (
                            <div className="p-12 text-center text-gray-400">Loading students...</div>
                        ) : (
                            <table className="min-w-full leading-normal text-left">
                                <thead>
                                    <tr className="bg-gray-900/50 text-blue-300 border-b border-gray-700/50">
                                        <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Roll No</th>
                                        <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Username</th>
                                        <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Grade</th>
                                        <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Section</th>
                                        <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Gender</th>
                                        <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/30">
                                    {filteredStudents.map(student => (
                                        <tr key={student._id} className="hover:bg-gray-700/30 transition duration-200 group">
                                            <td className="px-8 py-5 text-sm text-gray-300 font-mono">{student.roll}</td>
                                            <td className="px-8 py-5 text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{student.username}</td>
                                            <td className="px-8 py-5 text-sm text-blue-200/80">{student.grade}</td>
                                            <td className="px-8 py-5 text-sm text-blue-200/80">{student.section || '-'}</td>
                                            <td className="px-8 py-5 text-sm text-gray-400">{student.gender}</td>
                                            <td className="px-8 py-5 text-sm">
                                                <div className="flex gap-4">
                                                    <Link to={`/dashboard/edit-student/${student._id}`} className="text-blue-400 hover:text-white transition transform hover:scale-110 bg-blue-900/20 p-2 rounded-full hover:bg-blue-600">
                                                        <BsPencilSquare size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(student._id)}
                                                        className="text-red-400 hover:text-white transition transform hover:scale-110 bg-red-900/20 p-2 rounded-full hover:bg-red-600"
                                                    >
                                                        <BsTrash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {!loading && filteredStudents.length === 0 && (
                            <div className="p-12 text-center text-gray-500 text-lg flex flex-col items-center">
                                <span className="text-4xl mb-4 opacity-50">🎓</span>
                                No students found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
