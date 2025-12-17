import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BsPlusCircle, BsPencilSquare, BsTrash } from 'react-icons/bs';

const Students = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        axios.get('http://localhost:5000/student/students')
            .then(res => setStudents(res.data))
            .catch(err => console.log(err));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                const res = await axios.delete(`http://localhost:5000/student/student/${id}`);
                if (res.data.deleted) {
                    fetchStudents(); // Refresh list
                } else {
                    alert("Failed to delete");
                }
            } catch (err) {
                console.error(err);
                alert("Error deleting student");
            }
        }
    };

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-blue-400 tracking-tight">Students Management</h1>
                <Link
                    to="/dashboard/add-student"
                    className="flex items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1 transition duration-300"
                >
                    <BsPlusCircle className="mr-2 text-xl" />
                    <span className="font-semibold">Add Student</span>
                </Link>
            </div>

            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                <table className="min-w-full leading-normal text-left">
                    <thead>
                        <tr className="bg-gray-900 text-blue-300 border-b border-gray-700">
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Roll No</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Username</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Grade</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Gender</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {students.map(student => (
                            <tr key={student._id} className="hover:bg-gray-700 transition duration-200">
                                <td className="px-6 py-4 text-sm font-medium text-gray-300">{student.roll}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-white">{student.username}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">{student.grade}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">{student.gender}</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex gap-4">
                                        <Link to={`/dashboard/edit-student/${student._id}`} className="text-blue-400 hover:text-blue-300 transition transform hover:scale-110">
                                            <BsPencilSquare size={20} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(student._id)}
                                            className="text-red-400 hover:text-red-300 transition transform hover:scale-110"
                                        >
                                            <BsTrash size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {students.length === 0 && (
                    <div className="p-10 text-center text-gray-500 text-lg">
                        No students found. Add one to see them here!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Students;
