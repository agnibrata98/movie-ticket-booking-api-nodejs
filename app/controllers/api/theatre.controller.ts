import { Request, Response } from "express";
import { TheatreSchemaValidate } from "../../models/theatre.model";
import { StatusCode } from "../../helper/StatusCode";
import { theatreRepositories } from "../../repositories/theatre.repository";
import _ from "lodash";

class TheatreController {
    async createTheatre(req: Request, res: Response) {
        try {
            const { name, location, numberOfScreens, assignedMovies } = req.body;

            // ✅ If assignedMovies comes as string, try parsing it
            let parsedAssignedMovies = assignedMovies;
            if (typeof assignedMovies === "string") {
                try {
                    parsedAssignedMovies = JSON.parse(assignedMovies);
                } catch {
                    return res.status(StatusCode.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid format for assignedMovies. Must be valid JSON."
                    });
                }
            }

            // ✅ Validate using Joi
            const { error } = TheatreSchemaValidate.validate({
                name,
                location,
                numberOfScreens,
                assignedMovies: parsedAssignedMovies
            });

            if (error) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            // ✅ Create theatre (assignedMovies optional)
            const newTheatre = await theatreRepositories.create({
                name,
                location,
                numberOfScreens,
                assignedMovies: parsedAssignedMovies || []
            });

            return res.status(StatusCode.CREATED).json({
                success: true,
                message: "Theatre created successfully",
                data: newTheatre
            });
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while creating theatre"
            });
        }
    }

    async getAllTheatres(req: Request, res: Response) {
        try {
            const theatres = await theatreRepositories.findAll();
            if(_.isEmpty(theatres)) {
                return res.status(StatusCode.NOT_FOUND).json({
                    success: false,
                    message: "No theatres found"
                });
            } else {
                return res.status(StatusCode.OK).json({
                    success: true,
                    message: "Theatres fetched successfully",
                    data: theatres
                });
            }
        } catch (error) {
          console.log(error);
            return res.status(StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while fetching theatres"
            });  
        }
    }

    async assignMoviesToTheatre(req: Request, res: Response) {
        try {
            const { theatreId } = req.params;
            let { assignedMovies } = req.body;

            // Parse if coming as string (from Postman)
            if (typeof assignedMovies === "string") {
                assignedMovies = JSON.parse(assignedMovies);
            }

            if (!Array.isArray(assignedMovies)) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "assignedMovies must be an array"
                });
            }

            const updatedTheatre = await theatreRepositories.assignMovies(
                theatreId,
                assignedMovies
            );

            res.status(StatusCode.OK).json({
                success: true,
                message: "Movies assigned successfully",
                data: updatedTheatre
            });
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while assigning movies to theatre"
            });
        }
    }
}

export const theatreController = new TheatreController();