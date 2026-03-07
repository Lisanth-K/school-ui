import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import '../../styles/AcademicYear.css'; 

const AcademicYear = () => {
    const [years, setYears] = useState([
        { id: 1, year_name: '2023-2024', start_date: '2023-06-01', end_date: '2024-04-30', is_active: false },
        { id: 2, year_name: '2024-2025', start_date: '2024-06-01', end_date: '2025-04-30', is_active: true }
    ]);
    const [formData, setFormData] = useState({ year_name: '', start_date: '', end_date: '' });

    // Status Change Logic
    const handleStatusChange = (id) => {
        // Mocking backend update: 
        // 1. One year can be active at a time
        // 2. Set selected year as true, others as false
        const updatedYears = years.map(y => ({
            ...y,
            is_active: y.id === id ? true : false
        }));
        
        setYears(updatedYears);
        console.log(`Status changed for ID: ${id}. Backend sync required here.`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newYear = { ...formData, id: Date.now(), is_active: false };
        setYears([...years, newYear]);
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
                        <button type="submit" className="theme-btn-primary" style={{marginTop: '10px'}}>Register Year</button>
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
                </div>
            </div>
        </div>
    );
};

export default AcademicYear;