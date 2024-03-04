import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";

import { InitialRatingState } from "../models/InitialRatingState";
import { IRating } from "../models/Rating";
import { headers } from "../Constants";

export const fetchRating = createAsyncThunk("nameFetchRatings", async () => {
    const ratings = await axios.get("https://localhost:7231/api/Review");
    return ratings.data;
});

export const addReview=createAsyncThunk("nameAddReview",async (userReview:IRating)=>{
   await axios.post("https://localhost:7231/api/Review", userReview, { headers: headers });
});

export const editReview=createAsyncThunk("nameEditReview",async (userReview:IRating)=>{
   await axios.put(`https://localhost:7231/api/Review/${userReview.id}?reviewerId=${userReview.reviewerId}&movieId=${userReview.movieId}`, userReview, { headers: headers })
});

const initialState: InitialRatingState = {
    isLoading: false,
    isError: false,
    Ratings: []
};

export const ratingSlice = createSlice({
    name: "ratings",
    initialState: initialState,
    reducers: {
        
    },
    extraReducers: (buildQueries) => {
        buildQueries.addCase(fetchRating.pending, (state) => { state.isLoading = true })
        buildQueries.addCase(fetchRating.fulfilled, (state, action) => {
            state.Ratings = action.payload
                state.isLoading = false
        })
        buildQueries.addCase(fetchRating.rejected, (state) => {
            state.isError = true
                state.isLoading = false
        })
        buildQueries.addCase(addReview.fulfilled,()=>{})
        buildQueries.addCase(editReview.fulfilled,()=>{})
    }
})
export default ratingSlice.reducer;