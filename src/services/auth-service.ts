const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function login(username: string, password: string) {
    let validUser = false;
    await fetch(BACKEND_URL + "/api/v1/login", {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify({username: username, password: password})
    })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("userId", data["userId"]);
            localStorage.setItem("jwtToken", data["token"]);
            validUser = true;
        })
        .catch((err) => {
            alert("Error logging in: " + err.message);
        });

    return validUser;
}

export async function logout(): Promise<boolean> {
    let success = false;
    await fetch(BACKEND_URL + "/api/v1/logout", {
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(localStorage.getItem("jwtToken")),
        method: "POST"
    })
        .then(() => {
            localStorage.setItem("userId", "-1");
            localStorage.setItem("jwtToken", "-1");
            success = true;
        })
        .catch((err) => {
            alert("Error logging out: " + err.message);
        });

    return success;

}

// https://stackoverflow.com/questions/48983708/where-to-store-access-token-in-react-js
export function getUserId(): number {
    return JSON.parse(localStorage.getItem("userId") || "-1") || -1;
}

export async function register(username: string, password: string) {
    await fetch(BACKEND_URL + "/api/v1/users", {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify({username: username, password: password})
    })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("userId", data["userId"]);
            localStorage.setItem("jwtToken", data["token"]);
        })
        .catch((err) => {
            alert("Error registering user: " + err.message);
        });
}