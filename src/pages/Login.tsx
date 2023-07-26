import React, {useEffect, useState} from "react";
import * as authService from "../services/AuthService.ts";
import {getUserId} from "../services/AuthService.ts";
import {useNavigate} from "react-router-dom";
import "../css/login.css";

function Login() {
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

    async function handleLogin() {
        await authService.login(username, password).then((success) => {
            if (success) {
                setIsLoggedIn(true);
            } else {
                alert("Invalid credentials");
            }
        })
    }

    return (
        <div className={"login-body"}>
            <div className={"login-container"}>
                <p className={"text-3xl"}>Login</p>
                <div id="login-form">
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
                    <button className="border" type="button" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
