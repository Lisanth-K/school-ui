import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';

// Admin Pages Import
import AcademicYear from './pages/admin/AcademicYear';
import SubjectManagement from './pages/admin/SubjectManagement';
import ClassesManagement from './pages/admin/ClassesManagement';
import ExamsManagement from './pages/admin/ExamsManagement';
import ExamResultsManagement from './pages/admin/ExamResultsManagement';
import StudentsList from './pages/admin/StudentsList';

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
            <Route path="/admin/classes" element={<ClassesManagement />} />
            <Route path="/admin/exams" element={<ExamsManagement />} />
            <Route path="/admin/exam-results" element={<ExamResultsManagement />} />
            <Route path="/admin/students" element={<StudentsList />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;