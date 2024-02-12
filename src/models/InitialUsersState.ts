import { User } from "./User";

export interface InitialUsersState{
    isLoading:boolean,
    isError:boolean,
    users:User[]
}