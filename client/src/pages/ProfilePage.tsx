import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Edit2, Save, X, Eye, Heart, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';
import { api as axiosInstance } from '../common/axiosInstance';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [city, setCity] = useState(user?.city || '');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ ads: 0, views: 0 });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    // Load full profile
    axiosInstance.get('/users/me').then((r) => {
      setName(r.data.name || '');
      setCity(r.data.city || '');
      setPhone(r.data.phone || '');
    }).catch(() => {});

    // Load my ads to get stats
    axiosInstance.get('/ads/my').then((r) => {
      const ads = Array.isArray(r.data) ? r.data : [];
      const totalViews = ads.reduce((sum: number, a: any) => sum + (a.views || 0), 0);
      setStats({ ads: ads.length, views: totalViews });
    }).catch(() => {});
  }, [user, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.patch('/users/me', { name, city, phone });
      toast.success('Profile updated!');
      setEditing(false);
      // Update local storage
      const stored = JSON.parse(localStorage.getItem('auth_user') || '{}');
      localStorage.setItem('auth_user', JSON.stringify({ ...stored, name, city }));
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-sellora-bg min-h-screen py-6">
      <div className="max-w-2xl mx-auto px-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white border border-sellora-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-sellora-primary flex items-center justify-center text-white font-bold text-2xl">
                {name?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-sellora-text">{name || user.name}</h1>
                <p className="text-sellora-muted text-sm">{user.email}</p>
                {city && <p className="text-sellora-muted text-sm mt-0.5">📍 {city}</p>}
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-sm border border-sellora-border rounded px-3 py-1.5 hover:border-sellora-primary hover:text-sellora-primary transition-colors"
              >
                <Edit2 size={14} /> Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-sellora-text mb-1">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sellora-text mb-1">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sellora-text mb-1">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 flex items-center justify-center gap-1 border border-sellora-border rounded py-2.5 text-sm text-sellora-text hover:bg-sellora-bg"
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-1 btn-gradient font-semibold rounded-xl py-2.5 text-sm disabled:opacity-60"
                >
                  <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="text-center p-3 bg-sellora-bg rounded-lg">
                <p className="text-2xl font-bold text-sellora-primary">{stats.ads}</p>
                <p className="text-xs text-sellora-muted mt-1">Active Ads</p>
              </div>
              <div className="text-center p-3 bg-sellora-bg rounded-lg">
                <p className="text-2xl font-bold text-sellora-primary">{stats.views}</p>
                <p className="text-xs text-sellora-muted mt-1">Total Views</p>
              </div>
              <div className="text-center p-3 bg-sellora-bg rounded-lg">
                <p className="text-2xl font-bold text-sellora-primary">0</p>
                <p className="text-xs text-sellora-muted mt-1">Saved Ads</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-sellora-border rounded-lg overflow-hidden">
          {[
            { icon: <User size={18} />, label: 'My Ads', sub: 'Manage your listings', to: '/my-ads' },
            { icon: <Heart size={18} />, label: 'Saved Ads', sub: 'Your favourites', to: '/favourites' },
            { icon: <MessageSquare size={18} />, label: 'Messages', sub: 'Chat with buyers/sellers', to: '/messages' },
            { icon: <Eye size={18} />, label: 'Recently Viewed', sub: 'Ads you visited', to: '/search' },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="flex items-center gap-4 p-4 border-b border-sellora-border last:border-0 hover:bg-sellora-bg transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-sellora-primary">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sellora-text text-sm">{item.label}</p>
                <p className="text-sellora-muted text-xs">{item.sub}</p>
              </div>
              <span className="text-sellora-muted">›</span>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => { dispatch(logout()); navigate('/'); toast.success('Logged out'); }}
          className="w-full bg-white border border-red-200 text-red-500 font-semibold py-3 rounded-lg hover:bg-red-50 transition-colors text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
