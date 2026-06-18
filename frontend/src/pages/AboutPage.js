import React from 'react';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Aryan Kapoor', role: 'Founder & Master Chocolatier', initial: 'A' },
  { name: 'Sana Sheikh', role: 'Head of Product Design', initial: 'S' },
  { name: 'Rohan Verma', role: 'Operations Manager', initial: 'R' },
];

const AboutPage = () => (
  <div>
    {/* HERO */}
    <div style={{ background: 'var(--gradient-main)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1511381939415-e44015466834?w=1400) center/cover', opacity: 0.1 }} />
      <div className="container text-center" style={{ position: 'relative' }}>
        <h1 style={{ color: 'var(--choco-caramel)', fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '1rem' }}>Our Sweet Story</h1>
        <p style={{ color: 'rgba(255,248,240,0.8)', fontSize: '1.15rem', maxWidth: 600, margin: '0 auto' }}>
          Born from a passion for the finest chocolate and a dream to share it with the world.
        </p>
      </div>
    </div>

    {/* STORY */}
    <section className="py-5 bg-choco-cream">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <img src="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=700" alt="Our Story"
              style={{ borderRadius: 'var(--radius)', width: '100%', height: 400, objectFit: 'cover', boxShadow: 'var(--shadow-lg)' }} />
          </div>
          <div className="col-lg-6">
            <div className="hero-badge" style={{ display: 'inline-block' }}>Est. 2018</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', margin: '1rem 0' }}>
              Crafted with Passion, Delivered with Love
            </h2>
            <p style={{ color: 'var(--choco-text)', lineHeight: 1.9, marginBottom: '1rem' }}>
              ChocoBits was born in a tiny kitchen in Mumbai in 2018, when founder Aryan Kapoor decided to share his grandmother's secret chocolate recipes with the world. What started as weekend batches for friends and family quickly turned into India's most beloved artisan chocolate brand.
            </p>
            <p style={{ color: 'var(--choco-text)', lineHeight: 1.9 }}>
              Every product we create uses only the finest Belgian and Swiss cacao, sourced ethically and processed with care. We believe great chocolate isn't just a treat — it's an experience.
            </p>
            <div className="row g-3 mt-3">
              {[['500+', 'Products'], ['50K+', 'Happy Customers'], ['6+', 'Years of Excellence'], ['100%', 'Natural Ingredients']].map(([n, l]) => (
                <div key={l} className="col-6">
                  <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)', borderLeft: '3px solid var(--choco-caramel)' }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--choco-warm)' }}>{n}</div>
                    <div style={{ color: 'var(--choco-muted)', fontSize: '0.85rem' }}>{l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* VALUES */}
    <section className="py-5 bg-choco-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Our Values</h2>
          <p className="section-subtitle mt-3">What makes ChocoBits special</p>
        </div>
        <div className="row g-4">
          {[
            { icon: '🌿', title: 'Natural & Pure', desc: 'Zero artificial colors or preservatives. Every ingredient is carefully chosen for purity and taste.' },
            { icon: '♻️', title: 'Eco-Friendly', desc: 'Sustainable packaging and ethical sourcing. We care for the planet as much as we care for chocolate.' },
            { icon: '❤️', title: 'Made with Love', desc: 'Every piece is hand-crafted by our skilled chocolatiers in small batches to ensure premium quality.' },
            { icon: '🎁', title: 'Perfect for Gifting', desc: 'From birthdays to festivals, our beautifully packaged products make every occasion memorable.' },
          ].map(v => (
            <div key={v.title} className="col-sm-6 col-lg-3">
              <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '2rem 1.5rem', textAlign: 'center', height: '100%', boxShadow: 'var(--shadow-sm)', transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{v.icon}</div>
                <h5 style={{ color: 'var(--choco-dark)', fontFamily: 'Playfair Display, serif' }}>{v.title}</h5>
                <p style={{ color: 'var(--choco-muted)', fontSize: '0.93rem', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* TEAM */}
    <section className="py-5 bg-choco-cream">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Meet the Team</h2>
          <p className="section-subtitle mt-3">The people behind the magic</p>
        </div>
        <div className="row g-4 justify-content-center">
          {team.map(m => (
            <div key={m.name} className="col-sm-6 col-md-4" style={{ maxWidth: 280 }}>
              <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem', color: 'var(--choco-caramel)', fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>{m.initial}</div>
                <h5 style={{ color: 'var(--choco-dark)', fontFamily: 'Playfair Display, serif' }}>{m.name}</h5>
                <p style={{ color: 'var(--choco-muted)', fontSize: '0.9rem' }}>{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ background: 'var(--gradient-main)', padding: '4rem 0' }}>
      <div className="container text-center">
        <h2 style={{ color: 'var(--choco-caramel)', fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>Ready to Indulge?</h2>
        <p style={{ color: 'rgba(255,248,240,0.8)', marginBottom: '2rem' }}>Explore our full range of premium chocolates and treats.</p>
        <Link to="/products" className="btn btn-gold btn-lg">Shop Now 🍫</Link>
      </div>
    </section>
  </div>
);

export default AboutPage;
