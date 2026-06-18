import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaSave } from 'react-icons/fa';
import { updateProfile } from '../../redux/slices/authSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(s => s.auth);
  const [form, setForm] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const updateData = { name: form.name, phone: form.phone };
      if (form.password) updateData.password = form.password;
      await dispatch(updateProfile(updateData));
      toast.success('Profile updated successfully!');
      setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-choco-cream py-4" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: 700 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', marginBottom: '2rem' }}>👤 My Profile</h2>

        <div className="row g-4">
          {/* AVATAR CARD */}
          <div className="col-md-4">
            <div className="bg-white rounded p-4 text-center shadow-sm">
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2.5rem', color: 'var(--choco-caramel)', fontFamily: 'Playfair Display, serif' }}>
                {userInfo?.name?.[0]?.toUpperCase()}
              </div>
              <h5 style={{ color: 'var(--choco-dark)' }}>{userInfo?.name}</h5>
              <p className="text-muted small">{userInfo?.email}</p>
              <span className="badge" style={{ background: userInfo?.role === 'admin' ? 'var(--choco-warm)' : 'var(--choco-caramel)', color: '#fff' }}>
                {userInfo?.role === 'admin' ? '⚙️ Admin' : '🛒 Customer'}
              </span>
            </div>
          </div>

          {/* EDIT FORM */}
          <div className="col-md-8">
            <div className="bg-white rounded p-4 shadow-sm">
              <h5 style={{ color: 'var(--choco-dark)', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Edit Information</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label"><FaUser className="me-2" />Full Name</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label"><FaEnvelope className="me-2" />Email</label>
                  <input className="form-control" value={form.email} disabled style={{ background: 'var(--choco-light)' }} />
                  <small className="text-muted">Email cannot be changed</small>
                </div>
                <div className="mb-3">
                  <label className="form-label"><FaPhone className="me-2" />Phone</label>
                  <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                </div>
                <hr style={{ borderColor: 'rgba(198,134,66,0.15)' }} />
                <h6 style={{ color: 'var(--choco-muted)', marginBottom: '1rem' }}>Change Password (optional)</h6>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-control" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current" />
                </div>
                <div className="mb-4">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-control" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat new password" />
                </div>
                <button type="submit" className="btn btn-choco" disabled={loading}>
                  <FaSave className="me-2" />{loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
