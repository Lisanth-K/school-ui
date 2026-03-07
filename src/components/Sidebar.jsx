import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Calendar, 
    BookOpen, 
    Layers, 
    Users, 
    UserPlus, 
    ClipboardList, 
    Award 
} from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            {/* Logo Section */}
            <div className="sidebar-logo">
                <h2>School ERP</h2>
            </div>

            {/* Admin Profile Section */}
            <div className="sidebar-profile">
                <div className="profile-icon">
                    <span style={{ color: '#1d395e', fontWeight: 'bold' }}>A</span>
                </div>
                <div className="profile-info">
                    <span className="admin-name">Admin User</span>
                    <span className="admin-role">Administrator</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <LayoutDashboard className="nav-icon" size={20} />
                    <span className="nav-text">Dashboard</span>
                </NavLink>

                <div className="nav-section-title">ACADEMICS</div>

                <NavLink to="/admin/academic-years" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Calendar className="nav-icon" size={20} />
                    <span className="nav-text">Academic Years</span>
                </NavLink>

                <NavLink to="/admin/classes" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Layers className="nav-icon" size={20} />
                    <span className="nav-text">Classes & Sections</span>
                </NavLink>

                <NavLink to="/admin/subjects" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <BookOpen className="nav-icon" size={20} />
                    <span className="nav-text">Subjects</span>
                </NavLink>

                <div className="nav-section-title">STUDENTS</div>

                <NavLink to="/admin/students" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Users className="nav-icon" size={20} />
                    <span className="nav-text">Students List</span>
                </NavLink>

                <NavLink to="/admin/enrollments" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <UserPlus className="nav-icon" size={20} />
                    <span className="nav-text">Enrollments</span>
                </NavLink>

                <div className="nav-section-title">EXAMINATIONS</div>

                <NavLink to="/admin/exams" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <ClipboardList className="nav-icon" size={20} />
                    <span className="nav-text">Exams</span>
                </NavLink>

                <NavLink to="/admin/exam-results" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Award className="nav-icon" size={20} />
                    <span className="nav-text">Exam Results</span>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;