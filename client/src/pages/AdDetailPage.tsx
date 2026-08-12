import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Eye, Phone, Heart, Share2, Flag, ChevronLeft, ChevronRight, ArrowLeft, MessageSquare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { RootState, AppDispatch } from '../store';
import { fetchAdByIdHandler, fetchAllAdsHandler } from '../store/slices/adsSlice';
import { toggleFavouriteHandler, fetchFavouritesHandler } from '../store/slices/favouritesSlice';
import AdCard from '../components/AdCard';
import { sendMessage } from '../services/messages.service';

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AdDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentAd, ads, loading } = useSelector((state: RootState) => state.ads);
  const { favourites } = useSelector((state: RootState) => state.favourites);
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeImage, setActiveImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const isFav = favourites.some((f: any) => f.adId === currentAd?.id || f.ad?.id === currentAd?.id);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdByIdHandler(Number(id)));
      dispatch(fetchAllAdsHandler({ limit: 8 }));
    }
    if (user) dispatch(fetchFavouritesHandler());
    setActiveImage(0);
    window.scrollTo(0, 0);
  }, [dispatch, id, user]);

  const handleToggleFav = async () => {
    if (!user) { navigate('/login'); return; }
    await dispatch(toggleFavouriteHandler(currentAd!.id));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleSendMessage = async () => {
    if (!user) { navigate('/login'); return; }
    if (!msgText.trim()) return;
    setSendingMsg(true);
    try {
      await sendMessage({ receiverId: currentAd!.user!.id, adId: currentAd!.id, message: msgText });
      toast.success('Message sent!');
      setShowMsgModal(false);
      setMsgText('');
      navigate('/messages');
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSendingMsg(false);
    }
  };

  const prevImg = () => setActiveImage((i) => Math.max(0, i - 1));
  const nextImg = () => setActiveImage((i) => Math.min((currentAd?.images?.length || 1) - 1, i + 1));

  if (loading && !currentAd) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6 animate-pulse">
          <div className="md:col-span-2 space-y-4">
            <div className="aspect-video bg-gray-200 rounded-lg" />
            <div className="bg-white rounded-lg h-40" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg h-48" />
            <div className="bg-white rounded-lg h-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentAd) return (
    <div className="text-center py-20 text-sellora-muted">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-lg font-semibold">Ad not found</p>
      <button onClick={() => navigate('/')} className="mt-4 text-sellora-primary font-semibold hover:underline">Go Home</button>
    </div>
  );

  const similarAds = ads.filter((a) => a.id !== currentAd.id && a.category?.id === currentAd.category?.id).slice(0, 4);

  return (
    <div className="bg-sellora-bg min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sellora-muted text-sm mb-4 hover:text-sellora-primary transition-colors">
          <ArrowLeft size={16} /> Back to results
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Images + Description */}
          <div className="md:col-span-2 space-y-4">
            {/* Image Gallery */}
            <div className="bg-white border border-sellora-border rounded-lg overflow-hidden">
              <div className="relative aspect-video bg-gray-100 select-none">
                {currentAd.images?.length > 0 ? (
                  <img
                    src={currentAd.images[activeImage].startsWith('http')
                      ? currentAd.images[activeImage]
                      : `${currentAd.images[activeImage].startsWith('http') ? currentAd.images[activeImage] : currentAd.images[activeImage]}`}
                    alt={currentAd.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200 text-8xl">📷</div>
                )}

                {currentAd.images?.length > 1 && (
                  <>
                    <button onClick={prevImg} disabled={activeImage === 0} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 disabled:opacity-30 hover:bg-black/70">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextImg} disabled={activeImage === currentAd.images.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 disabled:opacity-30 hover:bg-black/70">
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-2 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                      {activeImage + 1} / {currentAd.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {currentAd.images?.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {currentAd.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 rounded shrink-0 overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-sellora-primary' : 'border-transparent'}`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price + Title */}
            <div className="bg-white border border-sellora-border rounded-lg p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold text-sellora-text">
                    ₹{Number(currentAd.price).toLocaleString('en-IN')}
                  </p>
                  <h1 className="text-xl font-semibold text-sellora-text mt-1">{currentAd.title}</h1>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={handleToggleFav} className="p-2 border border-sellora-border rounded-full hover:border-red-300 transition-colors">
                    <Heart size={18} fill={isFav ? '#ff6b6b' : 'none'} stroke={isFav ? '#ff6b6b' : '#666'} />
                  </button>
                  <button onClick={handleShare} className="p-2 border border-sellora-border rounded-full hover:border-sellora-primary transition-colors">
                    <Share2 size={18} className="text-sellora-muted" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-sellora-muted">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {[currentAd.city, currentAd.state].filter(Boolean).join(', ')}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} /> {currentAd.views} views
                </span>
                <span>{formatDate(currentAd.createdAt)}</span>
              </div>

              {currentAd.category && (
                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/search?categorySlug=${currentAd.category.slug}`}
                    className="text-xs bg-blue-50 text-sellora-primary px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {currentAd.category.name}
                  </Link>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white border border-sellora-border rounded-lg p-5">
              <h2 className="font-bold text-sellora-text mb-3">Description</h2>
              <p className="text-sellora-text text-sm whitespace-pre-line leading-relaxed">
                {currentAd.description || 'No description provided.'}
              </p>
            </div>

            {/* Report */}
            <button className="flex items-center gap-2 text-sm text-sellora-muted hover:text-red-500 transition-colors">
              <Flag size={14} /> Report this ad
            </button>
          </div>

          {/* Right: Seller + Actions */}
          <aside className="space-y-4">
            {/* Seller Card */}
            <div className="bg-white border border-sellora-border rounded-lg p-5">
              <h2 className="font-bold text-sellora-text mb-4">Seller details</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-sellora-primary flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {currentAd.user?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-semibold text-sellora-text">{currentAd.user?.name}</p>
                  <p className="text-sellora-muted text-sm">{currentAd.user?.city || 'Location not set'}</p>
                </div>
              </div>

              {/* Phone button */}
              <button
                onClick={() => { if (!user) { navigate('/login'); return; } setShowPhone(true); }}
                className="w-full border-2 border-sellora-primary text-sellora-primary font-bold py-2.5 rounded text-sm hover:bg-sellora-primary hover:text-white transition-colors flex items-center justify-center gap-2 mb-3"
              >
                <Phone size={16} />
                {showPhone ? (currentAd.user?.phone || 'Phone not provided') : 'Show Phone Number'}
              </button>

              {/* Chat button */}
              {user?.id !== currentAd.user?.id && (
                <button
                  onClick={() => { if (!user) { navigate('/login'); return; } setShowMsgModal(true); }}
                  className="w-full btn-gradient font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  Chat with Seller
                </button>
              )}
            </div>

            {/* Posted date & category */}
            <div className="bg-white border border-sellora-border rounded-lg p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-sellora-muted">Posted</span>
                <span className="text-sellora-text font-medium">{formatDate(currentAd.createdAt)}</span>
              </div>
              {currentAd.category && (
                <div className="flex justify-between">
                  <span className="text-sellora-muted">Category</span>
                  <span className="text-sellora-text font-medium">{currentAd.category.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sellora-muted">Ad ID</span>
                <span className="text-sellora-text font-medium">#{currentAd.id}</span>
              </div>
            </div>

            {/* Safety tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-800 text-sm mb-2">Safety Tips</h3>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Meet in a safe, public place</li>
                <li>• Don't pay before inspecting the item</li>
                <li>• Beware of unrealistic prices</li>
                <li>• Never share personal financial info</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Similar Ads */}
        {similarAds.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-sellora-text">Similar Ads</h2>
              <Link
                to={`/search?categorySlug=${currentAd.category?.slug}`}
                className="text-sm text-sellora-primary font-semibold hover:underline"
              >
                View more
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {similarAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
            </div>
          </section>
        )}
      </div>

      {/* Message Modal */}
      {showMsgModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-sellora-text text-lg mb-1">Message the Seller</h3>
            <p className="text-sellora-muted text-sm mb-4">About: {currentAd.title}</p>
            <div className="space-y-2 mb-4">
              {['Is this available?', 'What is the lowest price?', 'Can I see it today?'].map((quick) => (
                <button
                  key={quick}
                  onClick={() => setMsgText(quick)}
                  className="w-full text-left text-sm border border-sellora-border rounded px-3 py-2 hover:border-sellora-primary hover:bg-blue-50 transition-colors"
                >
                  {quick}
                </button>
              ))}
            </div>
            <textarea
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Type your message..."
              rows={3}
              className="w-full border border-sellora-border rounded px-3 py-2 text-sm focus:outline-none focus:border-sellora-primary resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowMsgModal(false)}
                className="flex-1 border border-sellora-border text-sellora-text py-2 rounded text-sm hover:bg-sellora-bg"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!msgText.trim() || sendingMsg}
                className="flex-1 btn-gradient font-semibold py-2 rounded-xl text-sm disabled:opacity-60"
              >
                {sendingMsg ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
