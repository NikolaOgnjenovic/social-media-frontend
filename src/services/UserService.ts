import {Comment, Image, LoginResponse, User} from "../types/global";
import {getImages} from "./ImageService";
import {getUserJwtToken} from "./AuthService.ts";
import {getComments} from "./CommentService.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
let users: User[] = [];
let userData: LoginResponse | null = null;

// Sends a GET request which, if successful, populates the users array
export async function getUsers(): Promise<User[]> {
    if (users.length > 0) {
        return users;
    }

    const response = await fetch(BACKEND_URL + "/api/v1/users");

    if (!response.ok) {
        throw new Error("Failed to get users.");
    }

    users = await response.json();
    return users;
}

export async function getUserPopularity() {
    if (users.length === 0) {
        users = await getUsers();
    }

    const images = await getImages();
    const comments = await getComments();
    let userPopularity: { username: string, popularity: number }[] = [];
    users.forEach((user: User) => {
        userPopularity.push({username: user.username, popularity: getPopularity(images, comments, user.id)})
    });

    return userPopularity;
}

function getPopularity(images: Image[], comments: Comment[], userId: number) {
    let popularity = 0;
    images.forEach((image: Image) => {
        if (image.authorId === userId) {
            popularity += image.likeCount;
        }
    });

    comments.forEach((comment: Comment) => {
        if (comment.authorId === userId) {
            popularity += comment.likeCount;
        }
    });

    return popularity;
}

export async function getUsernameById(userId: number) {
    if (users.length === 0) {
        users = await getUsers();
    }

    const user: User | undefined = users.find((user) => user.id == userId);
    if (user !== undefined) {
        return user.username;
    }

    return "";
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

export function getUserLikedImageIds(): Set<number> {
    const userData = getUserData();
    if (userData) {
        return new Set(userData.likedImageIds);
    }

    return new Set();
}

export async function updateUserLikedImageIds(id: number, updatedLikedImageIds: Set<number>): Promise<User[]> {
    if (users.length === 0) {
        users = await getUsers();
    }

    // Send a PATCH request to update the liked image ids
    const response = await fetch(BACKEND_URL + "/api/v1/users/liked-image-ids", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getUserJwtToken()}`
        },
        method: "PATCH",
        body: JSON.stringify(Array.from(updatedLikedImageIds))
    });

    if (!response.ok) {
        throw new Error("Failed to update liked image ids.");
    }

    // Update the liked image ids for the current user locally
    const updatedUsers = [...users];
    const updatedUsersLength = updatedUsers.length;
    for (let i = 0; i < updatedUsersLength; i++) {
        if (updatedUsers[i].id === id) {
            updatedUsers[i].likedImageIds = updatedLikedImageIds;
            break;
        }
    }

    // Save the updated data to local storage
    let userData = getUserData();
    if (userData !== null) {
        userData.likedImageIds = Array.from(updatedLikedImageIds);
        localStorage.setItem("user", JSON.stringify(userData));
    }

    users = updatedUsers;
    return updatedUsers;
}

export function getUserLikedCommentIds(): Set<number> {
    const userData = getUserData();
    if (userData) {
        return new Set(userData.likedCommentIds);
    }

    return new Set();
}

export async function updateUserLikedCommentIds(id: number, updatedLikedCommentIds: Set<number>): Promise<User[]> {
    if (users.length === 0) {
        users = await getUsers();
    }

    // Send a PATCH request to update the liked comment ids
    const response = await fetch(BACKEND_URL + "/api/v1/users/liked-comment-ids", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getUserJwtToken()}`
        },
        method: "PATCH",
        body: JSON.stringify(Array.from(updatedLikedCommentIds))
    });

    if (!response.ok) {
        throw new Error("Failed to update liked comment ids.");
    }

    // Update the liked comment ids for the current user locally
    const updatedUsers = [...users];
    const updatedUsersLength = updatedUsers.length;
    for (let i = 0; i < updatedUsersLength; i++) {
        if (updatedUsers[i].id === id) {
            updatedUsers[i].likedCommentIds = updatedLikedCommentIds;
            break;
        }
    }

    // Save the updated data to local storage
    let userData = getUserData();
    if (userData !== null) {
        userData.likedCommentIds = Array.from(updatedLikedCommentIds);
        localStorage.setItem("user", JSON.stringify(userData));
    }

    users = updatedUsers;
    return updatedUsers;
}