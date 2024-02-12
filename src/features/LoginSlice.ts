import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { initialLoginState } from "../models/InitialState";
import { User } from "../models/User";
const initialLoggedinState:initialLoginState = {
    isLoginClicked:false,
    isSignUpClicked:false,
    currentUser:{
    id:0,
    firstName:"",
    lastName:"",
    email :"",
    role:""
    },
    popupMessage:""
};
export const loginSlice=createSlice({
    name:"login",
    initialState:initialLoggedinState,
    reducers:{
        openLogin:(state)=>{
          state.isLoginClicked=true;
        },
        closeLogin:(state)=>{
          state.isLoginClicked=false;
        },
        openSingnUp:(state)=>{
           state.isSignUpClicked=true;
        },
        closeSingnUp:(state)=>{
          state.isSignUpClicked=false;
        },
        setpopupMessage:(state,action:PayloadAction<string>)=>{
          state.popupMessage=action.payload;
        },
        setCurrentUser:(state,action:PayloadAction<User>)=>
        {
          const payload=action.payload;
          state.currentUser.id=payload.id;
          state.currentUser.email=payload.email;
          state.currentUser.firstName=payload.firstName;
          state.currentUser.lastName=payload.lastName;
          state.currentUser.role=payload.role;
        }
    }
})
export default loginSlice.reducer;
export const {openLogin,closeLogin,openSingnUp,closeSingnUp,setCurrentUser,setpopupMessage} = loginSlice.actions;