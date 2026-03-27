import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {

  // ✅ SCROLL FUNCTION
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

        {/* BRAND */}
        <div>
          <h1 className="text-xl font-semibold text-white mb-3">
            <span className="text-slate-400">Tricity</span>
            <span className="text-white">Estate</span>
          </h1>
          <p className="text-sm text-slate-400">
            Find your perfect place with ease. Explore premium properties across the city.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h2 className="text-white font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" onClick={scrollTop} className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-white transition">
                Search
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* PROPERTIES */}
        <div>
          <h2 className="text-white font-semibold mb-3">Properties</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search?propertyType=apartment" className="hover:text-white">Apartment</Link></li>
            <li><Link to="/search?propertyType=villa" className="hover:text-white">Villa</Link></li>
            <li><Link to="/search?propertyType=farmhouse" className="hover:text-white">Farmhouse</Link></li>
            <li><Link to="/search?type=rent" className="hover:text-white">For Rent</Link></li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h2 className="text-white font-semibold mb-3">Follow Us</h2>
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>

      <div className="border-t border-slate-700 text-center text-sm py-4 text-slate-400">
        © {new Date().getFullYear()} TricityEstate. All rights reserved.
      </div>
    </footer>
  );
}