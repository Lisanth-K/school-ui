import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import '../../styles/ExamResults.css';

const ExamResults = () => {
    const [results, setResults] = useState([]);
    const [formData, setFormData] = useState({
        student_id: '',
        exam_id: '',
        subject_id: '',
        marks: '',
        academic_year_id: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [students] = useState([
        { id: 1, name: 'Student One' },
        { id: 2, name: 'Student Two' }
    ]);
    const [exams] = useState([
        { id: 1, name: 'Mid-term' },
        { id: 2, name: 'Final' }
    ]);
    const [subjects] = useState([
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Physics' }
    ]);
    const [academicYears] = useState([{ id: 1, year_name: '2024-2025' }]);

    useEffect(() => {
        setResults([
            {
                id: 1,
                student_id: 1,
                exam_id: 1,
                subject_id: 1,
                academic_year_id: 1,
                student_name: 'Student One',
                exam_name: 'Mid-term',
                subject_name: 'Mathematics',
                marks: 85,
                year_name: '2024-2025'
            },
            {
                id: 2,
                student_id: 1,
                exam_id: 1,
                subject_id: 2,
                academic_year_id: 1,
                student_name: 'Student One',
                exam_name: 'Mid-term',
                subject_name: 'Physics',
                marks: 78,
                year_name: '2024-2025'
            },
            {
                id: 3,
                student_id: 2,
                exam_id: 1,
                subject_id: 1,
                academic_year_id: 1,
                student_name: 'Student Two',
                exam_name: 'Mid-term',
                subject_name: 'Mathematics',
                marks: 92,
                year_name: '2024-2025'
            }
        ]);
    }, []);

    const handleRemove = (id) => {
        setResults(prev => prev.filter(r => r.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setFormData({ student_id: '', exam_id: '', subject_id: '', marks: '', academic_year_id: '' });
        }
    };

    const handleEdit = (result) => {
        setEditingId(result.id);
        setFormData({
            student_id: String(result.student_id),
            exam_id: String(result.exam_id),
            subject_id: String(result.subject_id),
            marks: String(result.marks),
            academic_year_id: String(result.academic_year_id)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const student = students.find(s => s.id === Number(formData.student_id));
        const exam = exams.find(ex => ex.id === Number(formData.exam_id));
        const subject = subjects.find(s => s.id === Number(formData.subject_id));
        const year = academicYears.find(y => y.id === Number(formData.academic_year_id));
        const payload = {
            student_id: Number(formData.student_id),
            exam_id: Number(formData.exam_id),
            subject_id: Number(formData.subject_id),
            academic_year_id: Number(formData.academic_year_id),
            student_name: student?.name || '-',
            exam_name: exam?.name || '-',
            subject_name: subject?.name || '-',
            marks: formData.marks,
            year_name: year?.year_name || '-'
        };
        if (editingId) {
            setResults(prev => prev.map(r => (r.id === editingId ? { ...r, ...payload } : r)));
            setEditingId(null);
        } else {
            setResults(prev => [...prev, { id: Date.now(), ...payload }]);
        }
        setFormData({ student_id: '', exam_id: '', subject_id: '', marks: '', academic_year_id: '' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><Award size={28} /> Exam Results</h1>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Add Exam Result</h2></div>
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
                                <label>Exam *</label>
                                <select
                                    value={formData.exam_id}
                                    onChange={(e) => setFormData({ ...formData, exam_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select exam</option>
                                    {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
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
                            <div className="form-row">
                                <label>Marks *</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="0–100"
                                    value={formData.marks}
                                    onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
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
                            {editingId ? 'Update Result' : 'Save Result'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="status-toggle-btn"
                                style={{ marginLeft: '10px', marginTop: '10px' }}
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({ student_id: '', exam_id: '', subject_id: '', marks: '', academic_year_id: '' });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Results List</h2></div>
                <div className="card-body" style={{ padding: '0' }}>
                    <table className="theme-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Exam</th>
                                <th>Subject</th>
                                <th>Marks</th>
                                <th>Academic Year</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(r => (
                                <tr key={r.id}>
                                    <td style={{ fontWeight: '600' }}>{r.student_name}</td>
                                    <td>{r.exam_name}</td>
                                    <td>{r.subject_name}</td>
                                    <td>{r.marks}</td>
                                    <td>{r.year_name}</td>
                                    <td className="action-cell">
                                        <button
                                            type="button"
                                            className="status-toggle-btn"
                                            onClick={() => handleEdit(r)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="status-toggle-btn action-remove"
                                            onClick={() => handleRemove(r.id)}
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

export default ExamResults;
