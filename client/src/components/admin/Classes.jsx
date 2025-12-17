import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BsPlusCircle, BsPencilSquare, BsTrash } from 'react-icons/bs';

const Classes = () => {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = () => {
        axios.get('http://localhost:5000/class/classes')
            .then(res => setClasses(res.data))
            .catch(err => console.log(err));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this class?")) {
            try {
                const res = await axios.delete(`http://localhost:5000/class/class/${id}`);
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
        <div className="p-8 bg-gray-900 min-h-screen text-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-blue-400 tracking-tight">Classes Management</h1>
                <Link
                    to="/dashboard/add-class"
                    className="flex items-center bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-1 transition duration-300"
                >
                    <BsPlusCircle className="mr-2 text-xl" />
                    <span className="font-semibold">Add Class</span>
                </Link>
            </div>

            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                <table className="min-w-full leading-normal text-left">
                    <thead>
                        <tr className="bg-gray-900 text-purple-400 border-b border-gray-700">
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Class Name</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Section</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Teacher In-Charge</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {classes.map((cls) => (
                            <tr key={cls._id} className="hover:bg-gray-700 transition duration-200">
                                <td className="px-6 py-4 text-sm font-medium text-white">{cls.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{cls.section}</td>
                                <td className="px-6 py-4 text-sm font-mono text-yellow-300 bg-gray-700 rounded-md inline-block mt-2 px-2 py-1">{cls.teacher_id?.username || 'Unassigned'}</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex gap-4">
                                        <button className="text-gray-600 cursor-not-allowed" title="Edit functionality not requested for Class">
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cls._id)}
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
                {classes.length === 0 && (
                    <div className="p-10 text-center text-gray-500 text-lg">
                        No classes found. Add one to see them here!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Classes;
