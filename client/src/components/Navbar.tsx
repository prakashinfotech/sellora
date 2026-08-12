import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Plus, Heart, MessageSquare, User, LogOut, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';
import Logo from './Logo';

const INDIAN_CITIES = [
  'India', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow',
  'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
  'Pimpri', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra',
  'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar',
];

const SEARCH_PLACEHOLDER = 'Search cars, phones, furniture and more...';

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState('India');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const cityRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Keep Navbar city in sync with URL params (sidebar filter updates URL directly)
  useEffect(() => {
    const urlCity = searchParams.get('city');
    setSelectedCity(urlCity && INDIAN_CITIES.includes(urlCity) ? urlCity : 'India');
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCityDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCity !== 'India') params.set('city', selectedCity);
    // Preserve active category filter when searching within a category
    const categorySlug = searchParams.get('categorySlug');
    if (categorySlug) params.set('categorySlug', categorySlug);
    navigate(`/search?${params.toString()}`);
  };

  const filteredCities = INDIAN_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  /* Same search behaviour, rendered inline on desktop and on its own row on mobile */
  const searchForm = (compact = false) => (
    <form
      onSubmit={handleSearch}
      className={`flex items-center gap-1 bg-white border border-sellora-border rounded-full pl-4 pr-1 py-1.5 transition-shadow focus-within:border-sellora-primary focus-within:shadow-sellora ${compact ? 'w-full' : 'flex-1 max-w-[660px]'}`}
    >
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={SEARCH_PLACEHOLDER}
        aria-label="Search Sellora listings"
        className="flex-1 min-w-0 bg-transparent text-sm text-sellora-text placeholder:text-sellora-muted focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="btn-gradient shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
      >
        <Search size={17} strokeWidth={2.5} />
      </button>
    </form>
  );

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-sellora-border shadow-sellora-sm">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4">
        <div className="h-[68px] sm:h-[76px] flex items-center gap-2 sm:gap-4">
          {/* Logo */}
          <Logo className="h-8 sm:h-11" />

          {/* Location Picker */}
          <div className="relative shrink-0" ref={cityRef}>
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              aria-label="Change location"
              className="flex items-center gap-1.5 rounded-full border border-sellora-border bg-sellora-bg px-3 sm:px-3.5 py-2.5 text-sm font-medium text-sellora-text hover:border-sellora-primary hover:text-sellora-primary hover:shadow-sellora-sm transition-all whitespace-nowrap"
            >
              <MapPin size={15} className="text-sellora-primary shrink-0" />
              <span className="hidden sm:inline max-w-[100px] truncate">{selectedCity}</span>
              <ChevronDown size={14} className="text-sellora-muted shrink-0" />
            </button>

            {showCityDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-sellora-lg border border-sellora-border z-50 overflow-hidden animate-sellora-rise">
                <div className="p-2 border-b border-sellora-border">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search city..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-sellora-border rounded-xl focus:outline-none focus:border-sellora-primary"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCityDropdown(false);
                        setCitySearch('');
                        const params = new URLSearchParams();
                        if (searchQuery) params.set('search', searchQuery);
                        if (city !== 'India') params.set('city', city);
                        const categorySlug = searchParams.get('categorySlug');
                        if (categorySlug) params.set('categorySlug', categorySlug);
                        navigate(`/search?${params.toString()}`);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-sellora-primary-soft ${selectedCity === city ? 'text-sellora-primary font-semibold bg-sellora-primary-soft' : 'text-sellora-text'}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar — desktop / tablet */}
          <div className="hidden md:flex flex-1 justify-center">{searchForm()}</div>

          {/* Right Nav */}
          <nav className="flex items-center gap-1 shrink-0 ml-auto">
            {user ? (
              <>
                <Link
                  to="/favourites"
                  aria-label="Saved ads"
                  className="flex items-center gap-1.5 px-2 py-2 rounded-full text-sm font-medium text-sellora-text hover:text-sellora-primary hover:bg-sellora-primary-soft transition-colors"
                >
                  <Heart size={18} />
                  <span className="hidden lg:inline">Saved</span>
                </Link>

                <Link
                  to="/messages"
                  aria-label="Messages"
                  className="flex items-center gap-1.5 px-2 py-2 rounded-full text-sm font-medium text-sellora-text hover:text-sellora-primary hover:bg-sellora-primary-soft transition-colors"
                >
                  <MessageSquare size={18} />
                  <span className="hidden lg:inline">Chat</span>
                </Link>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    aria-label="Account menu"
                    className="flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-full text-sm font-medium text-sellora-text hover:bg-sellora-primary-soft transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center font-bold text-sm">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="hidden lg:inline max-w-[80px] truncate">{user.name}</span>
                    <ChevronDown size={14} className="text-sellora-muted" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-sellora-lg border border-sellora-border z-50 py-1.5 overflow-hidden animate-sellora-rise">
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-sellora-text hover:bg-sellora-primary-soft hover:text-sellora-primary transition-colors"
                      >
                        <User size={15} /> My Profile
                      </Link>
                      <Link
                        to="/my-ads"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-sellora-text hover:bg-sellora-primary-soft hover:text-sellora-primary transition-colors"
                      >
                        <ChevronRight size={15} /> My Ads
                      </Link>
                      <Link
                        to="/favourites"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-sellora-text hover:bg-sellora-primary-soft hover:text-sellora-primary transition-colors"
                      >
                        <Heart size={15} /> Saved Ads
                      </Link>
                      <hr className="my-1 border-sellora-border" />
                      <button
                        onClick={() => { dispatch(logout()); navigate('/'); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-full text-sm font-semibold text-sellora-primary border border-sellora-primary/30 hover:bg-sellora-primary-soft hover:border-sellora-primary transition-colors"
              >
                <User size={15} />
                <span className="hidden sm:inline">Login / Register</span>
                <span className="sm:hidden">Login</span>
              </Link>
            )}

            <Link
              to="/post-ad"
              className="btn-gradient ml-1 flex items-center gap-1.5 font-semibold px-3.5 sm:px-5 py-2.5 rounded-full text-sm"
            >
              <Plus size={16} strokeWidth={3} />
              <span className="hidden sm:inline">Sell Now</span>
              <span className="sm:hidden">Sell</span>
            </Link>
          </nav>
        </div>

        {/* Search Bar — mobile row */}
        <div className="md:hidden pb-3">{searchForm(true)}</div>
      </div>
    </header>
  );
}
