import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { Package, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [colorInput, setColorInput] = useState('');
  const [allColors, setAllColors] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [enableVariants, setEnableVariants] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const tabs = [
    { id: 'list', label: 'Products List' },
    { id: 'add', label: 'Add Product' },
    { id: 'variants', label: 'Variants' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'bulk', label: 'Bulk Actions' },
  ];
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    slug: '',
    description: '',
    price: '',
    sale_price: '',
    tax: '',
    discount: '',
    image_url: '',
    stock: '',
    low_stock_alert: '',
    stock_status: 'in_stock',
    category_id: '',
    brand_id: '',
    category: '',
    rating: '',
    reviews_count: '',
    weight: '',
    size: '',
    colors: '',
    fabric: '',
    fit: '',
    occasion: '',
    care_instruction: '',
    gender: '',
    age_group: '',
    season: '',
    delivery_charge: '',
    meta_title: '',
    meta_description: '',
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    loadProducts();
    loadCategoriesAndBrands();
    loadAttributes();
    loadColorsAndSizes();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await adminApi.products({ q: searchTerm });
      setProducts(data.products || []);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoriesAndBrands = async () => {
    try {
      const data = await adminApi.productCreateData();
      setCategories(data.categories || []);
      setBrands(data.brands || []);
    } catch (err) {
      console.error('Failed to load categories and brands:', err);
    }
  };

  const loadColorsAndSizes = async () => {
    try {
      const [colorsRes, sizesRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/admin/colors', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        }),
        fetch('http://127.0.0.1:8000/api/admin/sizes', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        }),
      ]);
      
      const colorsData = await colorsRes.json();
      const sizesData = await sizesRes.json();
      
      setAllColors(colorsData.colors || []);
      setAllSizes(sizesData.sizes || []);
    } catch (err) {
      console.error('Failed to load colors and sizes:', err);
    }
  };

  const loadAttributes = async () => {
    try {
      const response = await fetch('/api/admin/attributes');
      const data = await response.json();
      setAttributes(data.data?.data || []);
    } catch (err) {
      console.error('Failed to load attributes:', err);
    }
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !selectedColors.includes(colorInput.trim())) {
      setSelectedColors([...selectedColors, colorInput.trim()]);
      setColorInput('');
    }
  };

  const handleRemoveColor = (color) => {
    setSelectedColors(selectedColors.filter(c => c !== color));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await adminApi.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      slug: '',
      description: '',
      price: '',
      sale_price: '',
      tax: '',
      discount: '',
      image_url: '',
      stock: '',
      low_stock_alert: '',
      stock_status: 'in_stock',
      category_id: '',
      brand_id: '',
      category: '',
      rating: '',
      reviews_count: '',
      weight: '',
      size: '',
      colors: '',
      fabric: '',
      fit: '',
      occasion: '',
      care_instruction: '',
      gender: '',
      age_group: '',
      season: '',
      delivery_charge: '',
      meta_title: '',
      meta_description: '',
      is_active: true,
      is_featured: false,
    });
    setSelectedColors([]);
    setColorInput('');
    setImageFile(null);
    setImagePreview(null);
    setActiveTab('add');
  };

  const handleEditProduct = async (product) => {
    try {
      const data = await adminApi.productEditData(product.id);
      setCategories(data.categories || []);
      setBrands(data.brands || []);
      
      const productData = data.product || product;
      setEditingProduct(productData);
      setFormData({
        name: productData.name || '',
        sku: productData.sku || '',
        slug: productData.slug || '',
        description: productData.description || '',
        price: productData.price || '',
        sale_price: productData.sale_price || '',
        tax: productData.tax || '',
        discount: productData.discount || '',
        image_url: productData.image_url || '',
        stock: productData.stock || '',
        low_stock_alert: productData.low_stock_alert || '',
        stock_status: productData.stock_status || 'in_stock',
        category_id: productData.category_id || '',
        brand_id: productData.brand_id || '',
        category: productData.category || '',
        rating: productData.rating || '',
        reviews_count: productData.reviews_count || '',
        weight: productData.weight || '',
        size: productData.size || '',
        colors: productData.colors || '',
        fabric: productData.fabric || '',
        fit: productData.fit || '',
        occasion: productData.occasion || '',
        care_instruction: productData.care_instruction || '',
        gender: productData.gender || '',
        age_group: productData.age_group || '',
        season: productData.season || '',
        delivery_charge: productData.delivery_charge || '',
        meta_title: productData.meta_title || '',
        meta_description: productData.meta_description || '',
        is_active: productData.is_active ?? true,
        is_featured: productData.is_featured ?? false,
      });
      setImagePreview(productData.image_url || null);
      
      // Parse existing colors into array
      if (productData.colors) {
        setSelectedColors(productData.colors.split(',').map(c => c.trim()));
      } else {
        setSelectedColors([]);
      }
      
      setActiveTab('add');
    } catch (err) {
      console.error('Failed to load product for edit:', err);
      setError('Failed to load product data');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add image file if exists
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      // Add boolean fields explicitly
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');
      formDataToSend.append('is_featured', formData.is_featured ? '1' : '0');
      
      // Add colors as comma-separated string
      formDataToSend.append('colors', selectedColors.join(', '));

      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, formDataToSend);
      } else {
        await adminApi.createProduct(formDataToSend);
      }

      setActiveTab('list');
      setEditingProduct(null);
      setImageFile(null);
      setImagePreview(null);
      setError(null);
      loadProducts();
    } catch (err) {
      setError(editingProduct ? 'Failed to update product' : 'Failed to create product');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Auto-generate slug from name
    if (name === 'name' && value && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedProducts.length === 0) return;
    
    try {
      await adminApi.bulkUpdateProductStatus(selectedProducts, status);
      setSelectedProducts([]);
      loadProducts();
    } catch (err) {
      setError('Failed to update product status');
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Products</h1>
              <p className="text-sm text-slate-600">Manage your product inventory</p>
            </div>
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <span className="text-blue-900">{selectedProducts.length} products selected</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('active')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('inactive')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Deactivate
                </button>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-slate-600 border-b border-slate-200">
                    <th className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(products.map(p => p.id));
                          } else {
                            setSelectedProducts([]);
                          }
                        }}
                      />
                    </th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <p className="font-medium text-slate-900">{product.name}</p>
                            <p className="text-sm text-slate-600">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{product.category}</td>
                      <td className="p-4 text-sm font-medium text-slate-900">
                        ৳{(product.price || 0).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`text-sm font-medium ${
                          product.stock <= 10 ? 'text-red-600' : 'text-slate-900'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-slate-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {products.length === 0 && (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No products found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'add' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-sm text-slate-600">
                {editingProduct ? 'Update product information' : 'Create a new product'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('list')}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {submitting && (
              <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                {editingProduct ? 'Updating product...' : 'Creating product...'}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Section 1: Basic Information */}
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="SKU-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="product-slug"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                    <div className="bg-white">
                      <ReactQuill
                        value={formData.description}
                        onChange={(value) => setFormData({ ...formData, description: value })}
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'color': [] }, { 'background': [] }],
                            ['link'],
                            ['clean']
                          ]
                        }}
                        formats={[
                          'header',
                          'bold', 'italic', 'underline', 'strike',
                          'list', 'bullet',
                          'color', 'background',
                          'link'
                        ]}
                        className="h-32 mb-12"
                        placeholder="Enter product description"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing */}
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Regular Price (BDT) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="0.00"
                      required
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price (BDT)</label>
                    <input
                      type="number"
                      name="sale_price"
                      value={formData.sale_price}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tax (%)</label>
                    <input
                      type="number"
                      name="tax"
                      value={formData.tax}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1"> Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Stock & Inventory */}
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Stock & Inventory</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Alert</label>
                    <input
                      type="number"
                      name="low_stock_alert"
                      value={formData.low_stock_alert}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock Status</label>
                    <select
                      name="stock_status"
                      value={formData.stock_status}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Category & Brand */}
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Category & Brand</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                    <select
                      name="brand_id"
                      value={formData.brand_id}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select brand</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 5: Product Images */}
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Images</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-48 h-48 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Or Image URL</label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Product Attributes */}
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Attributes</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="S, M, L, XL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Colors</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={colorInput}
                          onChange={(e) => setColorInput(e.target.value)}
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="Enter color name"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                        />
                        <button
                          type="button"
                          onClick={handleAddColor}
                          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                        >
                          Add
                        </button>
                      </div>
                      {selectedColors.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedColors.map((color, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                            >
                              {color}
                              <button
                                type="button"
                                onClick={() => handleRemoveColor(color)}
                                className="text-slate-500 hover:text-red-600"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fabric</label>
                    <input
                      type="text"
                      name="fabric"
                      value={formData.fabric}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Cotton, Polyester"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fit</label>
                    <input
                      type="text"
                      name="fit"
                      value={formData.fit}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Regular, Slim"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Occasion</label>
                    <input
                      type="text"
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Casual, Formal"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Care Instructions</label>
                    <textarea
                      name="care_instruction"
                      value={formData.care_instruction}
                      onChange={handleFormChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Machine wash cold, tumble dry low"
                    />
                  </div>
                </div>
              </div>

              {/* Section 7: Demographics */}
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Demographics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select gender</option>
                      <option value="Boys">Boys</option>
                      <option value="Girls">Girls</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age Group</label>
                    <select
                      name="age_group"
                      value={formData.age_group}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select age group</option>
                      <option value="Toddler">Toddler</option>
                      <option value="Kids">Kids</option>
                      <option value="Teen">Teen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Season</label>
                    <select
                      name="season"
                      value={formData.season}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select season</option>
                      <option value="Summer">Summer</option>
                      <option value="Winter">Winter</option>
                      <option value="All Season">All Season</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 8: Shipping */}
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Shipping</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Charge (BDT)</label>
                  <input
                    type="number"
                    name="delivery_charge"
                    value={formData.delivery_charge}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Section 9: SEO Settings */}
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Product meta title"
                      maxLength={255}
                    />
                    <p className="text-xs text-slate-500 mt-1">{formData.meta_title?.length || 0}/255 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleFormChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Product meta description"
                    />
                  </div>
                </div>
              </div>

              {/* Section 10: Status & Visibility */}
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Status & Visibility</h3>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleFormChange}
                      className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleFormChange}
                      className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Featured Product</span>
                  </label>
                </div>
              </div>

              {/* Section 11: Rating (Read-only) */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Rating</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Rating (0-5)</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50"
                      placeholder="0"
                      step="0.1"
                      min="0"
                      max="5"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Reviews Count</label>
                    <input
                      type="number"
                      name="reviews_count"
                      value={formData.reviews_count}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50"
                      placeholder="0"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'variants' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Product Variants</h1>
              <p className="text-sm text-slate-600">Manage color and size variants for selected product</p>
            </div>
          </div>

          {!editingProduct ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">Please select a product to manage its variants</p>
              <button
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                Go to Products List
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="mb-6">
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={enableVariants}
                    onChange={(e) => setEnableVariants(e.target.checked)}
                    className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <span className="text-lg font-medium text-slate-900">Enable Variants</span>
                </label>
                <p className="text-sm text-slate-600">
                  When enabled, you can create multiple variants based on colors and sizes.
                </p>
              </div>

              {enableVariants && (
                <div className="space-y-6">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Existing Variants</h3>
                    {variants.length === 0 ? (
                      <p className="text-slate-500 text-center py-4">No variants created yet</p>
                    ) : (
                      <div className="space-y-3">
                        {variants.map((variant) => (
                          <div key={variant.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-4">
                              {variant.color && (
                                <div className="flex items-center gap-2">
                                  {variant.color.hex_code && (
                                    <div
                                      className="w-6 h-6 rounded border border-slate-200"
                                      style={{ backgroundColor: variant.color.hex_code }}
                                    />
                                  )}
                                  <span className="text-sm font-medium">{variant.color.name}</span>
                                </div>
                              )}
                              {variant.size && (
                                <span className="text-sm text-slate-600">Size: {variant.size.name}</span>
                              )}
                              <span className="text-sm text-slate-600">SKU: {variant.sku || 'N/A'}</span>
                              <span className="text-sm text-slate-600">Stock: {variant.stock}</span>
                              <span className="text-sm font-medium text-slate-900">Price: ৳{variant.price || formData.price}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                variant.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {variant.status ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Variant</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
                          <option value="">Select Color</option>
                          {allColors.map((color) => (
                            <option key={color.id} value={color.id}>{color.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
                          <option value="">Select Size</option>
                          {allSizes.map((size) => (
                            <option key={size.id} value={size.id}>{size.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="Variant SKU"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                        <input
                          type="number"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Price Override</label>
                        <input
                          type="number"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="Leave empty to use base price"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price</label>
                        <input
                          type="number"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="Optional"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">
                      Add Variant
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
