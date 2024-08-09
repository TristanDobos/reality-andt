"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingSchema = exports.PropertyType = exports.AvailabilityState = void 0;
const mongoose = require('mongoose');
exports.AvailabilityState = {
    AVAILABLE: 'available',
    RESERVED: 'reserved',
    SOLD: 'sold',
    NOT_AVAILABLE: 'not_available'
};
exports.PropertyType = {
    FAMILY_HOUSE: "family_house",
    COTTAGE: "cottage",
    COUNTRY_HOUSE: "country_house",
    FARM_ESTATE: "farm_estate",
    MOBILE_HOUSE: "mobile_house",
    HOUSE_BOAT: "houseboat",
    LOG_HOUSE: "log_house",
    GARDEN_HOUSE: "garden_house",
    BUILDING: "building",
    VILLA: "villa",
    APARTMENT: "apartment",
    HOTEL: "hotel"
};
exports.ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    location: {
        city: String,
        address: String
    },
    propertyType: {
        type: String,
        enum: Object.values(exports.PropertyType),
        required: true
    },
    rooms: Number,
    bathrooms: Number,
    floorArea: Number,
    wholeArea: Number,
    owner: {
        name: String,
        phone: String,
        address: String
    },
    photos: [String],
    listedDate: {
        type: Date,
        default: Date.now
    },
    contactInfo: {
        name: String,
        phone: String,
        email: String
    },
    availability: {
        type: String,
        enum: Object.values(exports.AvailabilityState),
        default: exports.AvailabilityState.AVAILABLE
    }
});
//# sourceMappingURL=listing.js.map