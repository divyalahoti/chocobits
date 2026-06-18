import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import API from '../../utils/api';

const statusColors = {
  Pending: 'warning', Processing: 'info', Shipped: 'primary', Delivered: 'success', Cancelled: 'danger'
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await API.get('/orders/myorders'); setOrders(data.orders); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-choco-cream py-4" style={{ minHeight: '80vh' }}>
      <div className="container">
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', marginBottom: '2rem' }}>📦 My Orders</h2>
        {orders.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '4rem' }}>📭</div>
            <h4 style={{ color: 'var(--choco-dark)' }}>No orders yet</h4>
            <Link to="/products" className="btn btn-choco mt-3">Start Shopping</Link>
          </div>
        ) : (
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ background: 'var(--choco-dark)', color: 'white' }}>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td><code style={{ color: 'var(--choco-warm)' }}>#{o._id.slice(-8).toUpperCase()}</code></td>
                      <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>{o.orderItems.reduce((a, i) => a + i.quantity, 0)} items</td>
                      <td><strong style={{ color: 'var(--choco-warm)' }}>₹{o.totalPrice.toLocaleString()}</strong></td>
                      <td><span className={`badge bg-${statusColors[o.orderStatus] || 'secondary'}`}>{o.orderStatus}</span></td>
                      <td><Link to={`/orders/${o._id}`} className="btn btn-sm btn-choco-outline">View</Link></td>
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

export default OrderHistoryPage;
