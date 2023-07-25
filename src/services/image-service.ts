import {Image} from "../types/global";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Sends a POST request to upload an image to the server
export async function createImage(images: Image[], authorId: number, tags: string[], title: String, imageFile: File): Promise<Image[]> {
    console.log(localStorage.getItem("jwtToken"));
    const updatedImages = [...images];
    const formData = new FormData();
    formData.append("authorId", authorId.toString());
    formData.append("tags", tags.toString());
    formData.append("title", title.toString());
    formData.append("image", imageFile);

    await fetch(BACKEND_URL + "/api/v1/images", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "POST",
        body: formData
    })
        .then((res) => res.json())
        .then((image: Image) => {
            updatedImages.push(image);
        })
        .catch((err) => {
                alert("Error creating image: " + err.message);
            }
        );

    return updatedImages;
}

// Sends a GET request which, if successful, populates the images array
export async function getImages(): Promise<Image[]> {
    let images: Image[] = [];
    await fetch(BACKEND_URL + "/api/v1/images")
        .then(res => res.json())
        .then(data => {
            images = data;
        })
        .catch((err) => {
            alert("Error getting images: " + err.message);
        });
    return images;
}

export async function getImagesByUserId(): Promise<Image[]> {
    let images: Image[] = [];
    await fetch(BACKEND_URL + "/api/v1/user-images", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
    })
        .then(res => res.json())
        .then(data => {
            images = data;
        })
        .catch((err) => {
            alert("Error getting images: " + err.message);
        });
    return images;
}

export async function getImageFilePath(id: number): Promise<string> {
    let filePath = "";

    await fetch(BACKEND_URL + "/api/v1/images/" + id + "/file",
        {})
        .then(res => res.blob())
        .then(blob => {
            filePath = URL.createObjectURL(blob);
        })
        .catch((err) => {
            alert("Error getting image file: " + err.message);
        });

    return filePath;
}

export async function getCompressedImageFilePath(id: number): Promise<string> {
    let filePath = "";

    await fetch(BACKEND_URL + "/api/v1/images/" + id + "/compressed-file",
        {})
        .then(res => res.blob())
        .then(blob => {
            filePath = URL.createObjectURL(blob);
        })
        .catch((err) => {
            alert("Error getting image file: " + err.message);
        });

    return filePath;
}

// Sends a PATCH request which, if successful, updates the like count of the image with the given id
export async function updateImageLikeCount(images: Image[], id: number, updatedLikeCount: number): Promise<Image[]> {
    const updatedImages = [...images];
    await fetch(BACKEND_URL + "/api/v1/images/" + id + "/like-count", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "PATCH",
        body: JSON.stringify(updatedLikeCount)
    })
        .then(() => {
            for (let i = 0; i < updatedImages.length; i++) {
                if (updatedImages[i].id == id) {
                    updatedImages[i].likeCount = updatedLikeCount;
                    break;
                }
            }
        })
        .catch((err) => {
            alert("Error liking image: " + err.message);
        });

    return updatedImages;
}

// Sends a PATCH request which, if successful, updates the folder id of the image with the given id
export async function updateImageFolderId(images: Image[], id: number, updatedFolderId: number): Promise<Image[]> {
    const updatedImages = [...images];
    await fetch(BACKEND_URL + "/api/v1/images/" + id + "/folder-id", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "PATCH",
        body: JSON.stringify(updatedFolderId)
    })
        .then(() => {
            for (let i = 0; i < updatedImages.length; i++) {
                if (updatedImages[i].id == id) {
                    updatedImages[i].folderId = updatedFolderId;
                    break;
                }
            }
        })
        .catch((err) => {
            alert("Error updating image folder id: " + err.message);
        });

    return updatedImages;
}

export async function updateImageEditorIds(images: Image[], id: number, updatedEditorIds: number[]) {
    const updatedImages = [...images];
    await fetch(BACKEND_URL + "/api/v1/images/" + id + "/editor-ids", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "PATCH",
        body: JSON.stringify(updatedEditorIds)
    })
        .then(() => {
            for (let i = 0; i < updatedImages.length; i++) {
                if (updatedImages[i].id == id) {
                    updatedImages[i].editorIds = updatedEditorIds;
                    break;
                }
            }
        })
        .catch((err) => {
            alert("Error updating image editor ids: " + err.message);
        });

    return updatedImages;
}

export function updateFile(id: number, imageFile: File): void {
    const formData = new FormData();
    formData.append("image", imageFile);
    fetch(BACKEND_URL + "/api/v1/images/" + id + "/file", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "PATCH",
        body: formData
    })
        .catch((err) => {
                alert("Error creating image: " + err.message);
            }
        );
}

export async function deleteImage(images: Image[], imageId: number): Promise<Image[]> {
    try {
        await fetch(BACKEND_URL + "/api/v1/images/" + imageId, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            },
            method: "DELETE"
        });

        // Filter out the deleted image from the images array
        return images.filter((image) => image.id !== imageId);
    } catch (err: any) {
        alert("Error deleting image: " + err.message);
        return images; // Return the original array in case of an error
    }
}

