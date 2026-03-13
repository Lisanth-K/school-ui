import React, { useState, useEffect } from 'react';
import { Award, Edit, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { examResultsAPI, examsAPI, studentsAPI } from '../../api/api';
import '../../styles/Exams.css'; // We'll reuse the exams stylesheet

const ExamResultsManagement = () => {
    const [results, setResults] = useState([]);
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    
    const [formData, setFormData] = useState({
        exam_id: '',
        student_id: '',
        marks_obtained: '',
        total_marks: '',
        grade: '',
        remarks: ''
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

    // Automatic Grade Calculation whenever marks change
    useEffect(() => {
        const obtained = Number(formData.marks_obtained);
        const total = Number(formData.total_marks);
        
        if (formData.marks_obtained !== '' && formData.total_marks !== '' && total > 0) {
            const percentage = (obtained / total) * 100;
            let newGrade = '';
            
            if (percentage >= 90) newGrade = 'A+';
            else if (percentage >= 80) newGrade = 'A';
            else if (percentage >= 70) newGrade = 'B+';
            else if (percentage >= 60) newGrade = 'B';
            else if (percentage >= 50) newGrade = 'C';
            else if (percentage >= 40) newGrade = 'D';
            else newGrade = 'F';

            if (formData.grade !== newGrade) {
                setFormData(prev => ({ ...prev, grade: newGrade }));
            }
        } else if (formData.grade !== '') {
            setFormData(prev => ({ ...prev, grade: '' }));
        }
    }, [formData.marks_obtained, formData.total_marks]);

    // Update Total Marks when Exam is selected
    useEffect(() => {
        if (formData.exam_id) {
            const selectedExam = exams.find(e => String(e.id) === String(formData.exam_id));
            if (selectedExam && selectedExam.max_marks) {
                setFormData(prev => ({ ...prev, total_marks: selectedExam.max_marks }));
            }
        }
    }, [formData.exam_id, exams]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [resultsData, examsData, studentsData] = await Promise.all([
                examResultsAPI.getAll(),
                examsAPI.getAll(),
                studentsAPI.getAll().catch(() => []) // Provide default since students API might not be fully functional yet
            ]);
            setResults(resultsData);
            setExams(examsData);
            setStudents(studentsData);
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
            await examResultsAPI.create(formData);
            setSuccess('Result saved successfully!');
            setFormData({
                exam_id: formData.exam_id, // Keep the selected exam for continuous entry
                student_id: '',
                marks_obtained: '',
                total_marks: formData.total_marks, // Keep total marks
                grade: '',
                remarks: ''
            });
            await fetchData();
        } catch (err) {
            setError(err.message);
            console.error('Failed to create result:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this result?')) return;
        setError(null);
        try {
            await examResultsAPI.delete(id);
            setSuccess('Result deleted successfully!');
            await fetchData();
        } catch (err) {
            setError(err.message);
            console.error('Failed to delete result:', err);
        }
    };

    const getExamInfo = (id) => {
        const e = exams.find(e => String(e.id) === String(id));
        return e || { exam_name: id, exam_type: 'Theory' };
    };

    const getStudentName = (id) => {
        const s = students.find(s => String(s.id) === String(id));
        return s ? `${s.first_name} ${s.last_name}` : `Student #${id}`;
    };

    return (
        <div className="exams-container">
            {/* Header */}
            <div className="header-section">
                <h1 className="header-title">
                    <Award size={30} /> Exam Results
                </h1>
                <p className="header-subtitle">
                    Enter and manage student marks and grades
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
                                <label>Exam <span style={{color: 'red'}}>*</span></label>
                                <select 
                                    value={formData.exam_id}
                                    onChange={(e) => setFormData({...formData, exam_id: e.target.value})}
                                    required
                                >
                                    <option value="">Select an exam...</option>
                                    {exams.map(e => (
                                        <option key={e.id} value={e.id}>{e.exam_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Student ID / Name <span style={{color: 'red'}}>*</span></label>
                                {students.length > 0 ? (
                                    <select 
                                        value={formData.student_id}
                                        onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                                        required
                                    >
                                        <option value="">Select a student...</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input 
                                        type="number" 
                                        placeholder="Enter Student ID" 
                                        value={formData.student_id} 
                                        onChange={(e) => setFormData({...formData, student_id: e.target.value})} 
                                        required 
                                    />
                                )}
                            </div>

                            <div className="form-group" style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
                                <div style={{flex: 1}}>
                                    <label>Marks Obtained <span style={{color: 'red'}}>*</span></label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g. 85.5" 
                                        value={formData.marks_obtained} 
                                        onChange={(e) => setFormData({...formData, marks_obtained: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div style={{flex: 1}}>
                                    <label>Total Marks (from Exam)</label>
                                    <input 
                                        type="number"
                                        placeholder="Max Marks" 
                                        value={formData.total_marks} 
                                        readOnly
                                        style={{ backgroundColor: '#f8fafc', color: '#64748b' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Grade (Auto-generated)</label>
                                <input 
                                    type="text" 
                                    placeholder="Result Grade" 
                                    value={formData.grade} 
                                    readOnly
                                    style={{ backgroundColor: '#f8fafc', color: '#64748b', fontWeight: 'bold' }}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Remarks (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Excellent performance" 
                                    value={formData.remarks} 
                                    onChange={(e) => setFormData({...formData, remarks: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={submitting}>
                                {submitting ? (
                                    <><Loader2 size={16} className="spin-icon" /> Saving Result...</>
                                ) : (
                                    'Save Result'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="list-section">
                <h2 className="section-title">Score Records</h2>
                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading-state">
                            <Loader2 size={24} className="spin-icon" />
                            <span>Loading results...</span>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="empty-state">
                            <Award size={40} />
                            <p>No results found. Start entering scores above!</p>
                        </div>
                    ) : (
                        <table className="exams-table">
                            <thead>
                                <tr>
                                    <th>Exam</th>
                                    <th>Type</th>
                                    <th>Student</th>
                                    <th>Score</th>
                                    <th>Grade</th>
                                    <th>Remarks</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result) => (
                                    <tr key={result.id}>
                                        <td style={{fontWeight: '600'}}>{getExamInfo(result.exam_id).exam_name}</td>
                                        <td>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: getExamInfo(result.exam_id).exam_type === 'Practical' ? '#fef3c7' : '#e0f2fe',
                                                color: getExamInfo(result.exam_id).exam_type === 'Practical' ? '#92400e' : '#075985',
                                                fontSize: '11px',
                                                fontWeight: '600'
                                            }}>
                                                {getExamInfo(result.exam_id).exam_type || 'Theory'}
                                            </span>
                                        </td>
                                        <td>{getStudentName(result.student_id)}</td>
                                        <td>{result.marks_obtained} / {result.total_marks}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px', 
                                                borderRadius: '4px',
                                                backgroundColor: '#f1f5f9',
                                                fontWeight: '600'
                                            }}>
                                                {result.grade || '-'}
                                            </span>
                                        </td>
                                        <td style={{color: '#64748b', fontSize: '13px'}}>{result.remarks || '-'}</td>
                                        <td className="action-cell">
                                            <button className="action-icon delete" onClick={() => handleDelete(result.id)} title="Delete">
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

export default ExamResultsManagement;
