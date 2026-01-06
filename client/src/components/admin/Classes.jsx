import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BackButton from '../BackButton';
import { BsPlusCircle, BsPencilSquare, BsTrash } from 'react-icons/bs';

const Classes = () => {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/class/classes`)
            .then(res => setClasses(res.data))
            .catch(err => console.log(err));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this class?")) {
            try {
                const res = await axios.delete(`${import.meta.env.VITE_API_URL}/class/class/${id}`);
                if (res.data.deleted) {
                    fetchClasses();
                } else {
                    alert("Failed to delete");
                }
            } catch (err) {
                console.log(err);
                alert("Error deleting class");
            }
        }
    };

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-gray-100 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                <div className="flex items-center gap-4 bg-gray-800/40 p-3 pr-8 rounded-full border border-gray-700/50 backdrop-blur-sm shadow-lg">
                    <BackButton to="/dashboard" />
                    <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wide">Classes</h1>
                </div>
                <Link
                    to="/dashboard/add-class"
                    className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 transition duration-300 border border-purple-500/20"
                >
                    <BsPlusCircle className="mr-3 text-xl" />
                    <span className="font-bold tracking-wide">Add Class</span>
                </Link>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
                <table className="min-w-full leading-normal text-left">
                    <thead>
                        <tr className="bg-gray-900/50 text-purple-300 border-b border-gray-700/50">
                            <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Class Name</th>
                            <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Section</th>
                            <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Teacher In-Charge</th>
                            <th className="px-8 py-5 text-sm font-bold uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                        {classes.map((cls) => (
                            <tr key={cls._id} className="hover:bg-gray-700/30 transition duration-200 group">
                                <td className="px-8 py-5 text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{cls.name}</td>
                                <td className="px-8 py-5 text-sm text-gray-300">{cls.section}</td>
                                <td className="px-8 py-5 text-sm">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls.teacher_id ? 'bg-green-900/40 text-green-400 border border-green-500/30' : 'bg-red-900/40 text-red-400 border border-red-500/30'}`}>
                                        {cls.teacher_id?.username || 'Unassigned'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-sm">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleDelete(cls._id)}
                                            className="text-red-400 hover:text-red-300 transition transform hover:scale-110 bg-red-900/20 p-2 rounded-full hover:bg-red-900/40"
                                        >
                                            <BsTrash size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {classes.length === 0 && (
                    <div className="p-12 text-center text-gray-500 text-lg flex flex-col items-center">
                        <span className="text-4xl mb-4 opacity-50">📂</span>
                        No classes found. Add one to get started!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Classes;
