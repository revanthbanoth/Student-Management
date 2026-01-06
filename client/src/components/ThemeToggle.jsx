import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-2xl transition-all duration-300 bg-gray-800 border-2 border-gray-700 hover:scale-110"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
            <span className="text-2xl">{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>
    );
};

export default ThemeToggle;
