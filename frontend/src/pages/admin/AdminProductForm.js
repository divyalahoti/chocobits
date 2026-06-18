import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import API from '../../utils/api';

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', shortDescription: '', price: '', discountPrice: '',
    category: '', stock: '', weight: '', ingredients: '', isFeatured: false, isActive: true,
    images: ['', ''],
    tags: '',
  });

  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await API.get('/categories');
      setCategories(data.categories);
    };
    fetchCats();

    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data } = await API.get(`/products/${id}`);
          const p = data.product;
          setForm({
            name: p.name, description: p.description, shortDescription: p.shortDescription || '',
            price: p.price, discountPrice: p.discountPrice || '',
            category: p.category?._id || '', stock: p.stock, weight: p.weight || '',
            ingredients: p.ingredients || '', isFeatured: p.isFeatured, isActive: p.isActive,
            images: p.images?.length ? [...p.images, '', ''].slice(0, 4) : ['', '', '', ''],
            tags: p.tags?.join(', ') || '',
          });
        } catch (e) { toast.error('Failed to load product'); }
        finally { setLoading(false); }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (i, val) => {
    const imgs = [...form.images];
    imgs[i] = val;
    setForm(prev => ({ ...prev, images: imgs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
        stock: Number(form.stock),
        images: form.images.filter(Boolean),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (isEdit) {
        await API.put(`/products/${id}`, payload);
        toast.success('Product updated!');
      } else {
        await API.post('/products', payload);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="admin-layout"><AdminSidebar /><div className="admin-content"><Loader /></div></div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--choco-dark)' }}>
            {isEdit ? '✏️ Edit Product' : '➕ Add Product'}
          </h2>
          <button className="btn btn-choco-outline" onClick={() => navigate('/admin/products')}>← Back</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* LEFT */}
            <div className="col-lg-8">
              <div className="bg-white rounded p-4 shadow-sm mb-4">
                <h5 style={{ color: 'var(--choco-dark)', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Basic Information</h5>
                <div className="mb-3">
                  <label className="form-label">Product Name *</label>
                  <input className="form-control" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Dark Truffle Collection" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Short Description</label>
                  <input className="form-control" name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief tagline (max 100 chars)" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Full Description *</label>
                  <textarea className="form-control" rows="4" name="description" value={form.description} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ingredients</label>
                  <textarea className="form-control" rows="2" name="ingredients" value={form.ingredients} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input className="form-control" name="tags" value={form.tags} onChange={handleChange} placeholder="dark, premium, truffle" />
                </div>
              </div>

              {/* IMAGES */}
              <div className="bg-white rounded p-4 shadow-sm">
                <h5 style={{ color: 'var(--choco-dark)', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Product Images</h5>
                {form.images.map((img, i) => (
                  <div key={i} className="mb-3">
                    <label className="form-label">Image URL {i + 1} {i === 0 ? '(Main) *' : '(Optional)'}</label>
                    <input className="form-control" value={img} onChange={e => handleImageChange(i, e.target.value)}
                      placeholder="https://images.unsplash.com/..." required={i === 0} />
                    {img && <img src={img} alt="" style={{ height: 60, marginTop: 8, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-lg-4">
              <div className="bg-white rounded p-4 shadow-sm mb-4">
                <h5 style={{ color: 'var(--choco-dark)', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Pricing & Stock</h5>
                <div className="mb-3">
                  <label className="form-label">Category *</label>
                  <select className="form-select" name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Original Price (₹) *</label>
                  <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} required min="0" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Sale Price (₹) <small className="text-muted">(optional)</small></label>
                  <input type="number" className="form-control" name="discountPrice" value={form.discountPrice} onChange={handleChange} min="0" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock Quantity *</label>
                  <input type="number" className="form-control" name="stock" value={form.stock} onChange={handleChange} required min="0" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Weight</label>
                  <input className="form-control" name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 200g, 1kg" />
                </div>
              </div>

              <div className="bg-white rounded p-4 shadow-sm mb-4">
                <h5 style={{ color: 'var(--choco-dark)', marginBottom: '1rem', fontFamily: 'Playfair Display, serif' }}>Settings</h5>
                <div className="form-check form-switch mb-3">
                  <input className="form-check-input" type="checkbox" id="featured" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="featured">⭐ Featured Product</label>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="active" name="isActive" checked={form.isActive} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="active">✅ Active (visible in store)</label>
                </div>
              </div>

              <button type="submit" className="btn btn-choco w-100 btn-lg" disabled={saving}>
                {saving ? '⏳ Saving...' : isEdit ? '💾 Update Product' : '✅ Create Product'}
              </button>
              <button type="button" className="btn btn-choco-outline w-100 mt-2" onClick={() => navigate('/admin/products')}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
