import { User } from "./User";
export interface initialLoginState{
    isLoginClicked:boolean,
    isSignUpClicked:boolean,
    currentUser:User,
    popupMessage:string
}