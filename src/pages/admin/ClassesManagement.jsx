import React, { useState, useEffect } from 'react';
import { LayoutGrid, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { classesAPI, subjectsAPI } from '../../api/api';
import '../../styles/ClassesManagement.css'; 

const ClassesManagement = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classForm, setClassForm] = useState({ name: '', short_name: '', level: '' });
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    // UI States
    const [loading, setLoading] = useState(true);
    const [submittingClass, setSubmittingClass] = useState(false);
    const [submittingSubjects, setSubmittingSubjects] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Auto-dismiss success message
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Fetch classes and subjects from backend on page load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [classesData, subjectsData] = await Promise.all([
                classesAPI.getAll(),
                subjectsAPI.getAll()
            ]);
            setClasses(classesData);
            setSubjects(subjectsData);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Submit new class to backend
    const handleCreateClass = async (e) => {
        e.preventDefault();
        setSubmittingClass(true);
        setError(null);
        try {
            await classesAPI.create(classForm);
            setSuccess('Class created successfully!');
            setClassForm({ name: '', short_name: '', level: '' });
            await fetchData();
        } catch (err) {
            setError(err.message);
            console.error('Failed to create class:', err);
        } finally {
            setSubmittingClass(false);
        }
    };

    // Handle subject checkbox toggle
    const handleSubjectToggle = (subjectId) => {
        setSelectedSubjects(prev => 
            prev.includes(subjectId)
                ? prev.filter(id => id !== subjectId)
                : [...prev, subjectId]
        );
    };

    // Assign selected subjects to a class
    const handleAssignSubjects = async () => {
        if (!selectedClassId) {
            setError('Please select a class first.');
            return;
        }
        if (selectedSubjects.length === 0) {
            setError('Please select at least one subject.');
            return;
        }
        setSubmittingSubjects(true);
        setError(null);
        try {
            await classesAPI.assignSubjects(selectedClassId, selectedSubjects);
            setSuccess('Subjects assigned to class successfully!');
            setSelectedSubjects([]);
        } catch (err) {
            setError(err.message);
            console.error('Failed to assign subjects:', err);
        } finally {
            setSubmittingSubjects(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><LayoutGrid size={28} /> Classes & Sections</h1>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button className="alert-close" onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Success Alert */}
            {success && (
                <div className="alert alert-success">
                    <CheckCircle2 size={18} />
                    <span>{success}</span>
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <Loader2 size={24} className="spin-icon" />
                    <span>Loading classes and subjects...</span>
                </div>
            ) : (
                <div className="form-grid">
                    {/* Section 1: Add Class */}
                    <div className="theme-card">
                        <div className="card-header"><h2 className="card-title">Add New Class</h2></div>
                        <div className="card-body">
                            <form className="theme-form" onSubmit={handleCreateClass}>
                                <div className="form-row">
                                    <label>Class Name *</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Grade 10" 
                                        value={classForm.name}
                                        onChange={(e) => setClassForm({...classForm, name: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div className="form-row">
                                    <label>Level (Numeric)</label>
                                    <input 
                                        type="number" 
                                        placeholder="e.g. 10" 
                                        value={classForm.level}
                                        onChange={(e) => setClassForm({...classForm, level: e.target.value})}
                                    />
                                </div>
                                <button className="theme-btn-primary" type="submit" disabled={submittingClass}>
                                    {submittingClass ? (
                                        <><Loader2 size={16} className="spin-icon" /> Creating...</>
                                    ) : (
                                        'Create Class'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Section 2: Assign Subjects */}
                    <div className="theme-card">
                        <div className="card-header"><h2 className="card-title">Assign Subjects</h2></div>
                        <div className="card-body">
                            <div className="form-row">
                                <label>Select Class</label>
                                <select 
                                    value={selectedClassId} 
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                >
                                    <option value="">Select a class...</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <label style={{fontSize: '13px', fontWeight: '600'}}>Select Subjects to Link:</label>
                            {subjects.length === 0 ? (
                                <p style={{color: '#64748b', fontSize: '14px'}}>
                                    No subjects available. Please add subjects first.
                                </p>
                            ) : (
                                <div className="subject-selection-grid">
                                    {subjects.map(s => (
                                        <div key={s.id} className="checkbox-item">
                                            <input 
                                                type="checkbox" 
                                                id={`s-${s.id}`} 
                                                checked={selectedSubjects.includes(s.id)}
                                                onChange={() => handleSubjectToggle(s.id)}
                                            />
                                            <label htmlFor={`s-${s.id}`}>{s.name}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <button 
                                className="theme-btn-primary" 
                                style={{marginTop: '20px', width: '100%'}}
                                onClick={handleAssignSubjects}
                                disabled={submittingSubjects}
                            >
                                {submittingSubjects ? (
                                    <><Loader2 size={16} className="spin-icon" /> Assigning...</>
                                ) : (
                                    'Link Subjects to Class'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassesManagement;