import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import API from '../../utils/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products?limit=100');
      setProducts(data.products);
    } catch (e) { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await API.delete(`/products/${id}`);
      toast.success(`"${name}" deleted`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (e) { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)' }}>🍫 Products</h2>
          <Link to="/admin/products/new" className="btn btn-choco"><FaPlus className="me-2" />Add Product</Link>
        </div>

        {/* SEARCH */}
        <div className="input-group mb-4" style={{ maxWidth: 400 }}>
          <span className="input-group-text bg-white"><FaSearch color="var(--choco-warm)" /></span>
          <input type="text" className="form-control" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? <Loader /> : (
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <span style={{ color: 'var(--choco-muted)', fontSize: '0.9rem' }}>{filtered.length} products</span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ background: 'var(--choco-light)' }}>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p._id}>
                      <td>
                        <img src={p.images?.[0]} alt={p.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--choco-dark)', fontSize: '0.9rem', maxWidth: 200 }}>{p.name}</div>
                      </td>
                      <td><span className="badge" style={{ background: 'var(--choco-light)', color: 'var(--choco-warm)' }}>{p.category?.name}</span></td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--choco-warm)' }}>₹{p.discountPrice || p.price}</div>
                        {p.discountPrice && <small style={{ textDecoration: 'line-through', color: 'var(--choco-muted)' }}>₹{p.price}</small>}
                      </td>
                      <td>
                        <span className={`badge ${p.stock > 10 ? '' : p.stock > 0 ? 'bg-warning' : 'bg-danger'}`}
                          style={p.stock > 10 ? { background: '#e6f4ea', color: '#2d7a3a' } : {}}>
                          {p.stock}
                        </span>
                      </td>
                      <td>{p.isFeatured ? <span className="badge" style={{ background: '#fff3cd', color: '#856404' }}>✨ Yes</span> : <span className="badge bg-secondary">No</span>}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link to={`/admin/products/${p._id}/edit`} className="btn btn-sm btn-choco-outline"><FaEdit /></Link>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id, p.name)} disabled={deleting === p._id}>
                            {deleting === p._id ? '...' : <FaTrash />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
