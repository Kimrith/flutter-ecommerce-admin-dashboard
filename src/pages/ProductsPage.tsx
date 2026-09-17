import React, { useEffect, useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  AlertTriangle,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { productsService } from '../services/products.service';
import { categoriesService } from '../services/categories.service';
import { Category, Product } from '../types';
import { Modal } from '../components/ui/Modal';
import { API_BASE_URL } from '../services/api';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productsService.getAll({
        search: search || undefined,
        categoryId: selectedCategory || undefined,
      });
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setDescription('');
    setPrice('');
    setStock('10');
    setSku('');
    setCategoryId(categories[0]?.id || '');
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSlug(product.slug);
    setDescription(product.description || '');
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setSku(product.sku || '');
    setCategoryId(product.categoryId);
    setSelectedFiles([]);
    setPreviewUrls(product.images || []);
    setIsModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug || name.toLowerCase().replace(/\s+/g, '-'));
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('sku', sku);
      formData.append('categoryId', categoryId);

      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      if (editingProduct) {
        await productsService.update(editingProduct.id, formData);
      } else {
        await productsService.create(formData);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product. Check backend API connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      setDeletingId(id);
      await productsService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  const productList = Array.isArray(products) ? products : [];
  const filteredProducts = productList.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Products Catalog</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your store items, pricing, inventory stock, and image assets.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-sky-500 w-full md:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const imageUrl =
                    product.images && product.images.length > 0
                      ? product.images[0].startsWith('http')
                        ? product.images[0]
                        : `${API_BASE_URL.replace('/api/v1', '')}${product.images[0]}`
                      : null;

                  return (
                    <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{product.name}</h4>
                            <p className="text-xs text-slate-400 line-clamp-1">
                              {product.description || 'No description provided'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        {product.sku || 'N/A'}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-sky-400 border border-slate-700 text-xs font-semibold">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-extrabold text-emerald-400">
                        ${product.price?.toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`font-semibold text-xs px-2.5 py-1 rounded-md ${
                            product.stock > 10
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : product.stock > 0
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {product.stock} in stock
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingProduct) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="iPhone 15 Pro Max"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="iphone-15-pro-max"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="999.99"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                SKU Code
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU-IPH-15"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category *
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product features, specifications..."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Image Uploader */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Product Images (Upload)
            </label>
            <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center hover:border-sky-500/50 transition-colors bg-slate-900/40">
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400">
                Drag and drop image files here or click to browse
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block mt-3 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Choose Files
              </label>
            </div>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto py-2">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 rounded-xl border border-slate-700 overflow-hidden bg-slate-900 shrink-0 relative"
                  >
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
