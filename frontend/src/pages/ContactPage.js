import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success('✅ Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const info = [
    { icon: <FaMapMarkerAlt size={22} />, title: 'Our Address', lines: ['123 Cocoa Lane, Chocolate City', 'Mumbai, Maharashtra 400001'] },
    { icon: <FaPhone size={22} />, title: 'Phone', lines: ['+91 98765 43210', '+91 98765 43211'] },
    { icon: <FaEnvelope size={22} />, title: 'Email', lines: ['hello@chocobits.com', 'support@chocobits.com'] },
    { icon: <FaClock size={22} />, title: 'Working Hours', lines: ['Mon–Sat: 9:00 AM – 7:00 PM', 'Sun: 10:00 AM – 5:00 PM'] },
  ];

  return (
    <div>
      {/* HERO */}
      <div style={{ background: 'var(--gradient-main)', padding: '4rem 0', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1400) center/cover', opacity: 0.1 }} />
        <div style={{ position: 'relative' }}>
          <h1 style={{ color: 'var(--choco-caramel)', fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,5vw,3rem)' }}>Get in Touch</h1>
          <p style={{ color: 'rgba(255,248,240,0.8)' }}>We'd love to hear from you. Drop us a message!</p>
        </div>
      </div>

      <div className="py-5 bg-choco-cream">
        <div className="container">
          <div className="row g-5">
            {/* INFO */}
            <div className="col-lg-5">
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', marginBottom: '2rem' }}>Contact Information</h3>
              {info.map(item => (
                <div key={item.title} className="d-flex gap-3 mb-4">
                  <div style={{ width: 50, height: 50, background: 'var(--gradient-main)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--choco-caramel)', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <h6 style={{ color: 'var(--choco-dark)', marginBottom: '0.2rem' }}>{item.title}</h6>
                    {item.lines.map((l, i) => <p key={i} style={{ color: 'var(--choco-muted)', margin: 0, fontSize: '0.93rem' }}>{l}</p>)}
                  </div>
                </div>
              ))}

              <div style={{ background: 'var(--gradient-main)', borderRadius: 'var(--radius)', padding: '1.5rem', marginTop: '2rem' }}>
                <h6 style={{ color: 'var(--choco-caramel)', marginBottom: '0.5rem', fontFamily: 'Playfair Display, serif' }}>🎁 Bulk & Corporate Orders</h6>
                <p style={{ color: 'rgba(255,248,240,0.8)', fontSize: '0.9rem', margin: 0 }}>
                  Planning a corporate event or large gifting? We offer special pricing and custom packaging for bulk orders above ₹10,000.
                </p>
              </div>
            </div>

            {/* FORM */}
            <div className="col-lg-7">
              <div className="bg-white rounded p-4 shadow-sm">
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', marginBottom: '1.5rem' }}>Send us a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Your Name *</label>
                      <input className="form-control" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address *</label>
                      <input type="email" className="form-control" placeholder="john@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Subject *</label>
                      <select className="form-select" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
                        <option value="">Select a subject</option>
                        <option>Order Inquiry</option>
                        <option>Bulk / Corporate Order</option>
                        <option>Product Feedback</option>
                        <option>Shipping & Delivery</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message *</label>
                      <textarea className="form-control" rows="5" placeholder="Write your message here..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-choco btn-lg" disabled={loading}>
                        {loading ? '⏳ Sending...' : '📨 Send Message'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
