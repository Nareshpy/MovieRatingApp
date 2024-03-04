import { Movie } from "./Movie";
import { IRating } from "./Rating";

export interface IService{
    RatingOfMovie(movie: Movie, allRatings: IRating[]):number,
    getUserFromLocalStorage():string

}