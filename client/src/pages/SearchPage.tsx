import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, ChevronDown, X, Grid, List } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { fetchAllAdsHandler } from '../store/slices/adsSlice';
import { fetchCategoriesHandler } from '../store/slices/categoriesSlice';
import AdCard from '../components/AdCard';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

const INDIAN_CITIES = [
  'All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow',
];

function SkeletonCard() {
  return (
    <div className="bg-white border border-sellora-border rounded overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-2.5 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { ads, total, loading } = useSelector((state: RootState) => state.ads);
  const { categories } = useSelector((state: RootState) => state.categories);

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get('search') || '';
  const categorySlug = searchParams.get('categorySlug') || '';
  const city = searchParams.get('city') || '';

  useEffect(() => {
    dispatch(fetchCategoriesHandler());
  }, [dispatch]);

  useEffect(() => {
    const selectedCategory = categories.find((c) => c.slug === categorySlug);
    dispatch(fetchAllAdsHandler({
      search: search || undefined,
      categoryId: selectedCategory?.id || undefined,
      city: city || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }));
  }, [dispatch, search, categorySlug, city, minPrice, maxPrice, categories]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams(search ? { search } : {});
  };

  const hasFilters = minPrice || maxPrice || categorySlug || city;

  const sortedAds = [...ads].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="bg-sellora-bg min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        {/* Breadcrumb + results count */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-sellora-text">
              {loading
                ? 'Searching...'
                : search
                ? `Results for "${search}"`
                : categorySlug
                ? categories.find((c) => c.slug === categorySlug)?.name || 'All Ads'
                : 'All Ads'}
            </h1>
            {!loading && (
              <p className="text-sm text-sellora-muted">{total} results</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border border-sellora-border rounded px-3 py-1.5 text-sm text-sellora-text pr-7 focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-sellora-muted" />
            </div>

            {/* View mode */}
            <div className="flex border border-sellora-border rounded overflow-hidden bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-sellora-primary text-white' : 'text-sellora-muted hover:bg-sellora-bg'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 ${viewMode === 'list' ? 'bg-sellora-primary text-white' : 'text-sellora-muted hover:bg-sellora-bg'}`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-1 bg-white border border-sellora-border rounded px-3 py-1.5 text-sm text-sellora-text"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-56 shrink-0 space-y-4`}>
            {hasFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full flex items-center justify-center gap-1 text-xs text-red-500 border border-red-200 rounded py-1.5 hover:bg-red-50"
              >
                <X size={12} /> Clear all filters
              </button>
            )}

            {/* Categories */}
            <div className="bg-white border border-sellora-border rounded p-4">
              <h3 className="font-bold text-sellora-text text-sm mb-3">All Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => updateFilter('categorySlug', '')}
                  className={`w-full text-left text-sm py-1 px-2 rounded transition-colors ${!categorySlug ? 'text-sellora-primary font-semibold bg-blue-50' : 'text-sellora-text hover:bg-sellora-bg'}`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateFilter('categorySlug', c.slug)}
                    className={`w-full text-left text-sm py-1 px-2 rounded transition-colors ${categorySlug === c.slug ? 'text-sellora-primary font-semibold bg-blue-50' : 'text-sellora-text hover:bg-sellora-bg'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white border border-sellora-border rounded p-4">
              <h3 className="font-bold text-sellora-text text-sm mb-3">Location</h3>
              <div className="space-y-1">
                {INDIAN_CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateFilter('city', c === 'All Cities' ? '' : c)}
                    className={`w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                      (city === c || (c === 'All Cities' && !city))
                        ? 'text-sellora-primary font-semibold bg-blue-50'
                        : 'text-sellora-text hover:bg-sellora-bg'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white border border-sellora-border rounded p-4">
              <h3 className="font-bold text-sellora-text text-sm mb-3">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-sellora-border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-sellora-primary"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-sellora-border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-sellora-primary"
                />
                <button
                  onClick={() => {}}
                  className="w-full bg-sellora-primary text-white text-sm py-1.5 rounded hover:bg-sellora-primary-dark transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 gap-3'
                : 'space-y-3'
              }>
                {Array.from({ length: 9 }).map((_, i) => (
                  viewMode === 'grid'
                    ? <SkeletonCard key={i} />
                    : <div key={i} className="bg-white border border-sellora-border rounded h-28 animate-pulse" />
                ))}
              </div>
            ) : sortedAds.length === 0 ? (
              <div className="text-center py-20 bg-white border border-sellora-border rounded-lg">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-sellora-text font-semibold text-lg">No results found</p>
                <p className="text-sellora-muted text-sm mt-1">Try adjusting your search or filters</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-sellora-primary text-sm font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sortedAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="bg-white border border-sellora-border rounded overflow-hidden flex gap-3 p-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/ads/${ad.id}`)}
                  >
                    <div className="w-32 h-24 shrink-0 rounded overflow-hidden bg-gray-100">
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
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sellora-text text-lg">₹{Number(ad.price).toLocaleString('en-IN')}</p>
                      <p className="text-sellora-text text-sm mt-0.5 line-clamp-1">{ad.title}</p>
                      <p className="text-sellora-muted text-xs mt-1">{[ad.city, ad.state].filter(Boolean).join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
