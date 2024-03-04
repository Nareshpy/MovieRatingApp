import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { Rating } from 'react-simple-star-rating';
import { Box, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { MdOutlineEdit } from 'react-icons/md';
import { AiOutlineDelete } from "react-icons/ai";

import { Movie } from '../../models/Movie'
import Service from '../../Services/Service';

import { deleteMovie, fetchMovies, setCurrentMovie } from '../../features/MoviesSlice'
import { AppDispatch, RootState } from '../../app/Store'
import { carouselProps } from '../../models/CarouselProps'
import { categoriesOfDisplay } from '../../Constants';

import './Carousel.css'
import { PopUp } from '../popup/PopUp';

export const Carousel = (props: carouselProps) => {

  const serviceObj=new Service();
  const sliderRef = React.createRef<Slider>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const searchedMovie = useSelector((state: RootState) => state.movies.searchedMovie);
  const user = useSelector((state: RootState) => state.login.currentUser);
  const allMovies = useSelector((state: RootState) => state.movies.movies);
  const allRatings = useSelector((state: RootState) => state.reviews.Ratings);

  const [category, setCategory] = React.useState<string>('All');
  const [labelText, setLabelText] = useState<string>('');
  const [moviesForCarousel, setMoviesForCarousel] = useState<Movie[]>([]);
  const [togglePopUp,setTogglePopUp]=useState<boolean>(false);
  const [msg,SetMsg]=useState<string>("");
 
  useEffect(() => {
    labelForCarousel();
  }, [allMovies, category, searchedMovie]);

  useEffect(() => { }, [allMovies]);

  const labelForCarousel = () => {
    if (props.filterType === "All" && Object.values(categoriesOfDisplay).includes(category) && searchedMovie === undefined) {
      setLabelText(`${category} Movies`);
      if (category === categoriesOfDisplay.All) {
        setMoviesForCarousel(allMovies);
      }
      else {
        setMoviesForCarousel(allMovies.filter((movie) => movie.category === category))
      }

    }
    else if (props.filterType === "New" && Object.values(categoriesOfDisplay).includes(category) && searchedMovie === undefined) {
      setLabelText(`Recently Released ${category === categoriesOfDisplay.All ? "" : category} Movies`);
      if (category === categoriesOfDisplay.All) {
        setMoviesForCarousel(allMovies.slice(0, 10))
      }
      else {
        setMoviesForCarousel(allMovies.slice(0, 10).filter((movie) => movie.category === category))
      }
    }
    else if (props.filterType === "None" && category === categoriesOfDisplay.All && searchedMovie !== undefined) {
     // setLabelText("Search Result Movie");
      const searchedmov = searchedMovie.length ? allMovies.filter((mov) => mov.id === searchedMovie[0].id) : [];
      if (searchedmov) {
        setMoviesForCarousel(searchedMovie);
      }

    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handleDelete = (movid: number) => {
    dispatch(deleteMovie(movid)).then(() => {
      setTogglePopUp(true);
      SetMsg("Movie deleted successfully");
      dispatch(fetchMovies());
    }).catch(()=>{
      console.log("not deleted")
    });
    setTimeout(()=>{setTogglePopUp(false)},1000);
  };
  
  const sliderSettings = {
    className: "center",
    centerMode: true,
    centerPadding: "50px",
    draggable: true,
    focusOnSelect: true,
    swipe: true,
    arrows: false,
    slidesToShow: Math.min(moviesForCarousel.length, 5),
    slidesToScroll: 1,
    // infinite: true,
    rows: 1
  };

  const ratingOfMovie = (movie: Movie) => {
    return serviceObj.RatingOfMovie(movie,allRatings);
    //return RatingOfMovie(movie, allRatings)
  };

  const categorySelect = () => {
    return (
      <Box sx={{ width: '120px' }}>
        <FormControl sx={{}} fullWidth className='Formcontrol'>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category} className='dropdown'
            label="Category"
            onChange={handleChange}
            color='primary'
          >
            <MenuItem value={categoriesOfDisplay.All}>{categoriesOfDisplay.All}</MenuItem>
            <MenuItem value={categoriesOfDisplay.Action}>{categoriesOfDisplay.Action}</MenuItem>
            <MenuItem value={categoriesOfDisplay.Love}>{categoriesOfDisplay.Love}</MenuItem>
            <MenuItem value={categoriesOfDisplay.Thriller}>{categoriesOfDisplay.Thriller}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    )
  };

  return (<>
  {togglePopUp?<PopUp msg={msg}/>:<></>}
    <div className='content'>
      {props.showLabel&&<div className='category-parent'>
        <div className='category'>{labelText}</div>
        <div className='category-dropdown'><div className='filter-icon-div'><CiFilter></CiFilter><div>Category</div></div>{categorySelect()}</div>
      </div>}
      <div className='controls'>
        <div>
          <button onClick={() => sliderRef?.current?.slickPrev()}>
            <FaChevronLeft />
          </button>
        </div>
        <div>
          <button onClick={() => sliderRef?.current?.slickNext()}>
            <FaChevronRight />
          </button>
        </div>
      </div>
      <Slider ref={sliderRef} {...sliderSettings}>
        {
          moviesForCarousel.map((movie, index) => {
            return (<div className='carousel-item-parent' key={movie.id}>
              <div  className='carousel-item' onClick=
                {() => {
                  navigate(`/MovieDetails/${movie.id}`);
                  dispatch(setCurrentMovie(movie));
                }}>
                <img className='carousel-img' src={`data:"image/jpeg";base64,${movie.moviePoster}`} alt={movie.movieName} />
                <div className='basic-data-parent'>
                  <div className='movie-basic-data'>
                    <div className='moviename'>
                      {movie.movieName}
                    </div>
                    <div className='stars'><Rating initialValue={ratingOfMovie(movie)} readonly /></div>
                  </div>
                  <div className='movie-basic-data'>
                    <div className=''>
                      Rating
                    </div>
                    <div className=''>{ratingOfMovie(movie) < 1 ? "N/A" : ratingOfMovie(movie)}</div>
                  </div>
                </div>
              </div>
              {user.role==='Admin'?
              <div className='basic-data-parent opts'>
                <div className='movie-basic-data-opt' onClick={()=>{navigate(`/MovieForm/${movie.id}`)}}>
                  <div className='moviename-opt'>
                    Edit
                  </div>
                  <div className='stars'><MdOutlineEdit /></div>
                </div>
                <div className='movie-basic-data-opt' onClick={() => {
                  handleDelete(movie.id ? movie.id : 0);
                }}>
                  <div className='moviename-opt'>
                    Delete
                  </div>
                  <div className=''><AiOutlineDelete /></div>
                </div>
              </div>
              :<></>}
            </div>
            )
          })
        }
      </Slider>
    </div>
    </>
  )
}