"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubSchema = void 0;
const mongoose = require("mongoose");
const now = () => Math.floor(Date.now() / 1000);
exports.SubSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Number,
        required: true,
        default: now
    }
});
//# sourceMappingURL=sub.schema.js.map