import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Eye, Plus, Edit, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchMyAdsHandler, deleteAdHandler, updateAdHandler } from '../store/slices/adsSlice';
import PromoteModal from '../components/PromoteModal';

export default function MyAdsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { myAds, loading } = useSelector((state: RootState) => state.ads);
  const navigate = useNavigate();
  const [promoteAd, setPromoteAd] = useState<{ id: number; title: string } | null>(null);

  useEffect(() => {
    dispatch(fetchMyAdsHandler());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this ad? This cannot be undone.')) return;
    const result = await dispatch(deleteAdHandler(id));
    if (deleteAdHandler.fulfilled.match(result)) {
      toast.success('Ad deleted');
      dispatch(fetchMyAdsHandler());
    } else {
      toast.error('Failed to delete');
    }
  };

  const handleToggleStatus = async (ad: { id: number; status: string }) => {
    const newStatus = ad.status === 'active' ? 'sold' : 'active';
    const result = await dispatch(updateAdHandler({ id: ad.id, payload: { status: newStatus } }));
    if (updateAdHandler.fulfilled.match(result)) {
      toast.success(`Marked as ${newStatus}`);
    } else {
      toast.error('Failed to update');
    }
  };

  if (loading && myAds.length === 0) {
    return (
      <div className="bg-sellora-bg min-h-screen py-6">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-sellora-border rounded-lg h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-sellora-bg min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-sellora-text">My Ads</h1>
          <button
            onClick={() => navigate('/post-ad')}
            className="flex items-center gap-1.5 btn-gradient font-semibold px-4 py-2 rounded-xl text-sm"
          >
            <Plus size={16} /> Post New Ad
          </button>
        </div>

        {myAds.length === 0 ? (
          <div className="bg-white border border-sellora-border rounded-lg text-center py-20 px-4">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-lg font-semibold text-sellora-text">You haven't posted any ads yet</p>
            <p className="text-sellora-muted text-sm mt-1 mb-5">Start selling by posting your first ad</p>
            <Link
              to="/post-ad"
              className="inline-flex items-center gap-2 btn-gradient font-semibold px-6 py-2.5 rounded-xl"
            >
              <Plus size={16} /> Post an Ad
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myAds.map((ad) => (
              <div key={ad.id} className="bg-white border border-sellora-border rounded-lg p-4 flex gap-4 items-start hover:shadow-sm transition-shadow">
                {/* Image */}
                <div className="w-24 h-20 rounded overflow-hidden bg-gray-100 shrink-0 cursor-pointer" onClick={() => navigate(`/ads/${ad.id}`)}>
                  {ad.images?.[0] ? (
                    <img
                      src={ad.images[0].startsWith('http') ? ad.images[0] : `http://localhost:3000${ad.images[0]}`}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">📷</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/ads/${ad.id}`} className="font-semibold text-sellora-text hover:text-sellora-primary truncate block text-sm">
                    {ad.title}
                  </Link>
                  <p className="text-sellora-primary font-bold text-lg mt-0.5">
                    ₹{Number(ad.price).toLocaleString('en-IN')}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      ad.status === 'active' ? 'bg-green-100 text-green-700' :
                      ad.status === 'sold' ? 'bg-gray-100 text-gray-500' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {ad.status}
                    </span>
                    <span className="text-xs text-sellora-muted flex items-center gap-0.5">
                      <Eye size={11} /> {ad.views} views
                    </span>
                    {ad.city && <span className="text-xs text-sellora-muted">📍 {ad.city}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/edit-ad/${ad.id}`)}
                    className="text-xs border border-sellora-primary text-sellora-primary px-3 py-1.5 rounded hover:bg-sellora-primary hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Edit size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setPromoteAd({ id: ad.id, title: ad.title })}
                    className="text-xs border border-yellow-400 text-yellow-600 px-3 py-1.5 rounded hover:bg-yellow-50 transition-colors flex items-center gap-1"
                  >
                    <Zap size={12} /> Promote
                  </button>
                  <button
                    onClick={() => handleToggleStatus(ad)}
                    className="text-xs border border-gray-300 text-sellora-muted px-3 py-1.5 rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
                  >
                    {ad.status === 'active' ? 'Mark Sold' : 'Mark Active'}
                  </button>
                  <button
                    onClick={() => handleDelete(ad.id)}
                    className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded hover:bg-red-50 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {promoteAd && (
      <PromoteModal
        adId={promoteAd.id}
        adTitle={promoteAd.title}
        onClose={() => setPromoteAd(null)}
        onSuccess={() => dispatch(fetchMyAdsHandler())}
      />
    )}
  </>
  );
}
