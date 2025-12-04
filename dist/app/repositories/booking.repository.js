"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRepository = void 0;
const mongoose_1 = require("mongoose");
const booking_model_1 = require("../models/booking.model");
const theatre_model_1 = require("../models/theatre.model");
class BookingRepository {
    async createBooking(data) {
        const { userId, theatreId, movieId, showTiming, numberOfTickets } = data;
        // ✅ Validate ObjectIds
        if (!mongoose_1.Types.ObjectId.isValid(userId) ||
            !mongoose_1.Types.ObjectId.isValid(theatreId) ||
            !mongoose_1.Types.ObjectId.isValid(movieId)) {
            throw new Error("Invalid IDs provided");
        }
        // ✅ Find theatre and assigned movie
        const theatre = await theatre_model_1.TheatreModel.findById(theatreId);
        if (!theatre)
            throw new Error("Theatre not found");
        const assignedMovie = theatre.assignedMovies.find((m) => m.movieId.toString() === movieId.toString() &&
            m.showTimings.includes(showTiming));
        if (!assignedMovie) {
            throw new Error("This movie is not assigned to this theatre for the selected timing");
        }
        // ✅ Check seat availability
        if (assignedMovie.availableSeats < numberOfTickets) {
            throw new Error("Not enough seats available");
        }
        // ✅ Calculate total amount (fixed price per ticket)
        const pricePerTicket = 250;
        const totalAmount = pricePerTicket * numberOfTickets;
        // ✅ Create and save booking
        const booking = await booking_model_1.BookingModel.create({
            userId,
            theatreId,
            movieId,
            showTiming,
            numberOfTickets,
            totalAmount,
            status: "booked"
        });
        // ✅ Update available seats in theatre
        assignedMovie.availableSeats -= numberOfTickets;
        await theatre.save();
        return booking;
    }
    async cancelBooking(bookingId, userId) {
        // ✅ Validate IDs
        if (!mongoose_1.Types.ObjectId.isValid(bookingId) || !mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid bookingId or userId");
        }
        // ✅ Find booking
        const booking = await booking_model_1.BookingModel.findById(bookingId);
        if (!booking)
            throw new Error("Booking not found");
        // ✅ Ensure booking belongs to user
        if (booking.userId.toString() !== userId.toString()) {
            throw new Error("You are not authorized to cancel this booking");
        }
        // ✅ Check if already cancelled
        if (booking.status === "cancelled") {
            throw new Error("Booking is already cancelled");
        }
        // ✅ Find theatre and update seat availability
        const theatre = await theatre_model_1.TheatreModel.findById(booking.theatreId);
        if (!theatre)
            throw new Error("Theatre not found");
        const assignedMovie = theatre.assignedMovies.find((m) => m.movieId.toString() === booking.movieId.toString() &&
            m.showTimings.includes(booking.showTiming));
        if (assignedMovie) {
            assignedMovie.availableSeats += booking.numberOfTickets;
            await theatre.save();
        }
        // ✅ Update booking status
        booking.status = "cancelled";
        await booking.save();
        return booking;
    }
    //  Fetch all movies with total tickets booked
    async getMoviesWithTotalBookings() {
        const results = await booking_model_1.BookingModel.aggregate([
            {
                $match: { status: "booked" } // ✅ Count only active bookings
            },
            {
                $group: {
                    _id: "$movieId",
                    totalTicketsBooked: { $sum: "$numberOfTickets" }
                }
            },
            {
                $lookup: {
                    from: "movies",
                    localField: "_id",
                    foreignField: "_id",
                    as: "movieDetails"
                }
            },
            {
                $unwind: "$movieDetails"
            },
            {
                $project: {
                    _id: 0,
                    movieId: "$_id",
                    name: "$movieDetails.name",
                    genre: "$movieDetails.genre",
                    language: "$movieDetails.language",
                    totalTicketsBooked: 1
                }
            },
            {
                $sort: { totalTicketsBooked: -1 } // 🧮 Sort by popularity (optional)
            }
        ]);
        return results;
    }
    // Fetch all booking details for a given theatre
    async getBookingsByTheatreId(theatreId) {
        // Validate ObjectId
        if (!mongoose_1.Types.ObjectId.isValid(theatreId)) {
            throw new Error("Invalid theatreId format");
        }
        const results = await booking_model_1.BookingModel.aggregate([
            {
                $match: {
                    theatreId: new mongoose_1.Types.ObjectId(theatreId),
                    status: "booked"
                }
            },
            {
                $group: {
                    _id: {
                        movieId: "$movieId",
                        showTiming: "$showTiming"
                    },
                    totalTicketsBooked: { $sum: "$numberOfTickets" },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            },
            {
                $lookup: {
                    from: "movies",
                    localField: "_id.movieId",
                    foreignField: "_id",
                    as: "movieDetails"
                }
            },
            { $unwind: "$movieDetails" },
            {
                $project: {
                    _id: 0,
                    movieId: "$_id.movieId",
                    movieName: "$movieDetails.name",
                    genre: "$movieDetails.genre",
                    showTiming: "$_id.showTiming",
                    totalTicketsBooked: 1,
                    totalRevenue: 1
                }
            },
            {
                $sort: { movieName: 1, showTiming: 1 }
            }
        ]);
        return results;
    }
    async getUserBookingHistory(userId) {
        try {
            const userObjectId = new mongoose_1.Types.ObjectId(userId);
            // console.log("Fetching bookings for user:", userObjectId); // Debug log
            const bookings = await booking_model_1.BookingModel.aggregate([
                { $match: { userId: userObjectId } },
                {
                    $lookup: {
                        from: "movies",
                        localField: "movieId",
                        foreignField: "_id",
                        as: "movieDetails"
                    }
                },
                {
                    $lookup: {
                        from: "theatres",
                        localField: "theatreId",
                        foreignField: "_id",
                        as: "theatreDetails"
                    }
                },
                { $unwind: "$movieDetails" },
                { $unwind: "$theatreDetails" },
                {
                    $project: {
                        _id: 1,
                        showTiming: 1,
                        numberOfTickets: 1,
                        totalAmount: 1,
                        status: 1,
                        createdAt: 1,
                        "movieDetails.name": 1,
                        "movieDetails.genre": 1,
                        "movieDetails.language": 1,
                        "movieDetails.duration": 1,
                        "theatreDetails.name": 1,
                        "theatreDetails.location": 1
                    }
                },
                { $sort: { createdAt: -1 } } // show latest first
            ]);
            return bookings;
        }
        catch (error) {
            console.error("Error fetching booking history:", error);
            throw error;
        }
    }
}
const bookingRepository = new BookingRepository();
exports.bookingRepository = bookingRepository;
