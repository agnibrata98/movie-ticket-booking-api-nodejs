import { model, Schema, Types } from "mongoose";
import Joi from "joi";
import { BookingInterface } from "../interface/booking.interface";

export const BookingSchemaValidate = Joi.object({
  userId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Invalid userId format",
      "any.required": "userId is required",
      "string.empty": "userId cannot be empty"
    }),

  movieId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Invalid movieId format",
      "any.required": "movieId is required",
      "string.empty": "movieId cannot be empty"
    }),

  theatreId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Invalid theaterId format",
      "any.required": "theaterId is required",
      "string.empty": "theaterId cannot be empty"
    }),

  showTiming: Joi.string()
    .required()
    .pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i)
    .messages({
      "string.empty": "Show timing is required",
      "string.pattern.base":
        "showTiming must be in valid 12-hour format (e.g., '10:00 AM')"
    }),

  numberOfTickets: Joi.number().integer().min(1).required().messages({
    "number.base": "Number of tickets must be a number",
    "number.min": "At least 1 ticket must be booked",
    "any.required": "numberOfTickets is required"
  }),

  totalAmount: Joi.number().min(0).required().messages({
    "number.base": "Total amount must be a number",
    "number.min": "Total amount cannot be negative",
    "any.required": "totalAmount is required"
  }),

  status: Joi.string().valid("booked", "cancelled").default("booked").messages({
    "any.only": "Status must be either 'booked' or 'cancelled'"
  })
});

const BookingSchema = new Schema<BookingInterface>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    theatreId: { type: Schema.Types.ObjectId, ref: "Theater", required: true },
    showTiming: { type: String, required: true },
    numberOfTickets: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked"
    }
  },
  { timestamps: true }
);

const BookingModel = model<BookingInterface>("Booking", BookingSchema);

export { BookingModel };
