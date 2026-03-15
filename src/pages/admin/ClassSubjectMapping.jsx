import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import '../../styles/ClassSubjectMapping.css';

const ClassSubjectMapping = () => {
    const [mappings, setMappings] = useState([]);
    const [formData, setFormData] = useState({ class_id: '', subject_id: '' });
    const [editingId, setEditingId] = useState(null);
    const [classes, setClasses] = useState([
        { id: 1, name: 'Class 1' },
        { id: 2, name: 'Class 2' }
    ]);
    const [subjects, setSubjects] = useState([
        { id: 1, name: 'Mathematics', short_code: 'MAT101' },
        { id: 2, name: 'Physics', short_code: 'PHY101' }
    ]);

    useEffect(() => {
        setMappings([
            { id: 1, class_id: 1, subject_id: 1, class_name: 'Class 1', subject_name: 'Mathematics' },
            { id: 2, class_id: 1, subject_id: 2, class_name: 'Class 1', subject_name: 'Physics' }
        ]);
    }, []);

    const handleRemove = (id) => {
        setMappings(prev => prev.filter(m => m.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setFormData({ class_id: '', subject_id: '' });
        }
    };

    const handleEdit = (mapping) => {
        setEditingId(mapping.id);
        setFormData({
            class_id: String(mapping.class_id),
            subject_id: String(mapping.subject_id)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cls = classes.find(c => c.id === Number(formData.class_id));
        const sub = subjects.find(s => s.id === Number(formData.subject_id));
        if (!cls || !sub) return;
        const payload = {
            class_id: cls.id,
            subject_id: sub.id,
            class_name: cls.name,
            subject_name: sub.name
        };
        if (editingId) {
            setMappings(prev => prev.map(m => (m.id === editingId ? { ...m, ...payload } : m)));
            setEditingId(null);
        } else {
            setMappings(prev => [...prev, { id: Date.now(), ...payload }]);
        }
        setFormData({ class_id: '', subject_id: '' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><Layers size={28} /> Class Subject Mapping</h1>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Add Class–Subject</h2></div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="theme-form">
                        <div className="form-grid">
                            <div className="form-row">
                                <label>Class *</label>
                                <select
                                    value={formData.class_id}
                                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select class</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-row">
                                <label>Subject *</label>
                                <select
                                    value={formData.subject_id}
                                    onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select subject</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="theme-btn-primary" style={{ marginTop: '10px' }}>
                            {editingId ? 'Update Mapping' : 'Add Mapping'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="status-toggle-btn"
                                style={{ marginLeft: '10px', marginTop: '10px' }}
                                onClick={() => { setEditingId(null); setFormData({ class_id: '', subject_id: '' }); }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Class–Subject List</h2></div>
                <div className="card-body" style={{ padding: '0' }}>
                    <table className="theme-table">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Subject</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappings.map(m => (
                                <tr key={m.id}>
                                    <td style={{ fontWeight: '600' }}>{m.class_name}</td>
                                    <td>{m.subject_name}</td>
                                    <td className="action-cell">
                                        <button type="button" className="status-toggle-btn" onClick={() => handleEdit(m)}>Edit</button>
                                        <button type="button" className="status-toggle-btn action-remove" onClick={() => handleRemove(m.id)}>Remove</button>
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

export default ClassSubjectMapping;
