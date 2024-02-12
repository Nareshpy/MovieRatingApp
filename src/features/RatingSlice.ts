import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { InitialRatingState } from "../models/InitialRatingState";

export const fetchRating = createAsyncThunk("nameFetchRatings", async () => {
    const ratings = await axios.get("https://localhost:7231/api/Review");
    return ratings.data;
});
const initialState: InitialRatingState = {
    isLoading: false,
    isError: false,
    Ratings: []
}
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
    }
})
export default ratingSlice.reducer;