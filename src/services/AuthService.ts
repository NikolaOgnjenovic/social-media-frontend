const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function login(username: string, password: string): Promise<boolean> {
    const response = await fetch(BACKEND_URL + "/api/v1/login", {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify({username: username, password: password})
    });

    if (!response.ok) {
        return false;
    }

    const data = await response.json();
    localStorage.setItem("userId", data["userId"]);
    localStorage.setItem("jwtToken", data["token"]);
    return true;
}

export async function logout(): Promise<boolean> {
    const response = await fetch(BACKEND_URL + "/api/v1/logout", {
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(localStorage.getItem("jwtToken")),
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Failed to log out.");
    }

    localStorage.setItem("userId", "-1");
    localStorage.setItem("jwtToken", "-1");
    return true;
}

// https://stackoverflow.com/questions/48983708/where-to-store-access-token-in-react-js
export function getUserId(): number {
    return JSON.parse(localStorage.getItem("userId") || "-1") || -1;
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

    const data = await response.json();
    localStorage.setItem("userId", data["userId"]);
    localStorage.setItem("jwtToken", data["token"]);
}