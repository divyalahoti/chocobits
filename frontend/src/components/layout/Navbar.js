import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaHeart, FaUser, FaSignOutAlt, FaCog, FaClipboardList } from 'react-icons/fa';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(s => s.auth);
  const { cartItems } = useSelector(s => s.cart);
  const [navOpen, setNavOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
console.log(userInfo)
  return (
    <nav className="navbar navbar-expand-lg choco-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="brand-icon">🍫</span> ChocoBits
        </Link>
        <button className="navbar-toggler" type="button" onClick={() => setNavOpen(!navOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/" onClick={() => setNavOpen(false)}>Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/products" onClick={() => setNavOpen(false)}>Shop</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/about" onClick={() => setNavOpen(false)}>About</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contact" onClick={() => setNavOpen(false)}>Contact</NavLink></li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            <Link to="/cart" className="nav-link nav-icon-btn text-white position-relative" onClick={() => setNavOpen(false)}>
              <FaShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            {userInfo && (
              <Link to="/wishlist" className="nav-link nav-icon-btn text-white" onClick={() => setNavOpen(false)}>
                <FaHeart size={20} />
              </Link>
            )}

            {userInfo ? (
              <div className="dropdown">
                <button className="btn btn-sm btn-choco-outline dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                  <FaUser size={14} /> {userInfo.name?.split(' ')[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li><Link className="dropdown-item" to="/profile"><FaUser className="me-2" />Profile</Link></li>
                  <li><Link className="dropdown-item" to="/orders"><FaClipboardList className="me-2" />Orders</Link></li>
                  {userInfo.role === 'admin' && (
                    <li><Link className="dropdown-item" to="/admin/dashboard"><FaCog className="me-2" />Admin</Link></li>
                  )}
                  
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}><FaSignOutAlt className="me-2" />Logout</button></li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-sm btn-choco-outline" onClick={() => setNavOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-sm btn-choco" onClick={() => setNavOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
