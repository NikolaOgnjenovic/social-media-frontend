import {getUserId, logout} from "../services/auth-service.ts";
import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(getUserId() != -1);
    const navigate = useNavigate();

    async function handleLogout() {
        await logout().then((success) => {
            if (success) {
                setIsLoggedIn(false);
                navigate('/', {replace: true});
                window.location.reload();
            }
        });
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
                            Chart
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