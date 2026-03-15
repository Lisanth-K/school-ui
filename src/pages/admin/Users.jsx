import React, { useState, useEffect } from 'react';
import { Users as UsersIcon } from 'lucide-react';
import '../../styles/Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: 'staff',
        is_active: true
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        setUsers([
            { id: 1, username: 'admin', email: 'admin@school.edu', role: 'admin', is_active: true },
            { id: 2, username: 'teacher1', email: 'teacher1@school.edu', role: 'teacher', is_active: true }
        ]);
    }, []);

    const handleRemove = (id) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setFormData({ username: '', email: '', role: 'staff', is_active: true });
        }
    };

    const handleEdit = (user) => {
        setEditingId(user.id);
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role,
            is_active: user.is_active
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            username: formData.username,
            email: formData.email,
            role: formData.role,
            is_active: formData.is_active
        };
        if (editingId) {
            setUsers(prev => prev.map(u => (u.id === editingId ? { ...u, ...payload } : u)));
            setEditingId(null);
        } else {
            setUsers(prev => [...prev, { id: Date.now(), ...payload }]);
        }
        setFormData({ username: '', email: '', role: 'staff', is_active: true });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><UsersIcon size={28} /> Users</h1>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Add User</h2></div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="theme-form">
                        <div className="form-grid">
                            <div className="form-row">
                                <label>Username *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. johndoe"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                                <label>Role *</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </div>
                            <div className="form-row checkbox-row">
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                    Active
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="theme-btn-primary" style={{ marginTop: '10px' }}>
                            {editingId ? 'Update User' : 'Add User'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="status-toggle-btn"
                                style={{ marginLeft: '10px', marginTop: '10px' }}
                                onClick={() => { setEditingId(null); setFormData({ username: '', email: '', role: 'staff', is_active: true }); }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="theme-card">
                <div className="card-header"><h2 className="card-title">Users List</h2></div>
                <div className="card-body" style={{ padding: '0' }}>
                    <table className="theme-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td style={{ fontWeight: '600' }}>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'admin' ? 'active' : 'archived'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${u.is_active ? 'active' : 'archived'}`}>
                                            {u.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="action-cell">
                                        <button type="button" className="status-toggle-btn" onClick={() => handleEdit(u)}>Edit</button>
                                        <button type="button" className="status-toggle-btn action-remove" onClick={() => handleRemove(u.id)}>Remove</button>
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

export default Users;
