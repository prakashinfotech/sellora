import { Link } from 'react-router-dom';
import Logo from './Logo';

const ABOUT_LINKS = [
  'About Sellora',
  'Sellora for Business',
  'Sellora Blog',
  'Sitemap',
  'Legal & Privacy information',
  'Vulnerability Disclosure',
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-sellora-border mt-10">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-sellora-text text-sm mb-3 uppercase tracking-wide">Popular Locations</h4>
            <ul className="space-y-1.5 text-sm text-sellora-muted">
              {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'].map((city) => (
                <li key={city}>
                  <Link to={`/search?city=${city}`} className="hover:text-sellora-primary transition-colors">{city}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sellora-text text-sm mb-3 uppercase tracking-wide">Trending Searches</h4>
            <ul className="space-y-1.5 text-sm text-sellora-muted">
              {['Cars', 'Motorcycles', 'Mobile Phones', 'Laptops', 'Furniture', 'Jobs', 'Real Estate'].map((cat) => (
                <li key={cat}>
                  <Link to={`/search?search=${cat}`} className="hover:text-sellora-primary transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sellora-text text-sm mb-3 uppercase tracking-wide">About Us</h4>
            <ul className="space-y-1.5 text-sm text-sellora-muted">
              {ABOUT_LINKS.map((item) => (
                <li key={item}><span className="cursor-pointer hover:text-sellora-primary transition-colors">{item}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sellora-text text-sm mb-3 uppercase tracking-wide">Follow Us</h4>
            <div className="flex gap-2.5 mb-5">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((social) => (
                <button
                  key={social}
                  aria-label={`Sellora on ${social}`}
                  className="w-9 h-9 rounded-full bg-sellora-primary-soft border border-sellora-border flex items-center justify-center text-xs font-bold text-sellora-primary hover:border-sellora-primary hover:shadow-sellora transition-all"
                >
                  {social[0]}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { top: 'GET IT ON', name: 'Google Play', glyph: '▶' },
                { top: 'Download on the', name: 'App Store', glyph: '' },
              ].map((store) => (
                <div
                  key={store.name}
                  className="bg-sellora-text text-white text-xs px-3 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity w-fit"
                >
                  <span className="text-lg">{store.glyph}</span>
                  <div>
                    <div className="text-[10px] opacity-70">{store.top}</div>
                    <div className="font-bold">{store.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-sellora-border mb-5" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sellora-muted">
          <div className="flex items-center gap-3">
            <Logo className="h-7" />
            <p>© {new Date().getFullYear()} Sellora. All Rights Reserved.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="hover:text-sellora-primary transition-colors cursor-pointer">Help &amp; Support</span>
            <span>•</span>
            <span className="hover:text-sellora-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-sellora-primary transition-colors cursor-pointer">Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
