import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import { FaBox, FaClipboardList, FaUsers, FaRupeeSign } from 'react-icons/fa';
import API from '../../utils/api';

const statusColors = { Pending: 'warning', Processing: 'info', Shipped: 'primary', Delivered: 'success', Cancelled: 'danger' };

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [sRes, pRes, uRes] = await Promise.all([
          API.get('/orders/stats'),
          API.get('/products?limit=5'),
          API.get('/users'),
        ]);
        setStats(sRes.data.stats);
        setProducts(pRes.data.products);
        setUsers(uRes.data.users);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const statCards = stats ? [
    { icon: <FaClipboardList />, label: 'Total Orders', value: stats.totalOrders, color: '#3B1A08' },
    { icon: <FaRupeeSign />, label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString()}`, color: '#6B3A2A' },
    { icon: <FaBox />, label: 'Pending Orders', value: stats.pendingOrders, color: '#C68642' },
    { icon: <FaUsers />, label: 'Total Users', value: users.length, color: '#8B4513' },
  ] : [];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)' }}>📊 Dashboard</h2>
          <span style={{ color: 'var(--choco-muted)', fontSize: '0.9rem' }}>Welcome back, Admin 👋</span>
        </div>

        {loading ? <Loader /> : (
          <>
            {/* STAT CARDS */}
            <div className="row g-3 mb-4">
              {statCards.map(s => (
                <div key={s.label} className="col-6 col-lg-3">
                  <div className="stat-card">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <div style={{ color: 'var(--choco-muted)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>{s.label}</div>
                        <div className="stat-num">{s.value}</div>
                      </div>
                      <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4">
              {/* RECENT ORDERS */}
              <div className="col-lg-7">
                <div className="bg-white rounded shadow-sm overflow-hidden">
                  <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h6 style={{ color: 'var(--choco-dark)', margin: 0, fontFamily: 'Playfair Display, serif' }}>Recent Orders</h6>
                    <Link to="/admin/orders" className="btn btn-sm btn-choco-outline">View All</Link>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ background: 'var(--choco-light)' }}>
                        <tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {stats?.recentOrders?.map(o => (
                          <tr key={o._id}>
                            <td><code style={{ color: 'var(--choco-warm)', fontSize: '0.8rem' }}>#{o._id.slice(-8).toUpperCase()}</code></td>
                            <td style={{ fontSize: '0.9rem' }}>{o.user?.name || 'N/A'}</td>
                            <td style={{ fontWeight: 600, color: 'var(--choco-warm)' }}>₹{o.totalPrice?.toLocaleString()}</td>
                            <td><span className={`badge bg-${statusColors[o.orderStatus]}`}>{o.orderStatus}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS + RECENT PRODUCTS */}
              <div className="col-lg-5">
                <div className="bg-white rounded shadow-sm p-3 mb-3">
                  <h6 style={{ color: 'var(--choco-dark)', marginBottom: '1rem', fontFamily: 'Playfair Display, serif' }}>⚡ Quick Actions</h6>
                  <div className="d-grid gap-2">
                    <Link to="/admin/products/new" className="btn btn-choco">+ Add New Product</Link>
                    <Link to="/admin/orders" className="btn btn-choco-outline">Manage Orders</Link>
                    <Link to="/admin/users" className="btn btn-choco-outline">Manage Users</Link>
                  </div>
                </div>

                <div className="bg-white rounded shadow-sm overflow-hidden">
                  <div className="p-3 border-bottom">
                    <h6 style={{ color: 'var(--choco-dark)', margin: 0, fontFamily: 'Playfair Display, serif' }}>Recent Products</h6>
                  </div>
                  {products.slice(0, 4).map(p => (
                    <div key={p._id} className="d-flex align-items-center gap-3 p-3 border-bottom" style={{ fontSize: '0.88rem' }}>
                      <img src={p.images?.[0]} alt={p.name} style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      <div className="flex-grow-1 overflow-hidden">
                        <div style={{ fontWeight: 600, color: 'var(--choco-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ color: 'var(--choco-warm)' }}>₹{p.discountPrice || p.price}</div>
                      </div>
                      <span className={`badge ${p.stock > 0 ? '' : 'bg-danger'}`} style={p.stock > 0 ? { background: '#e6f4ea', color: '#2d7a3a' } : {}}>
                        {p.stock > 0 ? `${p.stock}` : 'OOS'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
