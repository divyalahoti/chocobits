import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { registerUser, clearError } from '../../redux/slices/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { if (userInfo) navigate('/'); }, [userInfo, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
  };

  return (
    <div className="bg-choco-cream py-4" style={{ minHeight: '80vh' }}>
      <div className="auth-card">
        <div className="auth-card-header">
          <h2>🍫 Join ChocoBits</h2>
          <p>Create your account and start indulging</p>
        </div>
        <div className="auth-card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="Your Name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input type={showPw ? 'text' : 'password'} className="form-control" placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" placeholder="Repeat password"
                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-choco w-100 btn-lg mb-3" disabled={loading}>
              {loading ? '⏳ Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center mb-0" style={{ color: 'var(--choco-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--choco-warm)', fontWeight: 600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
