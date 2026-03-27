import express from "express";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

const router = express.Router();

//
// 🔹 CREATE LISTING
//
router.post("/create", async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
});

//
// 🔹 DELETE LISTING
//
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, "You can delete only your own listings"));
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
});

//
// 🔹 UPDATE LISTING
//
router.put("/update/:id", async (req, res, next) => {
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
});

//
// 🔹 GET SINGLE LISTING
//
router.get("/get/:id", async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
});

//
// 🔹 GET / SEARCH LISTINGS
//
router.get("/get", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const offer =
      req.query.offer === "false" || req.query.offer === undefined
        ? { $in: [true, false] }
        : true;

    const furnished =
      req.query.furnished === "false" || req.query.furnished === undefined
        ? { $in: [true, false] }
        : true;

    const parking =
      req.query.parking === "false" || req.query.parking === undefined
        ? { $in: [true, false] }
        : true;

    const type =
      req.query.type === "all" || req.query.type === undefined
        ? { $in: ["sale", "rent"] }
        : req.query.type;

    let searchTerm = req.query.searchTerm || "";
    searchTerm = searchTerm.toLowerCase().replace(/\s+/g, "");

    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      offer,
      furnished,
      parking,
      type,
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
    next(error);
  }
});

//
// ✅ VERY IMPORTANT (FIXES YOUR ERROR)
//
export default router;