import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BsGraphUp,
    BsPeople,
    BsPerson,
    BsFileText,
    BsBoxArrowRight
} from 'react-icons/bs';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any auth tokens here if implemented
        navigate('/');
    };

    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col transition-all duration-300">
            <div className="p-6 flex items-center justify-center border-b border-slate-700">
                <h1 className="text-2xl font-bold text-blue-400">Admin Panel</h1>
            </div>

            <nav className="flex-1 mt-6">
                <ul className="space-y-2">
                    <li>
                        <Link to="/dashboard" className="flex items-center px-6 py-3 hover:bg-slate-800 transition-colors border-l-4 border-transparent hover:border-blue-500">
                            <BsGraphUp className="mr-3" /> Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/students" className="flex items-center px-6 py-3 hover:bg-slate-800 transition-colors border-l-4 border-transparent hover:border-blue-500">
                            <BsPeople className="mr-3" /> Students
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/teachers" className="flex items-center px-6 py-3 hover:bg-slate-800 transition-colors border-l-4 border-transparent hover:border-blue-500">
                            <BsPerson className="mr-3" /> Teachers
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/classes" className="flex items-center px-6 py-3 hover:bg-slate-800 transition-colors border-l-4 border-transparent hover:border-blue-500">
                            <BsFileText className="mr-3" /> Classes
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="p-6 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-slate-800 rounded transition-colors"
                >
                    <BsBoxArrowRight className="mr-3" /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
