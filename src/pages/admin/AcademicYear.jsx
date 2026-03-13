import React, { useState, useEffect } from 'react';
import { Calendar, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { academicYearAPI } from '../../api/api';
import '../../styles/AcademicYear.css'; 

const AcademicYear = () => {
    const [years, setYears] = useState([]);
    const [formData, setFormData] = useState({ year_name: '', start_date: '', end_date: '' });
    
    // UI States
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Auto-dismiss success message after 3 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Fetch academic years from backend on page load
    useEffect(() => {
        fetchYears();
    }, []);

    const fetchYears = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await academicYearAPI.getAll();
            setYears(data);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch academic years:', err);
        } finally {
            setLoading(false);
        }
    };

    // Set a year as active (backend call)
    const handleStatusChange = async (id) => {
        setError(null);
        try {
            await academicYearAPI.setActive(id);
            setSuccess('Academic year status updated successfully!');
            // Refresh the list after status change
            await fetchYears();
        } catch (err) {
            setError(err.message);
            console.error('Failed to update status:', err);
        }
    };

    // Submit new academic year to backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await academicYearAPI.create(formData);
            setSuccess('Academic year created successfully!');
            setFormData({ year_name: '', start_date: '', end_date: '' });
            // Refresh the list
            await fetchYears();
        } catch (err) {
            setError(err.message);
            console.error('Failed to create academic year:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><Calendar size={28} /> Academic Year</h1>
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

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Add Academic Year</h2></div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="theme-form">
                        <div className="form-grid">
                            <div className="form-row">
                                <label>Year Name *</label>
                                <input type="text" placeholder="e.g. 2025-2026" value={formData.year_name} onChange={(e) => setFormData({...formData, year_name: e.target.value})} required />
                            </div>
                            <div className="form-row">
                                <label>Start Date *</label>
                                <input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} required />
                            </div>
                            <div className="form-row">
                                <label>End Date *</label>
                                <input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} required />
                            </div>
                        </div>
                        <button type="submit" className="theme-btn-primary" style={{marginTop: '10px'}} disabled={submitting}>
                            {submitting ? (
                                <><Loader2 size={16} className="spin-icon" /> Saving...</>
                            ) : (
                                'Register Year'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Academic Years List</h2></div>
                <div className="card-body" style={{padding: '0'}}>
                    {loading ? (
                        <div className="loading-state">
                            <Loader2 size={24} className="spin-icon" />
                            <span>Loading academic years...</span>
                        </div>
                    ) : years.length === 0 ? (
                        <div className="empty-state">
                            <Calendar size={40} />
                            <p>No academic years found. Add one above!</p>
                        </div>
                    ) : (
                        <table className="theme-table">
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {years.map(y => (
                                    <tr key={y.id}>
                                        <td style={{fontWeight: '600'}}>{y.year_name}</td>
                                        <td>{y.start_date} to {y.end_date}</td>
                                        <td>
                                            <span className={`badge ${y.is_active ? 'active' : 'archived'}`}>
                                                {y.is_active ? 'Active' : 'Archived'}
                                            </span>
                                        </td>
                                        <td>
                                            {!y.is_active && (
                                                <button 
                                                    onClick={() => handleStatusChange(y.id)}
                                                    className="status-toggle-btn"
                                                >
                                                    Set Active
                                                </button>
                                            )}
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

export default AcademicYear;