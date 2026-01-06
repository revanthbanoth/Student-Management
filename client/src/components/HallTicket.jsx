import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BsPrinterFill, BsArrowLeft, BsDownload } from 'react-icons/bs';
import { useReactToPrint } from 'react-to-print';
import logo from '../assets/logo.png'; // Assuming logo exists

const HallTicket = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [student, setStudent] = useState(null);
    const componentRef = useRef();

    useEffect(() => {
        const studentId = localStorage.getItem('userId');

        // Fetch Exam Details
        axios.get(`${import.meta.env.VITE_API_URL}/exam/all`) // Use existing all route and filter or create new single route. Filtering for now to save time.
            .then(res => {
                const foundExam = res.data.find(e => e._id === examId);
                setExam(foundExam);
            })
            .catch(err => console.error(err));

        // Fetch Student Details
        if (studentId) {
            axios.get(`${import.meta.env.VITE_API_URL}/student/student/${studentId}`)
                .then(res => setStudent(res.data))
                .catch(err => console.error(err));
        }
    }, [examId]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `HallTicket_${student?.roll || 'Student'}`,
    });

    if (!exam || !student) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Hall Ticket...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8 font-sans">
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center text-white print:hidden">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                    <BsArrowLeft /> Back
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-bold shadow-lg transition"
                >
                    <BsPrinterFill /> Print Hall Ticket
                </button>
            </div>

            {/* Hall Ticket Card - Printable Area */}
            <div className="flex justify-center">
                <div
                    ref={componentRef}
                    className="bg-white text-black w-[210mm] min-h-[297mm] p-10 shadow-2xl relative overflow-hidden print:w-full print:shadow-none"
                    style={{ fontFamily: 'Times New Roman, serif' }} // Formal font
                >
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                        <img src={logo} alt="Watermark" className="w-96 grayscale" />
                    </div>

                    {/* Header */}
                    <div className="border-b-4 border-black pb-4 mb-8 text-center relative z-10">
                        <div className="flex items-center justify-center gap-4 mb-2">
                            <img src={logo} alt="Logo" className="h-20 w-20 object-contain" />
                            <div>
                                <h1 className="text-3xl font-bold uppercase tracking-wider">University Name</h1>
                                <p className="text-sm font-semibold mt-1">UGC Autonomous | Accredited with 'A' Grade</p>
                                <p className="text-xs mt-0.5">Campus Road, City - 500001</p>
                            </div>
                        </div>
                        <h2 className="text-2xl font-black uppercase mt-6 bg-black text-white inline-block px-8 py-1">
                            Hall Ticket
                        </h2>
                        <p className="mt-2 text-lg font-bold">{exam.title}</p>
                    </div>

                    {/* Student Info Grid */}
                    <div className="flex justify-between items-start border-2 border-black p-4 mb-8 relative z-10">
                        <div className="space-y-3 flex-1">
                            <div className="flex">
                                <span className="font-bold w-32">Student Name:</span>
                                <span className="uppercase border-b border-dotted border-black min-w-[200px]">{student.username}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Roll Number:</span>
                                <span className="font-mono text-lg font-bold">{student.roll}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Course/Grade:</span>
                                <span>{student.grade} - {student.section || 'A'}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Exam Center:</span>
                                <span>Main Campus, Block B</span>
                            </div>
                        </div>

                        {/* Photo Box */}
                        <div className="w-32 h-40 border-2 border-black flex flex-col items-center justify-center text-xs text-center ml-4">
                            {/* Placeholder for real photo if available */}
                            <span className="opacity-50">Affix Recent<br />Passport Photo</span>
                        </div>
                    </div>

                    {/* Exam Timetable */}
                    <div className="mb-8 relative z-10">
                        <h3 className="font-bold text-lg mb-2 border-l-4 border-black pl-2">Examination Schedule</h3>
                        <table className="w-full border-collapse border border-black text-sm">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-black px-4 py-2 text-left">Date</th>
                                    <th className="border border-black px-4 py-2 text-left">Time</th>
                                    <th className="border border-black px-4 py-2 text-left">Subject Code</th>
                                    <th className="border border-black px-4 py-2 text-left">Subject Name</th>
                                    <th className="border border-black px-4 py-2 text-center w-32">Invigilator Sign</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exam.timetable.map((t, idx) => (
                                    <tr key={idx}>
                                        <td className="border border-black px-4 py-3 font-bold">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="border border-black px-4 py-3">{t.time}</td>
                                        <td className="border border-black px-4 py-3 text-center">{100 + idx}</td> {/* Dummy code */}
                                        <td className="border border-black px-4 py-3 uppercase">{t.subject}</td>
                                        <td className="border border-black px-4 py-3"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Instructions */}
                    <div className="mb-12 relative z-10">
                        <h3 className="font-bold text-md mb-2">Instructions to Candidates:</h3>
                        <ul className="list-disc list-inside text-xs space-y-1 text-justify leading-relaxed">
                            <li>Candidates must present this Hall Ticket and a valid ID proof for verification at the entrance.</li>
                            <li>Candidates should report to the exam center at least 30 months before the scheduled time.</li>
                            <li>Electronic gadgets, smartwatches, and programmable calculators are strictly prohibited.</li>
                            <li>No candidate will be allowed to leave the examination hall before half of the duration is completed.</li>
                            <li>Malpractice of any kind will attract severe disciplinary action.</li>
                        </ul>
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between items-end mt-20 relative z-10">
                        <div className="text-center">
                            <div className="w-40 border-b border-black mb-1"></div>
                            <p className="font-bold text-sm">Student Signature</p>
                        </div>
                        <div className="text-center">
                            {/* <img src={sign} className="h-10 mx-auto" /> */}
                            <div className="font-script text-2xl mb-1">Controller of Exams</div>
                            <div className="w-40 border-b border-black mb-1"></div>
                            <p className="font-bold text-sm">Controller of Examinations</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-gray-500 border-t pt-2 mx-10">
                        Generated by Student Management System on {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HallTicket;
