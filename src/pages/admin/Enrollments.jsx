import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import '../../styles/Enrollments.css';

const Enrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [formData, setFormData] = useState({ student_id: '', section_id: '', academic_year_id: '' });
    const [editingId, setEditingId] = useState(null);
    const [students] = useState([
        { id: 1, name: 'Student One' },
        { id: 2, name: 'Student Two' }
    ]);
    const [sections] = useState([
        { id: 1, name: 'Section A', class_name: 'Class 1' },
        { id: 2, name: 'Section B', class_name: 'Class 1' }
    ]);
    const [academicYears] = useState([{ id: 1, year_name: '2024-2025' }]);

    useEffect(() => {
        setEnrollments([
            { id: 1, student_id: 1, section_id: 1, academic_year_id: 1, student_name: 'Student One', section_name: 'Section A', class_name: 'Class 1', year_name: '2024-2025' },
            { id: 2, student_id: 2, section_id: 1, academic_year_id: 1, student_name: 'Student Two', section_name: 'Section A', class_name: 'Class 1', year_name: '2024-2025' }
        ]);
    }, []);

    const handleRemove = (id) => {
        setEnrollments(prev => prev.filter(en => en.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setFormData({ student_id: '', section_id: '', academic_year_id: '' });
        }
    };

    const handleEdit = (enrollment) => {
        setEditingId(enrollment.id);
        setFormData({
            student_id: String(enrollment.student_id),
            section_id: String(enrollment.section_id),
            academic_year_id: String(enrollment.academic_year_id)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const student = students.find(s => s.id === Number(formData.student_id));
        const section = sections.find(s => s.id === Number(formData.section_id));
        const year = academicYears.find(y => y.id === Number(formData.academic_year_id));
        const payload = {
            student_name: student?.name || '-',
            section_name: section?.name || '-',
            class_name: section?.class_name || '-',
            year_name: year?.year_name || '-',
            student_id: Number(formData.student_id),
            section_id: Number(formData.section_id),
            academic_year_id: Number(formData.academic_year_id)
        };
        if (editingId) {
            setEnrollments(prev => prev.map(en => en.id === editingId ? { ...en, ...payload } : en));
            setEditingId(null);
        } else {
            setEnrollments(prev => [...prev, { id: Date.now(), ...payload }]);
        }
        setFormData({ student_id: '', section_id: '', academic_year_id: '' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><UserPlus size={28} /> Student Section Enrollments</h1>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Enroll Student in Section</h2></div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="theme-form">
                        <div className="form-grid">
                            <div className="form-row">
                                <label>Student *</label>
                                <select
                                    value={formData.student_id}
                                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select student</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="form-row">
                                <label>Section *</label>
                                <select
                                    value={formData.section_id}
                                    onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select section</option>
                                    {sections.map(s => <option key={s.id} value={s.id}>{s.name} ({s.class_name})</option>)}
                                </select>
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
                            {editingId ? 'Update Enrollment' : 'Enroll'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="status-toggle-btn"
                                style={{ marginLeft: '10px', marginTop: '10px' }}
                                onClick={() => { setEditingId(null); setFormData({ student_id: '', section_id: '', academic_year_id: '' }); }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Enrollments List</h2></div>
                <div className="card-body" style={{ padding: '0' }}>
                    <table className="theme-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Section</th>
                                <th>Class</th>
                                <th>Academic Year</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map(en => (
                                <tr key={en.id}>
                                    <td style={{ fontWeight: '600' }}>{en.student_name}</td>
                                    <td>{en.section_name}</td>
                                    <td>{en.class_name}</td>
                                    <td>{en.year_name}</td>
                                    <td className="action-cell">
                                        <button type="button" className="status-toggle-btn" onClick={() => handleEdit(en)}>Edit</button>
                                        <button type="button" className="status-toggle-btn action-remove" onClick={() => handleRemove(en.id)}>Remove</button>
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

export default Enrollments;
