import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { studentsAPI, classesAPI } from '../../api/api';
import '../../styles/Students.css'; 

const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    
    const [formData, setFormData] = useState({
        admission_no: '',
        first_name: '',
        last_name: '',
        class_id: '',
        gender: '',
        dob: '',
        email: ''
    });

    // UI States
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Auto-dismiss success message
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Fetch students and classes on load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [studentsData, classesData] = await Promise.all([
                studentsAPI.getAll(),
                classesAPI.getAll()
            ]);
            setStudents(studentsData);
            setClasses(classesData);
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
            await studentsAPI.create(formData);
            setSuccess('Student added successfully!');
            setFormData({
                admission_no: '',
                first_name: '',
                last_name: '',
                class_id: '',
                gender: '',
                dob: '',
                email: ''
            });
            await fetchData();
        } catch (err) {
            setError(err.message);
            console.error('Failed to add student:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        setError(null);
        try {
            await studentsAPI.delete(id);
            setSuccess('Student deleted successfully!');
            await fetchData();
        } catch (err) {
            setError(err.message);
            console.error('Failed to delete student:', err);
        }
    };

    const getClassName = (id) => {
        const c = classes.find(c => String(c.id) === String(id));
        return c ? c.name : 'Unknown';
    };

    return (
        <div className="students-container">
            {/* Header */}
            <div className="header-section">
                <h1 className="header-title">
                    <Users size={30} /> Students List
                </h1>
                <p className="header-subtitle">
                    Manager and view student records
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
            <div className="students-card">
                <div className="card-header" style={{padding: '15px 24px', borderBottom: '1px solid #e2e8f0'}}>
                    <h2 className="card-title" style={{fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <UserPlus size={20} /> Add New Student
                    </h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="students-form-grid">
                            <div className="form-group">
                                <label>Admission No *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. ADM001" 
                                    value={formData.admission_no} 
                                    onChange={(e) => setFormData({...formData, admission_no: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>First Name *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. John" 
                                    value={formData.first_name} 
                                    onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Doe" 
                                    value={formData.last_name} 
                                    onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Class *</label>
                                <select 
                                    value={formData.class_id}
                                    onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Gender *</label>
                                <select 
                                    value={formData.gender}
                                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>DOB *</label>
                                <input 
                                    type="date" 
                                    value={formData.dob} 
                                    onChange={(e) => setFormData({...formData, dob: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    placeholder="e.g. john@example.com" 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={submitting}>
                                {submitting ? (
                                    <><Loader2 size={16} className="spin-icon" /> Saving...</>
                                ) : (
                                    'Register Student'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="list-section">
                <h2 className="section-title">Students Registry</h2>
                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading-state">
                            <Loader2 size={24} className="spin-icon" />
                            <span>Loading students...</span>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="empty-state">
                            <Users size={40} />
                            <p>No students found. Add one above!</p>
                        </div>
                    ) : (
                        <table className="students-table">
                            <thead>
                                <tr>
                                    <th>Adm. No</th>
                                    <th>Name</th>
                                    <th>Class</th>
                                    <th>Gender</th>
                                    <th>DOB</th>
                                    <th>Contact</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td style={{fontWeight: '600'}}>{student.admission_no}</td>
                                        <td>{student.first_name} {student.last_name}</td>
                                        <td>
                                            <span className="student-badge">{getClassName(student.class_id)}</span>
                                        </td>
                                        <td>{student.gender}</td>
                                        <td>{student.dob}</td>
                                        <td>{student.email || '-'}</td>
                                        <td className="action-cell">
                                            <button className="action-icon edit" title="Edit"><Edit size={18} /></button>
                                            <button className="action-icon delete" onClick={() => handleDelete(student.id)} title="Delete">
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

export default StudentsList;
