"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const StatusCode_1 = require("../../helper/StatusCode");
const booking_repository_1 = require("../../repositories/booking.repository");
const mongoose_1 = require("mongoose");
class BookingController {
    async createBooking(req, res) {
        try {
            const userId = req.user?.id; // from JWT middleware
            const { movieId, theatreId } = req.params;
            const { showTiming, numberOfTickets } = req.body;
            // ✅ Basic validation
            if (!userId || !movieId || !theatreId) {
                return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Missing required IDs (userId, theatreId, or movieId)"
                });
            }
            if (!showTiming || !numberOfTickets) {
                return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "showTiming and numberOfTickets are required"
                });
            }
            // ✅ Call repository to create booking
            const booking = await booking_repository_1.bookingRepository.createBooking({
                userId: new mongoose_1.Types.ObjectId(userId),
                movieId: new mongoose_1.Types.ObjectId(movieId),
                theatreId: new mongoose_1.Types.ObjectId(theatreId),
                showTiming,
                numberOfTickets
            });
            return res.status(StatusCode_1.StatusCode.CREATED).json({
                success: true,
                message: "Booking created successfully",
                data: booking
            });
        }
        catch (error) {
            console.log(error);
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while creating booking"
            });
        }
    }
    async cancelBooking(req, res) {
        try {
            const userId = req.user?.id;
            const { bookingId } = req.params;
            if (!userId || !bookingId) {
                return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Missing required userId or bookingId"
                });
            }
            const cancelledBooking = await booking_repository_1.bookingRepository.cancelBooking(bookingId, userId);
            return res.status(StatusCode_1.StatusCode.OK).json({
                success: true,
                message: "Booking cancelled successfully",
                data: cancelledBooking
            });
        }
        catch (error) {
            console.error("Error cancelling booking:", error);
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message || "Failed to cancel booking"
            });
        }
    }
    // List all movies with total bookings
    async getMoviesWithTotalBookings(req, res) {
        try {
            const moviesWithBookings = await booking_repository_1.bookingRepository.getMoviesWithTotalBookings();
            return res.status(StatusCode_1.StatusCode.OK).json({
                success: true,
                message: "Fetched movies with total bookings successfully",
                data: moviesWithBookings
            });
        }
        catch (error) {
            console.error("Error fetching total bookings:", error);
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message || "Internal Server Error while fetching total bookings"
            });
        }
    }
    // Get all booking details by theatreId
    async getBookingsByTheatreId(req, res) {
        try {
            const { theatreId } = req.params;
            if (!theatreId) {
                return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "theatreId is required"
                });
            }
            const bookings = await booking_repository_1.bookingRepository.getBookingsByTheatreId(theatreId);
            if (!bookings || bookings.length === 0) {
                return res.status(StatusCode_1.StatusCode.NOT_FOUND).json({
                    success: false,
                    message: "No bookings found for this theatre"
                });
            }
            return res.status(StatusCode_1.StatusCode.OK).json({
                success: true,
                message: "Fetched all bookings for the theatre successfully",
                data: bookings
            });
        }
        catch (error) {
            console.error("Error fetching bookings by theatreId:", error);
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message || "Failed to fetch bookings by theatreId"
            });
        }
    }
    async viewBookingHistory(req, res) {
        try {
            const userId = req.user?.id; // From JWT middleware
            if (!userId) {
                return res.status(StatusCode_1.StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "User not authenticated"
                });
            }
            const bookingHistory = await booking_repository_1.bookingRepository.getUserBookingHistory(userId);
            if (!bookingHistory.length) {
                return res.status(StatusCode_1.StatusCode.NOT_FOUND).json({
                    success: false,
                    message: "No booking history found for this user"
                });
            }
            return res.status(StatusCode_1.StatusCode.OK).json({
                success: true,
                message: "Booking history fetched successfully",
                data: bookingHistory
            });
        }
        catch (error) {
            console.error(error);
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while fetching booking history"
            });
        }
    }
}
exports.bookingController = new BookingController();
