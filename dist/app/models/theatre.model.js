"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheatreModel = exports.TheatreSchemaValidate = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
exports.TheatreSchemaValidate = joi_1.default.object({
    name: joi_1.default.string().trim().required().min(3).messages({
        "string.empty": "Theatre name is required",
        "string.min": "Theatre name must be at least 3 characters long"
    }),
    location: joi_1.default.string()
        .trim()
        .required()
        .messages({ "string.empty": "Location is required" }),
    numberOfScreens: joi_1.default.number().integer().min(1).required().messages({
        "number.base": "Number of screens must be a number",
        "number.min": "There must be at least 1 screen"
    }),
    assignedMovies: joi_1.default.array()
        .items(joi_1.default.object({
        movieId: joi_1.default.string()
            .required()
            .custom((value, helpers) => {
            if (!mongoose_1.Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
            }
            return value;
        })
            .messages({
            "any.invalid": "movieId must be a valid ObjectId",
            "any.required": "movieId is required"
        }),
        screenNumber: joi_1.default.number().integer().required().messages({
            "number.base": "screenNumber must be a number",
            "any.required": "screenNumber is required"
        }),
        showTimings: joi_1.default.array()
            .items(joi_1.default.string().pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i))
            .min(1)
            .required()
            .messages({
            "array.base": "showTimings must be an array of strings",
            "string.pattern.base": "showTiming must be in valid 12-hour format (e.g., '10:00 AM')",
            "array.min": "At least one show timing is required"
        }),
        totalSeats: joi_1.default.number().integer().min(1).default(100).messages({
            "number.base": "totalSeats must be a number",
            "number.min": "There must be at least 1 seat"
        }),
        availableSeats: joi_1.default.number().integer().min(0).default(100).messages({
            "number.base": "availableSeats must be a number",
            "number.min": "availableSeats cannot be negative"
        })
    }))
        .optional()
});
const TheaterSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    numberOfScreens: { type: Number, required: true },
    assignedMovies: [
        {
            movieId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Movie" },
            screenNumber: { type: Number },
            showTimings: [{ type: String }],
            totalSeats: { type: Number, default: 100 },
            availableSeats: { type: Number, default: 100 }
        }
    ]
}, { timestamps: true });
const TheatreModel = (0, mongoose_1.model)("Theatre", TheaterSchema);
exports.TheatreModel = TheatreModel;
