import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from '../BackButton';

const AddClass = () => {
    const [name, setName] = useState('');
    const [section, setSection] = useState('');
    const [teacher_id, setTeacherId] = useState('');
    const [teachers, setTeachers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch teachers to assign to class
        axios.get(`${import.meta.env.VITE_API_URL}/teacher/teachers`)
            .then(res => setTeachers(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${import.meta.env.VITE_API_URL}/class/create`, {
            name, section, teacher_id
        })
            .then(res => {
                if (res.data.created) {
                    navigate('/dashboard/classes');
                } else {
                    alert('Creation failed');
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="flex justify-center items-center h-full pt-10">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border-t-4 border-purple-500 border border-gray-700">
                <div className="mb-4">
                    <BackButton to="/dashboard/classes" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Add Class</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">Class Name</label>
                        <input type="text" placeholder="e.g. Grade 10" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">Section</label>
                        <input type="text" placeholder="e.g. A" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" onChange={(e) => setSection(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">Teacher In-Charge</label>
                        <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" onChange={(e) => setTeacherId(e.target.value)} required>
                            <option value="">Select Teacher</option>
                            {teachers.map(t => (
                                <option key={t._id} value={t._id}>{t.username}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition duration-300 shadow-md transform hover:scale-105">
                        Create Class
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddClass;
