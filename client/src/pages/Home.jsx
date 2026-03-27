import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { motion } from 'framer-motion';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loginPopup, setLoginPopup] = useState(false);

  SwiperCore.use([Navigation]);

  // ✅ LOGIN POPUP
  useEffect(() => {
    const loginFlag = localStorage.getItem('loginSuccess');

    if (loginFlag === 'true') {
      setLoginPopup(true);
      localStorage.removeItem('loginSuccess');

      setTimeout(() => {
        setLoginPopup(false);
      }, 1200);
    }
  }, []);

  // ✅ FETCH LISTINGS
  useEffect(() => {
    const fetchOfferListings = async () => {
      const res = await fetch('/api/listing/get?offer=true&limit=4');
      const data = await res.json();
      setOfferListings(data);
      fetchRentListings();
    };

    const fetchRentListings = async () => {
      const res = await fetch('/api/listing/get?type=rent&limit=4');
      const data = await res.json();
      setRentListings(data);
      fetchSaleListings();
    };

    const fetchSaleListings = async () => {
      const res = await fetch('/api/listing/get?type=sale&limit=4');
      const data = await res.json();
      setSaleListings(data);
    };

    fetchOfferListings();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* 🔥 HERO */}
      <div className="relative overflow-hidden">

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(15,23,42,0.7), rgba(15,23,42,0.9)), url('https://images.unsplash.com/photo-1501183638710-841dd1904471')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center text-white">

          {/* 🔥 TITLE ANIMATION */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-semibold leading-tight"
          >
            Find your next{' '}
            <span className="text-yellow-400 font-bold">perfect</span>{' '}
            place to live
          </motion.h1>

          {/* 🔥 SUBTEXT */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto"
          >
            Explore premium homes, apartments, and properties tailored to your lifestyle.
          </motion.p>

          {/* 🔥 BUTTON (PREMIUM HOVER) */}
         <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="mt-10"
>
  <motion.div
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link
      to="/search"
      className="px-8 py-3 bg-white text-slate-900 rounded-xl font-semibold shadow-lg 
      hover:bg-yellow-400 hover:text-black 
      transition-all duration-300"
      style={{
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      }}
    >
      Explore Properties →
    </Link>
  </motion.div>
</motion.div>

        </div>
      </div>

      {/* 🔥 FEATURES */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {[
            { title: 'Verified Listings', desc: '100% trusted properties' },
            { title: 'Best Prices', desc: 'Competitive market rates' },
            { title: 'Easy Process', desc: 'Smooth buying & renting' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
            >
              <h3 className="font-semibold text-lg text-slate-800">
                {item.title}
              </h3>
              <p className="text-gray-500 mt-2 text-sm">{item.desc}</p>
            </motion.div>
          ))}

        </div>
      </div>

      {/* 🔥 SWIPER */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Featured Properties
        </h2>

        <Swiper navigation>
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="h-[400px] rounded-2xl shadow-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 🔥 LISTINGS */}
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">

        {offerListings.length > 0 && (
          <Section title="Latest Offers" link="/search?offer=true" listings={offerListings} />
        )}

        {rentListings.length > 0 && (
          <Section title="For Rent" link="/search?type=rent" listings={rentListings} />
        )}

        {saleListings.length > 0 && (
          <Section title="For Sale" link="/search?type=sale" listings={saleListings} />
        )}

      </div>

      {/* 🔥 LOGIN POPUP */}
      {loginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full"
          >
            <p className="text-xl font-semibold text-slate-800 mb-2">
              Login Successful 
            </p>
            <p className="text-gray-500 mb-4">Welcome back!</p>
            <button
              onClick={() => setLoginPopup(false)}
              className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:scale-105 transition"
            >
              OK
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}

/* 🔥 SECTION */
function Section({ title, link, listings }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
        <Link to={link} className="text-indigo-600 text-sm hover:underline">
          View all →
        </Link>
      </div>

      <div className="flex flex-wrap gap-6">
        {listings.map((listing) => (
          <motion.div
            key={listing._id}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.97 }}
          >
            <ListingItem listing={listing} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}