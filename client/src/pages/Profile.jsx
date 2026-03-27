import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [imageUploading, setImageUploading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);

  // ✅ CLOUDINARY UPLOAD
  const handleImageUpload = async (file) => {
    try {
      setImageUploading(true);

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "mern_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/di6yyopmm/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      setFormData((prev) => ({
        ...prev,
        profilePicture: result.secure_url,
        avatar: result.secure_url,
      }));

      setImageUploading(false);
    } catch (err) {
      console.log(err);
      setImageUploading(false);
    }
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // UPDATE USER
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // DELETE USER
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // SIGN OUT
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      await fetch('/api/auth/signout');
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // ✅ SHOW LISTINGS BACK
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);

    } catch (error) {
      setShowListingsError(true);
    }
  };

  // ✅ DELETE LISTING
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        {/* FILE INPUT */}
        <input
          type='file'
          hidden
          ref={fileRef}
          accept='image/*'
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />

        {/* PROFILE IMAGE */}
        <img
          onClick={() => fileRef.current.click()}
          src={
            formData.profilePicture ||
            currentUser?.profilePicture ||
            currentUser?.avatar ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
        />

        <p className="text-center text-sm">
          {imageUploading && "Uploading image..."}
        </p>

        {/* INPUTS */}
        <input
          type='text'
          id='username'
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='email'
          id='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='password'
          id='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <button
          disabled={loading || imageUploading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase'
        >
          {loading ? 'Updating...' : 'Update'}
        </button>

        <Link
          to='/create-listing'
          className='bg-green-700 text-white p-3 rounded-lg text-center uppercase'
        >
          Create Listing
        </Link>
      </form>

      {/* ACTIONS */}
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
          Delete Account
        </span>

        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign Out
        </span>
      </div>

      {/* STATUS */}
      <p className='text-red-700 mt-5'>{error}</p>
      {updateSuccess && (
        <p className='text-green-700'>Profile updated successfully!</p>
      )}

      {/* ✅ SHOW LISTINGS BUTTON */}
      <button onClick={handleShowListings} className='text-green-700 w-full mt-5'>
        Show Listings
      </button>

      {showListingsError && (
        <p className='text-red-700 mt-2'>Error showing listings</p>
      )}

      {/* ✅ LISTINGS DISPLAY */}
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4 mt-5'>
          <h1 className='text-center text-2xl font-semibold'>Your Listings</h1>

          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border p-3 rounded-lg flex justify-between items-center'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing"
                  className='w-16 h-16 object-cover'
                />
              </Link>

              <Link to={`/listing/${listing._id}`} className='flex-1 ml-3'>
                {listing.name}
              </Link>

              <div className='flex flex-col'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700'
                >
                  Delete
                </button>

                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}