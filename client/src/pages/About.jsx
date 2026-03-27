import React from 'react';

export default function About() {
  return (
    <div className='bg-white'>

      {/* HERO SECTION */}
      <div className='relative h-[300px] sm:h-[400px]'>
        <img
          src='https://images.unsplash.com/photo-1560518883-ce09059eeffa'
          alt='real estate'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center'>
          <h1 className='text-3xl sm:text-5xl font-bold text-white text-center'>
            About TricityEstate
          </h1>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className='py-16 px-4 max-w-6xl mx-auto'>

        {/* INTRO */}
        <p className='text-slate-600 text-lg leading-relaxed mb-10 text-center max-w-3xl mx-auto'>
          TricityEstate is a modern real estate platform designed to make
          property search simple, transparent, and efficient. Whether you're
          buying, selling, or renting — we help you find the perfect place with ease.
        </p>

        {/* SECTION 1 */}
        <div className='grid md:grid-cols-2 gap-10 items-center mb-16'>
          <img
            src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
            alt='home'
            className='rounded-2xl shadow-lg w-full h-[300px] object-cover'
          />
          <div>
            <h2 className='text-2xl font-semibold text-slate-800 mb-3'>
              Our Mission
            </h2>
            <p className='text-slate-600 leading-relaxed'>
              Our mission is to simplify the real estate journey by providing a
              platform that is fast, reliable, and user-friendly. We aim to
              connect people with properties in the most seamless way possible.
            </p>
          </div>
        </div>

        {/* SECTION 2 */}
        <div className='grid md:grid-cols-2 gap-10 items-center mb-16'>
          <div>
            <h2 className='text-2xl font-semibold text-slate-800 mb-3'>
              What We Offer
            </h2>
            <p className='text-slate-600 leading-relaxed'>
              From apartments to villas and vacation homes, we offer a wide
              variety of listings. Our smart filters and clean interface help
              users quickly find properties that match their needs.
            </p>
          </div>
          <img
            src='https://images.unsplash.com/photo-1570129477492-45c003edd2be'
            alt='villa'
            className='rounded-2xl shadow-lg w-full h-[300px] object-cover'
          />
        </div>

        {/* STATS */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mb-16'>
          <div className='bg-slate-100 p-6 rounded-xl shadow-sm'>
            <h3 className='text-2xl font-bold text-slate-800'>500+</h3>
            <p className='text-slate-600 text-sm'>Properties</p>
          </div>
          <div className='bg-slate-100 p-6 rounded-xl shadow-sm'>
            <h3 className='text-2xl font-bold text-slate-800'>300+</h3>
            <p className='text-slate-600 text-sm'>Happy Clients</p>
          </div>
          <div className='bg-slate-100 p-6 rounded-xl shadow-sm'>
            <h3 className='text-2xl font-bold text-slate-800'>100+</h3>
            <p className='text-slate-600 text-sm'>Cities Covered</p>
          </div>
          <div className='bg-slate-100 p-6 rounded-xl shadow-sm'>
            <h3 className='text-2xl font-bold text-slate-800'>24/7</h3>
            <p className='text-slate-600 text-sm'>Support</p>
          </div>
        </div>

        {/* CTA */}
        <div className='bg-slate-900 text-white p-10 rounded-2xl text-center shadow-lg'>
          <h2 className='text-2xl sm:text-3xl font-semibold mb-3'>
            Find Your Dream Home Today
          </h2>
          <p className='text-slate-300 mb-5'>
            Start exploring properties that match your lifestyle and budget.
          </p>
          <a
            href='/search'
            className='bg-white text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-slate-200 transition'
          >
            Explore Now
          </a>
        </div>

      </div>
    </div>
  );
}