import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ SCROLL TO TOP
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <div className='flex justify-between items-center max-w-7xl mx-auto px-5 py-3'>

        {/* LOGO */}
        <Link to='/' onClick={scrollTop}>
          <h1 className='font-semibold text-xl sm:text-2xl tracking-wide'>
            <span className='text-slate-500'>Tricity</span>
            <span className='text-slate-800'>Estate</span>
          </h1>
        </Link>

        {/* SEARCH */}
        <form
          onSubmit={handleSubmit}
          className='flex items-center bg-slate-100 px-4 py-2 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-slate-300 transition-all'
        >
          <input
            type='text'
            placeholder='Search properties...'
            className='bg-transparent outline-none text-sm sm:text-base w-28 sm:w-72 placeholder:text-slate-400'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit'>
            <FaSearch className='text-slate-500 hover:text-slate-800 transition text-lg' />
          </button>
        </form>

        {/* NAVIGATION */}
        <ul className='flex items-center gap-7 sm:gap-10 text-base font-semibold'>

          {/* HOME */}
          <Link to='/' onClick={scrollTop}>
            <li className='hidden sm:block text-slate-600 hover:text-black transition duration-200'>
              Home
            </li>
          </Link>

          {/* ✅ FIXED DROPDOWN */}
          <li className='relative hidden sm:block group text-slate-600 hover:text-black cursor-pointer transition duration-200'>
            
            <span className='flex items-center gap-1'>
              Properties <span className='text-xs'>▼</span>
            </span>

            {/* DROPDOWN MENU */}
            <div className='absolute left-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'>
              
              {[
                { name: 'Apartment', type: 'apartment' },
                { name: 'Villa', type: 'villa' },
                { name: 'Farmhouse', type: 'farmhouse' },
                { name: 'Vacation Home', type: 'vacation-home' },
                { name: 'Studio', type: 'studio' },
                { name: 'Penthouse', type: 'penthouse' },
              ].map((item) => (
                <Link key={item.type} to={`/search?propertyType=${item.type}`}>
                  <div className='px-4 py-2 text-slate-600 hover:bg-slate-100 hover:text-black transition cursor-pointer'>
                    {item.name}
                  </div>
                </Link>
              ))}

            </div>
          </li>

          {/* ABOUT */}
          <Link to='/about'>
            <li className='hidden sm:block text-slate-600 hover:text-black transition duration-200'>
              About
            </li>
          </Link>

          {/* PROFILE / SIGN IN */}
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='h-9 w-9 rounded-full object-cover border border-slate-300 hover:scale-105 transition duration-200'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className='bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition duration-200 shadow-sm'>
                Sign in
              </li>
            )}
          </Link>

        </ul>
      </div>
    </header>
  );
}