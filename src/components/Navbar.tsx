import {getUserId, logout} from "../services/AuthService";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {getUsernameById} from "../services/UserService.ts";
import {localizedStrings} from "../res/LocalizedStrings.tsx";

function Navbar() {
    const userId = getUserId();
    const [isLoggedIn, setIsLoggedIn] = useState(userId != -1);
    const navigate = useNavigate();
    const [currentUsername, setCurrentUsername] = useState("");

    useEffect(() => {
        getUsernameById(userId).then((username) => {
            setCurrentUsername(username);
        });

        // Load display language from localStorage
        localizedStrings.setLanguage(localStorage.getItem("displayLanguage") || "en");
    });

    useEffect(() => {
        // Load display language from localStorage
        localizedStrings.setLanguage(localStorage.getItem("displayLanguage") || "en");
    }, [isLoggedIn]);

    function handleLogout() {
        try {
            logout();
        } catch {
            console.log(localizedStrings.auth.errors.jwt);
        } finally {
            localStorage.setItem("user", "");
            setIsLoggedIn(false);
            navigate('/', {replace: true});
        }
    }

    // Updates the display language in local storage and reloads the window
    function setLanguage(languageCode: string) {
        localStorage.setItem("displayLanguage", languageCode);
        window.location.reload();
    }

    return (
        <header className="flex-container">
            <nav>
                {isLoggedIn ? (
                    <>
                        <NavLink to="/feed" activeClass="active-link">
                            {localizedStrings.navbar.feed}
                        </NavLink>
                        <NavLink to="/folders" activeClass="active-link">
                            {localizedStrings.navbar.folders}
                        </NavLink>
                        <NavLink to="/chart" activeClass={"active-link"}>
                            {localizedStrings.navbar.chart}
                        </NavLink>
                        <a onClick={handleLogout}>{localizedStrings.navbar.logout}</a>
                        <button className="image-button" type="submit" onClick={() => setLanguage("rsCyrillic")}>
                            <img src="../../public/serbian.svg" alt={localizedStrings.serbian}/>
                        </button>

                        <button className="image-button" type="submit" onClick={() => setLanguage("en")}>
                            <img src="../../public/english.svg" alt={localizedStrings.english}/>
                        </button>
                        <h1 className={"title"}>{localizedStrings.navbar.welcome} {currentUsername}</h1>
                    </>
                ) : (
                    <>
                        <NavLink to="/chart" activeClass={"active-link"}>
                            {localizedStrings.navbar.chart}
                        </NavLink>
                        <NavLink to="/login" activeClass="active-link">
                            {localizedStrings.navbar.login}
                        </NavLink>
                        <NavLink to="/register" activeClass="active-link">
                            {localizedStrings.navbar.register}
                        </NavLink>
                    </>
                )}
            </nav>
        </header>
    );
}

interface NavLinkProps {
    to: string;
    activeClass: string;
    children: React.ReactNode;
}

function NavLink({to, activeClass, children, ...rest}: NavLinkProps) {
    const location = useLocation();
    const isActive = location.pathname === to;
    const className = isActive ? activeClass : "";

    return (
        <a href={to} className={className} {...rest}>
            {children}
        </a>
    );
}

export default Navbar;