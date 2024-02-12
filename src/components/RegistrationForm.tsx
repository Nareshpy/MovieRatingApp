import { useEffect, useState } from "react";
import { GiCancel } from "react-icons/gi"
import { useNavigate } from "react-router-dom";
import { User } from "../models/User";
import { useSelector } from "react-redux";
import { RootState } from "../app/Store";
import axios from "axios";

export const RegistrationForm = () => {
    const users=useSelector((state:RootState)=>state.users.users);
    const [msg,setMsg]=useState<string>("");
    const [userDetails,setUserDetails]=useState<User>({
        firstName:"",
        lastName:"",
        email :"",
        password:"",
        role:"user"})
    const navigate=useNavigate();
    useEffect(()=>{
        setMsg("");
    },[userDetails]);
   const headers={'Content-Type': 'application/json'};
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setUserDetails((prevData) => ({
            ...prevData, [name]: value
        }))
    };
    const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setUserDetails({
            firstName:"",
            lastName:"",
            email :"",
            password:"",
            role:"user"})
    }
    const handleSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        users.find((user)=>{if(user.email===userDetails.email){setMsg("Email already in use");}})
        if(msg==="" && userDetails.firstName.length>0){
            axios.post("https://localhost:7231/api/Reviewer",userDetails,{headers:headers}).then((res)=>{
                console.log(res);
                setUserDetails({
                    firstName:"",
                    lastName:"",
                    email :"",
                    password:"",
                    role:"user"});
                    navigate(-1)
            }).catch((err)=>
            console.log(err.msg)
            )
        }
    }
    return (
        <div className="modal-parent">
            <dialog open className="login-modal" id="login-modal">
                <div className="cancel-icon"><span>{msg}</span><GiCancel onClick={()=>{navigate(-1)}}/>
                </div>
                <form onSubmit={(event)=>handleSubmit(event)}
                id="registration-form">
                    <div> <label htmlFor="firstName">First Name</label></div>
                    <div><input type="text" id="firstName" name="firstName" value={userDetails.firstName} onChange={(event)=>handleChange(event)} required /></div>
                    <div><label htmlFor="lastName">Last Name</label></div>
                    <div><input type="text" id="lastName" name="lastName" value={userDetails.lastName} onChange={(event)=>handleChange(event)} required /></div>
                    <div><label htmlFor="email">Email</label></div>
                    <div><input type="email" id="email" name="email" value={userDetails.email} onChange={(event)=>handleChange(event)} required/></div>
                    <div><label htmlFor="password">Password </label></div>
                    <div><input type="password" id="password" name="password" value={userDetails.password}  onChange={(event)=>handleChange(event)} required/></div>
                    {/* <div><label htmlFor="role">Role</label></div>
                    <div><input type="text" id="role" name="role" value={userDetails.role} onChange={(event)=>handleChange(event)} required/></div> */}
                    <div className="buttons">
                        <div><button type='reset' onClick={(event)=>{handleReset(event)}}>Clear</button></div>
                        <div><button type="submit" >Save</button></div>
                    </div>
                </form>
            </dialog>
        </div>
    )
}