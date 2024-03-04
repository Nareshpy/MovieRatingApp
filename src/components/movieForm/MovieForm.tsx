import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { GiCancel } from "react-icons/gi";

import { PopUp } from "../popup/PopUp";
import { Movie } from "../../models/Movie";
import { AppDispatch, RootState } from "../../app/Store";
import { addNewMovie, editMovie, fetchMovies } from "../../features/MoviesSlice";
import { categoriesOfMovie } from "../../Constants";

import './MovieForm.css';

export const MovieForm = () => {

   const params = useParams();
   const navigate = useNavigate();
   const dispatch = useDispatch<AppDispatch>();

   const movie = useSelector((state: RootState) => state.movies.movies.find((mov) => mov.id === Number(params.id)));

   const [moviePicture, setMoviePicture] = useState<File | null>(null);
   const [togglePopUp, setTogglePopUp] = useState<boolean>(false);
   const [msg, setMsg] = useState<string>("");
   const [isSubmitted,SetSubmit]=useState<boolean>(false);
   const [movieData, setMovieData] = useState<Movie>({ movieName: "", category: categoriesOfMovie.Action, moviePoster: "", releaseDate: new Date() });

   useEffect(() => {
      if (movieData.moviePoster) {
         if (movieData.moviePoster.length > 0 && isSubmitted) {
               addMovie();
         }
      }

   }, [movieData.moviePoster]);

   useEffect(() => {
      if (movie) {
         setMovieData({ id: movie.id, movieName: movie.movieName, moviePoster: movie.moviePoster, category: movie.category, releaseDate: new Date(movie.releaseDate) });
      }
   }, []);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setMovieData((prevData) => ({ ...prevData, [name]: e.target.type === "date" ? new Date(value) : value }))
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
      if (e?.target.files && e.target.files.length > 0) {
         const file = e.target.files[0];
         setMoviePicture(file);
      }
      else {
         setMoviePicture(null);
      }
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      SetSubmit(true);
      if(movie){
         addMovie();
      }
      else if (moviePicture) {
         const reader = new FileReader();
         reader.readAsDataURL(moviePicture);
         reader.onload = function (event) {
            setMovieData((prevData) => (
               { ...prevData, moviePoster: (event.target?.result as string).split(',')[1] }
            ));
         };
      }
   };

   const addMovie = () => {
      if (movie) {
         //axios.put(`https://localhost:7231/api/Movie/${movie.id}`, movieData, { headers: headers })
         dispatch(editMovie(movieData)).then(() => {
            dispatch(fetchMovies());
            setMsg("Movie edited successfully");
            setTogglePopUp(true);
         });
      }
      else {
         //axios.post("https://localhost:7231/api/Movie", movieData, { headers: headers })
         dispatch(addNewMovie(movieData)).then(() => {
            //console.log(response);
            dispatch(fetchMovies());
            setMsg("Movie added successfully");
            setTogglePopUp(true);
         }).catch(() => {
            setMsg("Something went wrong");
         });
      }
      setTimeout(() => {
         setTogglePopUp(false);
         window.history.length === 2 ? navigate('/') : navigate(-1)
      }, 1000);

   };

   return (
      <div className="modal-parent">
         {togglePopUp ? <PopUp msg={msg} /> : <></>}

         <dialog open className="movie-form-modal " id="login-modal">
            <div className="movieform-cancel-icon" >
               <GiCancel onClick={() => {
                  //navigate(-1)
                  window.history.length === 2 ? navigate('/') : navigate(-1)
                  //window.history.go(-1);
               }} /></div>
            <form id="movie-form" className="form-wrapper wrapper" onSubmit={(e) => handleSubmit(e)}>
               <div> <label htmlFor="MovieName">Movie Name</label></div>
               <div><input className="input-group" type="text" id="MovieName" name="movieName" onChange={(e) => handleInputChange(e)} value={movieData.movieName} required /></div>
               <div><label htmlFor="releaseDate">Release Date</label></div>
               <div><input className="input-group" type="date" id="releaseDate" name="releaseDate" onChange={(e) => handleInputChange(e)} value={movieData.releaseDate.toISOString().split('T')[0]} required /></div>
               <div><label htmlFor="Category">Category</label></div>
               <div>
                  <select name="category" className="input-group" value={movieData.category} onChange={(e)=>handleInputChange(e)}>
                     {Object.keys(categoriesOfMovie).map((key) =>
                        <option className="opt" value={key}>{key}</option>
                     )
                     }
                  </select>
               </div>
               {/* <div><input className="input-group" type="text" id="Category" name="category" onChange={(e) => handleInputChange(e)} value={movieData.category} required /></div> */}
               {!movie && <><div><label htmlFor="MoviePoster">Upload movie poster</label></div>
                  <div><input className="input-group" type="file" id="MoviePoster" name="MoviePoster" onChange={(e) => handleFileChange(e)} required /></div>
               </>}
               <div><button type="submit">save</button></div>
            </form>
         </dialog>
      </div>
   )
}