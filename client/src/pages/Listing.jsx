import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useMap } from "react-leaflet";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

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

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

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
  if (listing && listing.latitude && listing.longitude) {
    setPosition([listing.latitude, listing.longitude]);
  }
}, [listing]);


  useEffect(() => {
    document.body.style.overflow = contact ? 'hidden' : 'auto';
  }, [contact]);

 const [position, setPosition] = useState([28.6139, 77.2090]);

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

          {/* SHARE */}
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            />
          </div>

          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 bg-slate-100 p-2 rounded-md'>
              Link copied!
            </p>
          )}

          {/* MAIN CONTENT */}
          <div className='max-w-6xl mx-auto p-3 my-7 flex flex-col md:flex-row gap-6'>

            {/* LEFT */}
            <div className='flex-1 flex flex-col gap-4'>

              {/* ✅ PRICE */}
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

              {/* TYPE + DISCOUNT */}
              <div className='flex gap-4'>
                <p className='bg-red-900 text-white px-3 py-1 rounded-md'>
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>

                {listing.offer && (
                  <p className='bg-green-900 text-white px-3 py-1 rounded-md'>
                    {formatPrice(
                      listing.regularPrice - listing.discountPrice
                    )}{' '}
                    OFF
                  </p>
                )}
              </div>

              <p>
                <span className='font-semibold'>Description - </span>
                {listing.description}
              </p>

              <ul className='flex gap-4 flex-wrap text-green-900 font-semibold'>
                <li className='flex items-center gap-1'>
                  <FaBed /> {listing.bedrooms} Beds
                </li>

                <li className='flex items-center gap-1'>
                  <FaBath /> {listing.bathrooms} Baths
                </li>

                <li className='flex items-center gap-1'>
                  <FaParking />{' '}
                  {listing.parking ? 'Parking' : 'No Parking'}
                </li>

                <li className='flex items-center gap-1'>
                  <FaChair />{' '}
                  {listing.furnished ? 'Furnished' : 'Unfurnished'}
                </li>
              </ul>

              {/* BUTTON */}
              {currentUser &&
                listing.userRef !== currentUser._id && (
                  <button
                    onClick={() => setContact(true)}
                    className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-6'
                  >
                    Contact landlord
                  </button>
                )}
            </div>

            {/* MAP */}
            {/* MAP */}
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

  {/* ✅ FIX: force map center update */}
  <ChangeMapView center={position} />

  <Marker position={position}>
    <Popup closeButton={false}>
      {listing.address}
    </Popup>
  </Marker>
</MapContainer>
</div>
          </div>

          {/* CONTACT MODAL */}
          {contact && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-lg relative">

                <button
                  onClick={() => setContact(false)}
                  className="absolute top-2 right-3 text-2xl font-bold"
                >
                  ×
                </button>

                <Contact
                  listing={listing}
                  onClose={() => setContact(false)}
                  onSuccess={() => setSuccess(true)}
                />
              </div>
            </div>
          )}

          {/* SUCCESS POPUP */}
          {success && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white px-10 py-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">

                <p className="text-2xl font-semibold mb-3">
                  Message Sent!
                </p>

                <p className="text-slate-600 mb-5">
                  Your message opened in Gmail successfully.
                </p>

                <button
                  onClick={() => setSuccess(false)}
                  className="bg-slate-700 text-white px-6 py-2 rounded-lg"
                >
                  OK
                </button>

              </div>
            </div>
          )}

        </div>
      )}
    </main>
  );
}