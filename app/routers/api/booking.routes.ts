import express from 'express';
import { verifyUserRoleToken } from '../../middleware/VerifyUserRoleToken';
import { bookingController } from '../../controllers/api/booking.controller';


const bookingRouter=express.Router()

// post method [post] for creating a booking
bookingRouter.post('/book/:movieId/:theatreId', verifyUserRoleToken(["user"]), bookingController.createBooking);

// put method for cancelling any booking
bookingRouter.put("/cancel/:bookingId", verifyUserRoleToken(["user"]), bookingController.cancelBooking);

// List movies with total bookings (admin or user)
bookingRouter.get("/movies/total-bookings", verifyUserRoleToken(["admin"]), bookingController.getMoviesWithTotalBookings);

// Get all booking details for a given theatre (admin only)
bookingRouter.get("/theatre/:theatreId/bookings", verifyUserRoleToken(["admin"]), bookingController.getBookingsByTheatreId);

// User can view their booking history
bookingRouter.get("/history", verifyUserRoleToken(["user"]), bookingController.viewBookingHistory);

export {bookingRouter};