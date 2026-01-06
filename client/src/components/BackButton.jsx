import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const BackButton = ({ to, label = "Back" }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 border border-blue-500/30 group"
        >
            <BsArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">{label}</span>
        </button>
    );
};

export default BackButton;
