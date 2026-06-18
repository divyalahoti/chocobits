import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector(s => s.cart);
  const { userInfo } = useSelector(s => s.auth);

  const subtotal = cartItems.reduce((acc, i) => acc + (i.discountPrice || i.price) * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleQty = (id, qty) => {
    if (qty < 1) return;
    dispatch(updateQuantity({ id, quantity: qty }));
  };

  const handleCheckout = () => {
    if (!userInfo) navigate('/login');
    else navigate('/checkout');
  };

  if (cartItems.length === 0) return (
    <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
      <h3 style={{ color: 'var(--choco-dark)', fontFamily: 'Playfair Display, serif' }}>Your cart is empty</h3>
      <p className="text-muted mb-4">Add some delicious chocolates to get started!</p>
      <Link to="/products" className="btn btn-choco btn-lg">Start Shopping 🍫</Link>
    </div>
  );

  return (
    <div className="bg-choco-cream py-4" style={{ minHeight: '80vh' }}>
      <div className="container">
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', marginBottom: '1.5rem' }}>
          🛒 Shopping Cart <span className="badge" style={{ background: 'var(--choco-warm)', fontSize: '1rem' }}>{cartItems.length}</span>
        </h2>

        <div className="row g-4">
          <div className="col-lg-8">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=200'} alt={item.name} />
                <div className="flex-grow-1">
                  <Link to={`/products/${item._id}`} style={{ textDecoration: 'none' }}>
                    <h6 style={{ color: 'var(--choco-dark)', fontFamily: 'Playfair Display, serif', marginBottom: '0.3rem' }}>{item.name}</h6>
                  </Link>
                  <div style={{ color: 'var(--choco-warm)', fontWeight: 700 }}>₹{item.discountPrice || item.price}</div>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => handleQty(item._id, item.quantity - 1)}>−</button>
                  <span style={{ width: 36, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => handleQty(item._id, item.quantity + 1)}>+</button>
                </div>
                <div style={{ minWidth: 70, textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--choco-dark)' }}>₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</div>
                  <button className="btn btn-sm btn-link text-danger p-0 mt-1" onClick={() => dispatch(removeFromCart(item._id))}>
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}

            <Link to="/products" className="btn btn-choco-outline mt-2">
              <FaArrowLeft className="me-2" />Continue Shopping
            </Link>
          </div>

          <div className="col-lg-4">
            <div className="order-summary-card">
              <h5 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(198,134,66,0.15)' }}>
                Order Summary
              </h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? <span className="text-success">FREE</span> : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && <small className="text-muted d-block mb-2">Add ₹{999 - subtotal} more for free shipping</small>}
              <hr style={{ borderColor: 'rgba(198,134,66,0.15)' }} />
              <div className="d-flex justify-content-between mb-4">
                <strong style={{ fontSize: '1.1rem' }}>Total</strong>
                <strong style={{ fontSize: '1.2rem', color: 'var(--choco-warm)' }}>₹{total.toLocaleString()}</strong>
              </div>
              <button className="btn btn-choco w-100 btn-lg" onClick={handleCheckout}>
                <FaShoppingBag className="me-2" />Proceed to Checkout
              </button>
              <div className="text-center mt-3">
                <small className="text-muted">🔒 Secure & Safe Checkout</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
