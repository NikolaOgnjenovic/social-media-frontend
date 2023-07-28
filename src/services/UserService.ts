import {Image, User} from "../types/global";
import {getImages} from "./ImageService";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getUserPopularity() {
    const users = await getUsers();
    const images = await getImages();
    let userPopularity: { username: string, popularity: number }[] = [];
    users.forEach((user: User) => {
        userPopularity.push({username: user.username, popularity: getPopularity(images, user.id)})
    });

    return userPopularity;
}

function getPopularity(images: Image[], userId: number) {
    let popularity = 0;
    images.forEach((image: Image) => {
        if (image.authorId == userId) {
            popularity += image.likeCount;
        }
    })

    return popularity;
}

// Sends a GET request which, if successful, populates the users array
export async function getUsers(): Promise<User[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/users");

    if (!response.ok) {
        throw new Error("Failed to get users.");
    }

    return response.json();
}
