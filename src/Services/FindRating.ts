import { Movie } from "../models/Movie";
import { IRating } from "../models/Rating";
export const RatingOfMovie = (movie: Movie, allRatings: IRating[]) => {
    const allRatingsOfMovie = allRatings.filter((rating) => rating.movieId === movie.id);
    let ratingSum = 0;
    allRatingsOfMovie.forEach((review) => {
        ratingSum += review.rating
    })
    return allRatingsOfMovie.length > 0 ? Number((ratingSum / allRatingsOfMovie.length).toPrecision(2)) : 0;
}