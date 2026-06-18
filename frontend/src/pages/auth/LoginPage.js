import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginUser, clearError } from '../../redux/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const redirect = location.state?.from?.pathname || '/';

  useEffect(() => { if (userInfo) navigate(redirect); }, [userInfo, navigate, redirect]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="bg-choco-cream py-4" style={{ minHeight: '80vh' }}>
      <div className="auth-card">
        <div className="auth-card-header">
          <h2>🍫 Welcome Back</h2>
          <p>Login to your ChocoBits account</p>
        </div>
        <div className="auth-card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input type={showPw ? 'text' : 'password'} className="form-control" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-choco w-100 btn-lg mb-3" disabled={loading}>
              {loading ? '⏳ Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center mb-0" style={{ color: 'var(--choco-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--choco-warm)', fontWeight: 600 }}>Sign Up</Link>
          </p>
          <div className="text-center mt-3 p-3 rounded" style={{ background: 'var(--choco-light)', fontSize: '0.85rem' }}>
            <strong>Demo:</strong> admin@chocobits.com / admin123<br />
            <strong>User:</strong> user@chocobits.com / user123
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
