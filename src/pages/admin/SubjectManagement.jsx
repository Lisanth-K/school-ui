import React, { useState, useEffect } from 'react';
import { BookOpen, Edit, Trash2 } from 'lucide-react';
import '../../styles/SubjectManagement.css'; 

const SubjectManagement = () => {
    // Backend data-va store panna state
    const [subjects, setSubjects] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        short_code: '',
        is_elective: false,
        has_practical: false
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        setSubjects([
            { id: 1, name: 'Mathematics', short_code: 'MAT101', is_elective: false, has_practical: false },
            { id: 2, name: 'Physics', short_code: 'PHY101', is_elective: false, has_practical: true },
        ]);
    }, []);

    const handleRemove = (id) => {
        setSubjects(prev => prev.filter(s => s.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setFormData({ name: '', short_code: '', is_elective: false, has_practical: false });
        }
    };

    const handleEdit = (subject) => {
        setEditingId(subject.id);
        setFormData({
            name: subject.name,
            short_code: subject.short_code || '',
            is_elective: subject.is_elective || false,
            has_practical: subject.has_practical || false
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            short_code: formData.short_code,
            is_elective: formData.is_elective,
            has_practical: formData.has_practical
        };
        if (editingId) {
            setSubjects(prev => prev.map(s => (s.id === editingId ? { ...s, ...payload } : s)));
            setEditingId(null);
        } else {
            setSubjects(prev => [...prev, { id: Date.now(), ...payload }]);
        }
        setFormData({ name: '', short_code: '', is_elective: false, has_practical: false });
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
                            <button type="submit" className="submit-btn">
                                {editingId ? 'Update Subject' : 'Save Subject Details'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="status-toggle-btn"
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => { setEditingId(null); setFormData({ name: '', short_code: '', is_elective: false, has_practical: false }); }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Subjects Table Section */}
            <div className="list-section">
                <h2 className="section-title">Academic Subjects List</h2>
                <div className="table-wrapper">
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
                                        <button type="button" className="action-icon edit" onClick={() => handleEdit(sub)} title="Edit"><Edit size={18} /></button>
                                        <button type="button" className="action-icon delete" onClick={() => handleRemove(sub.id)} title="Remove"><Trash2 size={18} /></button>
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

export default SubjectManagement;