import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { IoMdSearch } from "react-icons/io";
import { IoArrowBackCircle } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { ImMenu } from "react-icons/im";
import { LuUserCircle2 } from "react-icons/lu";
import { Drawer } from "@mui/material";

import { AppDispatch, RootState } from "../../app/Store";
import { fetchRating } from "../../features/RatingSlice";
import { fetchUsers } from "../../features/UserSlice";
import { fetchMovieByName } from "../../features/MoviesSlice";
import { Carousel } from "../carousel/Carousel";

//import '../carousel/Carousel.css';
import './Header.css';

export const Header: React.FC = (): JSX.Element => {

    const navigate=useNavigate();
    const location=useLocation();
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector((state: RootState) => state.login.currentUser);
    const searchedMovie=useSelector((state:RootState)=>state.movies.searchedMovie);

    const [searchTerm,setSearchTerm]=useState<string>("")
    const [toggleLoading, setToggleLoading] = useState(false);
    const [toggleFlyOut,setToggleFlyOut]=useState(false);
    
    useEffect(()=>{
        dispatch(fetchRating());
        dispatch(fetchUsers());
    },[dispatch]);

    useEffect(()=>{
        setSearchTerm("");
    },[location.pathname]);

    useEffect(()=>{
        if(searchTerm.length>0){
        dispatch(fetchMovieByName(searchTerm)).then(()=>{setToggleLoading(false)});
        }
    },[searchTerm,dispatch]);
    
    // useEffect(()=>{
    //         setToggleLoading(false);
    // },[searchedMovie]);C:\Users\naresh.c\source\repos\RatingApp\imdbclone\src\assets\imdb-logo.png
    
    return (
        <>
            <div className="header-main-div">
                <div className="logo" onClick={()=>{navigate('/')}}>
                    <img src={require("../../assets/imdb-logo.png")} alt="logo" />
                </div>
                <div className="menu">
                    <div className="menu-icon"><ImMenu id="icon" onClick={()=>setToggleFlyOut(true)} />
                        <Drawer
                            anchor={"top"}
                            sx={{
                                "& .MuiPaper-root": {
                                    overflow:'hidden'
                                  }
                                    
                            }}
                            open={toggleFlyOut}
                            onClose={() => {setToggleFlyOut(false) }}
                        >
                            <div className="menu-item-cancel" ><GiCancel className="cancel-flyout" onClick={()=>setToggleFlyOut(false)}></GiCancel></div>
                            <div className="menu-item"><Link to={"/"} onClick={()=>{setToggleFlyOut(false)}}> Home</Link></div>
                            {user.role==="Admin"?<>
                            <div className="menu-item"><Link to={"/MovieForm"} onClick={()=>{setToggleFlyOut(false)}}> Add Movie</Link></div>
                            </>
                            :<></>}    
                        </Drawer>
                    </div>
                    <div className="menu-text">Menu</div>
                </div>
                <div className="search">
                    <div className="search-bar">
                    <input type="text" value={searchTerm} onChange={(e)=>
                    {setToggleLoading(true);setSearchTerm(e.target.value)}}
                    placeholder="search by movie name here" /><IoMdSearch className="search-icon" onClick={()=>{
                    dispatch(fetchMovieByName(searchTerm));
                    }}/></div>
                </div>
                {/* <div className="watchlist">
                    <div className="watchlist-icon"><img className="watchlist-image" src={require("../assets/watchlist-icon.png")} alt="icon" /></div>
                    <div className="wathclist-text">Watchlist</div>
                </div> */}
                <div className="login" onClick={() => {
                        if(user.firstName===""){
                          navigate("/Login")
                        }
                        else{
                            navigate("/Logout")
                        }
                    }}>
                    <div className="login-icon"><LuUserCircle2 id="user-icon" /></div>
                    <div className="login-text"> {user.firstName===""?"Login": user.firstName}</div>
                </div>
                <div className="languages">
                    {location.pathname==="/"?'English':<Link to={"/"}><IoArrowBackCircle  className="back-icon"/>Back</Link>}
                </div>
            </div>
            {
               (searchTerm ) && <div className="search-result-container"> <label className="category-search"> Search Result Movie</label>
            {toggleLoading?<></>:searchedMovie?<Carousel filterType="None" showLabel={false}/>:searchTerm===""? <></>:<div className="no-results">No Search Results Found</div>}
            </div>
            }
        </>
    )

}
