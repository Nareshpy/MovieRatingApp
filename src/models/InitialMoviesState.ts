import { Movie } from "./Movie";

export interface initialMoviesState{
    isLoading:boolean,
    isError:boolean,
    movies:Movie[],
    currentMovie:Movie,
    searchedMovie?:Movie[]
}