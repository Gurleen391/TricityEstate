import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

// CREATE LISTING
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// DELETE LISTING
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, "You can delete only your own listings"));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};

// UPDATE LISTING
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, "You can update only your own listings"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE LISTING
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// ✅ GET / SEARCH LISTINGS (FINAL FIXED)
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    // ✅ BOOLEAN FILTERS (cleaned logic)
    const offer = req.query.offer === "true";
    const furnished = req.query.furnished === "true";
    const parking = req.query.parking === "true";

    // ✅ TYPE FILTER
    const type =
      req.query.type && req.query.type !== "all"
        ? req.query.type
        : { $in: ["sale", "rent"] };

    // ✅ SEARCH TERM
    const searchTerm = req.query.searchTerm || "";

    // ✅ PROPERTY TYPE DETECTION
    const normalizedSearch = searchTerm.toLowerCase().replace(/\s+/g, "");
    let propertyTypeFilter = {};

    if (normalizedSearch.includes("vacationhome")) {
      propertyTypeFilter = { propertyType: "vacation-home" };
    } else if (normalizedSearch.includes("villa")) {
      propertyTypeFilter = { propertyType: "villa" };
    } else if (normalizedSearch.includes("studio")) {
      propertyTypeFilter = { propertyType: "studio" };
    }

    // ✅ SORT FIX (FINAL)
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    // 🔥 DEBUG (REMOVE AFTER TEST)
    console.log("SORT:", sort);
    console.log("ORDER:", order);

    // ✅ BUILD QUERY OBJECT (clean + dynamic)
    const query = {
      type,
      $and: [
        {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { address: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
          ],
        },
        propertyTypeFilter,
      ],
    };

    // ✅ APPLY BOOLEAN FILTERS ONLY IF TRUE
    if (offer) query.offer = true;
    if (furnished) query.furnished = true;
    if (parking) query.parking = true;

    // ✅ FINAL QUERY
    const listings = await Listing.find(query)
      .sort({ [sort]: order }) // 🔥 MAIN FIX
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};