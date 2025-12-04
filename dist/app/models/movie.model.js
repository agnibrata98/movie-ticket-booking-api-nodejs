"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieModel = exports.MovieSchemaValidate = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
//validation schema
exports.MovieSchemaValidate = joi_1.default.object({
    name: joi_1.default.string().trim().required().min(3).messages({
        "string.empty": "Movie name is required",
        "string.min": "Movie name must be at least 3 characters long"
    }),
    genre: joi_1.default.string()
        .required()
        .messages({ "string.empty": "Genre is required" }),
    language: joi_1.default.string()
        .required()
        .messages({ "string.empty": "Language is required" }),
    duration: joi_1.default.string()
        .required()
        .pattern(/^[0-9]+h\s?[0-9]*m?$/) // optional: enforce format like "2h 30m"
        .messages({
        "string.empty": "Duration is required",
        "string.pattern.base": "Duration must be in a valid format (e.g., '2h 30m')"
    }),
    movieImage: joi_1.default.string().required(),
    cast: joi_1.default.array()
        .items(joi_1.default.string().trim().min(2))
        .required()
        .min(1)
        .messages({
        "array.base": "Cast must be an array of strings",
        "array.min": "At least one cast member is required"
    }),
    director: joi_1.default.string()
        .trim()
        .required()
        .messages({ "string.empty": "Director name is required" }),
    releaseDate: joi_1.default.date().required().messages({
        "any.required": "Release date is required",
        "date.base": "Release date must be a valid date"
    })
});
const MovieSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    genre: { type: String, required: true },
    language: { type: String, required: true },
    duration: { type: String, required: true },
    movieImage: { type: String, required: true },
    cast: [{ type: String }],
    director: { type: String },
    releaseDate: { type: Date, required: true }
}, { timestamps: true });
const MovieModel = (0, mongoose_1.model)("Movie", MovieSchema);
exports.MovieModel = MovieModel;
