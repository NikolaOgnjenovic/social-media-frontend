import {Folder} from "../types/global";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createFolder(folders: Folder[], authorId: number, folderTitle: string): Promise<Folder[]> {
    const updatedFolders = [...folders];

    const response = await fetch(BACKEND_URL + "/api/v1/folders", {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify({
            authorId: authorId,
            title: folderTitle
        })
    });

    if (!response.ok) {
        throw new Error("Failed to create folder.");
    }

    const folder = await response.json();
    updatedFolders.push(folder);
    return updatedFolders;
}


// Sends a GET request which, if successful, populates the folders array
export async function getFolders(): Promise<Folder[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/folders");

    if (!response.ok) {
        throw new Error("Failed to get folders.");
    }

    return response.json();
}


export async function getFoldersByUserId(): Promise<Folder[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/folders/user", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
    });

    if (!response.ok) {
        throw new Error("Failed to get folders.");
    }

    return response.json();
}

export async function deleteFolder(folders: Folder[], id: number): Promise<Folder[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/folders/" + id, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete folder.");
    }

    const folderId: number = await response.json();
    return folders.filter((folder) => folder.id !== folderId);
}
