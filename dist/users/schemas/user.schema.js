"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose = require("mongoose");
const now = () => Math.floor(Date.now() / 1000);
exports.UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: {
        type: [String],
    },
    admin: {
        type: Boolean,
        default: false,
    },
    resetKey: {
        type: String,
    },
    removed: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
    },
    createdAt: {
        type: Number,
        required: true,
        default: now
    },
});
//# sourceMappingURL=user.schema.js.map