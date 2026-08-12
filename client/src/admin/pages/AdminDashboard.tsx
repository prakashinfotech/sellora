import { useEffect, useState } from 'react';
import { Users, ShoppingBag, CreditCard, TrendingUp } from 'lucide-react';
import { adminApi } from '../adminApi';

interface Stats {
  totalUsers: number;
  totalAds: number;
  activeAds: number;
  totalPayments: number;
  revenue: number;
  recentAds: any[];
  recentUsers: any[];
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-800">{value?.toLocaleString('en-IN')}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl h-24 animate-pulse border border-gray-200" />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users"    value={stats?.totalUsers}    icon={Users}       color="bg-blue-500" />
        <StatCard label="Total Ads"      value={stats?.totalAds}      icon={ShoppingBag} color="bg-sellora-primary" />
        <StatCard label="Active Ads"     value={stats?.activeAds}     icon={TrendingUp}  color="bg-green-500" />
        <StatCard label="Revenue (₹)"   value={Math.round((stats?.revenue || 0) / 100)} icon={CreditCard} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Ads */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-700 mb-4">Recent Ads</h2>
          <div className="space-y-3">
            {stats?.recentAds.map((ad) => (
              <div key={ad.id} className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded bg-gray-100 shrink-0 overflow-hidden">
                  {ad.images?.[0] && (
                    <img src={ad.images[0].startsWith('http') ? ad.images[0] : `http://localhost:3000${ad.images[0]}`}
                      className="w-full h-full object-cover" alt="" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{ad.title}</p>
                  <p className="text-gray-400 text-xs">{ad.user?.name} · ₹{Number(ad.price).toLocaleString('en-IN')}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  ad.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>{ad.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-700 mb-4">Recent Users</h2>
          <div className="space-y-3">
            {stats?.recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-full bg-sellora-primary flex items-center justify-center text-white font-bold shrink-0">
                  {u.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{u.name}</p>
                  <p className="text-gray-400 text-xs truncate">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  u.role === 'admin'  ? 'bg-purple-100 text-purple-700' :
                  u.role === 'banned' ? 'bg-red-100 text-red-500' :
                  'bg-green-100 text-green-700'
                }`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
