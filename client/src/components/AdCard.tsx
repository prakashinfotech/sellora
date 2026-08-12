import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

interface Ad {
  id: number;
  title: string;
  price: number;
  images: string[];
  city?: string;
  state?: string;
  createdAt?: string;
  featured?: boolean;
}

interface Props {
  ad: Ad;
  onToggleFavourite?: (id: number) => void;
  isFavourited?: boolean;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function AdCard({ ad, onToggleFavourite, isFavourited }: Props) {
  const imgSrc = ad.images?.[0]
    ? (ad.images[0].startsWith('http') ? ad.images[0] : ad.images[0])
    : null;

  const location = [ad.city, ad.state].filter(Boolean).join(', ');

  return (
    <Link to={`/ads/${ad.id}`} className="card-sellora group block overflow-hidden">
      {/* Image — fixed 4:3 ratio, cropped to fill so cards stay aligned */}
      <div className="relative aspect-[4/3] bg-sellora-primary-soft overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={ad.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-sellora-primary-soft">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#A5B4FC" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Featured badge */}
        {ad.featured && (
          <span className="absolute top-2.5 left-2.5 bg-sellora-warm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-sellora-sm">
            Featured
          </span>
        )}

        {/* Favourite button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavourite?.(ad.id); }}
          aria-label={isFavourited ? 'Remove from saved ads' : 'Save this ad'}
          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sellora-sm hover:scale-110 hover:shadow-sellora transition-all"
        >
          <Heart
            size={15}
            fill={isFavourited ? '#EC4899' : 'none'}
            stroke={isFavourited ? '#EC4899' : '#6B7280'}
            strokeWidth={2.2}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <p className="font-extrabold text-sellora-text text-[19px] leading-none tracking-tight">
          ₹{Number(ad.price).toLocaleString('en-IN')}
        </p>
        <p className="text-sellora-text text-[13px] font-medium mt-2 line-clamp-2 leading-snug min-h-[2.4rem] group-hover:text-sellora-primary transition-colors">
          {ad.title}
        </p>
        <div className="flex items-center justify-between gap-2 mt-2.5 pt-2.5 border-t border-sellora-border">
          <span className="flex items-center gap-1 min-w-0 text-sellora-muted text-[11px]">
            <MapPin size={12} className="shrink-0 text-sellora-primary/60" />
            <span className="truncate">{location || 'India'}</span>
          </span>
          <span className="text-sellora-muted text-[11px] whitespace-nowrap shrink-0">
            {formatDate(ad.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
