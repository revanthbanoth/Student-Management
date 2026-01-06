import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BsGraphUp,
    BsPeople,
    BsPerson,
    BsFileText,
    BsBoxArrowRight,
    BsShieldLock
} from 'react-icons/bs';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any auth tokens here if implemented
        navigate('/');
    };

    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col transition-all duration-300 shadow-2xl border-r border-slate-800">
            <div className="p-6 flex items-center justify-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <BsShieldLock size={28} className="text-blue-500 mr-3 animate-pulse" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Admin Panel</h1>
            </div>

            <nav className="flex-1 mt-6 px-4">
                <ul className="space-y-3">
                    <li>
                        <Link to="/dashboard" className="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 transition-all duration-300 group shadow-sm hover:shadow-blue-500/20">
                            <BsGraphUp className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                            <span className="font-medium group-hover:translate-x-1 transition-transform">Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/students" className="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 transition-all duration-300 group shadow-sm hover:shadow-blue-500/20">
                            <BsPeople className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                            <span className="font-medium group-hover:translate-x-1 transition-transform">Students</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/teachers" className="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 transition-all duration-300 group shadow-sm hover:shadow-green-500/20">
                            <BsPerson className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                            <span className="font-medium group-hover:translate-x-1 transition-transform">Teachers</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/classes" className="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-500 transition-all duration-300 group shadow-sm hover:shadow-purple-500/20">
                            <BsFileText className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                            <span className="font-medium group-hover:translate-x-1 transition-transform">Classes</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/examination" className="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-500 transition-all duration-300 group shadow-sm hover:shadow-orange-500/20">
                            <BsFileText className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                            <span className="font-medium group-hover:translate-x-1 transition-transform">Examination Cell</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="p-6 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-400 hover:text-white hover:bg-red-600/90 rounded-xl transition-all duration-300 group"
                >
                    <BsBoxArrowRight className="mr-3 text-xl group-hover:rotate-180 transition-transform" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
