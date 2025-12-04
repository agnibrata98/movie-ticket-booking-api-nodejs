"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theatreController = void 0;
const theatre_model_1 = require("../../models/theatre.model");
const StatusCode_1 = require("../../helper/StatusCode");
const theatre_repository_1 = require("../../repositories/theatre.repository");
const lodash_1 = __importDefault(require("lodash"));
class TheatreController {
    async createTheatre(req, res) {
        try {
            const { name, location, numberOfScreens, assignedMovies } = req.body;
            // ✅ If assignedMovies comes as string, try parsing it
            let parsedAssignedMovies = assignedMovies;
            if (typeof assignedMovies === "string") {
                try {
                    parsedAssignedMovies = JSON.parse(assignedMovies);
                }
                catch {
                    return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid format for assignedMovies. Must be valid JSON."
                    });
                }
            }
            // ✅ Validate using Joi
            const { error } = theatre_model_1.TheatreSchemaValidate.validate({
                name,
                location,
                numberOfScreens,
                assignedMovies: parsedAssignedMovies
            });
            if (error) {
                return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: error.details[0].message
                });
            }
            // ✅ Create theatre (assignedMovies optional)
            const newTheatre = await theatre_repository_1.theatreRepositories.create({
                name,
                location,
                numberOfScreens,
                assignedMovies: parsedAssignedMovies || []
            });
            return res.status(StatusCode_1.StatusCode.CREATED).json({
                success: true,
                message: "Theatre created successfully",
                data: newTheatre
            });
        }
        catch (error) {
            console.log(error);
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while creating theatre"
            });
        }
    }
    async getAllTheatres(req, res) {
        try {
            const theatres = await theatre_repository_1.theatreRepositories.findAll();
            if (lodash_1.default.isEmpty(theatres)) {
                return res.status(StatusCode_1.StatusCode.NOT_FOUND).json({
                    success: false,
                    message: "No theatres found"
                });
            }
            else {
                return res.status(StatusCode_1.StatusCode.OK).json({
                    success: true,
                    message: "Theatres fetched successfully",
                    data: theatres
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while fetching theatres"
            });
        }
    }
    async assignMoviesToTheatre(req, res) {
        try {
            const { theatreId } = req.params;
            let { assignedMovies } = req.body;
            // Parse if coming as string (from Postman)
            if (typeof assignedMovies === "string") {
                assignedMovies = JSON.parse(assignedMovies);
            }
            if (!Array.isArray(assignedMovies)) {
                return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "assignedMovies must be an array"
                });
            }
            const updatedTheatre = await theatre_repository_1.theatreRepositories.assignMovies(theatreId, assignedMovies);
            res.status(StatusCode_1.StatusCode.OK).json({
                success: true,
                message: "Movies assigned successfully",
                data: updatedTheatre
            });
        }
        catch (error) {
            console.log(error);
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while assigning movies to theatre"
            });
        }
    }
}
exports.theatreController = new TheatreController();
