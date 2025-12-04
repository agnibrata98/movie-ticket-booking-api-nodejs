import { Types } from "mongoose";

export interface BookingInterface {
  userId: Types.ObjectId;
  movieId: Types.ObjectId;
  theatreId: Types.ObjectId;
  showTiming: string;
  numberOfTickets: number;
  totalAmount: number;
  status: "booked" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}