import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import '../../styles/AcademicYear.css'; 

const AcademicYear = () => {
    const [years, setYears] = useState([
        { id: 1, year_name: '2023-2024', start_date: '2023-06-01', end_date: '2024-04-30', is_active: false },
        { id: 2, year_name: '2024-2025', start_date: '2024-06-01', end_date: '2025-04-30', is_active: true }
    ]);
    const [formData, setFormData] = useState({ year_name: '', start_date: '', end_date: '' });
    const [editingId, setEditingId] = useState(null);

    const handleStatusChange = (id) => {
        setYears(prev => prev.map(y => ({
            ...y,
            is_active: y.id === id
        })));
    };

    const handleRemove = (id) => {
        setYears(prev => prev.filter(y => y.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setFormData({ year_name: '', start_date: '', end_date: '' });
        }
    };

    const handleEdit = (year) => {
        setEditingId(year.id);
        setFormData({
            year_name: year.year_name,
            start_date: year.start_date,
            end_date: year.end_date
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { year_name: formData.year_name, start_date: formData.start_date, end_date: formData.end_date };
        if (editingId) {
            setYears(prev => prev.map(y => (y.id === editingId ? { ...y, ...payload } : y)));
            setEditingId(null);
        } else {
            setYears(prev => [...prev, { ...payload, id: Date.now(), is_active: false }]);
        }
        setFormData({ year_name: '', start_date: '', end_date: '' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><Calendar size={28} /> Academic Year</h1>
            </div>

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
                        <button type="submit" className="theme-btn-primary" style={{marginTop: '10px'}}>
                            {editingId ? 'Update Year' : 'Register Year'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="status-toggle-btn"
                                style={{ marginLeft: '10px', marginTop: '10px' }}
                                onClick={() => { setEditingId(null); setFormData({ year_name: '', start_date: '', end_date: '' }); }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Academic Years List</h2></div>
                <div className="card-body" style={{padding: '0'}}>
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
                                    <td className="action-cell">
                                        {!y.is_active && (
                                            <button type="button" onClick={() => handleStatusChange(y.id)} className="status-toggle-btn">
                                                Set Active
                                            </button>
                                        )}
                                        <button type="button" className="status-toggle-btn" onClick={() => handleEdit(y)}>Edit</button>
                                        <button type="button" className="status-toggle-btn action-remove" onClick={() => handleRemove(y.id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AcademicYear;