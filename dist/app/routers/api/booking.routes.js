"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRouter = void 0;
const express_1 = __importDefault(require("express"));
const VerifyUserRoleToken_1 = require("../../middleware/VerifyUserRoleToken");
const booking_controller_1 = require("../../controllers/api/booking.controller");
const bookingRouter = express_1.default.Router();
exports.bookingRouter = bookingRouter;
/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Movie booking and ticket management APIs
 */
/**
 * @swagger
 * /booking/book/{movieId}/{theatreId}:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     description: |
 *       User-only route.
 *       Creates a booking for a specific movie in a specific theatre.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *           example: "65df90b111c4aa7012b7e990"
 *         description: Movie ID
 *       - in: path
 *         name: theatreId
 *         required: true
 *         schema:
 *           type: string
 *           example: "65df90b222c4aa7012c7e991"
 *         description: Theatre ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - seats
 *             properties:
 *               seats:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [5, 6, 7]
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid input or seats unavailable
 *       401:
 *         description: Unauthorized (User required)
 */
// post method [post] for creating a booking
bookingRouter.post('/book/:movieId/:theatreId', (0, VerifyUserRoleToken_1.verifyUserRoleToken)(["user"]), booking_controller_1.bookingController.createBooking);
/**
 * @swagger
 * /booking/cancel/{bookingId}:
 *   put:
 *     summary: Cancel a booking
 *     tags: [Booking]
 *     description: |
 *       User-only route.
 *       Cancels a booking using booking ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *           example: "65df90b333c4aa7012c7e992"
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       404:
 *         description: Booking not found
 *       401:
 *         description: Unauthorized
 */
// put method for cancelling any booking
bookingRouter.put("/cancel/:bookingId", (0, VerifyUserRoleToken_1.verifyUserRoleToken)(["user"]), booking_controller_1.bookingController.cancelBooking);
/**
 * @swagger
 * /booking/movies/total-bookings:
 *   get:
 *     summary: List movies with total bookings
 *     tags: [Booking]
 *     description: |
 *       Admin-only route.
 *       Returns a list of all movies with their total booking counts.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Movie booking statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   movieId:
 *                     type: string
 *                   title:
 *                     type: string
 *                   totalBookings:
 *                     type: number
 *                 example:
 *                   movieId: "65df90b444c4aa7012c7e993"
 *                   title: "Avatar 2"
 *                   totalBookings: 120
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
// List movies with total bookings (admin or user)
bookingRouter.get("/movies/total-bookings", (0, VerifyUserRoleToken_1.verifyUserRoleToken)(["admin"]), booking_controller_1.bookingController.getMoviesWithTotalBookings);
/**
 * @swagger
 * /booking/theatre/{theatreId}/bookings:
 *   get:
 *     summary: Get all booking details for a theatre
 *     tags: [Booking]
 *     description: |
 *       Admin-only route.
 *       Returns all bookings for a specific theatre.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: theatreId
 *         required: true
 *         schema:
 *           type: string
 *           example: "65df90b555c4aa7012c7e994"
 *         description: Theatre ID
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *       404:
 *         description: Theatre not found or no bookings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
// Get all booking details for a given theatre (admin only)
bookingRouter.get("/theatre/:theatreId/bookings", (0, VerifyUserRoleToken_1.verifyUserRoleToken)(["admin"]), booking_controller_1.bookingController.getBookingsByTheatreId);
/**
 * @swagger
 * /booking/history:
 *   get:
 *     summary: View user's booking history
 *     tags: [Booking]
 *     description: |
 *       User-only route.
 *       Returns booking history for the logged-in user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Booking history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
// User can view their booking history
bookingRouter.get("/history", (0, VerifyUserRoleToken_1.verifyUserRoleToken)(["user"]), booking_controller_1.bookingController.viewBookingHistory);
