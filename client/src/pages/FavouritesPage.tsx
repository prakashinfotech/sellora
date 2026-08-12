import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchFavouritesHandler, toggleFavouriteHandler } from '../store/slices/favouritesSlice';
import AdCard from '../components/AdCard';

export default function FavouritesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { favourites, loading } = useSelector((state: RootState) => state.favourites);

  useEffect(() => {
    dispatch(fetchFavouritesHandler());
  }, [dispatch]);

  const handleToggle = async (adId: number) => {
    const result = await dispatch(toggleFavouriteHandler(adId));
    if (toggleFavouriteHandler.fulfilled.match(result)) {
      toast.success('Removed from saved ads');
    } else {
      toast.error('Failed to update saved ads');
    }
  };

  if (loading) {
    return (
      <div className="bg-sellora-bg min-h-screen py-6">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-sellora-border rounded overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-2.5 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sellora-bg min-h-screen py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Heart size={20} className="text-red-400 fill-red-400" />
          <h1 className="text-xl font-bold text-sellora-text">Saved Ads</h1>
          <span className="text-sellora-muted text-sm">({favourites.length})</span>
        </div>

        {favourites.length === 0 ? (
          <div className="bg-white border border-sellora-border rounded-lg text-center py-20">
            <Heart size={48} className="text-sellora-border mx-auto mb-4" />
            <p className="text-lg font-semibold text-sellora-text">No saved ads yet</p>
            <p className="text-sellora-muted text-sm mt-1 mb-5">Tap the heart icon on any ad to save it here</p>
            <Link to="/" className="inline-block btn-gradient font-semibold px-6 py-2.5 rounded-xl">
              Browse Ads
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {favourites.map((f: any) => (
              <AdCard
                key={f.id}
                ad={f.ad}
                isFavourited
                onToggleFavourite={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
