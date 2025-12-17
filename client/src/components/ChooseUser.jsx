import React from 'react';
import { useNavigate } from 'react-router-dom';
import premiumBg from '../assets/premium_landing_bg.png';

const ChooseUser = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
            style={{ backgroundImage: `url(${premiumBg})` }}
        >
            {/* Dark Overlay for better text contrast */}
            <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-[2px]"></div>

            {/* Dark Glass Card */}
            <div className="relative z-10 text-center p-10 bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 border-opacity-50 max-w-4xl mx-4 transform transition-all duration-500 hover:scale-[1.01]">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400">
                    Campus Nexus
                </h1>
                <p className="text-xl md:text-2xl font-light text-gray-300 mb-12 tracking-wide drop-shadow-md">
                    Next-Generation Student Management System
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    <button
                        onClick={() => navigate('/login/student')}
                        className="group relative px-6 py-5 bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-1 border border-blue-500/30"
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <span className="relative text-lg font-bold tracking-wider text-white">Student</span>
                    </button>

                    <button
                        onClick={() => navigate('/login/teacher')}
                        className="group relative px-6 py-5 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-emerald-500/40 hover:-translate-y-1 border border-emerald-500/30"
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <span className="relative text-lg font-bold tracking-wider text-white">Teacher</span>
                    </button>

                    <button
                        onClick={() => navigate('/login/admin')}
                        className="group relative px-6 py-5 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-slate-500/40 hover:-translate-y-1 border border-slate-500/30"
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <span className="relative text-lg font-bold tracking-wider text-white">Admin</span>
                    </button>
                </div>
            </div>

            <div className="absolute bottom-8 text-sm text-gray-500 font-light tracking-widest uppercase">
                © 2025 Campus Nexus
            </div>
        </div>
    );
};

export default ChooseUser;
