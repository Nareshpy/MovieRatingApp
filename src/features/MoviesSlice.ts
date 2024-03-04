import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

import axios from "axios";

import { Movie } from "../models/Movie";
import { initialMoviesState } from "../models/InitialMoviesState";
import { headers } from "../Constants";

export const fetchMovies = createAsyncThunk<Movie[],void>("nameFetchMovies", async () => {
    const movies = await axios.get("https://localhost:7231/api/Movie");
    return movies.data;
});

export const fetchMovieByName=createAsyncThunk("nameFetchMovieByName",async (movName:string)=>{
    const movie= await axios.get(`https://localhost:7231/api/Movie/getMovieByName/${movName}`);
    return movie.data;
});

export const editMovie=createAsyncThunk("nameEditMovie",async (movie:Movie)=>{
   await axios.put(`https://localhost:7231/api/Movie/${movie.id}`, movie, { headers: headers });
});

export const addNewMovie=createAsyncThunk("nameAddMovie",async (movie:Movie)=>{
   const response=await axios.post("https://localhost:7231/api/Movie", movie, { headers: headers });
   return response.data;
})

export const deleteMovie=createAsyncThunk(
    "nameDeleteMovie", async (movId:number)=>{
        await axios.delete(`https://localhost:7231/api/Movie/${movId}`);
    }
);

const initialState:initialMoviesState={
    isLoading:false,
    isError:false,
    movies:[],
    currentMovie:{
        movieName: "",
        releaseDate: new Date(),
        category: ""
    }
};

export const moviesSlice = createSlice({
    name: "movies",
    initialState: initialState,
    reducers: {
        setCurrentMovie:(state,action:PayloadAction<Movie>)=>{
        const payload=action.payload;
        state.currentMovie.category=payload.category;
        state.currentMovie.id=payload.id;
        state.currentMovie.movieName=payload.movieName;
        state.currentMovie.moviePoster=payload.moviePoster;
        state.currentMovie.releaseDate=payload.releaseDate
        }
    },
    extraReducers: (buildQueries) => {
        buildQueries.addCase(fetchMovies.pending, (state) => { state.isLoading = true })
        buildQueries.addCase(fetchMovies.fulfilled,(state,action)=>
        {
            state.movies=action.payload;
            state.isLoading=false;
            
        }
        )
        buildQueries.addCase(fetchMovies.rejected,(state)=>{
            state.isError=true;
            state.isLoading=false;
        })
        buildQueries.addCase(fetchMovieByName.fulfilled,(state,action)=>{
            state.searchedMovie=action.payload
        })
        buildQueries.addCase(fetchMovieByName.rejected,(state)=>{
            state.searchedMovie=undefined
        })
        buildQueries.addCase(deleteMovie.fulfilled,()=>{})
        buildQueries.addCase(editMovie.fulfilled,()=>{})
        buildQueries.addCase(addNewMovie.fulfilled,()=>{})
    }
});
export default moviesSlice.reducer;
export const {setCurrentMovie}=moviesSlice.actions;
