import { Types } from "mongoose";
import { MovieModel } from "../models/movie.model";

class MovieRepositories {
  // Movie repository methods would go here
  async create(movieData: any): Promise<any> {
    // Logic to create a movie in the database

    const newMovie = await MovieModel.create(movieData);
    return newMovie;
  }

  async findAllMoviesWithTheatres() {
    const result = await MovieModel.aggregate([
      {
        $lookup: {
          from: "theatres",
          let: { movieId: "$_id" },
          pipeline: [
            { $unwind: "$assignedMovies" },
            {
              $match: {
                $expr: { $eq: ["$assignedMovies.movieId", "$$movieId"] }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                location: 1,
                "assignedMovies.showTimings": 1
              }
            }
          ],
          as: "theatres"
        }
      },
      {
        $addFields: {
          totalTheatres: { $size: "$theatres" }
        }
      }
    ]);

    return result;
  }

  async findById(movieId: string): Promise<any | null> {
    // const movie = await MovieModel.aggregate([
    //   {
    //     $match: { _id: new Types.ObjectId(movieId) }
    //   },
    //   {
    //     $lookup: {
    //       from: "theatres",
    //       let: { movieIdStr: { $toString: "$_id" } },
    //       pipeline: [
    //         // { $unwind: "$assignedMovies" },
    //         {
    //           $match: {
    //             $expr: {
    //               $eq: [
    //                 { $toString: "$assignedMovies.movieId" },
    //                 "$$movieIdStr"
    //               ]
    //             }
    //           }
    //         },
    //         {
    //           $project: {
    //             _id: 1,
    //             name: 1,
    //             location: 1,
    //             "assignedMovies.screenNumber": 1,
    //             "assignedMovies.showTimings": 1,
    //             "assignedMovies.totalSeats": 1,
    //             "assignedMovies.availableSeats": 1
    //           }
    //         }
    //       ],
    //       as: "theatres"
    //     }
    //   },
    //   {
    //     $addFields: {
    //       totalTheatres: { $size: "$theatres" }
    //     }
    //   },
    //   {
    //     $project: { __v: 0 }
    //   }
    // ]);
    // const movie = await MovieModel.findById(movieId);
    // console.log(movie);

    const movie = await MovieModel.aggregate([
    {
      $match: { _id: new Types.ObjectId(movieId) }
    },
    {
      $lookup: {
        from: "theatres",
        let: { movieIdObj: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$$movieIdObj", "$assignedMovies.movieId"]
              }
            }
          },
          {
            $project: {
              name: 1,
              location: 1,
              numberOfScreens: 1,
              assignedMovies: {
                $filter: {
                  input: "$assignedMovies",
                  as: "movie",
                  cond: { $eq: ["$$movie.movieId", "$$movieIdObj"] }
                }
              }
            }
          }
        ],
        as: "theatres"
      }
    },
    {
      $addFields: {
        totalTheatres: { $size: "$theatres" }
      }
    },
    {
      $project: { __v: 0 }
    }
  ]);
    return movie[0] || null;
  }
}

const movieRepositories = new MovieRepositories();

export { movieRepositories };
