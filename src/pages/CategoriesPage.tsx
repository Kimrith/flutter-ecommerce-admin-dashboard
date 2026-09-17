import React, { useEffect, useState } from 'react';
import { FolderTree, Plus, Edit2, Trash2, Upload, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { categoriesService } from '../services/categories.service';
import { Category } from '../types';
import { Modal } from '../components/ui/Modal';
import { API_BASE_URL } from '../services/api';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoriesService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoryList = Array.isArray(categories) ? categories : [];

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setSelectedFile(null);
    setPreviewUrl(cat.image || null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (editingCategory) {
        await categoriesService.update(editingCategory.id, formData);
      } else {
        await categoriesService.create(formData);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
      alert('Failed to save category. Check backend API connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoriesService.delete(id);
      setCategories((prev) => (Array.isArray(prev) ? prev.filter((c) => c.id !== id) : []));
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Product Categories</h1>
          <p className="text-slate-400 text-sm mt-1">
            Organize products into structured store categories.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category Cards Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading categories...</div>
      ) : categoryList.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 text-slate-500">
          No categories found. Click "Add New Category" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryList.map((category) => {
            const imageUrl = category.image
              ? category.image.startsWith('http')
                ? category.image
                : `${API_BASE_URL.replace('/api/v1', '')}${category.image}`
              : null;

            return (
              <div
                key={category.id}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <FolderTree className="w-6 h-6 text-sky-400" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(category)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">{category.name}</h3>
                  <span className="inline-block mt-1 text-xs font-mono text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                    /{category.slug}
                  </span>

                  <p className="text-xs text-slate-400 mt-3 line-clamp-2">
                    {category.description || 'No description added for this category.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                  <span className="text-slate-400">ID: {category.id.slice(0, 8)}...</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingCategory) {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }
              }}
              placeholder="Electronics"
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
              placeholder="electronics"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category overview..."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Category Image */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category Image
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-sky-400 hover:file:bg-slate-700 cursor-pointer"
              />
              {previewUrl && (
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
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
              {isSaving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
