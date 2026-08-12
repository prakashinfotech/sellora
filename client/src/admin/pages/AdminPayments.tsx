import { useEffect, useState } from 'react';
import { adminApi } from '../adminApi';

export default function AdminPayments() {
  const [data, setData]     = useState<any>(null);
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);

  const load = (p = page) => {
    setLoading(true);
    adminApi.getPayments(p).then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(1); }, []);

  const statusColor = (s: string) =>
    s === 'paid'    ? 'bg-green-100 text-green-700'  :
    s === 'created' ? 'bg-yellow-100 text-yellow-700' :
    'bg-gray-100 text-gray-500';

  const totalRevenue = data?.data
    .filter((p: any) => p.status === 'paid')
    .reduce((sum: number, p: any) => sum + p.amount, 0) ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Payments</h1>
        <div className="text-right">
          <p className="text-xs text-gray-500">Page revenue</p>
          <p className="text-lg font-black text-green-600">₹{Math.round(totalRevenue / 100).toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['#', 'User', 'Ad', 'Plan', 'Amount', 'Status', 'Razorpay Order', 'Date'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : data?.data.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400">{p.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{p.user?.name || '—'}</p>
                  <p className="text-gray-400 text-xs">{p.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{p.ad?.title || '—'}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{p.plan}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">₹{Math.round(p.amount / 100)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(p.status)}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs font-mono truncate max-w-[140px]">{p.razorpayOrderId}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(p.createdAt).toLocaleDateString('en-IN')}
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
