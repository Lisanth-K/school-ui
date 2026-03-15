import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import '../../styles/Classes.css';

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({ name: '', academic_year_id: '' });
    const [editingId, setEditingId] = useState(null);
    const [academicYears, setAcademicYears] = useState([
        { id: 1, year_name: '2024-2025' },
        { id: 2, year_name: '2023-2024' }
    ]);

    useEffect(() => {
        setClasses([
            { id: 1, name: 'Class 1', academic_year_id: 1, year_name: '2024-2025' },
            { id: 2, name: 'Class 2', academic_year_id: 1, year_name: '2024-2025' }
        ]);
    }, []);

    const handleRemove = (id) => {
        setClasses(prev => prev.filter(c => c.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setFormData({ name: '', academic_year_id: '' });
        }
    };

    const handleEdit = (cls) => {
        setEditingId(cls.id);
        setFormData({
            name: cls.name,
            academic_year_id: String(cls.academic_year_id)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const yr = academicYears.find(y => y.id === Number(formData.academic_year_id));
        const payload = {
            name: formData.name,
            academic_year_id: yr?.id,
            year_name: yr?.year_name || '-'
        };
        if (editingId) {
            setClasses(prev => prev.map(c => (c.id === editingId ? { ...c, ...payload } : c)));
            setEditingId(null);
        } else {
            setClasses(prev => [...prev, { id: Date.now(), ...payload }]);
        }
        setFormData({ name: '', academic_year_id: '' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><Layers size={28} /> Classes</h1>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Add Class</h2></div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="theme-form">
                        <div className="form-grid">
                            <div className="form-row">
                                <label>Class Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Class 1"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Academic Year *</label>
                                <select
                                    value={formData.academic_year_id}
                                    onChange={(e) => setFormData({ ...formData, academic_year_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select year</option>
                                    {academicYears.map(y => <option key={y.id} value={y.id}>{y.year_name}</option>)}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="theme-btn-primary" style={{ marginTop: '10px' }}>
                            {editingId ? 'Update Class' : 'Add Class'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="status-toggle-btn"
                                style={{ marginLeft: '10px', marginTop: '10px' }}
                                onClick={() => { setEditingId(null); setFormData({ name: '', academic_year_id: '' }); }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Classes List</h2></div>
                <div className="card-body" style={{ padding: '0' }}>
                    <table className="theme-table">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Academic Year</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map(c => (
                                <tr key={c.id}>
                                    <td style={{ fontWeight: '600' }}>{c.name}</td>
                                    <td>{c.year_name}</td>
                                    <td className="action-cell">
                                        <button type="button" className="status-toggle-btn" onClick={() => handleEdit(c)}>Edit</button>
                                        <button type="button" className="status-toggle-btn action-remove" onClick={() => handleRemove(c.id)}>Remove</button>
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

export default Classes;
