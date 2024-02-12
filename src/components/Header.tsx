import { IoMdSearch } from "react-icons/io";
import { ImMenu } from "react-icons/im";
import { LuUserCircle2 } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/Store";
import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchRating } from "../features/RatingSlice";
import { fetchUsers } from "../features/UserSlice";
import { GiCancel } from "react-icons/gi";
import { fetchMovieByName } from "../features/MoviesSlice";
import { Carousel } from "./carousel/Carousel";
export const Header: React.FC = (): JSX.Element => {

    const navigate=useNavigate();
    const [searchTerm,setSearchTerm]=useState<string>("")
    const user = useSelector((state: RootState) => state.login.currentUser);
    const params=useParams()
    const searchedMovie=useSelector((state:RootState)=>state.movies.searchedMovie)
    const [toggleLoading, setToggleLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(()=>{
        dispatch(fetchRating());
        dispatch(fetchUsers());
    },[dispatch]);
    useEffect(()=>{
        dispatch(fetchMovieByName(searchTerm));
    },[searchTerm,dispatch]);
    useEffect(()=>{
            setToggleLoading(false);
            console.log()
    },[searchedMovie]);
    const [toggleFlyOut,setToggleFlyOut]=useState(false);
    return (
        <>
            <div className="header-main-div">
                <div className="logo">
                    <img src={require("../assets/imdb-logo.png")} alt="logo" />
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
                            <div className="menu-item">Remove Movie</div>   
                            <div className="menu-item"><Link to={"/Register"} onClick={()=>{setToggleFlyOut(false)}}>Delete Movie</Link></div>
                            </>
                            :<></>}    
                        </Drawer>
                    </div>
                    <div className="menu-text">Menu</div>
                </div>
                <div className="search">
                    <div className="search-bar"><input type="text" onChange={(e)=>{setToggleLoading(true);setSearchTerm(e.target.value)}} placeholder="search by movie name here" /><IoMdSearch className="search-icon" onClick={()=>{
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
                    English
                </div>
            </div>
            {toggleLoading?<></>:searchedMovie?<Carousel filterType="None"/>:searchTerm===""?<></>:"No Search Results Found"}
        </>
    )

}
