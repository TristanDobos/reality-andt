"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactInfoSchema = void 0;
const mongoose = require('mongoose');
exports.contactInfoSchema = new mongoose.Schema({
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
//# sourceMappingURL=contactInfo.js.map