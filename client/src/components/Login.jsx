import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/auth/login', {
                username,
                password,
                role
            });

            if (res.data.login) {
                localStorage.setItem('role', role);
                if (role === 'admin') {
                    navigate('/dashboard');
                } else if (role === 'student') {
                    localStorage.setItem('userId', res.data.id);
                    navigate('/student/dashboard');
                } else if (role === 'teacher') {
                    localStorage.setItem('userId', res.data.id);
                    navigate('/teacher/dashboard');
                }
            } else {
                setError("Login failed. Please check your credentials."); // More specific error fallback
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed. Server error?');
        }
    };

    const getRoleColor = () => {
        switch (role) {
            case 'admin': return 'from-gray-800 to-gray-900';
            case 'teacher': return 'from-green-700 to-green-900';
            case 'student': return 'from-blue-700 to-blue-900';
            default: return 'from-blue-900 to-indigo-900';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="flex w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden bg-gray-800 border border-gray-700">

                {/* Visual Side */}
                <div className={`hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br ${getRoleColor()} p-10 text-white`}>
                    <h2 className="text-4xl font-extrabold mb-4 text-center drop-shadow-lg">Welcome Back!</h2>
                    <p className="text-lg text-center opacity-90 drop-shadow-md">
                        {role === 'admin' && "Manage the entire institution efficiently."}
                        {role === 'teacher' && "Empower students and track their progress."}
                        {role === 'student' && "Access your records and stay updated."}
                    </p>
                    {/* Decorative Circle or Icon could go here */}
                    <div className="mt-8 bg-white bg-opacity-20 rounded-full h-32 w-32 flex items-center justify-center animate-pulse backdrop-blur-sm">
                        {/* Emojis based on role */}
                        <span className="text-6xl drop-shadow-xl">
                            {role === 'admin' && '🛡️'}
                            {role === 'teacher' && '👩‍🏫'}
                            {role === 'student' && '🧑‍🎓'}
                        </span>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-6 text-white capitalize center md:text-left">
                        {role} Login
                    </h2>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-3 rounded" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-300 text-sm font-bold mb-2">
                                {role === 'student' ? 'Roll Number / Username' : 'Username'}
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-200"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-200"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-lg transform transition hover:scale-105 bg-gradient-to-r ${getRoleColor()} hover:opacity-90`}
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-blue-400 hover:underline transition">
                            &larr; Back to Role Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
