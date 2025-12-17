import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsPeopleFill, BsPersonVideo3, BsCollectionFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import dashboardBg from '../../assets/dashboard-bg.png';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        classes: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = () => {
        axios.get('http://localhost:5000/dashboard/stats')
            .then(res => {
                setStats(res.data);
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="space-y-8">
            <div
                className="relative bg-cover bg-center p-12 rounded-2xl shadow-2xl text-white overflow-hidden"
                style={{ backgroundImage: `url(${dashboardBg})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Darker overlay */}
                <div className="relative z-10">
                    <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">Admin Dashboard</h1>
                    <p className="text-gray-200 mt-4 text-xl drop-shadow-md max-w-2xl font-light">
                        Welcome to your command center. Manage students, teachers, and classes effectively.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Students Card - Clickable */}
                <Link to="/dashboard/students" className="block">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer h-full">
                        <div className="flex items-center justify-between h-full">
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">Total Students</p>
                                <p className="text-5xl font-extrabold text-white mt-2 group-hover:text-blue-400 transition-colors">{stats.students}</p>
                            </div>
                            <div className="bg-blue-900/30 p-4 rounded-full text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-500/20">
                                <BsPeopleFill size={32} />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Teachers Card - Clickable */}
                <Link to="/dashboard/teachers" className="block">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl hover:border-green-500 transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer h-full">
                        <div className="flex items-center justify-between h-full">
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">Total Teachers</p>
                                <p className="text-5xl font-extrabold text-white mt-2 group-hover:text-green-400 transition-colors">{stats.teachers}</p>
                            </div>
                            <div className="bg-green-900/30 p-4 rounded-full text-green-400 group-hover:bg-green-600 group-hover:text-white transition-colors border border-green-500/20">
                                <BsPersonVideo3 size={32} />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Classes Card - Clickable */}
                <Link to="/dashboard/classes" className="block">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl hover:border-yellow-500 transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer h-full">
                        <div className="flex items-center justify-between h-full">
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">Total Classes</p>
                                <p className="text-5xl font-extrabold text-white mt-2 group-hover:text-yellow-400 transition-colors">{stats.classes}</p>
                            </div>
                            <div className="bg-yellow-900/30 p-4 rounded-full text-yellow-400 group-hover:bg-yellow-600 group-hover:text-white transition-colors border border-yellow-500/20">
                                <BsCollectionFill size={32} />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default DashboardHome;
