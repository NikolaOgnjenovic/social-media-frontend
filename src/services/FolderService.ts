import {Folder} from "../types/global";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createFolder(folders: Folder[], authorId: number, folderTitle: string): Promise<Folder[]> {
    const updatedFolders = [...folders];

    await fetch(BACKEND_URL + "/api/v1/folders", {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify({
            authorId: authorId,
            title: folderTitle
        })
    })
        .then((res) => res.json())
        .then((folder: Folder) => updatedFolders.push(folder))
        .catch((err) => {
            alert("Error creating folder: " + err.message);
        });
    return updatedFolders;
}

// Sends a GET request which, if successful, populates the folders array
export async function getFolders(): Promise<Folder[]> {
    let folders: Folder[] = [];

    await fetch(BACKEND_URL + "/api/v1/folders")
        .then(res => res.json())
        .then(data => {
            folders = data;
        })
        .catch((err) => {
            alert("Error getting folders: " + err.message);
        });
    return folders;
}

export async function getFoldersByUserId(): Promise<Folder[]> {
    let folders: Folder[] = [];

    await fetch(BACKEND_URL + "/api/v1/folders/user", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
    })
        .then(res => res.json())
        .then(data => {
            folders = data;
        })
        .catch((err) => {
            alert("Error getting folders: " + err.message);
        });
    return folders;
}

export async function deleteFolder(folders: Folder[], id: number): Promise<Folder[]> {
    await fetch(BACKEND_URL + "/api/v1/folders/" + id, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "DELETE"
    })
        .then(
            (res) => res.json())
        .then(
            (folderId: number) => {
                const updatedFolders = [...folders];
                for (let i = 0; i < updatedFolders.length; i++) {
                    if (updatedFolders[i].id == folderId) {
                        updatedFolders.splice(i, 1);
                        break;
                    }
                }
                folders = updatedFolders;
            }
        )
        .catch((err) => {
            alert("Error deleting folder: " + err.message);
        });

    return folders;
}