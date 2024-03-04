import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";

import { User } from "../models/User";
import { InitialUsersState } from "../models/InitialUsersState";
import { headers } from "../Constants";

export const fetchUsers = createAsyncThunk<User[],void>("nameFetchUsers", async () => {
    const users = await axios.get("https://localhost:7231/api/Reviewer");
    return users.data;
});
export const addUser=createAsyncThunk("nameAddUser",async (user:User)=>{
   await axios.post("https://localhost:7231/api/Reviewer", user, { headers: headers });
   
})

const initialState:InitialUsersState={
    isLoading: false,
    isError: false,
    users: []
};

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
        buildQueries.addCase(addUser.fulfilled,()=>{})
    }
});

export default usersSlice.reducer;
