import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaTachometerAlt, FaBox, FaClipboardList, FaUsers, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { logout } from '../../redux/slices/authSlice';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const links = [
    { to: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { to: '/admin/products', icon: <FaBox />, label: 'Products' },
    { to: '/admin/orders', icon: <FaClipboardList />, label: 'Orders' },
    { to: '/admin/users', icon: <FaUsers />, label: 'Users' },
  ];
  return (
    <div className="admin-sidebar">
      <div className="sidebar-brand">🍫 ChocoBits<br /><small style={{ fontSize: '0.7rem', color: 'rgba(255,248,240,0.5)' }}>Admin Panel</small></div>
      <nav className="nav flex-column">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className="nav-link">
            {l.icon} {l.label}
          </NavLink>
        ))}
        <NavLink to="/" className="nav-link"><FaHome /> View Store</NavLink>
        <button className="nav-link btn border-0 text-start mt-3" style={{ color: '#f87171' }}
          onClick={() => { dispatch(logout()); navigate('/'); }}>
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
