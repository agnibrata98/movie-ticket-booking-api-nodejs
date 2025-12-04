import express from 'express';
import { verifyUserRoleToken } from '../../middleware/VerifyUserRoleToken';
import { theatreController } from '../../controllers/api/theatre.controller';


const theatreRouter=express.Router()

// get method [get] for getting user profile
theatreRouter.post('/create-theatre', verifyUserRoleToken(["admin"]), theatreController.createTheatre);

// get method [get] for getting all theatres
theatreRouter.get('/get-theatres', verifyUserRoleToken(["admin"]), theatreController.getAllTheatres);

// assign movies to theatre
theatreRouter.patch('/assign-movies/:theatreId', verifyUserRoleToken(["admin"]), theatreController.assignMoviesToTheatre);

export {theatreRouter};