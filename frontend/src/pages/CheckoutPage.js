import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearCart } from '../redux/slices/cartSlice';
import API from '../utils/api';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector(s => s.cart);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', pincode: '', paymentMethod: 'COD'
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const subtotal = cartItems.reduce((acc, i) => acc + (i.discountPrice || i.price) * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(i => ({ product: i._id, name: i.name, image: i.images?.[0], price: i.discountPrice || i.price, quantity: i.quantity })),
        shippingAddress: { fullName: form.fullName, phone: form.phone, street: form.street, city: form.city, state: form.state, pincode: form.pincode },
        paymentMethod: form.paymentMethod,
        itemsPrice: subtotal, shippingPrice: shipping, taxPrice: tax, totalPrice: total,
      };
      const { data } = await API.post('/orders', orderData);
      dispatch(clearCart());
      toast.success('🎉 Order placed successfully!');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-choco-cream py-4" style={{ minHeight: '80vh' }}>
      <div className="container">
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', marginBottom: '2rem' }}>🛍️ Checkout</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-lg-8">
              {/* SHIPPING */}
              <div className="bg-white p-4 rounded shadow-sm mb-4">
                <h5 style={{ color: 'var(--choco-dark)', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>📦 Shipping Address</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input className="form-control" name="fullName" value={form.fullName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone *</label>
                    <input className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Street Address *</label>
                    <input className="form-control" name="street" value={form.street} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">City *</label>
                    <input className="form-control" name="city" value={form.city} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">State *</label>
                    <input className="form-control" name="state" value={form.state} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Pincode *</label>
                    <input className="form-control" name="pincode" value={form.pincode} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* PAYMENT */}
              <div className="bg-white p-4 rounded shadow-sm">
                <h5 style={{ color: 'var(--choco-dark)', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>💳 Payment Method</h5>
                {[['COD', '💵 Cash on Delivery'], ['UPI', '📱 UPI / QR Code'], ['Card', '💳 Credit / Debit Card']].map(([val, label]) => (
                  <div key={val} className="form-check mb-3 p-3 rounded" style={{ background: form.paymentMethod === val ? 'var(--choco-light)' : 'transparent', border: `1px solid ${form.paymentMethod === val ? 'var(--choco-caramel)' : '#dee2e6'}`, cursor: 'pointer' }}>
                    <input className="form-check-input" type="radio" name="paymentMethod" value={val}
                      checked={form.paymentMethod === val} onChange={handleChange} id={val} />
                    <label className="form-check-label w-100" htmlFor={val} style={{ cursor: 'pointer', fontWeight: form.paymentMethod === val ? 600 : 400 }}>{label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="order-summary-card">
                <h5 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', marginBottom: '1.2rem' }}>Order Summary</h5>
                {cartItems.map(i => (
                  <div key={i._id} className="d-flex justify-content-between mb-2 align-items-start">
                    <span style={{ fontSize: '0.9rem', color: 'var(--choco-text)' }}>{i.name} × {i.quantity}</span>
                    <span style={{ fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 8 }}>₹{((i.discountPrice || i.price) * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <hr style={{ borderColor: 'rgba(198,134,66,0.15)' }} />
                <div className="d-flex justify-content-between mb-1 small"><span className="text-muted">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="d-flex justify-content-between mb-1 small"><span className="text-muted">Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="d-flex justify-content-between mb-2 small"><span className="text-muted">GST (5%)</span><span>₹{tax}</span></div>
                <hr style={{ borderColor: 'rgba(198,134,66,0.15)' }} />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Total</strong>
                  <strong style={{ color: 'var(--choco-warm)', fontSize: '1.2rem' }}>₹{total.toLocaleString()}</strong>
                </div>
                <button type="submit" className="btn btn-choco w-100 btn-lg" disabled={loading}>
                  {loading ? '⏳ Placing Order...' : '🎉 Place Order'}
                </button>
                <p className="text-center mt-2 mb-0"><small className="text-muted">🔒 100% Secure Checkout</small></p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
