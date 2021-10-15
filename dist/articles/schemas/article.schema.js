"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleSchema = void 0;
const mongoose = require("mongoose");
const now = () => Math.floor(Date.now() / 1000);
exports.ArticleSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        maxlength: 100,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    tags: [String],
    brief: {
        type: String
    },
    image: {
        type: String
    },
    attr: {
        type: String
    },
    text: {
        type: String,
    },
    public: {
        type: Boolean,
        default: false
    },
    comments: [{
            name: {
                type: String,
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Number,
                required: true,
                default: now
            }
        }],
    clicks: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Number,
        default: now
    },
    updatedAt: {
        type: Number,
        default: now
    }
});
exports.ArticleSchema.index({ '$**': 'text' });
//# sourceMappingURL=article.schema.js.map