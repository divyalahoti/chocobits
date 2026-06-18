import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => (
  <footer className="choco-footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-4 col-md-6">
          <h5>🍫 ChocoBits</h5>
          <p style={{ fontSize: '0.93rem', lineHeight: 1.7 }}>
            Premium handcrafted chocolates made with love and the finest ingredients.
            Delivering joy, one bite at a time since 2018.
          </p>
          <div className="footer-social mt-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
          </div>
        </div>
        <div className="col-lg-2 col-md-6">
          <h5>Quick Links</h5>
          <ul className="list-unstyled" style={{ fontSize: '0.93rem' }}>
            {[['/', 'Home'], ['/products', 'Shop'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
              <li key={to} className="mb-2"><Link to={to}>{label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="col-lg-3 col-md-6">
          <h5>Categories</h5>
          <ul className="list-unstyled" style={{ fontSize: '0.93rem' }}>
            {['Chocolates', 'Gift Boxes', 'Cakes', 'Cookies', 'Festive Hampers'].map(c => (
              <li key={c} className="mb-2">
                <Link to={`/products?category=${c.toLowerCase().replace(' ', '-')}`}>{c}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-lg-3 col-md-6">
          <h5>Contact</h5>
          <ul className="list-unstyled" style={{ fontSize: '0.93rem' }}>
            <li className="mb-2 d-flex align-items-start gap-2"><FaMapMarkerAlt className="mt-1 flex-shrink-0" style={{ color: 'var(--choco-caramel)' }} /><span>123 Cocoa Lane, Chocolate City, Mumbai 400001</span></li>
            <li className="mb-2 d-flex align-items-center gap-2"><FaPhone style={{ color: 'var(--choco-caramel)' }} /><a href="tel:+919876543210">+91 98765 43210</a></li>
            <li className="mb-2 d-flex align-items-center gap-2"><FaEnvelope style={{ color: 'var(--choco-caramel)' }} /><a href="mailto:hello@chocobits.com">hello@chocobits.com</a></li>
          </ul>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="row">
        <div className="col-md-6 text-center text-md-start">
          <small>© {new Date().getFullYear()} ChocoBits. All rights reserved.</small>
        </div>
        <div className="col-md-6 text-center text-md-end">
          <small>Made with 🍫 &amp; ❤️ in India</small>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
