import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import API from '../../utils/api';

const statusColors = { Pending: 'warning', Processing: 'info', Shipped: 'primary', Delivered: 'success', Cancelled: 'danger' };
const allStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data.orders);
    } catch (e) { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success(`Order updated to "${newStatus}"`);
    } catch (e) { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  const filtered = filterStatus ? orders.filter(o => o.orderStatus === filterStatus) : orders;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', marginBottom: '1.5rem' }}>📦 Manage Orders</h2>

        {/* STATUS FILTER TABS */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          <button className={`btn btn-sm ${filterStatus === '' ? 'btn-choco' : 'btn-choco-outline'}`} onClick={() => setFilterStatus('')}>All ({orders.length})</button>
          {allStatuses.map(s => (
            <button key={s} className={`btn btn-sm ${filterStatus === s ? 'btn-choco' : 'btn-choco-outline'}`} onClick={() => setFilterStatus(s)}>
              {s} ({orders.filter(o => o.orderStatus === s).length})
            </button>
          ))}
        </div>

        {loading ? <Loader /> : (
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ background: 'var(--choco-dark)', color: '#fff' }}>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-4 text-muted">No orders found</td></tr>
                  ) : filtered.map(o => (
                    <tr key={o._id}>
                      <td><code style={{ color: 'var(--choco-warm)', fontSize: '0.8rem' }}>#{o._id.slice(-8).toUpperCase()}</code></td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{o.user?.name}</div>
                        <div style={{ color: 'var(--choco-muted)', fontSize: '0.78rem' }}>{o.user?.email}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={{ fontSize: '0.85rem' }}>{o.orderItems?.reduce((a, i) => a + i.quantity, 0)} items</td>
                      <td><strong style={{ color: 'var(--choco-warm)' }}>₹{o.totalPrice?.toLocaleString()}</strong></td>
                      <td>
                        <span style={{ fontSize: '0.8rem' }}>{o.paymentMethod}</span><br />
                        <span className={`badge ${o.isPaid ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontSize: '0.7rem' }}>
                          {o.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td><span className={`badge bg-${statusColors[o.orderStatus]}`}>{o.orderStatus}</span></td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={o.orderStatus}
                          onChange={e => handleStatusUpdate(o._id, e.target.value)}
                          disabled={updating === o._id || o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled'}
                          style={{ minWidth: 120, fontSize: '0.8rem' }}
                        >
                          {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
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

export default AdminOrders;
