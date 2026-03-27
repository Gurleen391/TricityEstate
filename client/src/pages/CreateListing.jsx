import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // CLOUDINARY IMAGE UPLOAD
  const storeImage = async (file) => {
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Image must be less than 2MB");
    }

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

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.secure_url;
  };

  // UPLOAD IMAGES
  const handleImageSubmit = async () => {
    if (files.length === 0) {
      return setImageUploadError("Select at least one image");
    }

    if (files.length + formData.imageUrls.length > 6) {
      return setImageUploadError("Maximum 6 images allowed");
    }

    try {
      setUploading(true);
      setImageUploadError("");

      const urls = [];

      for (let i = 0; i < files.length; i++) {
        const url = await storeImage(files[i]);
        urls.push(url);
      }

      setFormData({
        ...formData,
        imageUrls: formData.imageUrls.concat(urls),
      });

      setUploading(false);
    } catch (err) {
      setImageUploadError(err.message || "Image upload failed");
      setUploading(false);
    }
  };

  // REMOVE IMAGE
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.tagName === "SELECT"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      return setError("You must upload at least one image");
    }

    if (+formData.regularPrice < +formData.discountPrice) {
      return setError("Discount price must be lower than regular price");
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 flex-1">

          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* PROPERTY TYPE */}
          <select
            id="propertyType"
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.propertyType}
          >
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="farmhouse">Farmhouse</option>
            <option value="penthouse">Penthouse</option>
            <option value="studio">Studio</option>
            <option value="vacation-home">Vacation Home</option>
          </select>

          {/* OPTIONS */}
          <div className="flex gap-6 flex-wrap">

            <label>
              <input
                type="checkbox"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />{" "}
              Sell
            </label>

            <label>
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />{" "}
              Rent
            </label>

            <label>
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
              />{" "}
              Parking
            </label>

            <label>
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />{" "}
              Furnished
            </label>

            <label>
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
              />{" "}
              Offer
            </label>

          </div>

          {/* BEDROOM / BATHROOM */}
          <div className="flex gap-6">

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                className="p-3 border rounded-lg w-20"
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                className="p-3 border rounded-lg w-20"
                value={formData.bathrooms}
                onChange={handleChange}
              />
              <p>Baths</p>
            </div>

          </div>

          {/* PRICE */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="regularPrice"
              min="0"
              className="p-3 border rounded-lg"
              value={formData.regularPrice}
              onChange={handleChange}
            />
            <p>Price (₹ / month)</p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-1 gap-4">

          <p className="font-semibold">Images (max 6)</p>

          <div className="flex gap-4">
            <input
              type="file"
              multiple
              accept="image/*"
              className="p-3 border rounded w-full"
              onChange={(e) => setFiles([...e.target.files])}
            />

            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {imageUploadError && (
            <p className="text-red-700">{imageUploadError}</p>
          )}

          {formData.imageUrls.map((url, i) => (
            <div key={i} className="flex justify-between items-center border p-2">
              <img
                src={url}
                alt="listing"
                className="w-20 h-20 object-cover rounded"
              />

              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
                className="text-red-700"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>

          {error && <p className="text-red-700">{error}</p>}

        </div>

      </form>
    </main>
  );
}