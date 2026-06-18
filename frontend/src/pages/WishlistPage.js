import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { fetchWishlist, toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector(s => s.wishlist);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  const handleRemove = async (id) => {
    await dispatch(toggleWishlistItem(id));
    toast.info('Removed from wishlist');
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success(`${product.name} added to cart! 🛒`);
  };

  return (
    <div className="bg-choco-cream py-4" style={{ minHeight: '80vh' }}>
      <div className="container">
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', marginBottom: '2rem' }}>
          <FaHeart className="me-2" style={{ color: '#e53e3e' }} />My Wishlist
        </h2>
        {items.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '5rem' }}>💔</div>
            <h4 style={{ color: 'var(--choco-dark)' }}>Your wishlist is empty</h4>
            <p className="text-muted">Save your favourite chocolates here!</p>
            <Link to="/products" className="btn btn-choco">Browse Products</Link>
          </div>
        ) : (
          <div className="row g-4">
            {items.map(product => product && (
              <div key={product._id} className="col-sm-6 col-md-4 col-lg-3">
                <div className="product-card position-relative">
                  <div className="card-img-wrapper">
                    <Link to={`/products/${product._id}`}>
                      <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'} alt={product.name} />
                    </Link>
                    <button className="wishlist-btn active" onClick={() => handleRemove(product._id)} title="Remove">
                      <FaTrash size={14} color="#e53e3e" />
                    </button>
                  </div>
                  <div className="card-body">
                    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                      <p className="card-title">{product.name}</p>
                    </Link>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="price">₹{product.discountPrice || product.price}</span>
                      <button className="btn btn-sm btn-choco" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
