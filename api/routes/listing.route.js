import express from "express";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//
// 🔹 CREATE LISTING
//
router.post("/create", verifyToken, async (req, res, next) => {
  try {
    console.log("CREATE BODY:", req.body);

    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);

  } catch (error) {
    console.log("CREATE ERROR:", error);
    next(error);
  }
});

//
// 🔹 DELETE LISTING
//
router.delete("/delete/:id", verifyToken, async (req, res, next) => {
  try {
    console.log("DELETE PARAM:", req.params.id);

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    // ✅ SAFE CHECK
    if (!req.user || req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can delete only your own listings"));
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully"
    });

  } catch (error) {
    console.log("DELETE ERROR:", error);
    next(error);
  }
});

//
// 🔹 UPDATE LISTING (🔥 FIXED)
//
router.put("/update/:id", verifyToken, async (req, res, next) => {
  try {
    console.log("UPDATE ID:", req.params.id);
    console.log("UPDATE BODY:", req.body);
    console.log("USER:", req.user);

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    // ✅ SAFE USER CHECK (IMPORTANT FIX)
    if (!req.user || req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can update only your own listings"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // ✅ validation added
    );

    res.status(200).json(updatedListing);

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    next(error);
  }
});

//
// 🔹 GET SINGLE LISTING (SAFE)
//
router.get("/get/:id", async (req, res, next) => {
  try {
    console.log("GET SINGLE:", req.params.id);

    if (!req.params.id || req.params.id === "undefined") {
      return next(errorHandler(400, "Invalid ID"));
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    res.status(200).json(listing);

  } catch (error) {
    console.log("GET SINGLE ERROR:", error);
    next(error);
  }
});

//
// 🔹 GET / SEARCH LISTINGS (🔥 FIXED)
//
router.get("/get", async (req, res, next) => {
  try {
    console.log("QUERY:", req.query);

    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const offer =
      req.query.offer === "true" ? true : { $in: [true, false] };

    const furnished =
      req.query.furnished === "true" ? true : { $in: [true, false] };

    const parking =
      req.query.parking === "true" ? true : { $in: [true, false] };

    const type =
      req.query.type && req.query.type !== "all"
        ? req.query.type
        : { $in: ["sale", "rent"] };

    // ✅ FIX: HANDLE EMPTY STRING
    const propertyType =
      req.query.propertyType && req.query.propertyType !== ""
        ? req.query.propertyType
        : { $in: ["apartment", "villa", "farmhouse", "vacation-home", "studio", "penthouse"] };

    let searchTerm = req.query.searchTerm || "";
    searchTerm = searchTerm.toLowerCase().replace(/\s+/g, "");

    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const listings = await Listing.find({
      offer,
      furnished,
      parking,
      type,
      propertyType,
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        {
          propertyType: {
            $regex: searchTerm.replace("vacationhome", "vacation-home"),
            $options: "i",
          },
        },
      ],
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);

  } catch (error) {
    console.log("GET LISTINGS ERROR:", error);
    next(error);
  }
});

export default router;