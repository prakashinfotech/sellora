import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChevronLeft, ChevronRight, ArrowRight, Car, Bike, Smartphone, Laptop, Sofa,
  Shirt, PawPrint, Building2, Briefcase, Wrench, Trophy, BookOpen, Target,
  Flame, LucideIcon,
} from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { fetchAllAdsHandler } from '../store/slices/adsSlice';
import AdCard from '../components/AdCard';

/** Category slugs and labels are unchanged — only the icon presentation is new. */
const CATEGORIES: { name: string; slug: string; Icon: LucideIcon }[] = [
  { name: 'Cars', slug: 'cars', Icon: Car },
  { name: 'Motorcycles', slug: 'motorcycles', Icon: Bike },
  { name: 'Mobiles', slug: 'mobile-phones', Icon: Smartphone },
  { name: 'Electronics', slug: 'electronics', Icon: Laptop },
  { name: 'Furniture', slug: 'furniture', Icon: Sofa },
  { name: 'Fashion', slug: 'fashion', Icon: Shirt },
  { name: 'Pets', slug: 'pets', Icon: PawPrint },
  { name: 'Real Estate', slug: 'real-estate', Icon: Building2 },
  { name: 'Jobs', slug: 'jobs', Icon: Briefcase },
  { name: 'Services', slug: 'services', Icon: Wrench },
  { name: 'Sports', slug: 'sports', Icon: Trophy },
  { name: 'Books', slug: 'books', Icon: BookOpen },
];

const PROMO_CARDS: { title: string; sub: string; Icon: LucideIcon; gradient: string; to: string }[] = [
  {
    title: 'Find Your Perfect Match',
    sub: 'Explore thousands of verified listings',
    Icon: Target,
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
    to: '/search',
  },
  {
    title: 'Latest & Trending',
    sub: 'Discover the newest deals near you',
    Icon: Flame,
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
    to: '/search?categorySlug=mobile-phones',
  },
  {
    title: 'Home & Lifestyle',
    sub: 'Everything you need for your space',
    Icon: Sofa,
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
    to: '/search?categorySlug=furniture',
  },
];

/** Width one card occupies at the widest breakpoint, used to centre short rows. */
const CARD_WIDTH = 236;
const GRID_GAP = 20;

/** Column classes per row size — written out in full so Tailwind can see them. */
const GRID_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
};

function SkeletonCard() {
  return (
    <div className="bg-white border border-sellora-border rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-sellora-primary-soft" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-4 bg-sellora-primary-soft rounded w-2/3" />
        <div className="h-3 bg-sellora-primary-soft rounded w-full" />
        <div className="h-3 bg-sellora-primary-soft rounded w-1/2" />
      </div>
    </div>
  );
}

/**
 * Responsive listing grid — up to 5 cards per row on large desktops.
 * When a section has fewer items than the row can hold, the grid is capped to
 * the natural width of those items and centred, so cards never stretch and no
 * placeholder content is invented.
 */
function ListingGrid({ count, maxCols = 5, children }: { count: number; maxCols?: number; children: React.ReactNode }) {
  const cols = Math.max(1, Math.min(count, maxCols));
  const capped = cols < maxCols;

  return (
    <div
      className={`grid gap-3 sm:gap-5 ${GRID_COLS[cols]} ${capped ? 'mx-auto' : ''}`}
      style={capped ? { maxWidth: cols * CARD_WIDTH + (cols - 1) * GRID_GAP } : undefined}
    >
      {children}
    </div>
  );
}

/** Section heading with a "View all →" action, shared by every home section. */
function SectionHeader({ title, onViewAll }: { title: string; onViewAll: () => void }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-5">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-sellora-text">{title}</h2>
      <button
        onClick={onViewAll}
        className="group shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-sellora-primary hover:text-sellora-secondary transition-colors"
      >
        View all
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { ads, loading } = useSelector((state: RootState) => state.ads);
  const navigate = useNavigate();
  const catScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchAllAdsHandler({ limit: 24 }));
  }, [dispatch]);

  const scrollCats = (dir: 'left' | 'right') => {
    if (catScrollRef.current) {
      catScrollRef.current.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });
    }
  };

  // Split ads into the home page's sections
  const freshAds = ads.slice(0, 20);
  const carAds = ads.filter((a) => a.category?.slug === 'cars').slice(0, 4);
  const mobileAds = ads.filter((a) => a.category?.slug === 'mobile-phones').slice(0, 4);

  return (
    <div className="bg-sellora-bg min-h-screen">
      {/* Promotional cards */}
      <section className="bg-sellora-hero border-b border-sellora-border">
        <div className="max-w-[1200px] mx-auto px-4 py-7 sm:py-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {PROMO_CARDS.map(({ title, sub, Icon, gradient, to }) => (
              <button
                key={title}
                onClick={() => navigate(to)}
                style={{ backgroundImage: gradient }}
                className="group relative overflow-hidden rounded-3xl p-5 sm:p-6 text-left shadow-sellora hover:shadow-sellora-lg transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sellora-primary focus-visible:ring-offset-2"
              >
                {/* soft light bloom */}
                <span className="pointer-events-none absolute -right-10 -top-12 w-36 h-36 rounded-full bg-white/15 blur-2xl" />
                <div className="relative flex items-center justify-between gap-4">
                  <div className="text-white min-w-0">
                    <p className="font-bold text-lg sm:text-xl leading-snug tracking-tight">{title}</p>
                    <p className="text-sm text-white/85 mt-1.5 leading-relaxed">{sub}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                      Explore
                      <ArrowRight size={13} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                  <span className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 ring-1 ring-inset ring-white/25 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <Icon size={28} strokeWidth={1.75} className="text-white" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-sellora-border">
        <div className="max-w-[1200px] mx-auto px-4 py-6 relative">
          {/* soft fades so items scroll out of view instead of colliding with the arrows */}
          <span className="hidden sm:block pointer-events-none absolute left-4 top-0 bottom-0 w-14 z-[5] bg-gradient-to-r from-white via-white to-transparent" />
          <span className="hidden sm:block pointer-events-none absolute right-4 top-0 bottom-0 w-14 z-[5] bg-gradient-to-l from-white via-white to-transparent" />

          <button
            onClick={() => scrollCats('left')}
            aria-label="Scroll categories left"
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center bg-white rounded-full border border-sellora-border shadow-sellora-sm text-sellora-text hover:border-sellora-primary hover:text-sellora-primary hover:shadow-sellora transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <div
            ref={catScrollRef}
            className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide sm:px-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CATEGORIES.map(({ name, slug, Icon }) => (
              <button
                key={slug}
                onClick={() => navigate(`/search?categorySlug=${slug}`)}
                className="group flex flex-col items-center gap-2 px-1 py-1 shrink-0 w-[74px] sm:w-[80px] focus:outline-none"
              >
                <span className="w-14 h-14 rounded-2xl bg-white border border-sellora-border shadow-sellora-sm flex items-center justify-center transition-all duration-200 group-hover:border-sellora-primary group-hover:bg-sellora-primary-soft group-hover:shadow-sellora group-hover:-translate-y-1 group-focus-visible:border-sellora-primary">
                  <Icon size={24} strokeWidth={1.75} className="text-sellora-primary transition-transform duration-200 group-hover:scale-110" />
                </span>
                <span className="text-[11px] sm:text-xs text-sellora-muted font-medium text-center leading-tight group-hover:text-sellora-primary transition-colors">
                  {name}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollCats('right')}
            aria-label="Scroll categories right"
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center bg-white rounded-full border border-sellora-border shadow-sellora-sm text-sellora-text hover:border-sellora-primary hover:text-sellora-primary hover:shadow-sellora transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 py-7 sm:py-10 space-y-10 sm:space-y-12">
        {/* Cars section */}
        {(carAds.length > 0 || loading) && (
          <section>
            <SectionHeader title="Cars" onViewAll={() => navigate('/search?categorySlug=cars')} />
            <ListingGrid count={loading ? 4 : carAds.length} maxCols={4}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                : carAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
            </ListingGrid>
          </section>
        )}

        {/* Mobiles section */}
        {(mobileAds.length > 0 || loading) && (
          <section>
            <SectionHeader title="Mobiles" onViewAll={() => navigate('/search?categorySlug=mobile-phones')} />
            <ListingGrid count={loading ? 4 : mobileAds.length} maxCols={4}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                : mobileAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
            </ListingGrid>
          </section>
        )}

        {/* Recommended for You */}
        <section>
          <SectionHeader title="Recommended for You" onViewAll={() => navigate('/search')} />
          {loading ? (
            <ListingGrid count={10}>
              {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
            </ListingGrid>
          ) : freshAds.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-sellora-border shadow-sellora-sm">
              <p className="text-4xl mb-3">🛍️</p>
              <p className="text-sellora-text font-semibold">Nothing listed yet</p>
              <p className="text-sellora-muted text-sm mt-1">Be the first to sell something on Sellora.</p>
              <button
                onClick={() => navigate('/post-ad')}
                className="mt-5 btn-gradient font-semibold px-6 py-2.5 rounded-xl text-sm"
              >
                Post an Ad
              </button>
            </div>
          ) : (
            <ListingGrid count={freshAds.length}>
              {freshAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
            </ListingGrid>
          )}
        </section>
      </div>
    </div>
  );
}
