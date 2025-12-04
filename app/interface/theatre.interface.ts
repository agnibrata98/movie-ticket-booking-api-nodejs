import { Types } from "mongoose";

export interface TheatreMovieInterface {
  movieId: Types.ObjectId;
  screenNumber: number;
  showTimings: string[]; // e.g. ["10:00 AM", "1:30 PM", "7:00 PM"]
  totalSeats: number;
  availableSeats: number;
}

export interface TheatreInterface {
  name: string;
  location: string;
  numberOfScreens: number;
  assignedMovies: TheatreMovieInterface[];
  createdAt?: Date;
  updatedAt?: Date;
}