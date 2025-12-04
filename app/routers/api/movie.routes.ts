import express from 'express';
import { verifyUserRoleToken } from '../../middleware/VerifyUserRoleToken';
import { movieController } from '../../controllers/api/movie.controller';
import movieImageUpload from '../../helper/MovieImageUpload';


const movieRouter=express.Router()

// get method [get] for getting user profile
movieRouter.post('/create-movie', verifyUserRoleToken(["admin"]), movieImageUpload.single('movieImage') ,movieController.createMovie);

// get method [get] for getting all movies
movieRouter.get('/get-movies', verifyUserRoleToken(["user", "admin"]), movieController.getAllMovies);

// get method [get] for getting movie by id
movieRouter.get('/get-movie/:movieId', verifyUserRoleToken(["user", "admin"]), movieController.getMovieById);

export {movieRouter};