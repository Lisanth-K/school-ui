import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import '../../styles/Profiles.css';

const Profiles = () => {
    const [profiles, setProfiles] = useState([]);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        user_id: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [users] = useState([
        { id: 1, username: 'admin' },
        { id: 2, username: 'teacher1' }
    ]);

    useEffect(() => {
        setProfiles([
            { id: 1, user_id: 1, full_name: 'Admin User', email: 'admin@school.edu', phone: '+1234567890', username: 'admin' },
            { id: 2, user_id: 2, full_name: 'Jane Teacher', email: 'teacher1@school.edu', phone: '+0987654321', username: 'teacher1' }
        ]);
    }, []);

    const handleRemove = (id) => {
        setProfiles(prev => prev.filter(p => p.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setFormData({ full_name: '', email: '', phone: '', user_id: '' });
        }
    };

    const handleEdit = (profile) => {
        setEditingId(profile.id);
        setFormData({
            full_name: profile.full_name,
            email: profile.email,
            phone: profile.phone || '',
            user_id: String(profile.user_id)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = users.find(u => u.id === Number(formData.user_id));
        const payload = {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            username: user?.username || '-',
            user_id: Number(formData.user_id)
        };
        if (editingId) {
            setProfiles(prev => prev.map(p => (p.id === editingId ? { ...p, ...payload } : p)));
            setEditingId(null);
        } else {
            setProfiles(prev => [...prev, { id: Date.now(), ...payload }]);
        }
        setFormData({ full_name: '', email: '', phone: '', user_id: '' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><UserCircle size={28} /> Profiles</h1>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Add Profile</h2></div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="theme-form">
                        <div className="form-grid">
                            <div className="form-row">
                                <label>User *</label>
                                <select
                                    value={formData.user_id}
                                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select user</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                                </select>
                            </div>
                            <div className="form-row">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    placeholder="user@school.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    placeholder="+1234567890"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="theme-btn-primary" style={{ marginTop: '10px' }}>
                            {editingId ? 'Update Profile' : 'Save Profile'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="status-toggle-btn"
                                style={{ marginLeft: '10px', marginTop: '10px' }}
                                onClick={() => { setEditingId(null); setFormData({ full_name: '', email: '', phone: '', user_id: '' }); }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Profiles List</h2></div>
                <div className="card-body" style={{ padding: '0' }}>
                    <table className="theme-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map(p => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: '600' }}>{p.username}</td>
                                    <td>{p.full_name}</td>
                                    <td>{p.email}</td>
                                    <td>{p.phone || '-'}</td>
                                    <td className="action-cell">
                                        <button type="button" className="status-toggle-btn" onClick={() => handleEdit(p)}>Edit</button>
                                        <button type="button" className="status-toggle-btn action-remove" onClick={() => handleRemove(p.id)}>Remove</button>
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

export default Profiles;
