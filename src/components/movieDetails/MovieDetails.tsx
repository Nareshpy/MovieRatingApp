import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import { GrPowerReset } from "react-icons/gr";
import axios from "axios";
import { addReview, editReview, fetchRating } from "../../features/RatingSlice";
import { Rating } from "react-simple-star-rating";
import { MdModeEdit } from "react-icons/md";
import { GiCancel } from "react-icons/gi";

import { PopUp}  from "../popup/PopUp";
import { IRating } from "../../models/Rating";
import { AppDispatch, RootState } from "../../app/Store";
import Service from "../../Services/Service";
import { headers } from "../../Constants";

import "./MovieDetails.css";
import { editMovie } from "../../features/MoviesSlice";


export const MovieDetails = () => {

    const serviceObj=new Service();
    //const headers = { 'Content-Type': 'application/json' };
    const params=useParams()
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();

    const [movieId, setMovieId] = useState<number>(0);
    const [userReview,setUserReview]=useState<IRating>();
    const user = useSelector((state: RootState) => state.login.currentUser);
    const movie = useSelector((state: RootState) => state.movies.movies.find((mov) => mov.id === movieId));
    const allUsers = useSelector((state: RootState) => state.users.users);
    const allRatings = useSelector((state: RootState) => state.reviews.Ratings);
    const curMovieReviews = useSelector((state: RootState) => (state.reviews.Ratings.filter((rating) => rating.movieId === movieId)));
    //const userReview = allRatings.find((review) => (review.reviewerId === user.id) && (review.movieId === movie?.id));
    
    useEffect(()=>{
        console.log(user.id,movie?.id);
        setUserReview(allRatings.find((review) => (review.reviewerId === user.id) && (review.movieId === movie?.id)))
    },[allRatings,movie]);
    const [toggleCommentsInput, setToggleCommentsInput] = useState<boolean>(false);
    const [togglePopUp,setTogglePopUp]=useState<boolean>(false);
    const [msg,setMsg]=useState<string>("");
    const [usersComment, setUserComment] = useState<IRating>({
        comment: userReview ? userReview.comment : "",
        rating: userReview ? userReview.rating : 0,
        reviewerId: user.id,
        movieId: movie?.id
    });
    
    useEffect(() => {
        //let path = location.pathname.split('/')
        //setMovieId(Number(path[path.length - 1]));
        setMovieId(Number(params.id));
        setUserComment({ ...usersComment, movieId: Number(params.id) })
    }, [location]);
    
    useEffect(() => {
        setUserComment({ ...usersComment, movieId: movie?.id,reviewerId:user.id,id:userReview?.id,rating:userReview ? userReview.rating : 0 ,comment: userReview ? userReview.comment : "" });
    }, [userReview, movieId, movie,user]);

    const addComment =  () => {
        if (userReview) {
            //axios.put(`https://localhost:7231/api/Review/${userReview.id}?reviewerId=${usersComment.reviewerId}&movieId=${usersComment.movieId}`, usersComment, { headers: headers }).
            dispatch(editReview(usersComment)).then((res) => {
             dispatch(fetchRating()).then((res)=>{console.log(res);});
                setUserComment({ comment: "", movieId: 0, reviewerId: 0, rating: 0 });
                setMsg("Rating edited successfully");
                setTogglePopUp(true);
            }).catch((err)=>{
            });
            setToggleCommentsInput(false);
            setTimeout(()=>{setTogglePopUp(false)},1000);
            console.log(userReview);
        }
        else {
             //axios.post("https://localhost:7231/api/Review", usersComment, { headers: headers }).
             dispatch(addReview(usersComment)).then((res) => {
                dispatch(fetchRating());
                setMsg("Rating Added successfully");
                setTogglePopUp(true);
                setUserComment({ ...usersComment })
            }
            );
            setToggleCommentsInput(false);
            setTimeout(()=>{setTogglePopUp(false)},1000);
        }
    };

    const findUserName = (review: IRating) => {
        const currentUser = allUsers.find((user) => (user.id === review.reviewerId));
        return currentUser?.firstName;
    };

    const handleRating = (rate: number) => {
        setUserComment({ ...usersComment, rating: rate });
    };

    const findRatingOfMovie = () => {
        if (movie) {
            return  serviceObj.RatingOfMovie(movie, allRatings)
        }
    };

    const commentsInput = () => {
        return (
            <>
                <div className="comments-input">
                {(user.id!==0 && user!==undefined && userReview!==undefined) ?
                <div className="comments-cancelicon" ><GiCancel onClick={() => {
                   setToggleCommentsInput(false);
                }} /></div>:<></>}
                    <div><p>Give your rating</p></div>
                    <div><textarea className="test" value={usersComment.comment} onChange={(e) => {
                        setUserComment({ ...usersComment, comment: e.target.value })
                    }} rows={4} /></div>
                    <div className="rateing-parent-container">
                        <div className='rating-parent'>
                            <div>Rating</div>
                            <div>{usersComment.rating === undefined ? "0" : usersComment.rating}</div>
                            <div> <Rating onClick={handleRating} initialValue={usersComment.rating} /></div>
                            <div><GrPowerReset onClick={() => {
                                setUserComment((usersComment)=>({ ...usersComment, rating: 0 }))
                            }
                            } /></div>
                        </div>
                        <div className="btn-div tooltip" >
                            <button onClick={() => { addComment() }} disabled={user.id === 0 || user.id === undefined || usersComment.rating === 0 ? true : false}>Submit Rating</button>
                            {/* {(user===undefined || user.id===0 || usersComment.rating===0)?<span className="tooltip-text">{((user.id===0 || user===undefined) && usersComment.rating===0)?"Login to submit and Rating should be greater than 0":(user.id!==0 || user!==undefined || usersComment.rating===0)?"Rating should be greater than 0":""}</span>:<></>} */}
                            {(user.id===undefined || user.id===0 || usersComment.rating===0)?<span className="tooltip-text">{((user.id===0 || user.id===undefined))?"Login to submit":(usersComment.rating===0)?"Rating should be greater than 0":""}</span>:<></>}
                        </div>
                    </div>
                </div>
            </>
        )
    };

    return (
        <div className="movie-details-page">
            {togglePopUp?<PopUp msg={msg}/>:<></>}
            <div className="movie-container">
                <div className="movie-image">
                    <img className='carousel-img' src={`data:"image/jpeg";base64,${movie?.moviePoster}`} alt={movie?.movieName} />
                </div>
                <div className="movie-details">
                    <div className="movie-name"><p>{movie?.movieName}</p></div>
                    <p>Category : {movie?.category}</p>
                    <p>Rating : {findRatingOfMovie()}</p>
                    <p>Released date : {String(movie?.releaseDate).slice(0, 10)}</p>
                </div>
            </div>
            <div className="comments-container" >
                {(user.id === 0 || userReview === undefined || toggleCommentsInput) ? commentsInput() : <></>}
                {(userReview === undefined) ? <></> :
                    <div className="comments">
                        <div className="rating rating-container">
                            <div className="single-comment  rated" >{userReview?.rating}/5</div>
                            <div className="stars"><Rating initialValue={userReview?.rating} readonly /></div>
                        </div>
                        <div className="rating">
                            <div className="username">You</div>
                            <div className="single-comment comment-string">
                                {userReview?.comment}
                            </div>
                        </div>
                        <div className="edit-icon"><MdModeEdit onClick={() => { setToggleCommentsInput(true) }} /></div>
                    </div>}
                {(userReview?curMovieReviews.filter((review)=>review.id!==userReview.id):curMovieReviews).map((review, index) => {
                    return (
                        <div className="comments" key={review.id}>
                            <div className="rating rating-container">
                                <div className="single-comment  rated" >{review.rating}/5</div>
                                <div className="stars"><Rating initialValue={review.rating} readonly /></div>
                            </div>
                            <div className="rating">
                                <div className="username">{findUserName(review)}</div>
                                <div className="single-comment comment-string">
                                    {review.comment}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}