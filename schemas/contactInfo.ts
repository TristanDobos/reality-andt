const mongoose = require('mongoose');

export const contactInfoSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true
  },
  ownerNumber: {
    type: String,
    required: true
  },
  note: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Listing'
  }
});

