"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.theatreRepositories = void 0;
const theatre_model_1 = require("../models/theatre.model");
class TheatreRepositories {
    // Movie repository methods would go here
    async create(theatreData) {
        // Logic to create a movie in the database
        const newTheatre = await theatre_model_1.TheatreModel.create(theatreData);
        return newTheatre;
    }
    // Get all theatres
    async findAll() {
        const theatres = await theatre_model_1.TheatreModel.aggregate([
            {
                $lookup: {
                    from: "movies", // collection name (Mongoose auto-pluralizes)
                    localField: "assignedMovies.movieId",
                    foreignField: "_id",
                    as: "movieDetails"
                }
            },
            {
                $addFields: {
                    assignedMovies: {
                        $map: {
                            input: "$assignedMovies",
                            as: "assigned",
                            in: {
                                $mergeObjects: [
                                    "$$assigned",
                                    {
                                        movie: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$movieDetails",
                                                        as: "m",
                                                        cond: { $eq: ["$$m._id", "$$assigned.movieId"] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    movieDetails: 0, // Remove temp joined array
                    __v: 0
                }
            }
        ]);
        return theatres;
    }
    // Assign movies to a theatre
    async assignMovies(theatreId, assignedMovies) {
        // Validate theatre existence
        const theatre = await theatre_model_1.TheatreModel.findById(theatreId);
        if (!theatre) {
            throw new Error("Theatre not found");
        }
        // Push new movies into existing assignedMovies array
        theatre.assignedMovies.push(...assignedMovies);
        await theatre.save();
        return theatre;
    }
}
const theatreRepositories = new TheatreRepositories();
exports.theatreRepositories = theatreRepositories;
