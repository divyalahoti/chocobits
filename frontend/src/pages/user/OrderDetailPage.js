import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import API from '../../utils/api';

const statusColors = { Pending: 'warning', Processing: 'info', Shipped: 'primary', Delivered: 'success', Cancelled: 'danger' };
const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await API.get(`/orders/${id}`); setOrder(data.order); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <div className="container py-5 text-center"><h4>Order not found</h4><Link to="/orders" className="btn btn-choco mt-3">Back to Orders</Link></div>;

  const stepIndex = steps.indexOf(order.orderStatus);

  return (
    <div className="bg-choco-cream py-4" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)' }}>
            Order <span style={{ color: 'var(--choco-warm)' }}>#{order._id.slice(-8).toUpperCase()}</span>
          </h2>
          <span className={`badge bg-${statusColors[order.orderStatus] || 'secondary'} fs-6`}>{order.orderStatus}</span>
        </div>

        {/* ORDER TRACKER */}
        {order.orderStatus !== 'Cancelled' && (
          <div className="bg-white rounded p-4 shadow-sm mb-4">
            <h5 style={{ color: 'var(--choco-dark)', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>📍 Order Tracking</h5>
            <div className="d-flex justify-content-between align-items-center position-relative">
              <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '3px', background: 'var(--choco-light)', zIndex: 0 }}>
                <div style={{ height: '100%', background: 'var(--choco-warm)', width: `${Math.max(0, (stepIndex / (steps.length - 1)) * 100)}%`, transition: 'width 0.5s' }} />
              </div>
              {steps.map((step, i) => (
                <div key={step} className="text-center" style={{ zIndex: 1, flex: 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: i <= stepIndex ? 'var(--choco-warm)' : 'var(--choco-light)', color: i <= stepIndex ? '#fff' : 'var(--choco-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 700, border: i === stepIndex ? '3px solid var(--choco-dark)' : '3px solid transparent', transition: 'all 0.3s' }}>
                    {i < stepIndex ? '✓' : i + 1}
                  </div>
                  <small style={{ color: i <= stepIndex ? 'var(--choco-dark)' : 'var(--choco-muted)', fontWeight: i === stepIndex ? 700 : 400, fontSize: '0.78rem' }}>{step}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="row g-4">
          {/* ORDER ITEMS */}
          <div className="col-lg-8">
            <div className="bg-white rounded p-4 shadow-sm mb-4">
              <h5 style={{ color: 'var(--choco-dark)', marginBottom: '1rem', fontFamily: 'Playfair Display, serif' }}>🍫 Order Items</h5>
              {order.orderItems.map((item, i) => (
                <div key={i} className="d-flex align-items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(198,134,66,0.1)' }}>
                  <img src={item.image || 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=100'} alt={item.name}
                    style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div className="flex-grow-1">
                    <Link to={`/products/${item.product}`} style={{ color: 'var(--choco-dark)', textDecoration: 'none', fontWeight: 600 }}>{item.name}</Link>
                    <div className="text-muted small">Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--choco-warm)' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* SHIPPING ADDRESS */}
            <div className="bg-white rounded p-4 shadow-sm">
              <h5 style={{ color: 'var(--choco-dark)', marginBottom: '1rem', fontFamily: 'Playfair Display, serif' }}>📦 Shipping Address</h5>
              <p className="mb-1"><strong>{order.shippingAddress.fullName}</strong></p>
              <p className="mb-1 text-muted">{order.shippingAddress.street}</p>
              <p className="mb-1 text-muted">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="mb-0 text-muted">📞 {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="col-lg-4">
            <div className="order-summary-card">
              <h5 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', marginBottom: '1.2rem' }}>💰 Payment Summary</h5>
              <div className="d-flex justify-content-between mb-2 small"><span className="text-muted">Subtotal</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
              <div className="d-flex justify-content-between mb-2 small"><span className="text-muted">Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
              <div className="d-flex justify-content-between mb-2 small"><span className="text-muted">GST</span><span>₹{order.taxPrice}</span></div>
              <hr style={{ borderColor: 'rgba(198,134,66,0.15)' }} />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong style={{ color: 'var(--choco-warm)', fontSize: '1.2rem' }}>₹{order.totalPrice?.toLocaleString()}</strong>
              </div>
              <div className="p-3 rounded" style={{ background: 'var(--choco-light)' }}>
                <div className="d-flex justify-content-between small mb-1"><span>Payment Method</span><strong>{order.paymentMethod}</strong></div>
                <div className="d-flex justify-content-between small mb-1"><span>Payment Status</span><strong className={order.isPaid ? 'text-success' : 'text-warning'}>{order.isPaid ? '✅ Paid' : '⏳ Pending'}</strong></div>
                <div className="d-flex justify-content-between small"><span>Order Date</span><strong>{new Date(order.createdAt).toLocaleDateString('en-IN')}</strong></div>
              </div>
              <Link to="/orders" className="btn btn-choco-outline w-100 mt-3">← Back to Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
