import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChooseUser from './components/ChooseUser';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import AddStudent from './components/admin/AddStudent';
import Students from './components/admin/Students';
import DashboardHome from './components/admin/DashboardHome';
import Classes from './components/admin/Classes';
import Teachers from './components/admin/Teachers';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AddTeacher from './components/admin/AddTeacher';
import AddClass from './components/admin/AddClass';
import StudentMarks from './components/StudentMarks'; // Don't forget to create/import this
import AddMarks from './components/AddMarks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChooseUser />} />
        <Route path="/" element={<ChooseUser />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/marks" element={<StudentMarks />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/class/:classId/marks" element={<AddMarks />} />
        <Route path="/dashboard" element={<AdminDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="students" element={<Students />} />
          <Route path="classes" element={<Classes />} />
          <Route path="add-class" element={<AddClass />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="add-teacher" element={<AddTeacher />} />
          <Route path="edit-teacher/:id" element={<AddTeacher />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="edit-student/:id" element={<AddStudent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
