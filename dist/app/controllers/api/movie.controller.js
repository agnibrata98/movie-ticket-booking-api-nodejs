"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieController = void 0;
const StatusCode_1 = require("../../helper/StatusCode");
const movie_model_1 = require("../../models/movie.model");
const lodash_1 = __importDefault(require("lodash"));
const movie_repository_1 = require("../../repositories/movie.repository");
class MovieController {
    async createMovie(req, res) {
        try {
            // Movie creation logic
            const { name, genre, language, duration, cast, director, releaseDate } = req.body;
            const movieImage = req.file ? req.file.path : "";
            // ✅ handle cast if sent as JSON string
            let parsedCast = cast;
            if (typeof cast === "string") {
                try {
                    parsedCast = JSON.parse(cast);
                }
                catch (err) {
                    return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid cast format. Must be a valid JSON array."
                    });
                }
            }
            const { error } = movie_model_1.MovieSchemaValidate.validate({
                name,
                genre,
                language,
                duration,
                movieImage,
                cast: parsedCast,
                director,
                releaseDate
            });
            if (error) {
                return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: error.details[0].message
                });
            }
            const newMoviedata = await movie_repository_1.movieRepositories.create({
                name,
                genre,
                language,
                duration,
                movieImage,
                cast: parsedCast,
                director,
                releaseDate
            });
            if (lodash_1.default.isObject(newMoviedata) && !lodash_1.default.isEmpty(newMoviedata)) {
                return res.status(StatusCode_1.StatusCode.CREATED).json({
                    success: true,
                    message: "Movie created successfully",
                    data: newMoviedata
                });
            }
            else {
                return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid movie data"
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
    async getAllMovies(req, res) {
        try {
            const movies = await movie_repository_1.movieRepositories.findAllMoviesWithTheatres();
            if (lodash_1.default.isEmpty(movies)) {
                return res.status(StatusCode_1.StatusCode.NOT_FOUND).json({
                    success: false,
                    message: "No movies found"
                });
            }
            else {
                return res.status(StatusCode_1.StatusCode.OK).json({
                    success: true,
                    message: "Movies fetched successfully",
                    data: movies
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while fetching movies"
            });
        }
    }
    async getMovieById(req, res) {
        try {
            const movieId = req.params.movieId;
            const movie = await movie_repository_1.movieRepositories.findById(movieId);
            if (lodash_1.default.isEmpty(movie)) {
                return res.status(StatusCode_1.StatusCode.NOT_FOUND).json({
                    success: false,
                    message: "Movie not found"
                });
            }
            else {
                return res.status(StatusCode_1.StatusCode.OK).json({
                    success: true,
                    message: "Movie fetched successfully",
                    data: movie
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while fetching movie by ID"
            });
        }
    }
}
exports.movieController = new MovieController();
