import { useState, useEffect } from 'react';
import { Package, Search, AlertTriangle, TrendingUp, TrendingDown, Edit } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'low-stock', label: 'Low Stock' },
    { id: 'out-of-stock', label: 'Out of Stock' },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = filteredProducts.filter(p => p.stock > 0 && p.stock <= 10);
  const outOfStockProducts = filteredProducts.filter(p => p.stock === 0);

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'bg-red-100 text-red-700', label: 'Out of Stock' };
    if (stock <= 10) return { color: 'bg-amber-100 text-amber-700', label: 'Low Stock' };
    return { color: 'bg-green-100 text-green-700', label: 'In Stock' };
  };

  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((p.stock || 0) * (p.price || 0)), 0);

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
            <p className="text-sm text-slate-600">Manage product stock levels</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Products</p>
                    <p className="text-2xl font-bold text-slate-900">{products.length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Stock</p>
                    <p className="text-2xl font-bold text-slate-900">{totalStock}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Low Stock</p>
                    <p className="text-2xl font-bold text-slate-900">{lowStockProducts.length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-slate-900">{outOfStockProducts.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">All Products</h2>
              </div>
              {loading ? (
                <div className="p-8 text-center text-sm font-semibold text-slate-500">
                  Loading...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-sm font-semibold text-slate-500">
                  No products found
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredProducts.slice(0, 20).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-600">SKU: {product.sku || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">{product.stock || 0}</p>
                          <p className="text-xs text-slate-500">Stock</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(product.stock).color}`}>
                          {getStockStatus(product.stock).label}
                        </span>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'low-stock' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Low Stock Products (≤10)</h2>
              </div>
              {loading ? (
                <div className="p-8 text-center text-sm font-semibold text-slate-500">
                  Loading...
                </div>
              ) : lowStockProducts.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <p className="text-slate-500">No low stock products</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-600">SKU: {product.sku || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-amber-600">{product.stock || 0}</p>
                          <p className="text-xs text-slate-500">Stock</p>
                        </div>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'out-of-stock' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Out of Stock Products</h2>
              </div>
              {loading ? (
                <div className="p-8 text-center text-sm font-semibold text-slate-500">
                  Loading...
                </div>
              ) : outOfStockProducts.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <p className="text-slate-500">No out of stock products</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {outOfStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-600">SKU: {product.sku || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-red-600">0</p>
                          <p className="text-xs text-slate-500">Stock</p>
                        </div>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
