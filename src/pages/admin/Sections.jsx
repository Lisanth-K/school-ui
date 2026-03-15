import React, { useState, useEffect } from 'react';
import { LayoutGrid } from 'lucide-react';
import '../../styles/Sections.css';

const Sections = () => {
    const [sections, setSections] = useState([]);
    const [formData, setFormData] = useState({ name: '', class_id: '' });
    const [editingId, setEditingId] = useState(null);
    const [classes, setClasses] = useState([
        { id: 1, name: 'Class 1' },
        { id: 2, name: 'Class 2' }
    ]);

    useEffect(() => {
        setSections([
            { id: 1, name: 'Section A', class_id: 1, class_name: 'Class 1' },
            { id: 2, name: 'Section B', class_id: 1, class_name: 'Class 1' }
        ]);
    }, []);

    const handleRemove = (id) => {
        setSections(prev => prev.filter(s => s.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setFormData({ name: '', class_id: '' });
        }
    };

    const handleEdit = (section) => {
        setEditingId(section.id);
        setFormData({
            name: section.name,
            class_id: String(section.class_id)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cls = classes.find(c => c.id === Number(formData.class_id));
        const payload = {
            name: formData.name,
            class_id: cls?.id,
            class_name: cls?.name || '-'
        };
        if (editingId) {
            setSections(prev => prev.map(s => (s.id === editingId ? { ...s, ...payload } : s)));
            setEditingId(null);
        } else {
            setSections(prev => [...prev, { id: Date.now(), ...payload }]);
        }
        setFormData({ name: '', class_id: '' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><LayoutGrid size={28} /> Sections</h1>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Add Section</h2></div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="theme-form">
                        <div className="form-grid">
                            <div className="form-row">
                                <label>Section Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Section A"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
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
                        </div>
                        <button type="submit" className="theme-btn-primary" style={{ marginTop: '10px' }}>
                            {editingId ? 'Update Section' : 'Add Section'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="status-toggle-btn"
                                style={{ marginLeft: '10px', marginTop: '10px' }}
                                onClick={() => { setEditingId(null); setFormData({ name: '', class_id: '' }); }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Sections List</h2></div>
                <div className="card-body" style={{ padding: '0' }}>
                    <table className="theme-table">
                        <thead>
                            <tr>
                                <th>Section</th>
                                <th>Class</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sections.map(s => (
                                <tr key={s.id}>
                                    <td style={{ fontWeight: '600' }}>{s.name}</td>
                                    <td>{s.class_name}</td>
                                    <td className="action-cell">
                                        <button type="button" className="status-toggle-btn" onClick={() => handleEdit(s)}>Edit</button>
                                        <button type="button" className="status-toggle-btn action-remove" onClick={() => handleRemove(s.id)}>Remove</button>
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

export default Sections;
