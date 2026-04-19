import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ADD YOUR LIVE API URL
  const API_URL = "https://tricityestate.onrender.com";

  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    propertyType: "",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  // ✅ FETCH DATA FROM URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);

        console.log("Fetching with params:", urlParams.toString());

        const res = await fetch(`${API_URL}/api/listing/get?${urlParams.toString()}`);
        const data = await res.json();

        setListings(data);
        setShowMore(data.length > 8);
        setLoading(false);
      } catch (error) {
        console.log("FETCH ERROR:", error);
        setLoading(false);
      }
    };

    setSidebardata((prev) => ({
      ...prev,
      searchTerm: urlParams.get("searchTerm") || "",
      type: urlParams.get("type") || "all",
      propertyType: urlParams.get("propertyType") || "",
      parking: urlParams.get("parking") === "true",
      furnished: urlParams.get("furnished") === "true",
      offer: urlParams.get("offer") === "true",
      sort: urlParams.get("sort") || "createdAt",
      order: urlParams.get("order") || "desc",
    }));

    fetchListings();
  }, [location.search]);

  // ✅ HANDLE INPUT (FIXED)
  const handleChange = (e) => {

    // TYPE
    if (e.target.name === "type") {
      setSidebardata((prev) => ({
        ...prev,
        type: e.target.id,
      }));
    }

    // SEARCH
    if (e.target.id === "searchTerm") {
      setSidebardata((prev) => ({
        ...prev,
        searchTerm: e.target.value,
      }));
    }

    // PROPERTY TYPE ✅ FIXED
    if (e.target.id === "propertyType") {
      setSidebardata((prev) => ({
        ...prev,
        propertyType: e.target.value,
      }));
    }

    // CHECKBOXES
    if (["parking", "furnished", "offer"].includes(e.target.id)) {
      setSidebardata((prev) => ({
        ...prev,
        [e.target.id]: e.target.checked,
      }));
    }

    // SORT
    if (e.target.id === "sort_order") {
      const [sort, order] = e.target.value.split("_");

      setSidebardata((prev) => ({
        ...prev,
        sort,
        order,
      }));
    }
  };

  // ✅ HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();

    if (sidebardata.searchTerm)
      urlParams.set("searchTerm", sidebardata.searchTerm);

    if (sidebardata.type !== "all")
      urlParams.set("type", sidebardata.type);

    if (sidebardata.propertyType)
      urlParams.set("propertyType", sidebardata.propertyType);

    if (sidebardata.parking)
      urlParams.set("parking", true);

    if (sidebardata.furnished)
      urlParams.set("furnished", true);

    if (sidebardata.offer)
      urlParams.set("offer", true);

    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    navigate(`/search?${urlParams.toString()}`);
  };

  // ✅ SHOW MORE
  const onShowMoreClick = async () => {
    const startIndex = listings.length;

    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);

    const res = await fetch(`${API_URL}/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();

    setListings((prev) => [...prev, ...data]);

    if (data.length < 9) setShowMore(false);
  };

  return (
    <div className="flex flex-col md:flex-row">

      {/* SIDEBAR */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* SEARCH */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Search:</label>
            <input
              type="text"
              id="searchTerm"
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* ✅ PROPERTY TYPE DROPDOWN (ADDED UI FIX) */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Property Type:</label>
            <select
              id="propertyType"
              value={sidebardata.propertyType}
              onChange={handleChange}
              className="border rounded-lg p-3"
            >
              <option value="">All</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="farmhouse">Farmhouse</option>
            </select>
          </div>

          {/* TYPE */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>

            <input type="radio" name="type" id="all"
              checked={sidebardata.type === "all"}
              onChange={handleChange} /> All

            <input type="radio" name="type" id="rent"
              checked={sidebardata.type === "rent"}
              onChange={handleChange} /> Rent

            <input type="radio" name="type" id="sale"
              checked={sidebardata.type === "sale"}
              onChange={handleChange} /> Sale
          </div>

          {/* SUBMIT */}
          <button className="bg-slate-700 text-white p-3 rounded-lg">
            Search
          </button>
        </form>
      </div>

      {/* RESULTS */}
      <div className="flex-1">
        <div className="p-7 flex flex-wrap gap-4">

          {!loading && listings.length === 0 && (
            <p>No listing found!</p>
          )}

          {loading && <p>Loading...</p>}

          {!loading &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button onClick={onShowMoreClick}>
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}