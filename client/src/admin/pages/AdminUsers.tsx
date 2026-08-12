import { useEffect, useState } from 'react';
import { Search, ShieldCheck, Ban, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../adminApi';

export default function AdminUsers() {
  const [data, setData]     = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);

  const load = (p = page, s = search) => {
    setLoading(true);
    adminApi.getUsers(p, s || undefined)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1, ''); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load(1, search);
  };

  const handleBan = async (id: number, currentRole: string) => {
    const action = currentRole === 'banned' ? 'Unban' : 'Ban';
    if (!confirm(`${action} this user?`)) return;
    try {
      const res = await adminApi.banUser(id);
      toast.success(`User ${res.role === 'banned' ? 'banned' : 'unbanned'}`);
      load();
    } catch { toast.error('Failed'); }
  };

  const handleMakeAdmin = async (id: number) => {
    if (!confirm('Make this user an admin?')) return;
    try {
      await adminApi.makeAdmin(id);
      toast.success('User is now admin');
      load();
    } catch { toast.error('Failed'); }
  };

  const roleBadge = (role: string) => {
    if (role === 'admin')  return 'bg-purple-100 text-purple-700';
    if (role === 'banned') return 'bg-red-100 text-red-500';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Users</h1>
        <span className="text-sm text-gray-500">{data?.total ?? '...'} total</span>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sellora-primary"
        />
        <button type="submit" className="bg-sellora-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
          <Search size={16} />
        </button>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['#', 'Name', 'Email', 'City', 'Role', 'Joined', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : data?.data.map((u: any) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400">{u.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-sellora-primary flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3 text-gray-500">{u.city || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge(u.role)}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(u.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {u.role !== 'admin' && (
                      <>
                        <button
                          onClick={() => handleBan(u.id, u.role)}
                          className={`p-1.5 rounded transition-colors ${
                            u.role === 'banned'
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                          title={u.role === 'banned' ? 'Unban' : 'Ban'}
                        >
                          {u.role === 'banned' ? <ShieldOff size={15} /> : <Ban size={15} />}
                        </button>
                        <button
                          onClick={() => handleMakeAdmin(u.id)}
                          className="p-1.5 rounded text-purple-500 hover:bg-purple-50 transition-colors"
                          title="Make Admin"
                        >
                          <ShieldCheck size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.total > data.limit && (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => { setPage(p => p - 1); load(page - 1); }}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-500">Page {page} of {Math.ceil(data.total / data.limit)}</span>
          <button
            onClick={() => { setPage(p => p + 1); load(page + 1); }}
            disabled={page >= Math.ceil(data.total / data.limit)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
