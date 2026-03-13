import React, { useState, useEffect } from 'react';
import { ClipboardList, Edit, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { examsAPI, classesAPI, subjectsAPI, academicYearAPI } from '../../api/api';
import '../../styles/Exams.css'; 

const ExamsManagement = () => {
    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    
    const [formData, setFormData] = useState({
        exam_name: '',
        start_date: '',
        end_date: '',
        class_id: '',
        subject_id: '',
        academic_year_id: '',
        exam_type: 'Theory',
        max_marks: '',
        passing_marks: ''
    });

    // UI States
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [examsData, classesData, subjectsData, yearsData] = await Promise.all([
                examsAPI.getAll(),
                classesAPI.getAll(),
                subjectsAPI.getAll(),
                academicYearAPI.getAll()
            ]);
            setExams(examsData);
            setClasses(classesData);
            setSubjects(subjectsData);
            setAcademicYears(yearsData);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await examsAPI.create(formData);
            setSuccess('Exam created successfully!');
            setFormData({ 
                exam_name: '', 
                start_date: '', 
                end_date: '', 
                class_id: '', 
                subject_id: '',
                academic_year_id: '',
                exam_type: 'Theory',
                max_marks: '',
                passing_marks: ''
            });
            await fetchData();
        } catch (err) {
            setError(err.message);
            console.error('Failed to create exam:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this exam?')) return;
        setError(null);
        try {
            await examsAPI.delete(id);
            setSuccess('Exam deleted successfully!');
            await fetchData();
        } catch (err) {
            setError(err.message);
            console.error('Failed to delete exam:', err);
        }
    };

    // Helper functions to get names from IDs
    const getClassName = (id) => {
        const c = classes.find(c => String(c.id) === String(id));
        return c ? c.name : id;
    };

    const getSubjectName = (id) => {
        const s = subjects.find(s => String(s.id) === String(id));
        return s ? s.name : id;
    };

    const getAcademicYearName = (id) => {
        const y = academicYears.find(y => String(y.id) === String(id));
        return y ? y.year_name : id;
    };

    return (
        <div className="exams-container">
            {/* Header */}
            <div className="header-section">
                <h1 className="header-title">
                    <ClipboardList size={30} /> Exams Management
                </h1>
                <p className="header-subtitle">
                    Schedule and manage examinations for classes
                </p>
            </div>

            {/* Alerts */}
            {error && (
                <div className="alert alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button className="alert-close" onClick={() => setError(null)}>×</button>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <CheckCircle2 size={18} />
                    <span>{success}</span>
                </div>
            )}

            {/* Form Card */}
            <div className="exams-card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="exams-form-grid">
                            <div className="form-group">
                                <label>Exam Name <span style={{color: 'red'}}>*</span></label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Midterm Physics Exam" 
                                    value={formData.exam_name} 
                                    onChange={(e) => setFormData({...formData, exam_name: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Start Date <span style={{color: 'red'}}>*</span></label>
                                <input 
                                    type="date" 
                                    value={formData.start_date} 
                                    onChange={(e) => setFormData({...formData, start_date: e.target.value})} 
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date <span style={{color: 'red'}}>*</span></label>
                                <input 
                                    type="date" 
                                    value={formData.end_date} 
                                    onChange={(e) => setFormData({...formData, end_date: e.target.value})} 
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Class <span style={{color: 'red'}}>*</span></label>
                                <select 
                                    value={formData.class_id}
                                    onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                                    required
                                >
                                    <option value="">Select a class...</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Subject <span style={{color: 'red'}}>*</span></label>
                                <select 
                                    value={formData.subject_id}
                                    onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                                    required
                                >
                                    <option value="">Select a subject...</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Academic Year <span style={{color: 'red'}}>*</span></label>
                                <select 
                                    value={formData.academic_year_id}
                                    onChange={(e) => setFormData({...formData, academic_year_id: e.target.value})}
                                    required
                                >
                                    <option value="">Select a year...</option>
                                    {academicYears.map(y => (
                                        <option key={y.id} value={y.id}>{y.year_name} {y.is_active ? '(Active)' : ''}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Exam Type <span style={{color: 'red'}}>*</span></label>
                                <select 
                                    value={formData.exam_type}
                                    onChange={(e) => setFormData({...formData, exam_type: e.target.value})}
                                    required
                                >
                                    <option value="Theory">Theory</option>
                                    <option value="Practical">Practical</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Max Marks <span style={{color: 'red'}}>*</span></label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 100" 
                                    value={formData.max_marks} 
                                    onChange={(e) => setFormData({...formData, max_marks: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Passing Marks <span style={{color: 'red'}}>*</span></label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 40" 
                                    value={formData.passing_marks} 
                                    onChange={(e) => setFormData({...formData, passing_marks: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={submitting}>
                                {submitting ? (
                                    <><Loader2 size={16} className="spin-icon" /> Saving...</>
                                ) : (
                                    'Schedule Exam'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="list-section">
                <h2 className="section-title">Scheduled Exams</h2>
                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading-state">
                            <Loader2 size={24} className="spin-icon" />
                            <span>Loading exams...</span>
                        </div>
                    ) : exams.length === 0 ? (
                        <div className="empty-state">
                            <ClipboardList size={40} />
                            <p>No exams found. Schedule one above!</p>
                        </div>
                    ) : (
                        <table className="exams-table">
                            <thead>
                                <tr>
                                    <th>Exam Name</th>
                                    <th>Schedule (From - To)</th>
                                    <th>Year</th>
                                    <th>Class</th>
                                    <th>Subject</th>
                                    <th>Type</th>
                                    <th>Max/Pass</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((exam) => (
                                    <tr key={exam.id}>
                                        <td style={{fontWeight: '600'}}>{exam.exam_name}</td>
                                        <td>
                                            <div style={{fontSize: '13px', display: 'flex', flexDirection: 'column'}}>
                                                <span>{new Date(exam.start_date).toLocaleDateString()}</span>
                                                <span style={{fontSize: '11px', color: '#64748b'}}>to {new Date(exam.end_date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                fontSize: '12px',
                                                padding: '2px 6px',
                                                backgroundColor: '#f8fafc',
                                                borderRadius: '4px',
                                                border: '1px solid #e2e8f0',
                                                color: '#475569'
                                            }}>
                                                {getAcademicYearName(exam.academic_year_id)}
                                            </span>
                                        </td>
                                        <td>{getClassName(exam.class_id)}</td>
                                        <td>{getSubjectName(exam.subject_id)}</td>
                                        <td>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: exam.exam_type === 'Practical' ? '#fef3c7' : '#e0f2fe',
                                                color: exam.exam_type === 'Practical' ? '#92400e' : '#075985',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                {exam.exam_type || 'Theory'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{fontSize: '13px', fontWeight: '500'}}>
                                                {exam.max_marks || '-'} / {exam.passing_marks || '-'}
                                            </div>
                                        </td>
                                        <td className="action-cell">
                                            <button className="action-icon edit" title="Edit"><Edit size={18} /></button>
                                            <button className="action-icon delete" onClick={() => handleDelete(exam.id)} title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamsManagement;
