import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTrash, FaSearch } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import API from '../../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await API.get('/users'); setUsers(data.users); }
      catch (e) { toast.error('Failed to load users'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await API.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success(`User "${name}" deleted`);
    } catch (e) { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await API.put(`/users/${id}`, { role });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));
      toast.success('User role updated');
    } catch (e) { toast.error('Update failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', marginBottom: '1.5rem' }}>👥 Manage Users</h2>

        <div className="input-group mb-4" style={{ maxWidth: 400 }}>
          <span className="input-group-text bg-white"><FaSearch color="var(--choco-warm)" /></span>
          <input type="text" className="form-control" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? <Loader /> : (
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <div className="p-3 border-bottom">
              <small className="text-muted">{filtered.length} users</small>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ background: 'var(--choco-dark)', color: '#fff' }}>
                  <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--choco-caramel)', fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.name}</td>
                      <td style={{ fontSize: '0.88rem', color: 'var(--choco-muted)' }}>{u.email}</td>
                      <td style={{ fontSize: '0.88rem' }}>{u.phone || '—'}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={u.role}
                          onChange={e => handleRoleChange(u._id, e.target.value)}
                          style={{ minWidth: 100 }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(u._id, u.name)}
                          disabled={deleting === u._id || u.role === 'admin'}
                          title={u.role === 'admin' ? 'Cannot delete admin' : 'Delete user'}
                        >
                          {deleting === u._id ? '...' : <FaTrash />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
