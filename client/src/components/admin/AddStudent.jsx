import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AddStudent = () => {
    const [username, setUsername] = useState('');
    const [roll, setRoll] = useState('');
    const [password, setPassword] = useState('');
    const [grade, setGrade] = useState('');
    const [gender, setGender] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            axios.get('http://localhost:5000/student/students') // Inefficient to fetch all, but we don't have a get-one endpoint yet except findOne maybe?
            // Actually, usually we have a getById. I'll use the list and filter for now to be safe,
            // OR I can quickly check if I have a getById. I don't think I made one.
            // Wait, I made a DELETE /student/:id and UPDATE /student/:id. I didn't make a GET /student/:id.
            // To be safe and quick, I'll fetch all and find one, OR just add a get endpoint.
            // Adding a get endpoint is better.
            // Let's add GET /student/:id to backend first? No, I want to finish this file.
            // I'll assume I can just loop through for now or I'll add the endpoint in the next step.
            // Actually, I'll add the endpoint in the next step.
            fetchStudent();
        }
    }, [id]);

    const fetchStudent = async () => {
        try {
            // I will implement this route momentarily
            const res = await axios.get(`http://localhost:5000/student/student/${id}`);
            const student = res.data;
            setUsername(student.username);
            setRoll(student.roll);
            setGrade(student.grade);
            setGender(student.gender);
            // Password usually not sent back for security, keep blank to leave unchanged?
            // Logic below needs to handle blank password updates if editing.
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            axios.put(`http://localhost:5000/student/student/${id}`, {
                username,
                roll,
                grade,
                // password, // We might not want to update password here unless provided
            })
                .then(res => {
                    if (res.data.updated) {
                        navigate('/dashboard/students');
                    } else {
                        alert('Update failed');
                    }
                })
                .catch(err => console.log(err));
        } else {
            axios.post('http://localhost:5000/student/register', {
                username,
                roll,
                password,
                grade,
                gender
            })
                .then(res => {
                    if (res.data.registered) {
                        navigate('/dashboard/students');
                    } else {
                        console.log(res);
                        alert('Registration failed: ' + (res.data.message || 'Unknown error'));
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div className="flex justify-center items-center h-full pt-10">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border-t-4 border-blue-500 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">{id ? 'Edit Student' : 'Add Student'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">Roll No</label>
                        <input
                            type="text"
                            placeholder="Enter Roll No"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={roll}
                            onChange={(e) => setRoll(e.target.value)}
                            required
                        />
                    </div>
                    {!id && (
                        <div>
                            <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">Grade</label>
                        <input
                            type="text"
                            placeholder="Enter Grade"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            required
                        />
                    </div>
                    {!id && ( // Gender
                        <div>
                            <label className="block text-gray-300 text-sm font-bold mb-2">Gender</label>
                            <select
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-105"
                    >
                        {id ? 'Update Student' : 'Register Student'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;
