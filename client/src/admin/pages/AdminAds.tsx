import { useEffect, useState } from 'react';
import { Search, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminApi } from '../adminApi';

const STATUS_OPTIONS = ['', 'active', 'sold', 'inactive'];

export default function AdminAds() {
  const navigate = useNavigate();
  const [data, setData]       = useState<any>(null);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);

  const load = (p = page, s = search, st = status) => {
    setLoading(true);
    adminApi.getAds(p, s || undefined, st || undefined)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1, '', ''); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load(1, search, status);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Permanently delete this ad?')) return;
    try {
      await adminApi.deleteAd(id);
      toast.success('Ad deleted');
      load();
    } catch { toast.error('Failed'); }
  };

  const handleStatus = async (id: number, newStatus: string) => {
    try {
      await adminApi.updateAdStatus(id, newStatus);
      toast.success(`Marked as ${newStatus}`);
      load();
    } catch { toast.error('Failed'); }
  };

  const statusColor = (s: string) => {
    if (s === 'active')   return 'bg-green-100 text-green-700';
    if (s === 'sold')     return 'bg-gray-100 text-gray-500';
    if (s === 'inactive') return 'bg-yellow-100 text-yellow-700';
    return '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Ads</h1>
        <span className="text-sm text-gray-500">{data?.total ?? '...'} total</span>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sellora-primary w-64"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); load(1, search, e.target.value); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sellora-primary"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s || 'All Status'}</option>
          ))}
        </select>
        <button type="submit" className="bg-sellora-primary text-white px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-1">
          <Search size={15} /> Search
        </button>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['#', 'Ad', 'Seller', 'Price', 'City', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : data?.data.map((ad: any) => (
              <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400">{ad.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded bg-gray-100 shrink-0 overflow-hidden">
                      {ad.images?.[0] && (
                        <img src={ad.images[0].startsWith('http') ? ad.images[0] : `http://localhost:3000${ad.images[0]}`}
                          className="w-full h-full object-cover" alt="" />
                      )}
                    </div>
                    <span className="font-medium text-gray-800 max-w-[200px] truncate">{ad.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{ad.user?.name || '—'}</td>
                <td className="px-4 py-3 font-semibold text-sellora-primary">₹{Number(ad.price).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-gray-500">{ad.city || '—'}</td>
                <td className="px-4 py-3">
                  <select
                    value={ad.status}
                    onChange={(e) => handleStatus(ad.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColor(ad.status)}`}
                  >
                    {['active', 'sold', 'inactive'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/ads/${ad.id}`)}
                      className="p-1.5 rounded text-sellora-primary hover:bg-blue-50 transition-colors"
                      title="View"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.total > data.limit && (
        <div className="flex items-center gap-2 justify-end">
          <button onClick={() => { setPage(p => p - 1); load(page - 1); }} disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
          <span className="text-sm text-gray-500">Page {page} of {Math.ceil(data.total / data.limit)}</span>
          <button onClick={() => { setPage(p => p + 1); load(page + 1); }} disabled={page >= Math.ceil(data.total / data.limit)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
        </div>
      )}
    </div>
  );
}
