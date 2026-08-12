import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../adminApi';

interface Category { id: number; name: string; slug: string; icon: string; }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [editForm, setEditForm]     = useState({ name: '', slug: '', icon: '' });
  const [showAdd, setShowAdd]       = useState(false);
  const [addForm, setAddForm]       = useState({ name: '', slug: '', icon: '' });

  const load = () => {
    adminApi.getCategories().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, slug: cat.slug, icon: cat.icon || '' });
  };

  const saveEdit = async (id: number) => {
    try {
      await adminApi.updateCategory(id, editForm);
      toast.success('Category updated');
      setEditingId(null);
      load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category? Ads in this category will lose their category.')) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success('Deleted');
      load();
    } catch { toast.error('Failed'); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.slug) { toast.error('Name and slug are required'); return; }
    try {
      await adminApi.createCategory(addForm);
      toast.success('Category created');
      setAddForm({ name: '', slug: '', icon: '' });
      setShowAdd(false);
      load();
    } catch { toast.error('Failed — slug might already exist'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 bg-sellora-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white border border-sellora-primary/30 rounded-xl p-4 flex gap-3 flex-wrap items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
            <input value={addForm.name}
              onChange={(e) => setAddForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
              placeholder="e.g. Electronics"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sellora-primary w-44"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Slug *</label>
            <input value={addForm.slug}
              onChange={(e) => setAddForm(f => ({ ...f, slug: e.target.value }))}
              placeholder="e.g. electronics"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sellora-primary w-44"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Icon (emoji)</label>
            <input value={addForm.icon}
              onChange={(e) => setAddForm(f => ({ ...f, icon: e.target.value }))}
              placeholder="📱"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sellora-primary w-20"
            />
          </div>
          <button type="submit" className="bg-sellora-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90">Create</button>
          <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50">Cancel</button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['#', 'Icon', 'Name', 'Slug', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400">{cat.id}</td>
                <td className="px-4 py-3 text-xl">{cat.icon || '🏷️'}</td>
                <td className="px-4 py-3">
                  {editingId === cat.id ? (
                    <input value={editForm.name} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                      className="border border-sellora-primary rounded px-2 py-1 text-sm w-36 focus:outline-none" />
                  ) : (
                    <span className="font-medium text-gray-800">{cat.name}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {editingId === cat.id ? (
                    <input value={editForm.slug} onChange={(e) => setEditForm(f => ({ ...f, slug: e.target.value }))}
                      className="border border-sellora-primary rounded px-2 py-1 text-sm w-36 focus:outline-none" />
                  ) : (
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{cat.slug}</code>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {editingId === cat.id ? (
                      <>
                        <button onClick={() => saveEdit(cat.id)} className="p-1.5 rounded text-green-600 hover:bg-green-50" title="Save"><Check size={15} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 rounded text-gray-400 hover:bg-gray-100" title="Cancel"><X size={15} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(cat)} className="p-1.5 rounded text-sellora-primary hover:bg-blue-50" title="Edit"><Pencil size={15} /></button>
                        <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded text-red-500 hover:bg-red-50" title="Delete"><Trash2 size={15} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
