import express from 'express';
import { verifyUserRoleToken } from '../../middleware/VerifyUserRoleToken';
import { movieController } from '../../controllers/api/movie.controller';
import movieImageUpload from '../../helper/MovieImageUpload';


const movieRouter=express.Router()

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management APIs
 */


/**
 * @swagger
 * /movie/create-movie:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     description: |
 *       Admin-only route.  
 *       Creates a movie with title, description, genre, release date, and poster image.  
 *       Accepts **multipart/form-data** for image upload.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - genre
 *               - releaseDate
 *               - movieImage
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Interstellar"
 *               description:
 *                 type: string
 *                 example: "A team of explorers travel beyond this galaxy to discover whether mankind has a future among the stars."
 *               genre:
 *                 type: string
 *                 example: "Sci-Fi"
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2014-11-07"
 *               movieImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (admin only)
 */
// get method [get] for getting user profile
movieRouter.post('/create-movie', verifyUserRoleToken(["admin"]), movieImageUpload.single('movieImage') ,movieController.createMovie);


/**
 * @swagger
 * /movie/get-movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     description: Fetches the list of all movies.  
 *       Accessible by users and admin.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Movie list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "65df90b123a4c9ff12a5e890"
 *                   title:
 *                     type: string
 *                     example: "Inception"
 *                   genre:
 *                     type: string
 *                     example: "Sci-Fi"
 *                   movieImage:
 *                     type: string
 *                     example: "http://localhost:8000/uploads/movies/inception.jpg"
 *       401:
 *         description: Unauthorized
 */
// get method [get] for getting all movies
movieRouter.get('/get-movies', verifyUserRoleToken(["user", "admin"]), movieController.getAllMovies);


/**
 * @swagger
 * /movie/get-movie/{movieId}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movies]
 *     description: Fetches a single movie by its unique ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *           example: "65df90b123a4c9ff12a5e890"
 *         description: MongoDB Movie ID
 *     responses:
 *       200:
 *         description: Movie details fetched successfully
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 */
// get method [get] for getting movie by id
movieRouter.get('/get-movie/:movieId', verifyUserRoleToken(["user", "admin"]), movieController.getMovieById);

export {movieRouter};