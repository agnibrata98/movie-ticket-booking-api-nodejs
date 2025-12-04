import { StatusCode } from "../../helper/StatusCode";
import { Request, Response } from "express";
import { MovieSchemaValidate } from "../../models/movie.model";
import _ from "lodash";
import { movieRepositories } from "../../repositories/movie.repository";

class MovieController {
  async createMovie(req: Request, res: Response): Promise<any> {
    try {
      // Movie creation logic
      const {
        name,
        genre,
        language,
        duration,
        cast,
        director,
        releaseDate
      } = req.body;
      const movieImage = req.file ? req.file.path : "";

      // ✅ handle cast if sent as JSON string
      let parsedCast = cast;
      if (typeof cast === "string") {
        try {
          parsedCast = JSON.parse(cast);
        } catch (err) {
          return res.status(StatusCode.BAD_REQUEST).json({
            success: false,
            message: "Invalid cast format. Must be a valid JSON array."
          });
        }
      }

      const { error } = MovieSchemaValidate.validate({
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
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: error.details[0].message
        });
      }

      const newMoviedata = await movieRepositories.create({
        name,
        genre,
        language,
        duration,
        movieImage,
        cast: parsedCast,
        director,
        releaseDate
      });

      if (_.isObject(newMoviedata) && !_.isEmpty(newMoviedata)) {
        return res.status(StatusCode.CREATED).json({
          success: true,
          message: "Movie created successfully",
          data: newMoviedata
        });
      } else {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid movie data"
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  async getAllMovies(req: Request, res: Response): Promise<any> {
    try {
      const movies = await movieRepositories.findAllMoviesWithTheatres();
      if (_.isEmpty(movies)) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "No movies found"
        });
      } else {
        return res.status(StatusCode.OK).json({
          success: true,
          message: "Movies fetched successfully",
          data: movies
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: "Internal server error while fetching movies"
      });
    }
  }

  async getMovieById(req: Request, res: Response): Promise<any> {
    try {
      const movieId = req.params.movieId;
      const movie = await movieRepositories.findById(movieId);

      if (_.isEmpty(movie)) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "Movie not found"
        });
      } else {
        return res.status(StatusCode.OK).json({
          success: true,
          message: "Movie fetched successfully",
          data: movie
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: "Internal server error while fetching movie by ID"
      });
    }
  }
}

export const movieController = new MovieController();
