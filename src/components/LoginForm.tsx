import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GiCancel } from "react-icons/gi";
import { User } from "../models/User";
import { closeLogin, openSingnUp, setCurrentUser } from "../features/LoginSlice";
import { Login } from "../models/Login";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../app/Store";
const LoginForm = () => {
    const allUsers = useSelector((state: RootState) => state.users.users)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Login>({ email: "", password: "" });
    const [errMsg,setErrMsg]=useState<string>("")
    useEffect(()=>{
        setErrMsg("")
    },[formData])
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData, [name]: value
        }))
    };
    const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setFormData({ email: "", password: "" })
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const returnvalue = allUsers.find((user: User) => user.email === formData.email && user.password === formData.password);
        if (returnvalue) {
            dispatch(setCurrentUser(returnvalue));
            localStorage.setItem("currentUser", JSON.stringify(returnvalue))
            dispatch(closeLogin());
            navigate('/');
        }
        else{
               setErrMsg("Email and password doesn't match")
        }
    }
    return (
        <>
            <div className="modal-parent">
                <dialog open className="login-modal" id="login-modal">
                    
                    <div className="cancel-icon" >
                        <span>{errMsg}</span>
                        <GiCancel onClick={() => {
                            navigate(-1)
                            dispatch(closeLogin());
                        }} />
                    </div>
                    <form onSubmit={(event) => handleSubmit(event)} id="login-form">
                        <div> <label htmlFor="email">Email:</label></div>
                        <div><input value={formData.email} onChange={(event) => handleChange(event)} className="input" type="email" id="email" name="email" required /></div>
                        <div> <label htmlFor="password">Password:</label></div>
                        <div><input value={formData.password} onChange={(event) => { handleChange(event) }} className="input" type="password" id="password" name="password" required /></div>
                        <div className="buttons">
                            <div><button className="clear-btn" onClick={(event) => { handleReset(event) }}>Clear</button></div>
                            <div><button type="submit">Login</button></div>
                        </div>
                    </form>
                    <div className="prompt-text" onClick={() => { dispatch(closeLogin()); dispatch(openSingnUp()) }}>New User?<Link to={"/Register"}>Sign-Up</Link></div>
                </dialog>

            </div>
        </>
    )
}
export default LoginForm;