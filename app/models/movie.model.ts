import { model, Schema, Types } from "mongoose";
import Joi, { required } from "joi";
import { MovieInterface } from "../interface/movie.interface";

//validation schema
export const MovieSchemaValidate = Joi.object({
  name: Joi.string().trim().required().min(3).messages({
    "string.empty": "Movie name is required",
    "string.min": "Movie name must be at least 3 characters long"
  }),

  genre: Joi.string()
    .required()
    .messages({ "string.empty": "Genre is required" }),

  language: Joi.string()
    .required()
    .messages({ "string.empty": "Language is required" }),

  duration: Joi.string()
    .required()
    .pattern(/^[0-9]+h\s?[0-9]*m?$/) // optional: enforce format like "2h 30m"
    .messages({
      "string.empty": "Duration is required",
      "string.pattern.base":
        "Duration must be in a valid format (e.g., '2h 30m')"
    }),
  movieImage: Joi.string().required(),

  cast: Joi.array()
    .items(Joi.string().trim().min(2))
    .required()
    .min(1)
    .messages({
      "array.base": "Cast must be an array of strings",
      "array.min": "At least one cast member is required"
    }),

  director: Joi.string()
    .trim()
    .required()
    .messages({ "string.empty": "Director name is required" }),

  releaseDate: Joi.date().required().messages({
    "any.required": "Release date is required",
    "date.base": "Release date must be a valid date"
  })
});

const MovieSchema = new Schema<MovieInterface>(
  {
    name: { type: String, required: true, trim: true },
    genre: { type: String, required: true },
    language: { type: String, required: true },
    duration: { type: String, required: true },
    movieImage: { type: String, required: true },
    cast: [{ type: String }],
    director: { type: String },
    releaseDate: { type: Date, required: true }
  },
  { timestamps: true }
);

const MovieModel = model<MovieInterface>("Movie", MovieSchema);

export { MovieModel };
