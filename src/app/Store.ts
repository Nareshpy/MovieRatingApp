import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/LoginSlice";
import moviesReducer from "../features/MoviesSlice";
import reviewsReducer from "../features/RatingSlice";
import usersReducer from "../features/UserSlice"
export const store = configureStore({
    reducer: {
        login: loginReducer,
        movies:moviesReducer,
        reviews:reviewsReducer,
        users:usersReducer
    }
});
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch