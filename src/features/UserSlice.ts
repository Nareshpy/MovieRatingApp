import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../models/User";
import axios from "axios";
import { InitialUsersState } from "../models/InitialUsersState";

export const fetchUsers = createAsyncThunk<User[],void>("nameFetchUsers", async () => {
    const users = await axios.get("https://localhost:7231/api/Reviewer");
    return users.data;
})
const initialState:InitialUsersState={
    isLoading: false,
    isError: false,
    users: []
}
export const usersSlice=createSlice({
    name:"users",
    initialState:initialState,
    reducers:{},
    extraReducers:(buildQueries)=>{
        buildQueries.addCase(fetchUsers.pending,(state)=>{state.isLoading=true});
        buildQueries.addCase(fetchUsers.fulfilled,(state,action)=>{
            state.users=action.payload;
            state.isLoading=false;
        })
        buildQueries.addCase(fetchUsers.rejected,(state)=>{
            state.isError=true;
            state.isLoading=false;
        })
    }
})
export default usersSlice.reducer;
