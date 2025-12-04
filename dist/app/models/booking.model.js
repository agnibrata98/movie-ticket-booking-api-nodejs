"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = exports.BookingSchemaValidate = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
exports.BookingSchemaValidate = joi_1.default.object({
    userId: joi_1.default.string()
        .required()
        .custom((value, helpers) => {
        if (!mongoose_1.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
        .messages({
        "any.invalid": "Invalid userId format",
        "any.required": "userId is required",
        "string.empty": "userId cannot be empty"
    }),
    movieId: joi_1.default.string()
        .required()
        .custom((value, helpers) => {
        if (!mongoose_1.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
        .messages({
        "any.invalid": "Invalid movieId format",
        "any.required": "movieId is required",
        "string.empty": "movieId cannot be empty"
    }),
    theatreId: joi_1.default.string()
        .required()
        .custom((value, helpers) => {
        if (!mongoose_1.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
        .messages({
        "any.invalid": "Invalid theaterId format",
        "any.required": "theaterId is required",
        "string.empty": "theaterId cannot be empty"
    }),
    showTiming: joi_1.default.string()
        .required()
        .pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i)
        .messages({
        "string.empty": "Show timing is required",
        "string.pattern.base": "showTiming must be in valid 12-hour format (e.g., '10:00 AM')"
    }),
    numberOfTickets: joi_1.default.number().integer().min(1).required().messages({
        "number.base": "Number of tickets must be a number",
        "number.min": "At least 1 ticket must be booked",
        "any.required": "numberOfTickets is required"
    }),
    totalAmount: joi_1.default.number().min(0).required().messages({
        "number.base": "Total amount must be a number",
        "number.min": "Total amount cannot be negative",
        "any.required": "totalAmount is required"
    }),
    status: joi_1.default.string().valid("booked", "cancelled").default("booked").messages({
        "any.only": "Status must be either 'booked' or 'cancelled'"
    })
});
const BookingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Movie", required: true },
    theatreId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Theater", required: true },
    showTiming: { type: String, required: true },
    numberOfTickets: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["booked", "cancelled"],
        default: "booked"
    }
}, { timestamps: true });
const BookingModel = (0, mongoose_1.model)("Booking", BookingSchema);
exports.BookingModel = BookingModel;
