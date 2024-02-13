import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './Carousel.css'
import Slider from 'react-slick'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { deleteMovie, fetchMovies, setCurrentMovie } from '../../features/MoviesSlice'
import { CiFilter } from "react-icons/ci";
import { AppDispatch, RootState } from '../../app/Store'
import { carouselProps } from '../../models/CarouselProps'
import { Movie } from '../../models/Movie'
import { useNavigate } from 'react-router-dom'
import { RatingOfMovie } from '../../Services/FindRating'
import { Rating } from 'react-simple-star-rating';
import { Box, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { MdOutlineEdit } from 'react-icons/md';
import { AiOutlineDelete } from "react-icons/ai";
import { MovieForm } from '../movieForm/MovieForm';
export const Carousel = (props: carouselProps) => {
  const [category, setCategory] = React.useState<string>('All');
  const searchedMovie = useSelector((state: RootState) => state.movies.searchedMovie);
  const [labelText, setLabelText] = useState<string>('')
  const sliderRef = React.createRef<Slider>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const allMovies = useSelector((state: RootState) => state.movies.movies)
  const allRatings = useSelector((state: RootState) => state.reviews.Ratings)
  const [moviesForCarousel, setMoviesForCarousel] = useState<Movie[]>([])

  useEffect(() => {
    labelForCarousel();
  }, [allMovies, category, searchedMovie]);
  useEffect(() => { }, [allMovies]);
  const categories = { Action: "Action", Love: "Love", Thriller: "Thriller", All: "All" };
  const labelForCarousel = () => {
    if (props.filterType === "All" && Object.values(categories).includes(category) && searchedMovie === undefined) {
      setLabelText(`${category} Movies`);
      if (category === categories.All) {

        setMoviesForCarousel(allMovies);
      }
      else {
        setMoviesForCarousel(allMovies.filter((movie) => movie.category === category))

      }

    }
    else if (props.filterType === "New" && Object.values(categories).includes(category) && searchedMovie === undefined) {
      setLabelText(`Recently Released ${category === categories.All ? "" : category} Movies`);
      if (category === categories.All) {
        setMoviesForCarousel(allMovies.slice(0, 10))
      }
      else {
        setMoviesForCarousel(allMovies.slice(0, 10).filter((movie) => movie.category === category))
      }
    }
    else if (props.filterType === "None" && category === categories.All && searchedMovie !== undefined) {
      setLabelText("Search Result Movie");

      const searchedmov = searchedMovie.length ? allMovies.filter((mov) => mov.id === searchedMovie[0].id) : [];
      if (searchedmov) {
        setMoviesForCarousel(searchedMovie);
      }

    }
  }
  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };
  const handleDelete = (movid: number) => {
    dispatch(deleteMovie(movid)).then(() => {
      dispatch(fetchMovies());
    }).catch(()=>{
      console.log("not deleted")
    });
  }
  
  const sliderSettings = {
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    draggable: true,
    focusOnSelect: true,
    swipe: true,
    arrows: false,
    slidesToShow: Math.min(moviesForCarousel.length, 5),
    slidesToScroll: 3,
    infinite: true,
    rows: 1
  }
  const ratingOfMovie = (movie: Movie) => {
    return RatingOfMovie(movie, allRatings)
  }
  const categorySelect = () => {
    return (
      <Box sx={{ width: '120px' }}>
        <FormControl sx={{}} fullWidth className='Formcontrol'>
          {/* <InputLabel id="demo-simple-select-label" className='categorylabel'>Category</InputLabel> */}
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category} className='dropdown'
            label="Category"
            onChange={handleChange}
            color='primary'
          // variant='outlined'
          >
            <MenuItem value={categories.All}>{categories.All}</MenuItem>
            <MenuItem value={categories.Action}>{categories.Action}</MenuItem>
            <MenuItem value={categories.Love}>{categories.Love}</MenuItem>
            <MenuItem value={categories.Thriller}>{categories.Thriller}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    )
  }
  return (
    <div className='content'>
      <div className='category-parent'>
        <div className='category'>{labelText}</div>
        <div className='category-dropdown'><div className='filter-icon-div'><CiFilter></CiFilter><div>Category</div></div>{categorySelect()}</div>
      </div>
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
            return (<>
              <div key={movie.id} className='carousel-item' onClick=
                {() => {
                  navigate(`/MovieDetails/${movie.id}`);
                  dispatch(setCurrentMovie(movie));
                }} >
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
              <div className='basic-data-parent opt'>
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
            </>
            )
          })
        }
      </Slider>
    </div>
  )
}