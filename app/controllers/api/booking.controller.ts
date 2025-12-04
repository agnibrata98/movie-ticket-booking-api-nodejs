import { Request, Response } from "express";
import { StatusCode } from "../../helper/StatusCode";
import { bookingRepository } from "../../repositories/booking.repository";
import { Types } from "mongoose";

class BookingController {
    async createBooking(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id; // from JWT middleware
            const { movieId, theatreId } = req.params;
            const { showTiming, numberOfTickets } = req.body;

            // ✅ Basic validation
            if (!userId || !movieId || !theatreId) {
                return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Missing required IDs (userId, theatreId, or movieId)"
                });
            }

            if (!showTiming || !numberOfTickets) {
                return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "showTiming and numberOfTickets are required"
                });
            }

            // ✅ Call repository to create booking
            const booking = await bookingRepository.createBooking({
                userId: new Types.ObjectId(userId),
                movieId: new Types.ObjectId(movieId),
                theatreId: new Types.ObjectId(theatreId),
                showTiming,
                numberOfTickets
            } as any);

            return res.status(StatusCode.CREATED).json({
                success: true,
                message: "Booking created successfully",
                data: booking
            });
           
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while creating booking"
            });
        }
    }

    async cancelBooking(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            const { bookingId } = req.params;

            if (!userId || !bookingId) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Missing required userId or bookingId"
                });
            }

            const cancelledBooking = await bookingRepository.cancelBooking(
                bookingId,
                userId
            );

            return res.status(StatusCode.OK).json({
                success: true,
                message: "Booking cancelled successfully",
                data: cancelledBooking
            });
        } catch (error: any) {
            console.error("Error cancelling booking:", error);
            return res.status(StatusCode.SERVER_ERROR).json({
                success: false,
                message: error.message || "Failed to cancel booking"
            });
        }
    }

    // List all movies with total bookings
  async getMoviesWithTotalBookings(req: Request, res: Response) {
    try {
      const moviesWithBookings = await bookingRepository.getMoviesWithTotalBookings();

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Fetched movies with total bookings successfully",
        data: moviesWithBookings
      });
    } catch (error: any) {
      console.error("Error fetching total bookings:", error);
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal Server Error while fetching total bookings"
      });
    }
  }

  // Get all booking details by theatreId
  async getBookingsByTheatreId(req: Request, res: Response) {
    try {
      const { theatreId } = req.params;

      if (!theatreId) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "theatreId is required"
        });
      }

      const bookings = await bookingRepository.getBookingsByTheatreId(theatreId);

      if (!bookings || bookings.length === 0) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "No bookings found for this theatre"
        });
      }

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Fetched all bookings for the theatre successfully",
        data: bookings
      });
    } catch (error: any) {
      console.error("Error fetching bookings by theatreId:", error);
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch bookings by theatreId"
      });
    }
  }

  async viewBookingHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id; // From JWT middleware

      if (!userId) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated"
        });
      }

      const bookingHistory = await bookingRepository.getUserBookingHistory(userId);

      if (!bookingHistory.length) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "No booking history found for this user"
        });
      }

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Booking history fetched successfully",
        data: bookingHistory
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: "Internal server error while fetching booking history"
      });
    }
  }
}

export const bookingController = new BookingController();