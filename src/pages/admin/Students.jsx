import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import '../../styles/Students.css';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date_of_birth: '',
        guardian_name: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        setStudents([
            { id: 1, name: 'Student One', email: 'student1@school.edu', date_of_birth: '2015-04-10', guardian_name: 'Guardian One' },
            { id: 2, name: 'Student Two', email: 'student2@school.edu', date_of_birth: '2015-08-22', guardian_name: 'Guardian Two' }
        ]);
    }, []);

    const handleRemove = (id) => {
        setStudents(prev => prev.filter(s => s.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setFormData({ name: '', email: '', date_of_birth: '', guardian_name: '' });
        }
    };

    const handleEdit = (student) => {
        setEditingId(student.id);
        setFormData({
            name: student.name,
            email: student.email,
            date_of_birth: student.date_of_birth || '',
            guardian_name: student.guardian_name || ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            email: formData.email,
            date_of_birth: formData.date_of_birth,
            guardian_name: formData.guardian_name
        };
        if (editingId) {
            setStudents(prev => prev.map(s => (s.id === editingId ? { ...s, ...payload } : s)));
            setEditingId(null);
        } else {
            setStudents(prev => [...prev, { id: Date.now(), ...payload }]);
        }
        setFormData({ name: '', email: '', date_of_birth: '', guardian_name: '' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><Users size={28} /> Students List</h1>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Add Student</h2></div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="theme-form">
                        <div className="form-grid">
                            <div className="form-row">
                                <label>Student Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    placeholder="student@school.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    value={formData.date_of_birth}
                                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <label>Guardian Name</label>
                                <input
                                    type="text"
                                    placeholder="Guardian name"
                                    value={formData.guardian_name}
                                    onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="theme-btn-primary" style={{ marginTop: '10px' }}>
                            {editingId ? 'Update Student' : 'Add Student'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="status-toggle-btn"
                                style={{ marginLeft: '10px', marginTop: '10px' }}
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({ name: '', email: '', date_of_birth: '', guardian_name: '' });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Students List</h2></div>
                <div className="card-body" style={{ padding: '0' }}>
                    <table className="theme-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Date of Birth</th>
                                <th>Guardian</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(s => (
                                <tr key={s.id}>
                                    <td style={{ fontWeight: '600' }}>{s.name}</td>
                                    <td>{s.email}</td>
                                    <td>{s.date_of_birth || '-'}</td>
                                    <td>{s.guardian_name || '-'}</td>
                                    <td className="action-cell">
                                        <button
                                            type="button"
                                            className="status-toggle-btn"
                                            onClick={() => handleEdit(s)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="status-toggle-btn action-remove"
                                            onClick={() => handleRemove(s.id)}
                                        >
                                            Remove
                                        </button>
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

export default Students;
