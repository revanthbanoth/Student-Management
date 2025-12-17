import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AddTeacher = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [contact, setContact] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/teacher/teacher/${id}`)
                .then(res => {
                    const teacher = res.data;
                    setUsername(teacher.username);
                    setEmail(teacher.email);
                    setSubject(teacher.subject);
                    setContact(teacher.contact);
                })
                .catch(err => console.log(err));
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            axios.put(`http://localhost:5000/teacher/teacher/${id}`, {
                username, email, subject, contact
            })
                .then(res => {
                    if (res.data.updated) {
                        navigate('/dashboard/teachers');
                    } else {
                        alert('Update failed');
                    }
                })
                .catch(err => console.log(err));
        } else {
            axios.post('http://localhost:5000/teacher/register', {
                username, password, email, subject, contact
            })
                .then(res => {
                    if (res.data.registered) {
                        navigate('/dashboard/teachers');
                    } else {
                        alert('Registration failed');
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div className="flex justify-center items-center h-full pt-10">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border-t-4 border-green-500 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">{id ? 'Edit Teacher' : 'Add Teacher'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">Username</label>
                        <input type="text" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    {!id && (
                        <div>
                            <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                            <input type="password" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                        <input type="email" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">Subject</label>
                        <input type="text" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">Contact</label>
                        <input type="text" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={contact} onChange={(e) => setContact(e.target.value)} required />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300 shadow-md transform hover:scale-105">
                        {id ? 'Update Teacher' : 'Register Teacher'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTeacher;
