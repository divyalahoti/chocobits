import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';
import StarRating from '../components/common/StarRating';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import API from '../utils/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(s => s.auth);
  const { items: wishlist } = useSelector(s => s.wishlist);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const isWishlisted = wishlist?.some(w => (w._id || w) === id);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
      } catch (e) { navigate('/products'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product.stock === 0) return toast.error('Out of stock');
    dispatch(addToCart({ ...product, quantity: qty }));
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleWishlist = async () => {
    if (!userInfo) { navigate('/login'); return; }
    await dispatch(toggleWishlistItem(product._id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!userInfo) { navigate('/login'); return; }
    setReviewLoading(true);
    try {
      await API.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Review submitted!');
      setComment('');
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setReviewLoading(false); }
  };

  if (loading) return <Loader />;
  if (!product) return null;

  const displayPrice = product.discountPrice || product.price;
  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const imgs = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1511381939415-e44015466834?w=600'];

  return (
    <div className="bg-choco-cream py-4">
      <div className="container">
        {/* BREADCRUMB */}
        <nav className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><button className="btn btn-link p-0 text-decoration-none" style={{ color: 'var(--choco-warm)' }} onClick={() => navigate('/products')}><FaArrowLeft className="me-1" />Shop</button></li>
            <li className="breadcrumb-item active">{product.name}</li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* IMAGES */}
          <div className="col-md-5">
            <div className="product-detail-img mb-3">
              <img src={imgs[mainImg]} alt={product.name} />
            </div>
            {imgs.length > 1 && (
              <div className="d-flex gap-2 flex-wrap">
                {imgs.map((img, i) => (
                  <img key={i} src={img} alt="" className={`thumb-img ${mainImg === i ? 'active' : ''}`} onClick={() => setMainImg(i)} />
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="col-md-7">
            <span className="badge" style={{ background: 'var(--choco-light)', color: 'var(--choco-warm)', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              {product.category?.name}
            </span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)', fontSize: 'clamp(1.5rem,3vw,2rem)' }}>{product.name}</h1>

            <div className="d-flex align-items-center gap-3 my-2">
              <StarRating rating={product.rating} />
              <span className="text-muted">({product.numReviews} reviews)</span>
            </div>

            <div className="my-3">
              {product.discountPrice ? (
                <div className="d-flex align-items-center gap-3">
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--choco-warm)' }}>₹{product.discountPrice}</span>
                  <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--choco-muted)' }}>₹{product.price}</span>
                  <span className="badge bg-danger">{discount}% OFF</span>
                </div>
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--choco-warm)' }}>₹{product.price}</span>
              )}
            </div>

            <p style={{ color: 'var(--choco-text)', lineHeight: 1.8 }}>{product.shortDescription || product.description}</p>

            {/* META */}
            <div className="row g-2 my-3">
              {product.weight && <div className="col-auto"><span className="badge" style={{ background: 'var(--choco-light)', color: 'var(--choco-warm)', padding: '0.5rem 1rem' }}>⚖️ {product.weight}</span></div>}
              <div className="col-auto">
                <span className={`badge ${product.stock > 0 ? '' : 'bg-danger'}`} style={product.stock > 0 ? { background: '#e6f4ea', color: '#2d7a3a', padding: '0.5rem 1rem' } : { padding: '0.5rem 1rem' }}>
                  {product.stock > 0 ? `✅ In Stock (${product.stock})` : '❌ Out of Stock'}
                </span>
              </div>
            </div>

            {/* QTY & CART */}
            <div className="d-flex align-items-center gap-3 my-4 flex-wrap">
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}><FaMinus size={12} /></button>
                <span style={{ width: 40, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}><FaPlus size={12} /></button>
              </div>
              <button className="btn btn-choco btn-lg flex-grow-1" onClick={handleAddToCart} disabled={product.stock === 0}>
                <FaShoppingCart className="me-2" /> Add to Cart
              </button>
              <button className={`btn btn-lg ${isWishlisted ? 'btn-danger' : 'btn-choco-outline'}`} onClick={handleWishlist} style={{ padding: '0.65rem 1rem' }}>
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            <button className="btn btn-gold w-100" onClick={() => { handleAddToCart(); navigate('/checkout'); }}>
              Buy Now →
            </button>
          </div>
        </div>

        {/* DESCRIPTION & REVIEWS */}
        <div className="mt-5">
          <ul className="nav nav-tabs" id="productTabs">
            <li className="nav-item"><button className="nav-link active" data-bs-toggle="tab" data-bs-target="#desc">Description</button></li>
            <li className="nav-item"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#reviews">Reviews ({product.numReviews})</button></li>
          </ul>
          <div className="tab-content bg-white p-4 rounded-bottom shadow-sm">
            <div className="tab-pane fade show active" id="desc">
              <p style={{ lineHeight: 1.9 }}>{product.description}</p>
              {product.ingredients && <><h6 className="mt-3 text-choco-dark">Ingredients</h6><p>{product.ingredients}</p></>}
            </div>
            <div className="tab-pane fade" id="reviews">
              {product.reviews.length === 0 ? (
                <p className="text-muted">No reviews yet. Be the first to review!</p>
              ) : (
                product.reviews.map(r => (
                  <div key={r._id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between">
                      <strong>{r.name}</strong>
                      <small className="text-muted">{new Date(r.createdAt).toLocaleDateString('en-IN')}</small>
                    </div>
                    <StarRating rating={r.rating} size={14} />
                    <p className="mt-1 mb-0">{r.comment}</p>
                  </div>
                ))
              )}
              {/* REVIEW FORM */}
              <div className="mt-4 p-3 bg-choco-cream rounded">
                <h6 className="text-choco-dark mb-3">Write a Review</h6>
                {userInfo ? (
                  <form onSubmit={handleReview}>
                    <div className="mb-3">
                      <label className="form-label">Rating</label>
                      <div className="d-flex gap-2">
                        {[1,2,3,4,5].map(n => (
                          <FaStar key={n} size={24} onClick={() => setRating(n)}
                            style={{ cursor: 'pointer', color: n <= rating ? 'var(--choco-gold)' : '#d4d4d4' }} />
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <textarea className="form-control" rows="3" placeholder="Share your experience..."
                        value={comment} onChange={e => setComment(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-choco" disabled={reviewLoading}>
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <p>Please <button className="btn btn-link p-0 text-choco" onClick={() => navigate('/login')}>login</button> to write a review.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
