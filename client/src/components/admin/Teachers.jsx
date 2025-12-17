import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BsPlusCircle, BsPencilSquare, BsTrash } from 'react-icons/bs';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = () => {
        axios.get('http://localhost:5000/teacher/teachers')
            .then(res => setTeachers(res.data))
            .catch(err => console.log(err));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this teacher?")) {
            try {
                const res = await axios.delete(`http://localhost:5000/teacher/teacher/${id}`);
                if (res.data.deleted) {
                    fetchTeachers();
                } else {
                    alert("Failed to delete");
                }
            } catch (err) {
                console.log(err);
                alert("Error deleting teacher");
            }
        }
    };

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-blue-400 tracking-tight">Teachers Management</h1>
                <Link
                    to="/dashboard/add-teacher"
                    className="flex items-center bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-green-500/50 transform hover:-translate-y-1 transition duration-300"
                >
                    <BsPlusCircle className="mr-2 text-xl" />
                    <span className="font-semibold">Add Teacher</span>
                </Link>
            </div>

            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                <table className="min-w-full leading-normal text-left">
                    <thead>
                        <tr className="bg-gray-900 text-green-400 border-b border-gray-700">
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {teachers.map((teacher) => (
                            <tr key={teacher._id} className="hover:bg-gray-700 transition duration-200">
                                <td className="px-6 py-4 text-sm font-medium text-white">{teacher.username}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{teacher.subject}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">{teacher.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">{teacher.contact}</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex gap-4">
                                        <Link to={`/dashboard/edit-teacher/${teacher._id}`} className="text-blue-400 hover:text-blue-300 transition transform hover:scale-110">
                                            <BsPencilSquare size={20} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(teacher._id)}
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
                {teachers.length === 0 && (
                    <div className="p-10 text-center text-gray-500 text-lg">
                        No teachers found. Add one to see them here!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Teachers;
