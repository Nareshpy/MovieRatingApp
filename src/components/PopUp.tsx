import { GiCancel } from "react-icons/gi";
import {  useNavigate } from "react-router-dom";

export const PopUp = ({msg}:{msg:string}) => {
    const navigate=useNavigate();
    return (
        <div className="modal-parent">
            <dialog open className="logout-modal" id="logout-modal">
                <div className="popup-container">
                <div className="cancelicon" ><GiCancel onClick={() => {
                    navigate(-1);
                }} /></div>
                <button onClick={() => {
                    
                }}>{msg}</button>
                </div>
            </dialog>
        </div>
    )
}