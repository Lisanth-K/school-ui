import React, { useState, useEffect } from 'react';
import { BookOpen, Edit, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { subjectsAPI } from '../../api/api';
import '../../styles/SubjectManagement.css'; 

const SubjectManagement = () => {
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        short_code: '',
        is_elective: false,
        has_practical: false
    });

    // UI States
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Auto-dismiss success message
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Fetch subjects from backend on page load
    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await subjectsAPI.getAll();
            setSubjects(data);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch subjects:', err);
        } finally {
            setLoading(false);
        }
    };

    // Submit new subject to backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await subjectsAPI.create(formData);
            setSuccess('Subject created successfully!');
            setFormData({ name: '', short_code: '', is_elective: false, has_practical: false });
            // Refresh the list
            await fetchSubjects();
        } catch (err) {
            setError(err.message);
            console.error('Failed to create subject:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete a subject
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) return;
        setError(null);
        try {
            await subjectsAPI.delete(id);
            setSuccess('Subject deleted successfully!');
            await fetchSubjects();
        } catch (err) {
            setError(err.message);
            console.error('Failed to delete subject:', err);
        }
    };

    return (
        <div className="subject-container">
            {/* Header */}
            <div className="header-section">
                <h1 className="header-title">
                    <BookOpen size={30} /> Subject Management
                </h1>
                <p className="header-subtitle">
                    Add and manage academic subjects for the current session
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button className="alert-close" onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Success Alert */}
            {success && (
                <div className="alert alert-success">
                    <CheckCircle2 size={18} />
                    <span>{success}</span>
                </div>
            )}

            {/* Form Card */}
            <div className="subject-card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="subject-form-grid">
                            <div className="form-group">
                                <label>Subject Name <span style={{color: 'red'}}>*</span></label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Mathematics" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Short Code</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. MAT01" 
                                    value={formData.short_code} 
                                    onChange={(e) => setFormData({...formData, short_code: e.target.value})} 
                                />
                            </div>

                            <div className="checkbox-row">
                                <label className="checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.is_elective} 
                                        onChange={(e) => setFormData({...formData, is_elective: e.target.checked})} 
                                    />
                                    Elective Subject
                                </label>
                                <label className="checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.has_practical} 
                                        onChange={(e) => setFormData({...formData, has_practical: e.target.checked})} 
                                    />
                                    Includes Practical/Lab
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={submitting}>
                                {submitting ? (
                                    <><Loader2 size={16} className="spin-icon" /> Saving...</>
                                ) : (
                                    'Save Subject Details'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Subjects Table Section */}
            <div className="list-section">
                <h2 className="section-title">Academic Subjects List</h2>
                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading-state">
                            <Loader2 size={24} className="spin-icon" />
                            <span>Loading subjects...</span>
                        </div>
                    ) : subjects.length === 0 ? (
                        <div className="empty-state">
                            <BookOpen size={40} />
                            <p>No subjects found. Add one above!</p>
                        </div>
                    ) : (
                        <table className="subject-table">
                            <thead>
                                <tr>
                                    <th>Subject Name</th>
                                    <th>Short Code</th>
                                    <th>Category</th>
                                    <th>Practical</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((sub) => (
                                    <tr key={sub.id}>
                                        <td>{sub.name}</td>
                                        <td>{sub.short_code || '-'}</td>
                                        <td>
                                            <span className={`type-badge ${sub.is_elective ? 'elective' : 'core'}`}>
                                                {sub.is_elective ? 'Elective' : 'Core'}
                                            </span>
                                        </td>
                                        <td>
                                            {sub.has_practical ? '✅ Yes' : '❌ No'}
                                        </td>
                                        <td className="action-cell">
                                            <button className="action-icon edit"><Edit size={18} /></button>
                                            <button className="action-icon delete" onClick={() => handleDelete(sub.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubjectManagement;