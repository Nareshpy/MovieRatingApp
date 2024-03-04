import { IService } from "../models/IService";
import { Movie } from "../models/Movie";
import { IRating } from "../models/Rating";

export default class Service implements IService{
    public RatingOfMovie(movie: Movie, allRatings: IRating[]):number{
        const allRatingsOfMovie = allRatings.filter((rating) => rating.movieId === movie.id);
        let ratingSum = 0;
        allRatingsOfMovie.forEach((review) => {
            ratingSum += review.rating
        })
        return allRatingsOfMovie.length > 0 ? Number((ratingSum / allRatingsOfMovie.length).toPrecision(2)) : 0;
    };
    public getUserFromLocalStorage(): string{
        const user = localStorage.getItem("currentUser");
        if (user !== null) {
            return user
        }
        else {
            return ""
        }
    };  
}