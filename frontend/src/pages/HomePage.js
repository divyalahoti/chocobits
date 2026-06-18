import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaShippingFast, FaAward, FaGift, FaHeadset } from 'react-icons/fa';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';
import API from '../utils/api';

const testimonials = [
  { name: 'Priya Sharma', city: 'Mumbai', text: 'The dark truffle collection is absolutely divine! Best chocolates I\'ve ever tasted. Will definitely order again.', rating: 5 },
  { name: 'Rahul Mehta', city: 'Delhi', text: 'Ordered the Diwali hamper for my family. The presentation was stunning and the chocolates were fresh and delicious!', rating: 5 },
  { name: 'Anita Patel', city: 'Bangalore', text: 'The triple chocolate cake was a showstopper at my daughter\'s birthday. Everyone loved it!', rating: 5 },
];

const features = [
  { icon: <FaShippingFast size={28} />, title: 'Free Delivery', desc: 'On orders above ₹999' },
  { icon: <FaAward size={28} />, title: 'Premium Quality', desc: 'Belgian & Swiss chocolate' },
  { icon: <FaGift size={28} />, title: 'Gift Wrapping', desc: 'Complimentary on request' },
  { icon: <FaHeadset size={28} />, title: '24/7 Support', desc: 'Always here to help' },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          API.get('/products?featured=true&limit=8'),
          API.get('/categories'),
        ]);
        setFeatured(pRes.data.products);
        setCategories(cRes.data.categories);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    alert(`Thank you! ${email} subscribed successfully 🎉`);
    setEmail('');
  };

  return (
    <>
      {/* HERO */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 hero-content fade-in-up">
              <div className="hero-badge">✨ Premium Artisan Chocolates</div>
              <h1>Indulge in the World's Finest <span style={{ color: '#fff' }}>Chocolates</span></h1>
              <p className="mt-3 mb-4">Handcrafted with love using the finest Belgian cacao. Every bite tells a story of passion, quality, and unmatched flavor.</p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/products" className="btn btn-gold btn-lg">
                  Shop Now <FaArrowRight className="ms-2" />
                </Link>
                <Link to="/about" className="btn btn-choco-outline btn-lg" style={{ borderColor: 'rgba(198,134,66,0.6)', color: 'var(--choco-caramel)' }}>
                  Our Story
                </Link>
              </div>
              <div className="hero-stats">
                {[['500+', 'Products'], ['50K+', 'Happy Customers'], ['4.9★', 'Avg Rating']].map(([n, l]) => (
                  <div key={l}><span className="hero-stat-num">{n}</span><span className="hero-stat-label">{l}</span></div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-img-wrapper">
                <img src="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=700" alt="Premium Chocolates" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-4" style={{ background: 'var(--choco-dark)' }}>
        <div className="container">
          <div className="row g-3">
            {features.map(f => (
              <div key={f.title} className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-3 p-2">
                  <div style={{ color: 'var(--choco-caramel)' }}>{f.icon}</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{f.title}</div>
                    <div style={{ color: 'rgba(255,248,240,0.6)', fontSize: '0.82rem' }}>{f.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-5 bg-choco-cream">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle mt-3">Explore our delectable collections</p>
          </div>
          <div className="row g-3">
            {categories.slice(0, 5).map(cat => (
              <div key={cat._id} className="col-6 col-md-4 col-lg" onClick={() => navigate(`/products?category=${cat._id}`)}>
                <div className="category-card">
                  <img src={cat.image || 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'} alt={cat.name} />
                  <div className="category-overlay">
                    <h5>{cat.name}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-5 bg-choco-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="section-title" style={{ padding: '0 0 0.7rem' }}>Featured Products</h2>
              <style>{'.section-title::after{left:0;transform:none}'}</style>
              <p className="section-subtitle mt-2">Hand-picked favourites just for you</p>
            </div>
            <Link to="/products" className="btn btn-choco-outline">View All <FaArrowRight className="ms-1" /></Link>
          </div>
          {loading ? <Loader /> : (
            <div className="row g-4">
              {featured.map(p => (
                <div key={p._id} className="col-6 col-md-4 col-lg-3"><ProductCard product={p} /></div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BANNER */}
      <section style={{ background: 'var(--gradient-main)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1600) center/cover', opacity: 0.1 }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <h2 style={{ color: 'var(--choco-caramel)', fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', marginBottom: '1rem' }}>
            🎁 Perfect Gifts for Every Occasion
          </h2>
          <p style={{ color: 'rgba(255,248,240,0.8)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 2rem' }}>
            Birthdays, anniversaries, festivals, or just because — our curated gift boxes make every moment sweeter.
          </p>
          <Link to="/products?category=gift-boxes" className="btn btn-gold btn-lg">
            Explore Gift Boxes <FaArrowRight className="ms-2" />
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-5 bg-choco-cream">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle mt-3">Real reviews from chocolate lovers</p>
          </div>
          <div className="row g-4">
            {testimonials.map(t => (
              <div key={t.name} className="col-md-4">
                <div className="testimonial-card fade-in-up">
                  <div className="d-flex gap-2 mb-3">
                    {[...Array(t.rating)].map((_, i) => <span key={i} style={{ color: 'var(--choco-gold)' }}>★</span>)}
                  </div>
                  <p style={{ color: 'var(--choco-text)', fontStyle: 'italic', marginBottom: '1.2rem' }}>"{t.text}"</p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="testimonial-avatar">{t.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--choco-dark)' }}>{t.name}</div>
                      <small style={{ color: 'var(--choco-muted)' }}>{t.city}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <h2>🍫 Get Sweet Deals in Your Inbox</h2>
              <p className="mb-4">Subscribe for exclusive offers, new arrivals and 10% off your first order!</p>
              <form onSubmit={handleNewsletter} className="d-flex">
                <input
                  type="email" className="form-control newsletter-input"
                  placeholder="Enter your email address"
                  value={email} onChange={e => setEmail(e.target.value)} required
                />
                <button type="submit" className="btn btn-gold" style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', whiteSpace: 'nowrap' }}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
