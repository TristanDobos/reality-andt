const mongoose = require('mongoose');

export const realEstateSchema = new mongoose.Schema({
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
    state: String,
    country: String,
    zipCode: String,
    address: String
  },
  propertyType: {
    type: String,
    enum: ['House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Other'],
    required: true
  },
  bedrooms: Number,
  bathrooms: Number,
  squareFeet: Number,
  amenities: [String],
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
  isAvailable: {
    type: Boolean,
    default: true
  }
});

