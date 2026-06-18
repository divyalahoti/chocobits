import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';
import API from '../utils/api';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      params.set('limit', 12);
      const { data } = await API.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    const cats = async () => { const { data } = await API.get('/categories'); setCategories(data.categories); };
    cats();
  }, []);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 });
    setSearchParams({});
  };

  const FilterPanel = () => (
    <div className="bg-white rounded p-3 shadow-sm mb-4" style={{ border: '1px solid rgba(198,134,66,0.1)' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0" style={{ color: 'var(--choco-dark)', fontWeight: 700 }}>🔍 Filters</h6>
        <button className="btn btn-sm btn-link text-danger p-0" onClick={clearFilters}><FaTimes /> Clear</button>
      </div>

      <div className="mb-3">
        <label className="form-label small">Category</label>
        <select className="form-select form-select-sm" value={filters.category} onChange={e => updateFilter('category', e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label small">Price Range (₹)</label>
        <div className="d-flex gap-2">
          <input type="number" className="form-control form-control-sm" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} />
          <input type="number" className="form-control form-control-sm" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="form-label small">Sort By</label>
        <select className="form-select form-select-sm" value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="bg-choco-cream" style={{ minHeight: '80vh' }}>
      {/* HEADER */}
      <div style={{ background: 'var(--gradient-main)', padding: '3rem 0' }}>
        <div className="container">
          <h1 style={{ color: 'var(--choco-caramel)', fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem' }}>🍫 Our Chocolate Shop</h1>
          <p style={{ color: 'rgba(255,248,240,0.8)' }}>Discover {total} premium products</p>
        </div>
      </div>

      <div className="container py-4">
        {/* SEARCH BAR */}
        <div className="row mb-4">
          <div className="col-md-8 col-lg-6">
            <div className="input-group">
              <span className="input-group-text bg-white" style={{ borderColor: 'rgba(198,134,66,0.3)' }}><FaSearch color="var(--choco-warm)" /></span>
              <input
                type="text" className="form-control"
                placeholder="Search chocolates, cakes, gift boxes..."
                value={filters.keyword}
                onChange={e => updateFilter('keyword', e.target.value)}
                style={{ borderColor: 'rgba(198,134,66,0.3)' }}
              />
            </div>
          </div>
          <div className="col-md-4 col-lg-6 d-flex justify-content-md-end align-items-center mt-2 mt-md-0 gap-3">
            <button className="btn btn-choco-outline btn-sm d-md-none" onClick={() => setShowFilter(!showFilter)}>
              <FaFilter className="me-1" /> Filters
            </button>
            <small className="text-muted">{total} products found</small>
          </div>
        </div>

        <div className="row g-4">
          {/* FILTERS SIDEBAR */}
          <div className={`col-md-3 ${showFilter ? '' : 'd-none d-md-block'}`}>
            <FilterPanel />
          </div>

          {/* PRODUCTS GRID */}
          <div className="col-md-9">
            {loading ? <Loader /> : products.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: '4rem' }}>🍫</div>
                <h4 style={{ color: 'var(--choco-dark)' }}>No products found</h4>
                <p className="text-muted">Try adjusting your filters</p>
                <button className="btn btn-choco" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="row g-3">
                  {products.map(p => (
                    <div key={p._id} className="col-6 col-lg-4"><ProductCard product={p} /></div>
                  ))}
                </div>

                {/* PAGINATION */}
                {pages > 1 && (
                  <nav className="mt-4 d-flex justify-content-center">
                    <ul className="pagination">
                      {[...Array(pages)].map((_, i) => (
                        <li key={i} className={`page-item ${filters.page === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}>{i + 1}</button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
