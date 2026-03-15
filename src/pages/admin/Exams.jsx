import React, { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import '../../styles/Exams.css';

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        exam_date: '',
        academic_year_id: '',
        class_id: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [academicYears] = useState([{ id: 1, year_name: '2024-2025' }]);
    const [classes] = useState([{ id: 1, name: 'Class 1' }, { id: 2, name: 'Class 2' }]);

    useEffect(() => {
        setExams([
            { id: 1, name: 'Mid-term', exam_date: '2024-09-15', academic_year_id: 1, class_id: 1, year_name: '2024-2025', class_name: 'Class 1' },
            { id: 2, name: 'Final', exam_date: '2024-11-20', academic_year_id: 1, class_id: 1, year_name: '2024-2025', class_name: 'Class 1' }
        ]);
    }, []);

    const handleRemove = (id) => {
        setExams(prev => prev.filter(ex => ex.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setFormData({ name: '', exam_date: '', academic_year_id: '', class_id: '' });
        }
    };

    const handleEdit = (exam) => {
        setEditingId(exam.id);
        setFormData({
            name: exam.name,
            exam_date: exam.exam_date,
            academic_year_id: String(exam.academic_year_id),
            class_id: String(exam.class_id)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const yr = academicYears.find(y => y.id === Number(formData.academic_year_id));
        const cls = classes.find(c => c.id === Number(formData.class_id));
        const payload = {
            name: formData.name,
            exam_date: formData.exam_date,
            academic_year_id: yr?.id,
            class_id: cls?.id,
            year_name: yr?.year_name || '-',
            class_name: cls?.name || '-'
        };
        if (editingId) {
            setExams(prev => prev.map(ex => (ex.id === editingId ? { ...ex, ...payload } : ex)));
            setEditingId(null);
        } else {
            setExams(prev => [...prev, { id: Date.now(), ...payload }]);
        }
        setFormData({ name: '', exam_date: '', academic_year_id: '', class_id: '' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><ClipboardList size={28} /> Exams</h1>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Add Exam</h2></div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="theme-form">
                        <div className="form-grid">
                            <div className="form-row">
                                <label>Exam Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Mid-term"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Exam Date *</label>
                                <input
                                    type="date"
                                    value={formData.exam_date}
                                    onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
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
                            {editingId ? 'Update Exam' : 'Add Exam'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="status-toggle-btn"
                                style={{ marginLeft: '10px', marginTop: '10px' }}
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({ name: '', exam_date: '', academic_year_id: '', class_id: '' });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Exams List</h2></div>
                <div className="card-body" style={{ padding: '0' }}>
                    <table className="theme-table">
                        <thead>
                            <tr>
                                <th>Exam</th>
                                <th>Date</th>
                                <th>Academic Year</th>
                                <th>Class</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map(ex => (
                                <tr key={ex.id}>
                                    <td style={{ fontWeight: '600' }}>{ex.name}</td>
                                    <td>{ex.exam_date}</td>
                                    <td>{ex.year_name}</td>
                                    <td>{ex.class_name}</td>
                                    <td className="action-cell">
                                        <button
                                            type="button"
                                            className="status-toggle-btn"
                                            onClick={() => handleEdit(ex)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="status-toggle-btn action-remove"
                                            onClick={() => handleRemove(ex.id)}
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

export default Exams;
