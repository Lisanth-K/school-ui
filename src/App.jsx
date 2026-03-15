import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';
// Admin Pages Import
import AcademicYear from './pages/admin/AcademicYear';
import SubjectManagement from './pages/admin/SubjectManagement';
import ClassSubjectMapping from './pages/admin/ClassSubjectMapping';
import Classes from './pages/admin/Classes';
import Sections from './pages/admin/Sections';
import Students from './pages/admin/Students';
import Enrollments from './pages/admin/Enrollments';
import Exams from './pages/admin/Exams';
import ExamResults from './pages/admin/ExamResults';
import Users from './pages/admin/Users';
import Profiles from './pages/admin/Profiles';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Left Side: Fixed Sidebar */}
        <Sidebar />

        {/* Right Side: Dynamic Main Content */}
        <div className="main-content">
          <Routes>
            {/* Default Dashboard Page */}
            <Route path="/" element={
              <div style={{ padding: '30px' }}>
                <h1 style={{ color: '#1d395e' }}>Welcome to Admin Dashboard 🚀</h1>
                <p style={{ color: '#64748b' }}>Select an option from the sidebar to get started.</p>
              </div>
            } />

            {/* Admin Routes */}
            <Route path="/admin/academic-years" element={<AcademicYear />} />
            <Route path="/admin/subjects" element={<SubjectManagement />} />
            <Route path="/admin/class-subjects" element={<ClassSubjectMapping />} />
            <Route path="/admin/classes" element={<Classes />} />
            <Route path="/admin/sections" element={<Sections />} />
            <Route path="/admin/students" element={<Students />} />
            <Route path="/admin/enrollments" element={<Enrollments />} />
            <Route path="/admin/exams" element={<Exams />} />
            <Route path="/admin/exam-results" element={<ExamResults />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/profiles" element={<Profiles />} />
          </Routes>
        </div>
      </div>
     
    </Router>

  );
}

export default App;