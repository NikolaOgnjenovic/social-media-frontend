import {LoginResponse} from "../types/global";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
let userData: LoginResponse | null = null;

export async function login(username: string, password: string): Promise<boolean> {
    const response = await fetch(BACKEND_URL + "/api/v1/login", {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify({username: username, password: password})
    });

    if (!response.ok) {
        return false;
    }

    const data: LoginResponse = await response.json();
    localStorage.setItem("user", JSON.stringify(data));
    return true;
}

export async function logout() {
    const response = await fetch(BACKEND_URL + "/api/v1/logout", {
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(getUserJwtToken()),
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Failed to log out.");
    }
}

function getUserData(): LoginResponse | null {
    if (userData !== null) {
        return userData;
    }

    // Retrieve data from localStorage
    const userDataJSON = localStorage.getItem("user");

    // Parse user data
    userData = userDataJSON ? JSON.parse(userDataJSON) : null;
    return userData;
}

export function getUserId(): number {
    const userData = getUserData();
    if (userData) {
        return userData.userId;
    }

    return -1;
}

export function getUserJwtToken(): string {
    const userData = getUserData();
    if (userData) {
        return userData.token;
    }

    return "";
}

export async function register(username: string, password: string): Promise<void> {
    const response = await fetch(BACKEND_URL + "/api/v1/users", {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify({username: username, password: password})
    });

    if (!response.ok) {
        throw new Error("Failed to register user.");
    }

    const data: LoginResponse = await response.json();
    localStorage.setItem("user", JSON.stringify(data));
}