import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    latitude: {
  type: Number,
  default: 0,
},
longitude: {
  type: Number,
  default: 0,
},

    regularPrice: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      required: true,
    },

    bathrooms: {
      type: Number,
      required: true,
    },

    bedrooms: {
      type: Number,
      required: true,
    },

    furnished: {
      type: Boolean,
      required: true,
    },

    parking: {
      type: Boolean,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    offer: {
      type: Boolean,
      required: true,
    },

    imageUrls: {
      type: Array,
      required: true,
    },

    propertyType: {
      type: String,
      required: true,
    },

    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;