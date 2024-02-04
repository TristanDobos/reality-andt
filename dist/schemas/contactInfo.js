"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactInfoSchema = void 0;
const mongoose = require('mongoose');
exports.ContactInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
});
//# sourceMappingURL=contactInfo.js.map