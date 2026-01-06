import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

const StudentMarks = () => {
    const [marks, setMarks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const studentId = localStorage.getItem('userId');
        if (studentId) {
            axios.get(`${import.meta.env.VITE_API_URL}/academic/marks/${studentId}`)
                .then(res => setMarks(res.data))
                .catch(err => console.log(err));
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-blue-400">My Academic Results</h1>
                <BackButton to="/student/dashboard" label="Back to Dashboard" />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-4xl mx-auto">
                {marks.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-gray-700">
                        <table className="min-w-full bg-gray-800 text-left">
                            <thead className="bg-gray-900 text-blue-300">
                                <tr>
                                    <th className="py-4 px-4 font-semibold uppercase tracking-wider text-sm border-b border-gray-700">Subject</th>
                                    <th className="py-4 px-4 font-semibold uppercase tracking-wider text-sm border-b border-gray-700">Exam Type</th>
                                    <th className="py-4 px-4 font-semibold uppercase tracking-wider text-sm border-b border-gray-700">Score</th>
                                    <th className="py-4 px-4 font-semibold uppercase tracking-wider text-sm border-b border-gray-700">Max Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {marks.map((mark, index) => (
                                    <tr key={index} className="hover:bg-gray-750 transition duration-150">
                                        <td className="py-4 px-4 font-medium text-white">{mark.subject}</td>
                                        <td className="py-4 px-4 text-gray-400">{mark.exam_type}</td>
                                        <td className="py-4 px-4 text-blue-400 font-bold text-lg">{mark.score}</td>
                                        <td className="py-4 px-4 text-gray-500">{mark.max_score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center p-10">
                        <p className="text-gray-500 italic text-lg">No marks recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentMarks;
