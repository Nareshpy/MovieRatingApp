import { useEffect, useState } from "react";
// import { RootState } from "../app/Store";
import { useDispatch, useSelector } from "react-redux";
import { GiCancel } from "react-icons/gi";
import axios from "axios";
import { User } from "../models/User";
// import { Link } from "react-router-dom";
// import { RegistrationForm } from "./RegistrationForm";
import { closeLogin, openSingnUp } from "../features/LoginSlice";
import { Login } from "../models/Login";
const LoginForm = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState<Login>({ email: "", password: "" });
    //const loginClikced = useSelector((state: RootState) => state.login.isLoginClicked)
    useEffect(() => {
        const getUsers = async () => {
            await axios.get("https://localhost:7231/api/Reviewer").then(res => {
                setUsers(res.data);
            })
        };
        getUsers();
    }, []);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData, [name]: value
        }))
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const returnvalue = users.find((user: User) => user.email === formData.email && user.password === formData.password
        )
        console.log(returnvalue)
    }
    return (
        <>
            <div className="modal-parent">
                <div className="cancel-icon" ><GiCancel onClick={() => { dispatch(closeLogin()) }} /></div>
                <dialog open className="login-modal" id="login-modal">
                    <form onSubmit={(event) => { handleSubmit(event) }} id="login-form">
                        <div> <label htmlFor="email">Email:</label></div>
                        <div><input value={formData.email} onChange={(event) => handleChange(event)} className="input" type="email" id="email" name="email" required /></div>
                        <div> <label htmlFor="password">Password:</label></div>
                        <div><input value={formData.password} onChange={(event) => { handleChange(event) }} className="input" type="password" id="password" name="password" required /></div>
                        <div className="buttons">
                            <div><button type='reset'>Cancel</button></div>
                            <div><button type="submit" >Login</button></div>
                        </div>
                    </form>
                    <div className="prompt-text" onClick={() => { dispatch(closeLogin()); dispatch(openSingnUp()) }}>New User?Sign-Up</div>
                </dialog>
            </div>
        </>
    )
}
export default LoginForm;