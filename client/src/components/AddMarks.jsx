import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AddMarks = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [className, setClassName] = useState(''); // To display class name
    const [marksData, setMarksData] = useState({}); // Store marks input for each student
    const [subjects, setSubjects] = useState(['Math', 'Science', 'English', 'History', 'Geography']); // Example subjects
    const [selectedSubject, setSelectedSubject] = useState('Math');
    const [examType, setExamType] = useState('Unit Test');

    useEffect(() => {
        // Fetch class details and students
        // We might need an endpoint to get class details by ID, or just fetch students by class ID directly if available.
        // Based on TeacherDashboard, we have: axios.get(http://localhost:5000/class/class/${id}) ? 
        // Or if we don't have that, we can fetch all classes and find one? 
        // Let's assume we can fetch students by class ID or filter them.

        // Actually TeacherDashboard used: axios.get(http://localhost:5000/student/students/grade/${cls.name})
        // This relies on class name. I should probably fetch the class first to get its name.

        const fetchClassAndStudents = async () => {
            try {
                // Fetch class details to get the name/grade
                const classRes = await axios.get(`http://localhost:5000/class/class/${classId}`);
                const cls = classRes.data;
                setClassName(`${cls.name} (${cls.section})`);

                // Fetch students for this class
                const studentsRes = await axios.get(`http://localhost:5000/student/students/grade/${cls.name}`);
                setStudents(studentsRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        if (classId) {
            fetchClassAndStudents();
        }
    }, [classId]);

    const handleInputChange = (studentId, field, value) => {
        setMarksData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const handleSaveMark = async (studentId) => {
        const studentMarks = marksData[studentId];
        if (!studentMarks || !studentMarks.score) {
            alert("Please enter a score");
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/academic/mark', {
                student_id: studentId,
                subject: selectedSubject,
                score: parseInt(studentMarks.score),
                max_score: 100, // Default for now
                exam_type: examType
            });
            if (res.data.recorded) {
                alert(`Marks recorded for student`);
                // Clear input or show success indicator
            } else {
                alert("Failed to record marks");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving marks");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-blue-400">Add Marks - {className}</h1>
                <button
                    onClick={() => navigate('/teacher/dashboard')}
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                    Back to Dashboard
                </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 mb-6">
                <div className="flex gap-4 mb-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Exam Type</label>
                        <select
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Unit Test">Unit Test</option>
                            <option value="Mid Term">Mid Term</option>
                            <option value="Final">Final</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-900 text-gray-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-4">Roll</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Score (out of 100)</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {students.map(student => (
                                <tr key={student._id} className="hover:bg-gray-750">
                                    <td className="p-4 text-gray-300">{student.roll}</td>
                                    <td className="p-4 font-medium text-white">{student.username}</td>
                                    <td className="p-4">
                                        <input
                                            type="number"
                                            min="0" max="100"
                                            placeholder="Enter Score"
                                            value={marksData[student._id]?.score || ''}
                                            onChange={(e) => handleInputChange(student._id, 'score', e.target.value)}
                                            className="bg-gray-700 border border-gray-600 text-white rounded p-2 w-32 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleSaveMark(student._id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
                                        >
                                            Save
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {students.length === 0 && <p className="text-center p-8 text-gray-500 italic">No students found.</p>}
                </div>
            </div>
        </div>
    );
};

export default AddMarks;
