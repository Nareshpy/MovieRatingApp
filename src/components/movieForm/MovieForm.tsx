import { useEffect, useState } from "react";
import { Movie } from "../../models/Movie";
import './MovieForm.css'
import axios from "axios";
import { GiCancel } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { PopUp } from "../PopUp";
export const MovieForm = () => {
   const [moviePicture, setMoviePicture] = useState<File | null>(null);
   const navigate=useNavigate();
   const [togglePopUp,setTogglePopUp]=useState<boolean>(false);
    const [msg,setMsg]=useState<string>("")
   const [movieData,setMovieData]=useState<Movie>({movieName:"",category:"",moviePoster:"",releaseDate:new Date()});
   useEffect(()=>{
      if(movieData.moviePoster){
         if(movieData.moviePoster.length>0){
            addMovie();
         }
      }
   },[movieData.moviePoster]);
   const headers={'Content-Type': 'application/json'};
   const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setMovieData((prevData)=>({...prevData,[name]:value}))
    };
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
      if (e?.target.files && e.target.files.length > 0) {
         const file = e.target.files[0];
         setMoviePicture(file)
      }
      else {
         setMoviePicture(null);
      }
   };
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (moviePicture)
       {
         const reader = new FileReader();
         reader.readAsDataURL(moviePicture);
         reader.onload = function (event) {
            setMovieData((prevData)=>(
               {...prevData,moviePoster:(event.target?.result as string).split(',')[1]} 
            ));
            
         };
      } 
   };
   
   const addMovie=async ()=>{
   await axios.post("https://localhost:7231/api/Movie",movieData,{headers:headers}).then((response)=>{
      console.log(response);
      setMsg("Movie added successfully");
      setTogglePopUp(true);
   }).catch(()=>{
      setMsg("Something went wrong");
   });
   setTimeout(()=>{setTogglePopUp(false)},1000);
   
}
   return (

      <div className="modal-parent">
      {togglePopUp?<PopUp msg={msg}/>:<></>}
         
      <dialog open className="movie-form-modal " id="login-modal">
      <div className="movieform-cancel-icon" >           
                    <GiCancel onClick={() => { 
                        navigate(-1)
            }} /></div>
         <form id="movie-form" className="form-wrapper wrapper" onSubmit={(e) => handleSubmit(e)}>
         <div> <label htmlFor="MovieName">Movie Name</label></div>
         <div><input className="input-group" type="text" id="MovieName" name="movieName" onChange={(e)=>handleInputChange(e)} required/></div>
         <div><label htmlFor="ReleaseDate">Release Date</label></div>
         <div><input className="input-group" type="date" id="ReleaseDate" name="ReleaseDate" onChange={(e) => handleInputChange(e)} required/></div>
         <div><label htmlFor="Category">Category</label></div>
         <div><input className="input-group" type="text" id="Category" name="category" onChange={(e) => handleInputChange(e)} required /></div>
         <div><label htmlFor="MoviePoster">Upload movie poster</label></div>
         <div><input className="input-group" type="file" id="MoviePoster" name="MoviePoster" onChange={(e) => handleFileChange(e)} required/></div>
         <div><button type="submit">save</button></div>
      </form>
      </dialog>
      </div>
   )
}