import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { GiCancel } from "react-icons/gi";

import { AppDispatch } from "../../app/Store";
import { closeLogin, setCurrentUser } from "../../features/LoginSlice";

import './LogOut.css';

export const LogOut = () => {

    const navigate=useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    return (
        <div className="modal-parent">
            <dialog open className="logout-modal" id="logout-modal">
                <div className="popup-container">
                <div className="cancelicon" ><Link to={"/"}><GiCancel onClick={() => {
                    dispatch(closeLogin());
                }} /></Link></div>
                <button onClick={() => {
                    dispatch(setCurrentUser({firstName:"",lastName:"",email:"",role:""}));
                    localStorage.removeItem("currentUser");
                    navigate("/");
                }}>Log out</button>
                </div>
            </dialog>
        </div>
    )
}