import {getUserId, logout} from "../services/AuthService";
import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(getUserId() != -1);
    const navigate = useNavigate();

    function handleLogout() {
        try {
            logout();
        } catch {
            console.log("Failed to invalidate jwt token");
        } finally {
            localStorage.clear();
            setIsLoggedIn(false);
            navigate('/', {replace: true});
        }
    }

    return (
        <header className="flex-container">
            <nav>
                {isLoggedIn ? (
                    <>
                        <NavLink to="/feed" activeClass="active-link">
                            Feed
                        </NavLink>
                        <NavLink to="/folders" activeClass="active-link">
                            Folders
                        </NavLink>
                        <NavLink to="/chart" activeClass={"active-link"}>
                            User popularity chart
                        </NavLink>
                        <a onClick={handleLogout}>Logout</a>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" activeClass="active-link">
                            Login
                        </NavLink>
                        <NavLink to="/register" activeClass="active-link">
                            Register
                        </NavLink>
                        <NavLink to="/chart" activeClass={"active-link"}>
                            User popularity chart
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