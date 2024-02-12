import { IRating } from "./Rating";

export interface InitialRatingState{
    isLoading:boolean,
    isError:boolean,
    Ratings:IRating[]

}