import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlistItem } from '../../redux/slices/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(s => s.auth);
  const { items: wishlist } = useSelector(s => s.wishlist);

  const isWishlisted = wishlist?.some(w => (w._id || w) === product._id);
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return toast.error('Out of stock');
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!userInfo) { navigate('/login'); return; }
    await dispatch(toggleWishlistItem(product._id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const displayPrice = product.discountPrice || product.price;

  return (
    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
      <div className="product-card">
        <div className="card-img-wrapper">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600'}
            alt={product.name}
            loading="lazy"
          />
          {product.isFeatured && <span className="product-badge">✨ Featured</span>}
          {discount > 0 && <span className="product-badge" style={{ top: product.isFeatured ? '38px' : '10px', background: '#e53e3e' }}>{discount}% OFF</span>}
          <button className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} onClick={handleWishlist} title="Wishlist">
            {isWishlisted ? <FaHeart color="#e53e3e" /> : <FaRegHeart color="#8B4513" />}
          </button>
        </div>
        <div className="card-body">
          <p className="card-title">{product.name}</p>
          <div className="d-flex align-items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={12} className={i < Math.round(product.rating) ? 'star-rating' : 'star-empty'} />
            ))}
            <small className="text-muted ms-1">({product.numReviews})</small>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              {product.discountPrice ? (
                <span>
                  <span className="original-price">₹{product.price}</span>
                  <span className="price">₹{product.discountPrice}</span>
                </span>
              ) : (
                <span className="price">₹{product.price}</span>
              )}
            </div>
            <button
              className="btn btn-sm btn-choco"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
            >
              <FaShoppingCart className="me-1" /> {product.stock === 0 ? 'OOS' : 'Add'}
            </button>
          </div>
          {product.stock < 5 && product.stock > 0 && (
            <small className="text-danger mt-1 d-block">Only {product.stock} left!</small>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
