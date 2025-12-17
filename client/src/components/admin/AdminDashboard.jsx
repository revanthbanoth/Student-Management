import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;
