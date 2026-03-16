import React, { useState } from 'react';
import { LayoutGrid, PlusCircle, BookOpen } from 'lucide-react';
import '../../styles/ClassesManagement.css'; 

const ClassesManagement = () => {
    // Backend 'classes.py' endpoints kaga
    const [classes, setClasses] = useState([
        { id: 1, name: 'Grade 10', short_name: 'G10', level: 10 },
        { id: 2, name: 'Grade 11', short_name: 'G11', level: 11 }
    ]);

    // Backend 'subjects' kaga (Assuming these exist in DB)
    const [subjects] = useState([
        { id: 101, name: 'Mathematics' },
        { id: 102, name: 'Science' },
        { id: 103, name: 'English' }
    ]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><LayoutGrid size={28} /> Classes & Sections</h1>
            </div>

            <div className="form-grid">
                {/* Section 1: Add Class (routes/admin/classes.py -> /add) */}
                <div className="theme-card">
                    <div className="card-header"><h2 className="card-title">Add New Class</h2></div>
                    <div className="card-body">
                        <form className="theme-form">
                            <div className="form-row">
                                <label>Class Name *</label>
                                <input type="text" placeholder="e.g. Grade 10" required />
                            </div>
                            <div className="form-row">
                                <label>Level (Numeric)</label>
                                <input type="number" placeholder="e.g. 10" />
                            </div>
                            <button className="theme-btn-primary">Create Class</button>
                        </form>
                    </div>
                </div>

                {/* Section 2: Assign Subjects (routes/admin/class_subjects.py -> /assign) */}
                <div className="theme-card">
                    <div className="card-header"><h2 className="card-title">Assign Subjects</h2></div>
                    <div className="card-body">
                        <div className="form-row">
                            <label>Select Class</label>
                            <select>
                                <option>Select a class...</option>
                                {classes.map(c => <option key={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        
                        <label style={{fontSize: '13px', fontWeight: '600'}}>Select Subjects to Link:</label>
                        <div className="subject-selection-grid">
                            {subjects.map(s => (
                                <div key={s.id} className="checkbox-item">
                                    <input type="checkbox" id={`s-${s.id}`} />
                                    <label htmlFor={`s-${s.id}`}>{s.name}</label>
                                </div>
                            ))}
                        </div>
                        
                        <button className="theme-btn-primary" style={{marginTop: '20px', width: '100%'}}>
                             Link Subjects to Class
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassesManagement;