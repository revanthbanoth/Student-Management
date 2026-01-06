import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BackButton from '../BackButton';
import { BsPlusCircle, BsPencilSquare, BsTrash } from 'react-icons/bs';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/teacher/teachers`)
            .then(res => setTeachers(res.data))
            .catch(err => console.log(err));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this teacher?")) {
            try {
                const res = await axios.delete(`${import.meta.env.VITE_API_URL}/teacher/teacher/${id}`);
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
        <div className="p-8 bg-gray-900 min-h-screen text-gray-100 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                <div className="flex items-center gap-4 bg-gray-800/40 p-3 pr-8 rounded-full border border-gray-700/50 backdrop-blur-sm shadow-lg">
                    <BackButton to="/dashboard" />
                    <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 tracking-wide">Teachers</h1>
                </div>
                <Link
                    to="/dashboard/add-teacher"
                    className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1 transition duration-300 border border-green-500/20"
                >
                    <BsPlusCircle className="mr-3 text-xl" />
                    <span className="font-bold tracking-wide">Add Teacher</span>
                </Link>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
                <table className="min-w-full leading-normal text-left">
                    <thead>
                        <tr className="bg-gray-900/50 text-green-300 border-b border-gray-700/50">
                            <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Name</th>
                            <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Subject</th>
                            <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Email</th>
                            <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Contact</th>
                            <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                        {teachers.map((teacher) => (
                            <tr key={teacher._id} className="hover:bg-gray-700/30 transition duration-200 group">
                                <td className="px-8 py-5 text-sm font-bold text-white group-hover:text-green-300 transition-colors">{teacher.username}</td>
                                <td className="px-8 py-5 text-sm text-gray-300">{teacher.subject}</td>
                                <td className="px-8 py-5 text-sm text-gray-400">{teacher.email}</td>
                                <td className="px-8 py-5 text-sm text-gray-400">{teacher.contact}</td>
                                <td className="px-8 py-5 text-sm">
                                    <div className="flex gap-4">
                                        <Link to={`/dashboard/edit-teacher/${teacher._id}`} className="text-blue-400 hover:text-white transition transform hover:scale-110 bg-blue-900/20 p-2 rounded-full hover:bg-blue-600">
                                            <BsPencilSquare size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(teacher._id)}
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
                {teachers.length === 0 && (
                    <div className="p-12 text-center text-gray-500 text-lg flex flex-col items-center">
                        <span className="text-4xl mb-4 opacity-50">👨‍🏫</span>
                        No teachers found. Add one to see them here!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Teachers;
