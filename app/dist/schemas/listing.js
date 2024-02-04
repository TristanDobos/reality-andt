"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingSchema = void 0;
const mongoose = require('mongoose');
const AvailabilityState = {
    AVAILABLE: 'available',
    RESERVED: 'reserved',
    SOLD: 'sold',
    NOT_AVAILABLE: 'not_available'
};
const PropertyType = {
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
        zipCode: String,
        address: String
    },
    propertyType: {
        type: String,
        enum: Object.values(PropertyType),
        required: true
    },
    rooms: Number,
    bathrooms: Number,
    area: Number,
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
        enum: Object.values(AvailabilityState),
        default: AvailabilityState.AVAILABLE
    }
});
//# sourceMappingURL=listing.js.map