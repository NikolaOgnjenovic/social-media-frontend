import React, {useEffect, useState} from "react";
import * as authService from "../services/AuthService.ts";
import {getUserId} from "../services/AuthService.ts";
import {useNavigate} from "react-router-dom";
import "../css/login.css";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(getUserId() != -1);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/feed', {replace: true});
            window.location.reload();
        }
    }, [isLoggedIn])

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    async function handleRegister() {
        await authService.register(username, password);
        setIsLoggedIn(true);
    }

    return (
        <div className={"login-body"}>
            <div className={"login-container"}>
                <p className={"text-3xl"}>Register</p>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input placeholder="Username"
                           type="text"
                           id="username"
                           required
                           onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input placeholder="Password"
                           type="password"
                           id="password"
                           required
                           onChange={handlePasswordChange}
                    />
                </div>
                <button className="border" type="submit" onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
}

export default Register;
