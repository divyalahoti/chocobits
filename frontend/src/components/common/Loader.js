import React from 'react';

const Loader = ({ text = 'Loading...' }) => (
  <div className="page-loader">
    <div className="choco-spinner"></div>
    <p style={{ color: 'var(--choco-muted)', fontFamily: 'Playfair Display, serif' }}>{text}</p>
  </div>
);

export default Loader;
