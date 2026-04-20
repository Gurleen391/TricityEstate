import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';

// ✅ FIX: Force map to update when position changes
function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function Listing() {
  SwiperCore.use([Navigation]);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [success, setSuccess] = useState(false);

  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  // ✅ INR FORMAT FUNCTION
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // ✅ FETCH LISTING
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        console.log("Listing Data:", data); // 🔥 DEBUG

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
        setError(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    document.body.style.overflow = contact ? 'hidden' : 'auto';
  }, [contact]);

  // ✅ DYNAMIC POSITION
  const position =
    listing?.latitude && listing?.longitude
      ? [listing.latitude, listing.longitude]
      : null;

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}

      {error && (
        <p className='text-center my-7 text-2xl'>
          Something went wrong!
        </p>
      )}

      {listing && !loading && !error && (
        <div>
          {/* IMAGE SLIDER */}
          <Swiper navigation>
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <img
                  src={url}
                  alt='listing'
                  className='w-full h-[500px] object-cover'
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* MAIN CONTENT */}
          <div className='max-w-6xl mx-auto p-3 my-7 flex flex-col md:flex-row gap-6'>

            {/* LEFT */}
            <div className='flex-1 flex flex-col gap-4'>
              <p className='text-2xl font-semibold'>
                {listing.name} -{' '}
                {listing.offer
                  ? formatPrice(listing.discountPrice)
                  : formatPrice(listing.regularPrice)}
                {listing.type === 'rent' && ' / month'}
              </p>

              <p className='flex items-center gap-2 text-slate-600 text-sm'>
                <FaMapMarkerAlt className='text-green-700' />
                {listing.address}
              </p>
            </div>

            {/* ✅ MAP FIXED */}
            {position && (
              <div className='w-full md:w-[400px] h-[300px] sticky top-24'>
                <MapContainer
                  center={position}
                  zoom={13}
                  className='h-full w-full rounded-lg shadow-lg'
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  />

                  {/* ✅ FORCE UPDATE */}
                  <ChangeMapView center={position} />

                  {/* ✅ MARKER BACK */}
                  <Marker position={position}>
                    <Popup closeButton={false}>
                      {listing.address}
                    </Popup>
                  </Marker>

                </MapContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}