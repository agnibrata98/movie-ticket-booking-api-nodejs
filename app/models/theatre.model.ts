import { model, Schema, Types } from "mongoose";
import Joi from "joi";
import { TheatreInterface } from "../interface/theatre.interface";

export const TheatreSchemaValidate = Joi.object({
  name: Joi.string().trim().required().min(3).messages({
    "string.empty": "Theatre name is required",
    "string.min": "Theatre name must be at least 3 characters long"
  }),

  location: Joi.string()
    .trim()
    .required()
    .messages({ "string.empty": "Location is required" }),

  numberOfScreens: Joi.number().integer().min(1).required().messages({
    "number.base": "Number of screens must be a number",
    "number.min": "There must be at least 1 screen"
  }),

  assignedMovies: Joi.array()
    .items(
      Joi.object({
        movieId: Joi.string()
          .required()
          .custom((value, helpers) => {
            if (!Types.ObjectId.isValid(value)) {
              return helpers.error("any.invalid");
            }
            return value;
          })
          .messages({
            "any.invalid": "movieId must be a valid ObjectId",
            "any.required": "movieId is required"
          }),

        screenNumber: Joi.number().integer().required().messages({
          "number.base": "screenNumber must be a number",
          "any.required": "screenNumber is required"
        }),

        showTimings: Joi.array()
          .items(
            Joi.string().pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i)
          )
          .min(1)
          .required()
          .messages({
            "array.base": "showTimings must be an array of strings",
            "string.pattern.base":
              "showTiming must be in valid 12-hour format (e.g., '10:00 AM')",
            "array.min": "At least one show timing is required"
          }),

        totalSeats: Joi.number().integer().min(1).default(100).messages({
          "number.base": "totalSeats must be a number",
          "number.min": "There must be at least 1 seat"
        }),

        availableSeats: Joi.number().integer().min(0).default(100).messages({
          "number.base": "availableSeats must be a number",
          "number.min": "availableSeats cannot be negative"
        })
      })
    )
    .optional()
});

const TheaterSchema = new Schema<TheatreInterface>(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    numberOfScreens: { type: Number, required: true },
    assignedMovies: [
      {
        movieId: { type: Schema.Types.ObjectId, ref: "Movie" },
        screenNumber: { type: Number },
        showTimings: [{ type: String }],
        totalSeats: { type: Number, default: 100 },
        availableSeats: { type: Number, default: 100 }
      }
    ]
  },
  { timestamps: true }
);

const TheatreModel = model<TheatreInterface>("Theatre", TheaterSchema);

export { TheatreModel };
